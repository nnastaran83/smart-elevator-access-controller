import React, { useState } from "react";
import FaceDetector from "../components/FaceDetector.jsx";
import ButtonOutlinedTextAndIcon from "../components/ButtonOutlinedTextAndIcon.jsx";
import '../styles/App.css';
import ContactList from "../components/ContactList.jsx";
import { Button } from "semantic-ui-react";
import { Link, Outlet } from "react-router-dom";


const App = () => {
  
    const [page, setPage] = useState(0);
    const pages = [<FaceDetector />, null];


    const handleVideoCallButtonClick = (e) => {
        setPage(1);
        console.log(page);
        e.preventDefault();
    };

    const handleBackButtonClick = (e) => {
        setPage(0);
        console.log(page);
        e.preventDefault();
    };


    return (
        <div className="App ui basic segment">

            <div className="ui basic segment">
                {
                    page === 0 &&
                    <div>
                        <div className="segment basic ui ">
                            { pages[page] }
                        </div>


                        <div className="segment ui button-panel">
                            <ButtonOutlinedTextAndIcon
                                color="violet"
                                text="Video Call"
                                handleClick={ handleVideoCallButtonClick } />

                        </div>
                    </div>

                }
                {
                    page === 1 &&
                    <div>
                        <ContactList />
                        <div className="segment ui button-panel">
                            <ButtonOutlinedTextAndIcon
                                color="violet"
                                text="Back"
                                handleClick={ handleBackButtonClick } />
                        </div>
                    </div>

                }
            </div>


        </div>


    );
};

export default App;