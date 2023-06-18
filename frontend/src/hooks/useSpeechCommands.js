import React from 'react';
import {useState, useEffect} from 'react';
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {useDispatch} from "react-redux";
import {FLOOR_MAP, QUESTION_STEPS, USER_STATES} from "../util/constants.js";
import axios from "axios";
import {
    startFaceRecognition,
    setIsVideoCallActive,
    changeUserType,
    setRequestedFloorNumber
} from "../store/index.js";

/**
 * This hook is used to handle the speech recognition commands and responses.
 * @param utterance
 * @param userType
 * @param currentQuestionStep
 * @param setCurrentQuestionStep
 * @param detectedUserInfo
 * @param VALID_COMMANDS
 * @param VALID_FLOOR_NUMBERS
 * @returns {{listening, askUser: ((function(*): Promise<void>)|*), transcript, isSpeechSynthesisEnded: boolean, resetTranscript, siriMessage: string, browserSupportsSpeechRecognition}}
 */
export const useSpeechCommands = (utterance, userType, currentQuestionStep, setCurrentQuestionStep, detectedUserInfo, VALID_COMMANDS, VALID_FLOOR_NUMBERS) => {
    const dispatch = useDispatch();
    const [siriMessage, setSiriMessage] = useState("");
    const [isSpeechSynthesisEnded, setSpeechSynthesisEnded] = useState(false);


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
                            axios.post('http://localhost:5000/check_access_permission',
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


    return {
        listening,
        resetTranscript,
        transcript,
        browserSupportsSpeechRecognition,
        askUser,
        siriMessage,
        isSpeechSynthesisEnded
    };
};