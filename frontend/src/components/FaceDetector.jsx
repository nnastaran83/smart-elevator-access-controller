import React, {useEffect, useRef, useState} from 'react';
import {Box, styled} from "@mui/material";
import PitchContainer from "./PitchContainer.jsx";
import '../styles/FaceDetector.css';
import axios from "axios";


/**
 * FaceDetector component is used to detect faces in the video stream and send the video frame data to the Flask backend.
 * @returns {JSX.Element}
 * @component
 */
const FaceDetector = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [detected, setDetected] = useState(false);
    const speech = new SpeechSynthesisUtterance();


    const log = (...args) => {
        console.log(...args);
    };

    useEffect(() => {
        const run = async () => {
            log("run started");
            speech.voice = speechSynthesis.getVoices()[5];
            speech.lang = "en-US";


        };

        run().then(startVideo);

    }, []);


    const talkToUser = () => {
        speech.text = "hello";
        speechSynthesis.speak(speech);
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

    /**
     * Detects faces in the video stream and sends the video frame data to the Flask backend
     * @returns {Promise<void>}
     */
    const detectFace = async () => {

        if (videoRef.current.paused || videoRef.current.ended) {
            setTimeout(() => detectFace(), 1000);
            return;
        }

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the content of the canvas to a Base64-encoded JPEG image.
        const frameData = canvas.toDataURL('image/jpeg', 1);

        // Send the video frame data to backend server and wait for response.
        const response = await axios.post('http://localhost:5000/recognize_face',
            {frame_data: frameData},
            {headers: {'Content-Type': 'application/json'}}
        );
        console.log(response.data);

        setTimeout(() => detectFace(), 1000);
    };

    return (
        <Box>
            <div className="circle">
                <span className="circle__btn">
                    <video
                        id={"face-recognition-video-cam"}
                        ref={videoRef}
                        autoPlay
                        onPlay={detectFace}
                        style={{display: "block"}}

                    />
                    <canvas ref={canvasRef}/>
                     <PitchContainer/>
                </span>
                <span className="circle__back-1"></span>
                <span className="circle__back-2"></span>
            </div>
        </Box>
    );
};


export default FaceDetector;