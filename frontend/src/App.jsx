import React, {useEffect, useMemo, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom';
import './styles/App.scss';
import FaceDetector from "./components/FaceDetector";
import ContactList from "./components/ContactList.jsx";
import VideoCallPopup from "./components/VideoCallPopup.jsx";
import VideoCall from "./components/VideoCall";
import videoCall from "./components/VideoCall";

/**
 * App component is the main component of the application
 * and is used to render the application into the root.
 * @returns {JSX.Element}
 * @constructor
 *
 */
const App = () => {
    const [videoCallLink, setVideoCallLink] = useState(null);

    const handleVideoVisibility = () => {
        setVideoCallLink(videoCallLink ? null : <VideoCallPopup/>);
    };
 
    return (
        <Router>
            <div className="App" onClick={handleVideoVisibility}>
                <div className="ui center aligned container">
                    <div className="ui basic center aligned segment">
                        <div className="ui basic center aligned segment">
                            <Routes>
                                <Route path='/' element={<FaceDetector/>}/>
                                <Route path='/contactlist' element={<ContactList/>}/>
                                <Route path='/videocall' element={<VideoCall/>}/>
                            </Routes>
                        </div>
                    </div>
                </div>
                {videoCallLink}
            </div>
        </Router>
    );
};

export default App;