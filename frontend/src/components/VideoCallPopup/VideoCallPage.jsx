import {Box, Grid} from "@mui/material";
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
import EllipseButton from "../buttons/EllipseButton.jsx";
import useSpeech from "../../hooks/useSpeech.js";
import axios from "axios";
import {useSelector} from "react-redux";
import {usePeerConnection} from "../../hooks/usePeerConnection.js";

const message = {
    title: "Smart",
    message: "New Incoming Video Call",
};


/**
 * Video Calling Page using WebRTC
 * @returns {JSX.Element}
 * @constructor
 */
// eslint-disable-next-line react/prop-types
function VideoCallPage({uid, email, floorNumber}) {
    const localStreamRef = useRef(null);
    //const [localStream, setLocalStream] = useState(null);
    const remoteVideo = useRef(null);
    //   const [remoteStream, setRemoteStream] = useState(null);
    const [pc] = usePeerConnection();
    const sendSignalChannel = useRef(null);
    const [joinedCall, setJoinedCall] = useState(false);
    const imageFrameData = useSelector((state) => state.currentDetectedUser.detectedUserInfo.imageFrameData);

    const [sayText] = useSpeech();

    useEffect(() => {
        startLocalStream();
        addRemoteStream();
        startCallWithUser();

    }, []);


    /**
     * Open the webcam
     * @param constraints
     * @returns {Promise<MediaStream>}
     */
    const openMediaDevices = async (constraints) => {
        return await navigator.mediaDevices.getUserMedia(constraints);
    };


    /**
     * Start the local video stream
     * @returns {Promise<void>}
     */
    const startLocalStream = async () => {
        // stop the previous stream before starting a new one
        stopStreamedVideo(localStreamRef.current);

        // start the new stream
        try {
            localStreamRef.current.srcObject = await openMediaDevices({
                'video': true,
                'audio': true
            });
            console.log('Got MediaStream:', localStreamRef.current.srcObject);
            // Pushing tracks from local stream to peerConnection
            localStreamRef.current.srcObject.getTracks().forEach((track) => {
                pc.current.addTrack(track, localStreamRef.current.srcObject);
            });


        } catch (error) {
            console.error('Error accessing media devices.', error);
        }

        // setLocalStream(localStreamRef.current.srcObject);
    };


    /**
     * Stop video stream
     * @param videoElem
     */
    const stopStreamedVideo = (videoElem) => {
        if (videoElem.srcObject) {
            console.log(videoElem.srcObject)
            const stream = videoElem.srcObject;
            const tracks = stream.getTracks();

            tracks.forEach((track) => {
                track.stop();
            });

            videoElem.srcObject = null;
        }
        //   setLocalStream(null);

    };

    const addRemoteStream = async () => {
        // initializing the remote server to the media stream
        const remoteStream = new MediaStream();

        pc.current.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                console.log("Adding track to remoteStream", track);
                remoteStream.addTrack(track);
            });
            remoteVideo.current.srcObject = remoteStream;
        };
        pc.current.oniceconnectionstatechange = (e) => {
            console.log("ICE connection state change: ", pc.current.iceConnectionState);
            if (pc.current.iceConnectionState === "connected" || pc.current.iceConnectionState === "completed") {
                setJoinedCall(true);
            } else if (pc.current.iceConnectionState === "disconnected" || pc.current.iceConnectionState === "failed" || pc.current.iceConnectionState === "closed") {
                setJoinedCall(false);
            }
        };
        //     setRemoteStream(remoteStream);
    };


    /**
     * Handles the click event of the call button
     * @returns {Promise<void>}
     */
    const startCallWithUser = async () => {
        setJoinedCall(true);
        await sendVideoCallRequestMessageToUser(email, message);

        const callDoc = doc(db, "calls", uid); // Main collection in firestore
        const offerCandidates = collection(callDoc, "offerCandidates"); //Sub collection of callDoc
        const answerCandidiates = collection(callDoc, "answerCandidates"); //Sub collection of callDoc

        sendSignalChannel.current = pc.current.createDataChannel("sendSignalChannel");
        sendSignalChannel.current.onmessage = async (event) => {
            console.log("Got message from sendSignalChannel", event.data);
            sayText(event.data);
            if (event.data === "Access approved!") {
                try {
                    await axios.post('http://localhost:5000/memorize_approval',
                        {frame_data: imageFrameData, floor_number: floorNumber},
                    );

                } catch (error) {
                    console.log(error);
                }
            }
        };
        //Before the caller and callee can connect to each other, they need to exchange ICE candidates that tell WebRTC how to connect to the remote peer.
        //Get candidates for caller and save to db
        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("Got Ice Candidate", event.candidate);
                const json = event.candidate.toJSON();
                addDoc(offerCandidates, json);
            }
        };

        // Create a RTCSessionDescription that will represent the offer from the caller, then set it as the local description,
        const offerDescription = await pc.current.createOffer();
        await pc.current.setLocalDescription(offerDescription);

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
            if (data) {
                if (!pc.current.currentRemoteDescription && data.answer) {
                    const answer = data.answer;
                    // const answerDescription = new RTCSessionDescription(data.answer);
                    await pc.current.setRemoteDescription(answer);
                }
            }
        });

        // Listen for answer candidates and add them to peer connection
        onSnapshot(answerCandidiates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {

                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.current.addIceCandidate(candidate);

                }
            });
        });
    };

    /**
     * Hang up the video call
     */
    const hangupCall = () => {
        //TODO: compelete this function
        setJoinedCall(false);
        pc.current.close()
    };

    return (
        <Box
            className={"webrtc-video-calling-app"}
            sx={{height: "100%", width: "100%"}}
        >
            <Grid
                container
                style={{height: "100%", maxHeight: "100%", margin: 0, padding: 0}}
            >
                <Grid item xs={12} sm={12} md={6} lg={6} sx={{textAlign: "center"}}>
                    <VideoContainer>
                        <VideoItem
                            component={"video"}
                            id="webcamVideo"
                            autoPlay
                            playsInline
                            ref={localStreamRef}
                        ></VideoItem>
                    </VideoContainer>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} sx={{textAlign: "center"}}>
                    <VideoContainer>
                        <VideoItem
                            component={"video"}
                            id="remoteVideo"
                            autoPlay
                            playsInline
                            ref={remoteVideo}
                        ></VideoItem>
                    </VideoContainer>
                </Grid>
            </Grid>

            <EllipseButton
                sx={{position: "absolute", bottom: 15, right: 15, padding: "1rem"}}
                id="hangupButton"
                bgcolor={joinedCall ? "#FF0000" : "#00FF00"}
                hovercolor={joinedCall ? "#930000" : "#009900"}
                onClick={joinedCall ? hangupCall : startCallWithUser}
                variant="contained"
            >
                {joinedCall ? "X" : "JOIN"}
            </EllipseButton>
        </Box>
    );
}

export default VideoCallPage;
