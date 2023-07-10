import React from 'react';
import {Chip, Typography} from "@mui/material";
import AnimationContainer from "../containers/AnimationContainer.jsx";
import RainbowContainer from "../containers/RainbowContainer.jsx";
import {useSpeechCommands} from '../../hooks/useSpeechCommands.js';
import MicIconButton from "../buttons/MicIconButton.jsx";

/**
 * Siri component is used to display the Siri UI and handle the speech commands.
 * @param utterance
 * @returns {JSX.Element}
 * @component
 */
// eslint-disable-next-line react/prop-types
const Siri = ({utterance}) => {
    const {
        listening,
        transcript,
        siriMessage
    } = useSpeechCommands();


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

        </React.Fragment>
    );
};

export default Siri;