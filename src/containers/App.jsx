import React, {useState} from "react";
import FaceDetector from "../components/FaceDetector.jsx";
import ButtonOutlinedTextAndIcon from "../components/ButtonOutlinedTextAndIcon.jsx";
import '../styles/App.css';
import ContactList from "../components/ContactList.jsx";

const App = () => {
    const [page, setPage] = useState(0);
    const pages = [<FaceDetector/>, null];


    const handleVideoCallButtonClick = (e) => {
        if (page === 0) {
            setPage(1);
        } else {
            setPage(0);
        }

        console.log(page);
        e.preventDefault();
    };


    return (
        <div className="App">
            
            <div className="ui basic segment">
                {
                    page === 0 &&
                    <div>
                        <div className="ui basic segment button-panel">
                            {pages[page]}
                        </div>
                        <div className="segment ui button-panel">
                            <ButtonOutlinedTextAndIcon color="violet"
                                                       handleClick={handleVideoCallButtonClick}/>
                        </div>
                    </div>

                }
                {
                    page === 1 && <ContactList/>
                }
            </div>


        </div>


    );
};

export default App;