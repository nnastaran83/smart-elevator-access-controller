import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import '../styles/FaceDetection.css';
import { Container, Header, Divider } from 'semantic-ui-react';
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Radial separators
import RadialSeparators from './RadialSeperators';



const FaceDetection = () => {

    const MODEL_URL = "/models";

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [expressions, setExpressions] = useState([]);
    const [labeledDescriptors, setLabeledDescriptors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const log = (...args) => {
        console.log(...args);
    };

    useEffect(() => {
        const run = async () => {
            log("run started");
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]).then(startVideo);

            const options = new faceapi.TinyFaceDetectorOptions({
                inputSize: 128,
                scoreThreshold: 0.5
            });

            const referenceImage = await faceapi.fetchImage('/people_images/6.jpg');
            const nastaran = await faceapi.computeFaceDescriptor(referenceImage, options);
            const labeledDescriptors = [
                new faceapi.LabeledFaceDescriptors(
                    'Nastaran',
                    [nastaran]
                )
            ];
            setLabeledDescriptors(labeledDescriptors);
            console.log(labeledDescriptors);

        };

        run();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);

        return () => {
            clearInterval(timer);
        };
    }, []);


    const startVideo = async () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const detectFace = async () => {
        if (
            videoRef.current.paused ||
            videoRef.current.ended ||
            !faceapi.nets.tinyFaceDetector.params
        ) {
            setTimeout(() => detectFace());
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const displaySize = { width: video.videoWidth, height: video.videoHeight };

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        faceapi.matchDimensions(canvas, displaySize);

        const options = new faceapi.SsdMobilenetv1Options(
            {
                minConfidence: 0.8,
                maxResults: 1
            });

        const detectedFace = await faceapi.detectSingleFace(video, options).withFaceLandmarks().withFaceDescriptor();

        if (!detectedFace) {
            setTimeout(() => detectFace());
            return;
        } else {
            const resizedDetection = faceapi.resizeResults(detectedFace, displaySize);

            drawDetection(resizedDetection, canvas);
            const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.8);
            const bestMatch = faceMatcher.findBestMatch(detectedFace.descriptor);

            console.log(bestMatch);
        };


        /* create FaceMatcher with automatically assigned labels
     from the detection results for the reference image*/
        const result = await faceapi
            .detectSingleFace(videoRef.current, options)
            .withFaceExpressions();

        if (result) {
            const expressions = [];
            for (const [key, value] of Object.entries(result.expressions)) {
                expressions.push([key, value]);
            }

            setExpressions(expressions);
        }

        setTimeout(() => detectFace(), 1000);
    };

    const drawDetection = (resizedDetection, canvas) => {
        /** 
         * Draw a rectangle around the detected face
        */
        const { top, left, width, height } = resizedDetection.detection.box;
        const drawOptions = {
            lineWidth: 1
        };
        const box = new faceapi.draw.DrawBox({ x: left + 80, y: top, width, height }, drawOptions);

        box.draw(canvas);
    };


    return (


            <div className="video-container">
                <video
                    ref={ videoRef }
                    autoPlay
                    muted
                    onPlay={ detectFace }
                />
                <canvas ref={ canvasRef } />
                <div className="circular-progressbar-container" >
                    <CircularProgressbarWithChildren
                        value={ 100 }
                        strokeWidth={ 1 }
                        styles={ buildStyles({

                            textColor: "white",
                            pathColor: "#F70CAB",
                            trailColor: "white"
                        }) }
                    >
                        <RadialSeparators
                            count={ 110 }
                            style={ {
                                background: "#fff",
                                width: "10px",
                                // This needs to be equal to props.strokeWidth
                                height: `${1}%`

                            } }
                        />
                    </CircularProgressbarWithChildren>
                </div>

            </div>


    );

};


export default FaceDetection; 