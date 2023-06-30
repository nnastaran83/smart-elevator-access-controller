import {useRef} from 'react';

const usePeerConnection = () => {
    // server config
    const servers = {
        iceServers: [
            {
                urls: [
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                ], // free stun server
            },
        ],
        iceCandidatePoolSize: 10,
    };
    return {pc: useRef(new RTCPeerConnection(servers))};
};

export {usePeerConnection};