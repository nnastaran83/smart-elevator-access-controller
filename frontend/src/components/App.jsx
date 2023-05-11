import React, {useEffect, useMemo, useState} from 'react';
import {Route, Routes, Link, useNavigate} from 'react-router-dom';
import '../styles/App.scss';
import FaceDetector from "./FaceDetector/index.jsx";
import ContactList from "./ContactList.jsx";
import VideoCallPopup from "./VideoCallPopup/index.jsx";
import {Container} from "@mui/material";


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
            <div className="ui center aligned container">
                <div className="ui basic center aligned segment">
                    <div className="ui basic center aligned segment">
                        <Routes>
                            <Route path='/' element={<FaceDetector/>}/>
                            <Route path='/contactlist' element={<ContactList/>}/>
                          

                        </Routes>
                    </div>
                </div>
            </div>
            {videoCallLink}
        </Container>

    );
};

export default App;