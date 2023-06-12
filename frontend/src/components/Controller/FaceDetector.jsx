import React, {useEffect, useRef} from 'react';
import axios from "axios";
import PitchContainer from "../PitchContainer.jsx";
import '../../styles/FaceDetector.css';
import {useDispatch} from "react-redux";
import {setCurrentDetectedImageFrameData, setDetectedUserInfo, startSiri} from "../../store/index.js";


//TODO : to stop the camera use this in the code : before it save the stream as state

//                      let tracks = stream.getTracks();
//                     tracks.forEach(function (track) {
//                         track.stop();
//                     });
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
        startVideo();

    }, []);


    /**
     * Starts webcam video stream
     * @returns {Promise<void>}
     */
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
        try {
            const response = await axios.post('http://localhost:5000/recognize_face',
                {frame_data: frameData},
                {headers: {'Content-Type': 'application/json'}}
            );

            dispatch(setCurrentDetectedImageFrameData(frameData));

            if (response.data.name) {
                await dispatch(setDetectedUserInfo(response.data));
                await dispatch(startSiri());
            } else {
                setTimeout(() => detectFace(), 5000);
            }

        } catch (error) {
            console.log(error);
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