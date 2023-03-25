import React, {useEffect, useState} from "react";
import FaceDetector from "./components/FaceDetector.jsx";
import './styles/App.scss';
import ContactList from "./components/ContactList.jsx";
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import NavigationMenu from "./components/NavigationMenu.jsx";


const App = () => {

    const [roomName, setRoomName] = useState('');
    const [page, setPage] = useState(0);
    const pages = [<FaceDetector/>, null];


    const [count, setCount] = useState(() => {
        const savedCount = localStorage.getItem("count");
        return savedCount ? parseInt(savedCount, 10) : 0;
    });

    // useEffect(() => {
    //     localStorage.setItem("count", count);
    // }, [count]);


    const handleVideoCallButtonClick = (e) => {
        setPage(1);
        console.log(page);
        e.preventDefault();
    };

    const handleHomeButtonClick = (e) => {
        setPage(0);
        console.log(page);
        e.preventDefault();
    };

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


                {/*
                return (
                <div className="App">
                <h1>Counter</h1>
                <p>Count: {count}</p>
                <button onClick={() => setCount(count + 1)}>Increment</button>
            </div>
            );

            {/*

             <InviteForm roomName={roomName}/>
            <VideoCall roomName={roomName}/>
            */}


            </div>

        </Router>


    );
};

export default App;