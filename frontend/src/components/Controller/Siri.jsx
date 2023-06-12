import React, {useEffect, useState} from 'react';
import '../../styles/Siri.css';
import {Box, Chip, IconButton, Stack, Typography} from "@mui/material";
import AnimationContainer from "../AnimationContainer.jsx";
import {useDispatch, useSelector} from "react-redux";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import {startFaceRecognition, setIsVideoCallActive} from "../../store/index.js";
import VideoCallPopup from "../VideoCallPopup/index.jsx";
import axios from "axios";

const FLOOR_MAP = {
    '1': 1, 'one': 1,
    '2': 2, 'two': 2,
    '3': 3, 'three': 3,
    '4': 4, 'four': 4,
    '5': 5, 'five': 5,
    '6': 6, 'six': 6,
    '7': 7, 'seven': 7,
    '8': 8, 'eight': 8,
    '9': 9, 'nine': 9,
    '10': 10, 'ten': 10,
};
const VALID_FLOOR_NUMBERS = [...Object.keys(FLOOR_MAP).map(key => 'floor ' + key), ...Object.keys(FLOOR_MAP)];
const VALID_COMMANDS = ['yes', 'no', ...VALID_FLOOR_NUMBERS];
const USER_STATES = {
    REGISTERED_USER: 'registered',
    RETURNING_USER: 'returning_user',
    UNREGISTERED_USER: 'unregistered'
};
const QUESTION_STEPS = {
    INITIAL: 'initial',
    FLOOR_QUESTION: 'floor_question',
    VIDEO_CALL_QUESTION: 'video_call_question'
};

/***
 * Siri component is used to handle speech recognition and help the user.
 * @param utterance
 * @returns {JSX.Element}
 * @constructor
 */
