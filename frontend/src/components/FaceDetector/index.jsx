import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Eye from "./Eye";
import '../../styles/FaceDetector.css';
import {Box} from "@mui/material";
import PitchContainer from "../themed_components/PitchContainer.jsx";

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
            setTimeout(() => detectFace());
            return;
        }

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to base64-encoded data
        const frameData = canvas.toDataURL('image/jpeg', 0.8);

        // Send the video frame data to the Flask backend
        const response = await fetch('http://localhost:5000/recognize_face', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({frame_data: frameData}),
        });

        const data = await response.json();
        console.log(data.name);
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
                    {/*<Eye/>*/}
                </span>

                <span className="circle__back-1"></span>
                <span className="circle__back-2"></span>

            </div>


        </Box>
    );
};


export default FaceDetector;