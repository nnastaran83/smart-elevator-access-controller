import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './styles/App.scss';
import FaceDetector from "./components/FaceDetector.jsx";
import ContactList from "./components/ContactList.jsx";
import NavigationMenu from "./components/NavigationMenu.jsx";


/**
 * @returns {JSX.Element}
 * @constructor
 */
const App = () => {
    return (
        <Router>
            <div className="App">
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
            </div>
        </Router>
    );
};

export default App;