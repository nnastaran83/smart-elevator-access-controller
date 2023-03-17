// VideoCall.js
import React, {useEffect, useRef, useState} from 'react';
import Video from 'twilio-video';

const VideoCall = ({roomName}) => {
    const [token, setToken] = useState(null);
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();

    // Fetch an access token from the backend server
    const fetchToken = async () => {
        const response = await fetch(`http://localhost:5000/token?identity=${roomName}`);
        const data = await response.json();
        setToken(data.token);
    };

    useEffect(() => {
        fetchToken();
    }, []);

    // Connect to the Twilio room
    const connectToRoom = async (token) => {
        const room = await Video.connect(token, {video: true, audio: true, name: roomName});
        room.localParticipant.tracks.forEach((publication) => {
            if (publication.track.kind === 'video') {
                publication.track.attach(localVideoRef.current);
            }
        });

        room.on('participantConnected', (participant) => {
            console.log(`Participant connected: ${participant.identity}`);
            participant.tracks.forEach((publication) => {
                if (publication.track.kind === 'video') {

                    publication.track.attach(remoteVideoRef.current);
                }
            });
        });

        room.on('participantDisconnected', (participant) => {
            console.log(`Participant disconnected: ${participant.identity}`);
            participant.tracks.forEach((publication) => {
                if (publication.track.kind === 'video') {
                    publication.track.detach(remoteVideoRef.current);
                }
            });
        });

        window.addEventListener('beforeunload', () => {
            room.disconnect();
        });
    };

    useEffect(() => {
        if (token) {
            connectToRoom(token);
        }
    }, [token]);

    return (
        <div>
            <video ref={localVideoRef} autoPlay={true} muted={true}/>
            <video ref={remoteVideoRef} autoPlay={true}/>
        </div>
    );
};
export default VideoCall;
