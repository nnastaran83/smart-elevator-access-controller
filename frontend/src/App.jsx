import {useEffect} from "react";
import Controller from "./components/Controller/index.jsx";
import {Box, Container} from "@mui/material";
import {
    loadRegisteredUsers,
    setIsVideoCallActive,
    startFaceRecognition,
} from "./store/index.js";
import {useDispatch} from "react-redux";
import "./styles/App.scss";
import VideoCallPopup from "./components/VideoCallPopup/index.jsx";


/**
 * App component is the main component of the application
 * and is used to render the application into the root.
 * @returns {JSX.Element}
 * @component
 *
 */
const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadRegisteredUsers());
    }, []);

    /**
     * Handles the visibility of the video call popup
     * @param event
     */
    const startFaceDetector = (event) => {
        dispatch(setIsVideoCallActive(false));
        dispatch(startFaceRecognition());
        requestPermissionToSendNotification();
    };

    /**
     * Request permission from user to send notifications
     */
    function requestPermissionToSendNotification() {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            }
        });
    }

    return (
        <Container className="App" onClick={startFaceDetector}>
            <Box>
                <Controller/>
            </Box>
          
        </Container>
    );
};

export default App;
