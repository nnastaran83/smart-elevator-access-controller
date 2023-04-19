import React, {useState} from "react";

/**
 * JoinScreen component is used to display a screen for joining a meeting.
 * @param getMeetingAndToken
 * @returns {JSX.Element}
 * @constructor
 */
function JoinScreen({getMeetingAndToken}) {
    const [meetingId, setMeetingId] = useState(null);
    const onClick = async (e) => {
        e.preventDefault();
        await getMeetingAndToken(meetingId);
    };
    return (
        <div>
            <input
                type="text"
                placeholder="Enter Meeting Id"
                onChange={(e) => {
                    setMeetingId(e.target.value);
                }}
            />
            <button onClick={onClick}>Join</button>
            {" or "}
            <button onClick={onClick}>Create Meeting</button>
        </div>
    );
}

export default JoinScreen;