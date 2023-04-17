import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './styles/App.scss';
import FaceDetector from "./components/FaceDetector.jsx";
import ContactList from "./components/ContactList.jsx";
import NavigationMenu from "./components/NavigationMenu.jsx";
import VideoCallPopup from "./components/VideoCallPopup.jsx";


/**
 * @returns {JSX.Element}
 * @constructor
 */
const App = () => {
    const [visibleVideoCall, setVisibleVideoCall] = useState(false);
    const handleVideoVisibility = () => {
        setVisibleVideoCall(!visibleVideoCall);
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
                        <NavigationMenu/>

                    </div>
                </div>
                {
                    visibleVideoCall ? <VideoCallPopup visibility={visibleVideoCall}/> : null
                }

            </div>
        </Router>
    );
};

export default App;