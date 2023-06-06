import React from "react";
import {Box, Button, Grid, styled} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {db} from "../../firebase_module";
import VideoContainer from "./VideoContainer.jsx";
import VideoItem from "./VideoItem.jsx";
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    addDoc,
} from "firebase/firestore";
import {sendVideoCallRequestMessageToUser} from "../../firebase_module";


/**
 * Video Calling Page using WebRTC
 * @returns {JSX.Element}
 * @constructor
 */
function VideoCallPage({uid, token, email}) {
    const webcamVideo = useRef(null);
    const callButton = useRef(null);
    const remoteVideo = useRef(null);
    const hangupButton = useRef(null);
    const [callButtonIsEnabled, setCallButtonIsEnabled] = useState(false);

    let localStream = null;
    let remoteStream = null;


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

    const [pc, setPc] = useState(new RTCPeerConnection(servers));

    useEffect(() => {
        console.log("Peer Connection Created");
        const message = {
            title: "New Text Message",
            message: "Hello, how are you?",
        };
        sendVideoCallRequestMessageToUser(
            "nnastaran83@gmail.com",
            message).then(startWebCam());


    }, []);

    /**
     * Handles the click event of the webcam button
     * @returns {Promise<void>}
     */
    const startWebCam = async () => {
        // setting local stream to the video from our camera
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        // Pushing tracks from local stream to peerConnection
        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        // displaying the video data from the stream to the webpage
        webcamVideo.current.srcObject = localStream;

        // initializing the remote server to the mediastream
        remoteStream = new MediaStream();
        remoteVideo.current.srcObject = remoteStream;

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                console.log("Adding track to remoteStream", track);
                remoteStream.addTrack(track);
            });
            remoteVideo.current.srcObject = remoteStream;
        };

        // enabling and disabling interface based on the current condition
        setCallButtonIsEnabled(true);
    };

    /**
     * Handles the click event of the call button
     * @returns {Promise<void>}
     */
    const startCallWithUser = async () => {
        console.log("Call Button Clicked");

        //TODO: change the uid to the uid of the user to call
        const callDoc = doc(db, "calls", uid); // Main collection in firestore
        const offerCandidates = collection(callDoc, "offerCandidates"); //Sub collection of callDoc
        const answerCandidiates = collection(callDoc, "answerCandidates"); //Sub collection of callDoc


        //Before the caller and callee can connect to each other, they need to exchange ICE candidates that tell WebRTC how to connect to the remote peer.
        //Get candidates for caller and save to db
        pc.onicecandidate = (event) => {
            console.log("Got Ice Candidate", event.candidate);
            event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
        };

        // Create a RTCSessionDescription that will represent the offer from the caller, then set it as the local description,
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        // config for offer
        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };


        // setting the offer to the callDoc
        await setDoc(callDoc, {offer});

        ///Listen for changes to the database and detect when an answer from the callee has been added.
        onSnapshot(callDoc, async (snapshot) => {
            const data = snapshot.data();
            if (!pc.currentRemoteDescription && data.answer) {
                //TODO: change the answerDescription name to answer
                const answerDescription = new RTCSessionDescription(data.answer);
                await pc.setRemoteDescription(answerDescription);
            }

        });

        // Listen for answer candidates and add them to peer connection
        onSnapshot(answerCandidiates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.addIceCandidate(candidate);
                }
            });
        });

    };

    return (
        <Box
            className={"webrtc-video-calling-app"}
            sx={{height: "100%", width: "100%"}}

        >
            <Grid container
                  style={{height: "100%", maxHeight: "100%", margin: 0, padding: 0}}>
                <Grid item xs={12} sm={12} md={6} lg={6} sx={{textAlign: "center"}}>
                    <VideoContainer>
                        <VideoItem component={"video"}
                                   id="webcamVideo"
                                   autoPlay
                                   playsInline
                                   ref={webcamVideo}
                        ></VideoItem>
                    </VideoContainer>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} sx={{textAlign: "center"}}>
                    <VideoContainer>
                        <VideoItem component={"video"}
                                   id="remoteVideo"
                                   autoPlay
                                   playsInline
                                   ref={remoteVideo}
                        ></VideoItem>
                    </VideoContainer>
                </Grid>
                <Grid
                    container
                    columnSpacing={10}
                    style={{position: "fixed", bottom: 0, marginBottom: "1rem"}}
                >
                    <Grid item xs={6} sx={{textAlign: "right"}}>
                        <Button
                            id="callButton"
                            onClick={startCallWithUser}
                            ref={callButton}
                            disabled={!callButtonIsEnabled}
                            style={{
                                backgroundColor: "#00DE00",
                            }}
                            variant="contained"
                        >
                            JOIN
                        </Button>
                    </Grid>
                    <Grid item xs={6} sx={{textAlign: "left"}}>
                        <div>
                            <Button
                                id="hangupButton"
                                ref={hangupButton}
                                style={{
                                    backgroundColor: `#FF0000`,
                                }}
                                variant="contained"
                            >
                                X
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default VideoCallPage;
