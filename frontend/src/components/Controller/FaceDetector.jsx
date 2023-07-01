import React, {useEffect, useRef} from 'react';
import {useDispatch} from "react-redux";
import PitchContainer from "../containers/PitchContainer.jsx";
import {fetchDetectedUsersInfo} from "../../store/index.js";
import '../../styles/FaceDetector.css';
import * as faceapi from 'face-api.js';


/**
 * FaceDetector component is used to detect faces in the video stream and send the video frame data to the Flask backend.
 * @returns {JSX.Element}
 * @component
 */
const FaceDetector = () => {
    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);


    useEffect(() => {
        loadModels().then(startWebCamForFaceDetection);
    }, []);


    /**
     * Loads the face detection models
     * @returns {Promise<void>}
     */
    const loadModels = async () => {
        const MODEL_URL = '/models';
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    }


    /**
     * Starts webcam for face detection
     * @returns {Promise<void>}
     */
    const startWebCamForFaceDetection = async () => {
        navigator.mediaDevices.getUserMedia({video: true})
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((err) => {
                console.error(err);
            });
    };


    /**
     * Detects faces in the video stream and sends the video frame data to the Flask backend
     * @returns {Promise<void>}
     */
    const detectFace = async () => {
        if (videoRef.current.paused || videoRef.current.ended) {
            setTimeout(() => detectFace(), 1000);
            return;
        }

        // Draw the video frame to canvas.
        const video = videoRef.current;
        //Detect the face with the highest confidence score in an image

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        //Detect the face with the highest confidence score
        const detection = await faceapi.detectSingleFace(canvas);
        if (detection) {
            // Convert the content of the canvas to a Base64-encoded JPEG image.
            const frameData = canvas.toDataURL('image/jpeg', 1);
            dispatch(fetchDetectedUsersInfo(frameData));

        } else {
            setTimeout(() => detectFace(), 5000);
        }

    };

    return (
        <React.Fragment>
            <video
                id={"face-recognition-video-cam"}
                ref={videoRef}
                autoPlay
                onPlay={detectFace}
                style={{display: "block"}}
            />
            <canvas ref={canvasRef}/>
            <PitchContainer/>
        </React.Fragment>
    );
};

export default FaceDetector;