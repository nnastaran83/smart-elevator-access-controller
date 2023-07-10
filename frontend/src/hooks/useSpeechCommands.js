import {useState, useEffect, useCallback} from 'react';
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {useDispatch, useSelector} from "react-redux";
import {FLOOR_MAP, QUESTION_STEPS, USER_STATES} from "../util/constants.js";
import axios from "axios";
import {
    startFaceRecognition,
    setIsVideoCallActive,
    changeUserType,
    setRequestedFloorNumber
} from "../store/index.js";
import useSpeech from "./useSpeech.js";

/**
 * @description Hook to use speech recognition
 * @returns {{listening, askUser: ((function(*): void)|*), transcript, isSpeechSynthesisEnded: boolean, resetTranscript, siriMessage: string, browserSupportsSpeechRecognition}}
 */
export const useSpeechCommands = () => {
    const {
        detectedUserInfo,
        userType,
        VALID_COMMANDS,
        VALID_FLOOR_NUMBERS

    } = useSelector(({
                         currentDetectedUser: {detectedUserInfo, userType},
                         contactList: {registeredUsers}
                     }) => {
        // Create a set of floor numbers from your array of objects
        const floorNumberSet = new Set(registeredUsers.map(obj => obj.floor_number));
        // Filter VALID_FLOOR_NUMBERS to only include numbers in the set
        const VALID_FLOOR_NUMBERS = Object.keys(FLOOR_MAP).filter(floor =>
            floorNumberSet.has(FLOOR_MAP[floor])
        );
        const VALID_COMMANDS = ['yes', 'no', ...VALID_FLOOR_NUMBERS];
        return {
            detectedUserInfo,
            userType,
            VALID_COMMANDS,
            VALID_FLOOR_NUMBERS
        }
    });
    const [currentQuestionStep, setCurrentQuestionStep] = useState(QUESTION_STEPS.INITIAL);
    const dispatch = useDispatch();
    const [siriMessage, setSiriMessage] = useState("Welcome");
    const [isSpeechSynthesisEnded, setSpeechSynthesisEnded] = useState(false);
    const [sayText] = useSpeech();

    // Speech recognition commands and responses
    const commands = [
        {
            command: 'yes',
            callback: () => {
                if (currentQuestionStep === QUESTION_STEPS.INITIAL) {
                    //utterance.voice = speechSynthesis.getVoices()[5];
                    //utterance.lang = "en-US";
                    if ((userType === USER_STATES.REGISTERED_USER || userType === USER_STATES.RETURNING_USER)) {
                        setSiriMessage("No problem! Have a nice day!");
                        sayText("No problem! Have a nice day!").then(() => {
                            dispatch(startFaceRecognition());
                        });
                    }

                } else if (userType === USER_STATES.UNREGISTERED_USER && currentQuestionStep === QUESTION_STEPS.VIDEO_CALL_QUESTION) {
                    setSiriMessage("No problem! Here is the list of people you can contact with.");
                    sayText("No problem! Here is the list of people you can contact with.").then(() => {
                        dispatch(setIsVideoCallActive(true));
                    });
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
                    setSiriMessage("Goodbye!");
                    sayText("Goodbye!").then(() => {
                        dispatch(startFaceRecognition());
                    });
                }
            }
        },
        {
            command: VALID_FLOOR_NUMBERS,
            callback: async ({command}) => {
                if (currentQuestionStep === QUESTION_STEPS.FLOOR_QUESTION) {
                    const floorNumber = FLOOR_MAP[command.toLowerCase()];
                    if (floorNumber) {
                        dispatch(setRequestedFloorNumber(floorNumber));
                        if (userType === USER_STATES.UNREGISTERED_USER) {
                            setSiriMessage("Here is the list of people you can contact with to get access permission.");
                            sayText("Here is the list of people you can contact with to get access permission.").then(() => {
                                dispatch(setIsVideoCallActive(true));
                            });
                        } else {
                            setSiriMessage("Checking for access permission! Please wait...");
                            sayText("Checking for access permission! Please wait...").then(() => {
                                checkAccessPermission(floorNumber);
                            });

                        }

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
        } else {
            sayText("Welcome").then(() => {
                switch (userType) {
                    case USER_STATES.REGISTERED_USER:
                        askUser("Would you like to go home?");
                        break;
                    case USER_STATES.RETURNING_USER:
                        askUser(`Would you like to go to floor ${detectedUserInfo.floor_number} like the last time?`);
                        break;
                    default:
                        setCurrentQuestionStep(QUESTION_STEPS.FLOOR_QUESTION);
                        askUser("Which floor would you like to go to?");
                }

            });
        }


    }, []);


    useEffect(() => {
        if (!listening && isSpeechSynthesisEnded) {
            if (transcript.length === 0) {
                // Speech recognition has ended and speech synthesis had finished, dispatch your action here
                dispatch(startFaceRecognition());
                //  setSpeechSynthesisEnded(false);
            } else if (transcript.length > 0) {
                if (currentQuestionStep === QUESTION_STEPS.FLOOR_QUESTION) {
                    if (!VALID_FLOOR_NUMBERS.includes(transcript.toLowerCase())) {
                        askUser("Sorry! I didn't quite get that! Please repeat your answer!");
                    }
                } else if (currentQuestionStep === QUESTION_STEPS.INITIAL || currentQuestionStep === QUESTION_STEPS.VIDEO_CALL_QUESTION) {
                    if (!['yes', 'no'].includes(transcript.toLowerCase())) {
                        askUser("Sorry! I didn't quite get that! Please repeat your answer!");
                    }
                }

            }
        }

    }, [listening, isSpeechSynthesisEnded]);


    /**
     * Ask user a question and start listening
     * @type {(function(*): void)|*}
     */
    const askUser = useCallback((text) => {
        setSpeechSynthesisEnded(false);
        setSiriMessage(text);
        sayText(text).then(() => {
            SpeechRecognition.startListening();
            setSpeechSynthesisEnded(true);

        });
    }, [resetTranscript, sayText]);

    /**
     * Check access permission for the user
     * @param floorNumber
     * @returns {Promise<void>}
     */
    const checkAccessPermission = async (floorNumber) => {
        axios.post('http://localhost:5000/check_access_permission',
            {frame_data: detectedUserInfo.imageFrameData, floor_number: floorNumber}
        ).then(response => {
            if (response.data.access_permission) {
                setSiriMessage("Access granted! Have a nice day!");
                sayText("Access granted! Have a nice day!").then(() => {
                    dispatch(startFaceRecognition());
                });
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


    return {
        listening,
        resetTranscript,
        transcript,
        browserSupportsSpeechRecognition,
        askUser,
        siriMessage,
        isSpeechSynthesisEnded,

    };
};