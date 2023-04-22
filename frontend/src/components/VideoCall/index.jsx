import React, {useEffect, useMemo, useRef, useState} from "react";
import {
    MeetingProvider,
    MeetingConsumer,
    useMeeting,
    useParticipant,
} from "@videosdk.live/react-sdk";
import {authToken, createMeeting} from "../../apis/VideoSdkApi.js";
import JoinScreen from "./JoinScreen.jsx";
import MeetingView from "./MeetingView.jsx";

/**
 * VideoCall component is the main component of the video call
 * @returns {JSX.Element}
 * @component
 */
function VideoCall() {
    const [meetingId, setMeetingId] = useState(null);

    //Getting the meeting id by calling the api we just wrote
    const getMeetingAndToken = async (id) => {
        const meetingId =
            id == null ? await createMeeting({token: authToken}) : id;
        setMeetingId(meetingId);
    };

    //This will set Meeting Id to null when meeting is left or ended
    const onMeetingLeave = () => {
        setMeetingId(null);
    };

    return authToken && meetingId ? (
        <MeetingProvider
            config={{
                meetingId,
                micEnabled: true,
                webcamEnabled: true,
                name: "anonymous",
            }}
            token={authToken}
        >
            <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave}/>
        </MeetingProvider>
    ) : (
        <JoinScreen getMeetingAndToken={getMeetingAndToken}/>
    );
}

export default VideoCall;