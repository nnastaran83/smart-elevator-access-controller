// VideoCall.js
import React, {useEffect, useRef, useState} from 'react';
import socketClient from 'socket.io-client';

const VIDEO_CALL_SERVER = 'http://127.0.0.1:3000';

let socket;

const VideoCall = () => {

    useEffect(() => {
        const connectWithWebSocket = () => {
            socket = socketClient(VIDEO_CALL_SERVER);
            socket.on('connection', () => {
                console.log('successfully connected with server');
                console.log(socket.id);
            })
        };

        connectWithWebSocket();

    }, []);

    return (<div>
        Video Call Component
    </div>);


};
export default VideoCall;