const Siri = ({utterance}) => {
    const [userType, setUserType] = useState(null);
    const [currentQuestionStep, setCurrentQuestionStep] = useState(QUESTION_STEPS.INITIAL);
    const [siriMessage, setSiriMessage] = useState("");
    const [isSpeechSynthesisEnded, setSpeechSynthesisEnded] = useState(false);
    const [videoCallRequest, setVideoCallRequest] = useState(false);

    const dispatch = useDispatch();
    const detectedUserInfo = useSelector(state => state.faceDetector.detectedUserInfo);
    const isVideoCallActive = useSelector(state => state.videoCall.isVideoCallActive);
    const currentDetectedImageFrameData = useSelector(state => state.faceDetector.currentDetectedImageFrameData);

    // Speech recognition commands and responses
    const commands = [
        {
            command: 'yes',
            callback: () => {
                if (currentQuestionStep === QUESTION_STEPS.INITIAL) {
                    utterance.voice = speechSynthesis.getVoices()[5];
                    utterance.lang = "en-US";
                    if ((userType === USER_STATES.REGISTERED_USER || userType === USER_STATES.RETURNING_USER)) {
                        utterance.text = "No problem! Have a nice day!";
                        setSiriMessage(utterance.text);
                        utterance.onend = () => {
                            setSpeechSynthesisEnded(true);
                            dispatch(startFaceRecognition());
                        };
                        speechSynthesis.speak(utterance);
                    }

                } else if (userType === USER_STATES.UNREGISTERED_USER && currentQuestionStep === QUESTION_STEPS.VIDEO_CALL_QUESTION) {
                    utterance.text = "No problem! Here is the list of people you can contact with.";
                    setSiriMessage(utterance.text);
                    utterance.onend = () => {
                        setSpeechSynthesisEnded(true);
                        dispatch(setIsVideoCallActive(true));
                    };
                    speechSynthesis.speak(utterance);

                }
            }
        },
        {
            command: 'no',
            callback: () => {

                if ((userType === USER_STATES.REGISTERED_USER || userType === USER_STATES.RETURNING_USER) && currentQuestionStep === QUESTION_STEPS.INITIAL) {
                    setCurrentQuestionStep(QUESTION_STEPS.FLOOR_QUESTION);
                    askUser("Which floor would you like to go to?");

                } else if (userType === USER_STATES.UNREGISTERED_USER && currentQuestionStep === QUESTION_STEPS.VIDEO_CALL_QUESTION) {

                    utterance.text = "Goodbye!";
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
            command: VALID_FLOOR_NUMBERS,
            callback: async ({command}) => {
                console.log("command", command);
                if (currentQuestionStep === QUESTION_STEPS.FLOOR_QUESTION) {
                    const floorNumber = FLOOR_MAP[command.toLowerCase()];
                    if (floorNumber) {
                        utterance.voice = speechSynthesis.getVoices()[5];
                        utterance.lang = "en-US";
                        utterance.text = "Checking for access permission! Please wait...";
                        setSiriMessage(utterance.text);
                        utterance.onend = async () => {
                            const response = axios.post('http://localhost:5000/check_access_permission',
                                {frame_data: currentDetectedImageFrameData, floor_number: floorNumber}
                            ).then(response => {
                                if (response.data.access_permission) {
                                    utterance.text = "Access granted! Have a nice day!";
                                    setSiriMessage(utterance.text);
                                    utterance.onend = () => {
                                        setSpeechSynthesisEnded(true);
                                        dispatch(startFaceRecognition());
                                    };
                                    speechSynthesis.speak(utterance);
                                } else {
                                    setUserType(USER_STATES.UNREGISTERED_USER);
                                    setCurrentQuestionStep(QUESTION_STEPS.VIDEO_CALL_QUESTION);
                                    askUser("Access denied! Would you like to make a video call for approval?");

                                }


                            }).catch(error => {
                                    console.log("error", error);
                                }
                            );
                        };
                        speechSynthesis.speak(utterance);
                    }
                }
            }

        },

    ];


    const {
        listening,
        resetTranscript,
        transcript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({commands});


    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            console.log("Attention! Browser doesn't support speech recognition");
        }
        if (detectedUserInfo.uid) {
            setUserType(USER_STATES.REGISTERED_USER);
            askUser("Welcome! Would you like to go home?");

        } else if (detectedUserInfo.floor_number) {
            setUserType(USER_STATES.RETURNING_USER);
            askUser(`Welcome! Would you like to go to floor ${detectedUserInfo.floor_number} like the last time?`);
        } else {
            setUserType(USER_STATES.UNREGISTERED_USER);
            setCurrentQuestionStep(QUESTION_STEPS.VIDEO_CALL_QUESTION);
            askUser("Sorry! Can't recognize you! Would you like to make a video call for approval?");
        }

    }, []);


    useEffect(() => {
        console.log("listening", listening);
        console.log("isSpeechSynthesisEnded", isSpeechSynthesisEnded);
        console.log("transcript", transcript)
        if (!listening && isSpeechSynthesisEnded && transcript.length == 0) {
            // Speech recognition has ended and speech synthesis had finished, dispatch your action here
            dispatch(startFaceRecognition());
            setSpeechSynthesisEnded(false);
        } else if (transcript.length > 0 && !VALID_COMMANDS.includes(transcript.toLowerCase())) {
            console.log("transcript", transcript);
            askUser("Sorry! I didn't quite get that! Please repeat your answer!");
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
            <Stack spacing={2} sx={{zIndex: 1, position: "absolute", bottom: 40, textAlign: "center"}}>
                <Box>
                    {transcript ? <Chip label={`${transcript}`} variant="outlined"/> : null}
                </Box>
                <Box>
                    <IconButton sx={{
                        background: listening ? "rgba(106,245,82,0.18)" : "rgba(255,17,17,0.18)",
                        color: listening ? "#1aa600" : "#ff0c0c"
                    }}>
                        {listening ? <MicIcon/> : <MicOffIcon/>}
                    </IconButton>
                </Box>
            </Stack>

            {isVideoCallActive && <VideoCallPopup/>}
        </React.Fragment>

    );
};

export default Siri;