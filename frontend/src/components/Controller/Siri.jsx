import React from 'react';
import {Chip, Typography} from "@mui/material";
import AnimationContainer from "../containers/AnimationContainer.jsx";
import VideoCallPopup from "../VideoCallPopup/index.jsx";
import RainbowContainer from "../containers/RainbowContainer.jsx";
import {useSpeechCommands} from '../../hooks/useSpeechCommands.js';
import MicIconButton from "../buttons/MicIconButton.jsx";
import {useSelector} from "react-redux";

/**
 * Siri component is used to display the Siri UI and handle the speech commands.
 * @param utterance
 * @returns {JSX.Element}
 * @constructor
 */
// eslint-disable-next-line react/prop-types
const Siri = ({utterance}) => {
    const {
        listening,
        transcript,
        siriMessage
    } = useSpeechCommands();
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


    return (
        <React.Fragment>
            <AnimationContainer>
                <div style={{
                    width: "100%",
                    height: "100%",
                    fontSize: "70vmin",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <RainbowContainer/>
                </div>
            </AnimationContainer>

            <Typography variant="h5" gutterBottom sx={{textAlign: "center", zIndex: 1, padding: "40px"}}>
                {siriMessage}
            </Typography>

            <div style={{zIndex: 1, position: "absolute", bottom: 50, textAlign: "center"}}>
                {transcript ? <Chip label={`${transcript}`} sx={{marginBottom: "20px"}} variant="outlined"
                /> : null}
                <br/>
                <MicIconButton listening={listening}/>

            </div>

            {isVideoCallActive ? <VideoCallPopup floorNumber={requestedFloorNumber}/> : null}
        </React.Fragment>
    );
};

export default Siri;