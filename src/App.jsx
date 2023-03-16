import React, {useState} from "react";
import FaceDetector from "./components/FaceDetector.jsx";
import ButtonOutlinedTextAndIcon from "./components/ButtonOutlinedTextAndIcon.jsx";
import './App.css';
import ContactList from "./components/ContactList.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Outlet, Link} from "react-router-dom";
import {Button} from "semantic-ui-react";

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
            <div className="ui bottom attached grey two item menu" style={{position: "sticky", bottom: "40px"}}>
                <a className="item" onClick={handleBackButtonClick}>
                    <i className="home icon"></i>

                </a>
                <a className="item" onClick={handleVideoCallButtonClick}>
                    <i className="phone icon"></i>
                    Video Call
                </a>
            </div>

        </div>


    );
};

export default App;