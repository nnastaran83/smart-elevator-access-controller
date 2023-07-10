import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import '../../styles/FaceDetector.css';
import Siri from "./Siri.jsx";
import FaceDetector from "./FaceDetector.jsx";
import VideoCallPopup from "../VideoCallPopup/index.jsx";
import {useSpeechCommands} from "../../hooks/useSpeechCommands.js";

/**
 * FaceDetector component is used to detect faces in the video stream and send the video frame data to the Flask backend.
 * @returns {JSX.Element}
 * @component
 */
const Controller = () => {
    const {isSiriActive, isFaceRecognitionActive} = useSelector(state => {
            return {
                isSiriActive: state.controller.isSiriActive,
                isFaceRecognitionActive: state.controller.isFaceRecognitionActive
            }
        }
    );

    const [utterance] = useState(new SpeechSynthesisUtterance());


    const {
        requestedFloorNumber,
        isVideoCallActive
    } = useSelector((
        {
            currentDetectedUser: {requestedFloorNumber},
            videoCall: {isVideoCallActive}
        }) => {
        return {
            isVideoCallActive,
            requestedFloorNumber
        }
    });


    const log = (...args) => {
        console.log(...args);
    };

    useEffect(() => {
        const run = async () => {
            log("run started");
            utterance.voice = speechSynthesis.getVoices()[5];
            utterance.lang = "en-US";

        };
        run();

    }, [utterance]);


    return (
        <div className="circle">
                <span className="circle__btn">
                   {isFaceRecognitionActive && <FaceDetector/>}
                    {isSiriActive && <Siri utterance={utterance}/>}
                    {isVideoCallActive ? <VideoCallPopup floorNumber={requestedFloorNumber}/> : null}
                </span>
        </div>

    );
};


export default Controller;