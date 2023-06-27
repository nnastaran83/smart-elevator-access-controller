import React from 'react';
import {useState} from 'react';
import {Box, Chip, IconButton, Stack, Typography} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import AnimationContainer from "../containers/AnimationContainer.jsx";
import VideoCallPopup from "../VideoCallPopup/index.jsx";
import RainbowContainer from "../containers/RainbowContainer.jsx";
import {useSpeechCommands} from '../../hooks/useSpeechCommands.js';
import {useSiriData} from '../../hooks/useSiriData.js';
import {QUESTION_STEPS} from "../../util/constants.js";

/**
 * Siri component is used to display the Siri UI and handle the speech commands.
 * @param utterance
 * @returns {JSX.Element}
 * @constructor
 */
// eslint-disable-next-line react/prop-types
const Siri = ({utterance}) => {
    const [currentQuestionStep, setCurrentQuestionStep] = useState(QUESTION_STEPS.INITIAL);
    const {
        detectedUserInfo,
        userType,
        isVideoCallActive,
        requestedFloorNumber,
        VALID_COMMANDS,
        VALID_FLOOR_NUMBERS
    } = useSiriData();

    const {
        listening,
        transcript,
        siriMessage,
    } = useSpeechCommands(utterance,
        userType,
        currentQuestionStep,
        setCurrentQuestionStep,
        detectedUserInfo,
        VALID_COMMANDS,
        VALID_FLOOR_NUMBERS);


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
                    <RainbowContainer/>
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
                    color: listening ? "#1aa600" : "#ff0c0c", width: "50px", height: "50px"
                }}>
                    {listening ? <MicIcon/> : <MicOffIcon/>}
                </IconButton>
            </Stack>

            {isVideoCallActive ? <VideoCallPopup floorNumber={requestedFloorNumber}/> : null}
        </React.Fragment>
    );
};

export default Siri;