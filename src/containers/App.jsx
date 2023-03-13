import React from "react";
import FaceDetection from "../components/FaceDetection";
import '../styles/App.css';


const App = () => {

    return (

        <div className="App">
            <FaceDetection/>
            <button className="ui violet basic labeled icon button call">
                <i className="phone icon"></i>
                Video Call
            </button>


        </div>

    );
};

export default App;