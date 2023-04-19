import {useMeeting} from "@videosdk.live/react-sdk";
import React from "react";

/**
 * Controls component is used to control the video call room, like leave, toggleMic, toggleWebcam
 * @returns {JSX.Element}
 * @constructor
 */
function Controls() {
    const {leave, toggleMic, toggleWebcam} = useMeeting();
    return (
        <div>
            <button onClick={() => leave()}>Leave</button>
            <button onClick={() => toggleMic()}>toggleMic</button>
            <button onClick={() => toggleWebcam()}>toggleWebcam</button>
        </div>
    );
}

export default Controls;