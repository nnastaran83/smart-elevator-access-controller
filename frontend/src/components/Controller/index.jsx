import {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {Box} from "@mui/material";
import '../../styles/FaceDetector.css';
import Siri from "./Siri.jsx";
import FaceDetector from "./FaceDetector.jsx";


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
        <Box>
            <div className="circle">
                <span className="circle__btn">
                   {isFaceRecognitionActive && <FaceDetector/>}
                    {isSiriActive && <Siri utterance={utterance}/>}
                </span>
            </div>
        </Box>
    );
};


export default Controller;