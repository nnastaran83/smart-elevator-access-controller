import React, {useEffect, useMemo, useState} from 'react';
import {Route, Routes, Link, useNavigate} from 'react-router-dom';
import '../styles/App.scss';
import FaceDetector from "./FaceDetector/index.jsx";
import ContactList from "./ContactList.jsx";
import VideoCallPopup from "./VideoCallPopup/index.jsx";
import Root from "./themed_components/Root.jsx";
import {Box, Container} from "@mui/material";


/**
 * App component is the main component of the application
 * and is used to render the application into the root.
 * @returns {JSX.Element}
 * @component
 *
 */
const App = () => {
    const [videoCallLink, setVideoCallLink] = useState(null);

    const handleVideoVisibility = (event) => {
        setVideoCallLink(videoCallLink ? null : <VideoCallPopup/>);
    };

    return (

        <Container className="App" onClick={handleVideoVisibility}>
            <Box>
                <Routes>
                    <Route path='/' element={<FaceDetector/>}/>
                    <Route path='/contactlist' element={<ContactList/>}/>
                </Routes>

            </Box>

            {videoCallLink}
        </Container>


    );
};

export default App;