import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import axios from "axios";
import {Box, Chip, IconButton, Stack, Typography} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import AnimationContainer from "../containers/AnimationContainer.jsx";
import VideoCallPopup from "../VideoCallPopup/index.jsx";
import Rainbow from "../containers/Rainbow.jsx";
import {FLOOR_MAP, QUESTION_STEPS, USER_STATES} from "../../util/constants.js";
import {
    startFaceRecognition,
    setIsVideoCallActive,
    changeUserType,
    setRequestedFloorNumber
} from "../../store/index.js";


/***
 * Siri component is used to handle speech recognition and help the user.
 * @param utterance
 * @returns {JSX.Element}
 * @constructor
 */
const Siri = ({utterance}) => {
    const [currentQuestionStep, setCurrentQuestionStep] = useState(QUESTION_STEPS.INITIAL);
    const [siriMessage, setSiriMessage] = useState("");
    const [isSpeechSynthesisEnded, setSpeechSynthesisEnded] = useState(false);
    const dispatch = useDispatch();
    const {
        detectedUserInfo,
        userType,
        isVideoCallActive,
        requestedFloorNumber,
        registeredUsers
    } = useSelector(state => {
        return {
            detectedUserInfo: state.currentDetectedUser.detectedUserInfo,
            userType: state.currentDetectedUser.userType,
            isVideoCallActive: state.videoCall.isVideoCallActive,
            requestedFloorNumber: state.currentDetectedUser.requestedFloorNumber,
            registeredUsers: state.contactList.registeredUsers
        }
    });


    // Create a set of floor numbers from your array of objects
    const floorNumberSet = new Set(registeredUsers.map(obj => obj.floor_number));
    // Filter VALID_FLOOR_NUMBERS to only include numbers in the set
    const VALID_FLOOR_NUMBERS = Object.keys(FLOOR_MAP).filter(floor =>
        floorNumberSet.has(FLOOR_MAP[floor])
    );
    const VALID_COMMANDS = ['yes', 'no', ...VALID_FLOOR_NUMBERS];

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
                        dispatch(setRequestedFloorNumber(floorNumber));
                        utterance.voice = speechSynthesis.getVoices()[5];
                        utterance.lang = "en-US";
                        utterance.text = "Checking for access permission! Please wait...";
                        setSiriMessage(utterance.text);
                        utterance.onend = async () => {
                            const response = axios.post('http://localhost:5000/check_access_permission',
                                {frame_data: detectedUserInfo.imageFrameData, floor_number: floorNumber}
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
                                    dispatch(changeUserType(USER_STATES.UNREGISTERED_USER));
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
        if (userType === USER_STATES.REGISTERED_USER) {
            askUser("Welcome! Would you like to go home?");

        } else if (userType === USER_STATES.RETURNING_USER) {
            askUser(`Welcome! Would you like to go to floor ${detectedUserInfo.floor_number} like the last time?`);
        } else {
            setCurrentQuestionStep(QUESTION_STEPS.VIDEO_CALL_QUESTION);
            askUser("Sorry! Can't recognize you! Would you like to make a video call for approval?");
        }
    }, []);


    useEffect(() => {
        if (!listening && isSpeechSynthesisEnded && transcript.length === 0) {
            // Speech recognition has ended and speech synthesis had finished, dispatch your action here
            dispatch(startFaceRecognition());
            setSpeechSynthesisEnded(false);
        } else if (!listening && transcript.length > 0 && !VALID_COMMANDS.includes(transcript.toLowerCase())) {
            resetTranscript();
            askUser("Sorry! I didn't quite get that! Please repeat your answer!");
        }
    }, [listening, isSpeechSynthesisEnded]);


    /**
     * Talking to user
     * @returns {Promise<void>}
     */
    const askUser = async (text) => {
        setSpeechSynthesisEnded(false);
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
                }}>
                    <Rainbow/>
                </Box>
            </AnimationContainer>

            <Typography variant="h5" gutterBottom sx={{textAlign: "center", zIndex: 1, padding: "40px"}}>
                {siriMessage}
            </Typography>

            <Stack spacing={2} sx={{zIndex: 1, position: "absolute", bottom: 40, textAlign: "center"}}>
                <Box>
                    {transcript ? <Chip label={`${transcript}`} variant="outlined"/> : null}
                </Box>
                <IconButton sx={{
                    background: listening ? "rgba(106,245,82,0.18)" : "rgba(255,17,17,0.18)",
                    color: listening ? "#1aa600" : "#ff0c0c"
                }}>
                    {listening ? <MicIcon/> : <MicOffIcon/>}
                </IconButton>
            </Stack>

            {isVideoCallActive ? <VideoCallPopup floorNumber={requestedFloorNumber}/> : null}
        </React.Fragment>

    );
};

export default Siri;