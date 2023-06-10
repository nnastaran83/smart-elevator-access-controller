import React, {useCallback, useEffect, useState} from 'react';
import '../../styles/Siri.css';
import {Box, Chip, IconButton} from "@mui/material";
import AnimationContainer from "../AnimationContainer.jsx";
import {useDispatch, useSelector} from "react-redux";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import {startFaceRecognition} from "../../store/index.js";

const Siri = ({utterance}) => {
    const detectedUserInfo = useSelector(state => state.faceDetector.detectedUserInfo);

    const [siriMessage, setSiriMessage] = useState("");
    const [isSpeechSynthesisEnded, setSpeechSynthesisEnded] = useState(false);
    const dispatch = useDispatch();
    const commands = [
        {
            command: 'yes',
            callback: (command) => {
                console.log("Command: ", command);
            }
        }];

    const {
        listening,
        resetTranscript,
        transcript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({commands});

    useEffect(() => {
        console.log("Siri component mounted");
        if (!browserSupportsSpeechRecognition) {
            console.log("Attention! Browser doesn't support speech recognition");
        }
        talkToUser();
    }, []);

    useEffect(() => {
        if (!listening && isSpeechSynthesisEnded && transcript.length == 0) {
            // Speech recognition has ended and speech synthesis had finished, dispatch your action here
            dispatch(startFaceRecognition());
        }
    }, [listening]);

    /**
     * Talking to user
     * @returns {Promise<void>}
     */
    const talkToUser = async () => {
        utterance.voice = speechSynthesis.getVoices()[5];
        utterance.lang = "en-US";

        if (detectedUserInfo.uid) {//If user has uid, it means that the user is registered.
            utterance.text = "Welcome! Would you like to go home?";
        } else if (detectedUserInfo.floor_number) { //If user doesn't have uid, but has a floor, it means the user is a guest who came back.
            utterance.text = `Welcome! Would you like to go to floor ${detectedUserInfo.floor} like the last time?`;
        } else { //If user doesn't have uid and floor, it means the user is a guest who came for the first time.
            utterance.text = `Sorry! Can't recognize you! Would you like to make a video call for approval?`;
        }


        setSiriMessage(utterance.text);
        utterance.onend = () => {
            setSpeechSynthesisEnded(true);

            SpeechRecognition.startListening();
        };
        speechSynthesis.speak(utterance);

    };


    return (
        <React.Fragment>
            <AnimationContainer>
                <Box sx={{
                    width: "100%",
                    height: "100%",
                    fontSize: "70vmin",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }
                }>

                    <div className="rainbow-container">
                        <div className="green"></div>
                        <div className="pink"></div>
                        <div className="blue"></div>
                    </div>
                </Box>
            </AnimationContainer>
            <p style={{textAlign: "center"}}>{siriMessage}</p>
            <Box sx={{position: "absolute", left: 0, bottom: 0}}>
                <IconButton sx={{color: listening ? "#1cb612" : "#ce1313"}}>
                    {listening ? <MicIcon/> : <MicOffIcon/>}
                </IconButton>
                {transcript ? <Chip label={`${transcript}`} variant="outlined"/> : null}
            </Box>
        </React.Fragment>


    );
}

export default Siri;