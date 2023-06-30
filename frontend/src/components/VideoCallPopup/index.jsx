import {useState} from 'react';
import '../../styles/PopupFrameOverlay.css';
import VideoCallPage from "./VideoCallPage.jsx";
import {Box} from "@mui/material";
import ContactList from "./ContactList.jsx";

/**
 * VideoCallPopup component is used to display a frame for video call.
 * @param floorNumber
 * @returns {JSX.Element}
 * @constructor
 */
// eslint-disable-next-line react/prop-types
const VideoCallPopup = ({floorNumber}) => {
    const [videoCall, setVideoCall] = useState(null);


    /**
     * Handles the click event of the contact button
     * Starts a video call with the user
     * @param event
     */
    const handleContactButtonClick = (event) => {
        // Access custom attributes
        const uid = event.currentTarget.getAttribute('data-uid');
        const email = event.currentTarget.getAttribute('data-email');

        setVideoCall(<VideoCallPage uid={uid} email={email} floorNumber={floorNumber}/>)


    };

    return (
        <Box className="overlay">
            <Box className="inner-popup" onClick={(event) => (event.stopPropagation())}>
                {videoCall ? videoCall :
                    <ContactList handleContactButtonClick={handleContactButtonClick} floorNumber={floorNumber}/>}

            </Box>
        </Box>

    );
};

export default VideoCallPopup;