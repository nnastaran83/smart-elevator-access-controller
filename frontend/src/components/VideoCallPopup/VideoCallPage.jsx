import React from "react";
import { Box, Grid, IconButton, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase_module";
import VideoContainer from "./VideoContainer.jsx";
import VideoItem from "./VideoItem.jsx";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { sendVideoCallRequestMessageToUser } from "../../firebase_module";
import EllipseButton from "../buttons/EllipseButton.jsx";
import useSpeech from "../../hooks/useSpeech.js";

const message = {
  title: "Smart",
  message: "New Incoming Video Call",
};

let localStream = null;
let remoteStream = null;

// ice servers configuration
const iceConfig = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"], // free stun server
    },
  ],
  iceCandidatePoolSize: 10,
};

/**
 * Video Calling Page using WebRTC
 * @returns {JSX.Element}
 * @constructor
 */
function VideoCallPage({ uid, token, email }) {
  const localWebcamVideo = useRef(null);
  const remoteVideo = useRef(null);
  // Creating peer connection
  const pc = useRef(new RTCPeerConnection(iceConfig));
  const sendSignalChannel = useRef(null);
  const [joinedCall, setJoinedCall] = useState(false);

  const { sayText } = useSpeech();

  useEffect(() => {
    startWebCam();
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
      pc.current.addTrack(track, localStream);
    });

    // displaying the video data from the stream to the webpage
    localWebcamVideo.current.srcObject = localStream;

    // initializing the remote server to the media stream
    remoteStream = new MediaStream();
    remoteVideo.current.srcObject = remoteStream;

    pc.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        console.log("Adding track to remoteStream", track);
        remoteStream.addTrack(track);
      });
      remoteVideo.current.srcObject = remoteStream;
    };
    pc.current.oniceconnectionstatechange = (e) => {
      console.log(
        "ICE connection state change: ",
        pc.current.iceConnectionState
      );
      if (
        pc.current.iceConnectionState === "connected" ||
        pc.current.iceConnectionState === "completed"
      ) {
        setJoinedCall(true);
      } else if (
        pc.current.iceConnectionState === "disconnected" ||
        pc.current.iceConnectionState === "failed" ||
        pc.current.iceConnectionState === "closed"
      ) {
        // Connection has been closed/failed
        // You can reset your state variable here
        setJoinedCall(false);
      }
    };
  };

  /**
   * Handles the click event of the call button
   * @returns {Promise<void>}
   */
  const startCallWithUser = async () => {
    //TODO: Delete the call document after call ends
    setJoinedCall(true);
    await deleteDoc(doc(db, "calls", uid));
    await sendVideoCallRequestMessageToUser(email, message);

    //TODO: change the uid to the uid of the user to call
    const callDoc = doc(db, "calls", uid); // Main collection in firestore
    const offerCandidates = collection(callDoc, "offerCandidates"); //Sub collection of callDoc
    const answerCandidiates = collection(callDoc, "answerCandidates"); //Sub collection of callDoc

    sendSignalChannel.current =
      pc.current.createDataChannel("sendSignalChannel");
    sendSignalChannel.current.onmessage = (event) => {
      console.log("Got message from sendSignalChannel", event.data);
      sayText(event.data);
    };
    //Before the caller and callee can connect to each other, they need to exchange ICE candidates that tell WebRTC how to connect to the remote peer.
    //Get candidates for caller and save to db
    pc.current.onicecandidate = (event) => {
      console.log("Got Ice Candidate", event.candidate);
      event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
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
    await setDoc(callDoc, { offer });

    ///Listen for changes to the database and detect when an answer from the callee has been added.
    onSnapshot(callDoc, async (snapshot) => {
      const data = snapshot.data();
      if (data) {
        if (!pc.current.currentRemoteDescription && data.answer) {
          //TODO: change the answerDescription name to answer
          const answerDescription = new RTCSessionDescription(data.answer);
          await pc.current.setRemoteDescription(answerDescription);
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
  };

  return (
    <Box
      className={"webrtc-video-calling-app"}
      sx={{ height: "100%", width: "100%" }}
    >
      <Grid
        container
        style={{ height: "100%", maxHeight: "100%", margin: 0, padding: 0 }}
      >
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ textAlign: "center" }}>
          <VideoContainer>
            <VideoItem
              component={"video"}
              id="webcamVideo"
              autoPlay
              playsInline
              ref={localWebcamVideo}
            ></VideoItem>
          </VideoContainer>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ textAlign: "center" }}>
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

      {/*TODO: Add camera on or of button*/}
      <EllipseButton
        sx={{ position: "absolute", bottom: 15, right: 15, padding: "1rem" }}
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
