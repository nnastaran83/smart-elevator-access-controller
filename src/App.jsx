import React, {useEffect, useState} from "react";
import FaceDetector from "./components/FaceDetector.jsx";
import './App.css';
import ContactList from "./components/ContactList.jsx";
import BottomMenu from "./components/BottomMenu.jsx";
import VideoCall from "./components/VideoCall.jsx";
import InviteForm from "./components/InviteForm.jsx";

const App = () => {
    const [roomName, setRoomName] = useState('');
    const [page, setPage] = useState(0);
    const pages = [<FaceDetector/>, null];

    const [count, setCount] = useState(() => {
        const savedCount = localStorage.getItem("count");
        return savedCount ? parseInt(savedCount, 10) : 0;
    });

    useEffect(() => {
        localStorage.setItem("count", count);
    }, [count]);


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

        <div className="App">

            <div className="ui center aligned container">

                <div className="ui basic center aligned segment">

                    <div className="ui basic center aligned segment">
                        {
                            page === 0 &&
                            <div className="segment basic center aligned ui">
                                {pages[page]}
                            </div>
                        }
                        {
                            page === 1 &&
                            <ContactList/>
                        }
                    </div>

                </div>

            </div>
            <BottomMenu handleHomeButtonClick={handleHomeButtonClick}
                        handleVideoCallButtonClick={handleVideoCallButtonClick}/>


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


    );
};

export default App;