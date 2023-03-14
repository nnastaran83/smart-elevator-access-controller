import React from "react";
import FaceDetector from "../components/FaceDetector.jsx";
import ButtonOutlinedTextAndIcon from "../components/ButtonOutlinedTextAndIcon.jsx";
import '../styles/App.css';


const App = () => {

    return (

        <div className="App">
            <FaceDetector/>
            <div className="segment ui">
                <ButtonOutlinedTextAndIcon color="violet"/>
            </div>


        </div>


    );
};

export default App;