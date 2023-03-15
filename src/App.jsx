import React, {useState} from "react";
import FaceDetector from "./components/FaceDetector.jsx";
import ButtonOutlinedTextAndIcon from "./components/ButtonOutlinedTextAndIcon.jsx";
import './App.css';
import ContactList from "./components/ContactList.jsx";
import {Button} from "semantic-ui-react";
import {Link, Outlet} from "react-router-dom";


const App = () => {

    const [page, setPage] = useState(0);
    const pages = [<FaceDetector/>, null];


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
        <div className="App ui center aligned container">

            <div className="ui basic center aligned segment">
                {
                    page === 0 &&
                    <div className="ui basic center aligned segment" style={{height: "100%"}}>
                        <div className="segment basic center aligned aligned ui">
                            {pages[page]}
                        </div>


                        <div className="segment ui button-panel">
                            <ButtonOutlinedTextAndIcon
                                color="violet"
                                text="Video Call"
                                handleClick={handleVideoCallButtonClick}/>

                        </div>
                    </div>

                }
                {
                    page === 1 &&
                    <div className="ui basic center aligned segment">
                        <div className="basic segment ui">
                            <ContactList/>
                        </div>

                        <div className="segment ui button-panel">
                            <ButtonOutlinedTextAndIcon
                                color="violet"
                                text="Back"
                                handleClick={handleBackButtonClick}/>
                        </div>
                    </div>

                }
            </div>


        </div>


    );
};

export default App;