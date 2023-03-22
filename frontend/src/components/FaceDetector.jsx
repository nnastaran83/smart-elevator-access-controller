import React, {useEffect, useReducer, useRef, useState} from 'react';
import * as faceapi from 'face-api.js';
import '../styles/FaceDetection.css';
import axios from 'axios';


const FaceDetector = () => {
    const MODEL_URL = "/models";
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [labeledDescriptors, setLabeledDescriptors] = useState([]);
    const [detected, setDetected] = useState(false);
    const speech = new SpeechSynthesisUtterance();

    const log = (...args) => {
        console.log(...args);
    };

    useEffect(() => {
        const run = async () => {
            log("run started");


            //   axios.get('http://127.0.0.1:5000/get_all_face_encodings')
            //   .then(response => {
            //     console.log(response.data);
            //   });

            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
            await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);


            const options = new faceapi.TinyFaceDetectorOptions({
                inputSize: 128,
                scoreThreshold: 0.5
            });

            const referenceImage = await faceapi.fetchImage('/people_images/6.jpg');
            const nastaran = await faceapi.computeFaceDescriptor(referenceImage);
            const labeledDescriptors = [
                new faceapi.LabeledFaceDescriptors(
                    'Nastaran',
                    [nastaran]
                )
            ];
            setLabeledDescriptors(labeledDescriptors);
            console.log(labeledDescriptors);
        };

        run().then(startVideo);

    }, []);


    const talkToUser = () => {
        speech.text = "hello";
        window.speechSynthesis.speak(speech);
    };


    const startVideo = async () => {
        navigator.mediaDevices.getUserMedia({video: true})
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
        const displaySize = {width: video.videoWidth, height: video.videoHeight};

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
            setDetected(false);
            setTimeout(() => detectFace());
            return;
        }


        setDetected(true);

        const resizedDetection = faceapi.resizeResults(detectedFace, displaySize);

        drawDetection(resizedDetection, canvas);

        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.8);
        const bestMatch = faceMatcher.findBestMatch(detectedFace.descriptor);
        // const data = { face_data: detectedFace.descriptor };
        // await fetch('http://localhost:5000/my-endpoint', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('Success:', data);
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });


        console.log(bestMatch);

        //talkToUser();


        /* create FaceMatcher with automatically assigned labels
     from the detection results for the reference image*/
        const result = await faceapi
            .detectSingleFace(videoRef.current, options)
            .withFaceExpressions();

        setTimeout(() => detectFace(), 1000);
    };

    const drawDetection = (resizedDetection, canvas) => {
        /**
         * Draw a rectangle around the detected face
         */
        const {top, left, width, height} = resizedDetection.detection.box;
        const drawOptions = {
            lineWidth: 1
        };
        const box = new faceapi.draw.DrawBox({x: left + 80, y: top, width, height}, drawOptions);

        box.draw(canvas);
    };


    return (

        <div className="ui basic center aligned segment video-container" style={{margin: "auto", width: "fit-content"}}>

            <div className="circle">
      <span className="circle__btn">


            <video
                ref={videoRef}
                autoPlay
                muted
                onPlay={detectFace}
            />
            <canvas ref={canvasRef}/>
      </span>
                <span className="circle__back-1"></span>
                <span className="circle__back-2"></span>
            </div>


        </div>


    );

};


export default FaceDetector;