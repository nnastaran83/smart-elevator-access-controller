import React, {useEffect, useState} from 'react';
import axios from "axios";


const ZoomCall = () => {
    const [meetingCreated, setMeetingCreated] = useState(false);
    const [meetingData, setMeetingData] = useState(null);


    const createZoomMeeting = async () => {
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1YTMzOS1KVFNBRzEzeWdRN0tmTUNBIn0.Mgj-yVRSzet2aZU9Q38mm9zB9dk8haWM4fKLzx3roA8";
        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };
        const data = {
            topic: "Your Meeting Topic",
            type: 1, // Instant meeting
            settings: {
                host_video: true,
                participant_video: true
            }
        };
        const userId = "me"; // Use "me" as the user ID to create a meeting for the current user
        const response = await axios.post(`https://api.zoom.us/v2/users/${userId}/meetings`, data, config);
        return response.data;
    };

    const joinZoomMeeting = async (meetingData) => {
        const loadZoomSDK = () => {
            return new Promise((resolve) => {
                const zoomScript = document.createElement("script");
                zoomScript.src = "https://source.zoom.us/1.9.9/lib/vendor/react.min.js";
                zoomScript.async = true;
                document.body.appendChild(zoomScript);
                zoomScript.onload = () => {
                    const sdkScript = document.createElement("script");
                    sdkScript.src = "https://source.zoom.us/zoom-meeting-1.9.9.min.js";
                    sdkScript.async = true;
                    document.body.appendChild(sdkScript);
                    sdkScript.onload = () => {
                        resolve();
                    };
                };
            });
        };

        await loadZoomSDK();


        ZoomMtg.init({
            leaveUrl: "https://smart-zoom-video-call.com", // Replace with your desired leave URL
            success: () => {
                ZoomMtg.join({
                    signature,
                    meetingNumber: meetingData.id,
                    userName: "Your Name",
                    apiKey: "Yb6pgEdkARTeyStJFBkiRfg",
                    userEmail: "",
                    passWord: meetingData.password,
                    success: () => {
                        console.log("Successfully joined meeting");
                    },
                    error: (error) => {
                        console.log("Failed to join meeting:", error);
                    },
                });
            },
            error: (error) => {
                console.log("Failed to initialize Zoom SDK:", error);
            },
        });
        const {ZoomMtg} = window.ZoomMtg;
    };


    const handleCreateMeeting = async () => {
        try {
            const meetingData = await createZoomMeeting();
            setMeetingData(meetingData);
            setMeetingCreated(true);
        } catch (error) {
            console.error("Error creating meeting:", error);
        }
    };

    const handleJoinMeeting = async () => {
        try {
            await joinZoomMeeting(meetingData);
        } catch (error) {
            console.error("Error joining meeting:", error);
        }
    };

    return (
        <div>
            {!meetingCreated ? (
                <button onClick={handleCreateMeeting}>Create Meeting</button>
            ) : (
                <button onClick={handleJoinMeeting}>Join Meeting</button>
            )}
        </div>
    );
};


export default ZoomCall;
