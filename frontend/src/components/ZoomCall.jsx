import React, {useEffect} from 'react';
import {ZoomMtg} from '@zoomus/websdk';

const ZoomCall = ({meetingNumber, userName, passWord, role = 0}) => {
    useEffect(() => {
        ZoomMtg.setZoomJSLib('https://source.zoom.us/2.11.0/lib', '/av');
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();


        ZoomMtg.init({
            leaveUrl: 'http://localhost:5173', // Change this to the URL users should be redirected to after leaving the meeting
            isSupportAV: true,
            success: () => {
                ZoomMtg.join({
                    meetingNumber,
                    userName,
                    passWord,
                    apiKey: 'DQZ2gBJuTwKoieaJIQvXqw',
                    apiSecret: 'MfdJYaE3RK5XhSasbApT5a9GqRPeJpnL',
                    userEmail: 'nnastaran83@gmail.com', // Optional, if you want to associate the user with an email address
                    role,
                    success: () => console.log('Joined the meeting'),
                    error: (error) => console.log(error),
                });
            },
            error: (error) => console.log(error),
        });
    }, []);

    return <div id="zmmtg-root"></div>;
};

export default ZoomCall;
