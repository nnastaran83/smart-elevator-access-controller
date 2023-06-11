import React, {useEffect, useState} from 'react';
import '../../styles/Siri.css';
import {Box, Chip, IconButton, Stack, Typography} from "@mui/material";
import AnimationContainer from "../AnimationContainer.jsx";
import {useDispatch, useSelector} from "react-redux";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import {startFaceRecognition} from "../../store/index.js";

const Siri = ({utterance}) => {
    const validCommands = ['yes', 'no', 'floor one', 'floor 1', 'floor 2', 'floor 3', 'floor 4', 'floor 5', 'floor 6', 'floor 7', 'floor 8', 'floor 9', 'floor 10', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    const [REGISTERED_USER, RETURNING_USER, UNREGISTERED_USER] = ['registered', 'returning_user', 'unregistered'];
    const [INITIAL, FLOOR_QUESTION] = ['initial', 'floor_question'];
    const [userType, setUserType] = useState(null);
    const [currentQuestionStep, setCurrentQuestionStep] = useState(INITIAL);
    const [siriMessage, setSiriMessage] = useState("");
    const [isSpeechSynthesisEnded, setSpeechSynthesisEnded] = useState(false);
    const dispatch = useDispatch();
    const detectedUserInfo = useSelector(state => state.faceDetector.detectedUserInfo);

    // Speech recognition commands and responses
    const commands = [
        {
            command: 'yes',
            callback: () => {
                if (currentQuestionStep === INITIAL && (userType === REGISTERED_USER || userType === RETURNING_USER)) {
                    utterance.voice = speechSynthesis.getVoices()[5];
                    utterance.lang = "en-US";
                    utterance.text = "No problem! Have a nice day!";
                    setSiriMessage(utterance.text);
                    utterance.onend = () => {
                        setSpeechSynthesisEnded(true);
                        dispatch(startFaceRecognition());
                    };
                    speechSynthesis.speak(utterance);

                }
            }
        },
        {
            command: 'no',
            callback: () => {

                if (userType === REGISTERED_USER || userType === RETURNING_USER || currentQuestionStep === INITIAL) {
                    setCurrentQuestionStep(FLOOR_QUESTION);
                    askUser("Which floor would you like to go to?");

                } else {
                    setSiriMessage("Goodbye!");
                }
            }
        },
        {
            command: ['(floor) one', '(floor) 1', '(floor) 2', '(floor) 3', '(floor) 4', '(floor) 5', '(floor) 6', '(floor) 7', '(floor) 8', '(floor) 9', '(floor) 10'],
            callback: ({command}) => {

                if (currentQuestionStep === FLOOR_QUESTION) {
                    console.log(`Hi there! You said: "${command}"`)
                }
            }
            ,
            matchInterim: true
        },

    ];


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

        if (detectedUserInfo.uid) {
            setUserType(REGISTERED_USER);
            askUser("Welcome! Would you like to go home?");

        } else if (detectedUserInfo.floor_number) {
            setUserType(RETURNING_USER);
            askUser(`Welcome! Would you like to go to floor ${detectedUserInfo.floor_number} like the last time?`);
        } else {
            setUserType(UNREGISTERED_USER);
            askUser("Sorry! Can't recognize you! Would you like to make a video call for approval?");
        }

    }, []);


    useEffect(() => {
        if (!listening && isSpeechSynthesisEnded && transcript.length == 0) {
            // Speech recognition has ended and speech synthesis had finished, dispatch your action here
            dispatch(startFaceRecognition());
        } else if (transcript.length > 0 && !validCommands.includes(transcript)) {
            askUser("Sorry! I didn't get that! Please repeat!");
        }

    }, [listening, isSpeechSynthesisEnded]);


    /**
     * Talking to user
     * @returns {Promise<void>}
     */
    const askUser = async (text) => {
        utterance.voice = speechSynthesis.getVoices()[5];
        utterance.lang = "en-US";
        utterance.text = text;
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
            <Typography variant="h5" gutterBottom
                        style={{textAlign: "center", zIndex: 1, padding: "40px"}}>
                {siriMessage}
            </Typography>
            <Stack spacing={2} sx={{zIndex: 1, position: "absolute", bottom: 30, textAlign: "center"}}>
                <Box>
                    {transcript ? <Chip label={`${transcript}`} variant="outlined"/> : null}
                </Box>
                <Box>
                    <IconButton sx={{color: listening ? "#1cb612" : "#ce1313"}}>
                        {listening ? <MicIcon/> : <MicOffIcon/>}
                    </IconButton>
                </Box>
            </Stack>


        </React.Fragment>

    );
};

export default Siri;