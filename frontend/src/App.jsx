import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom';
import './styles/App.scss';
import FaceDetector from "./components/FaceDetector";
import ContactList from "./components/ContactList.jsx";
import VideoCallPopup from "./components/VideoCallPopup.jsx";


/**
 * @returns {JSX.Element}
 * @constructor
 */
const App = () => {
    const [visibleVideoCall, setVisibleVideoCall] = useState(false);
    const [videoCallLink, setVideoCallLink] = useState(null);
    const handleVideoVisibility = (e) => {
        e.preventDefault();
        new Promise((resolve, reject) => {
            resolve(setVisibleVideoCall(!visibleVideoCall));
        }).then(() => {
            if (visibleVideoCall) {
                setVideoCallLink(<VideoCallPopup visibility={visibleVideoCall}/>);
            } else {
                setVideoCallLink(null);
            }
        });
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