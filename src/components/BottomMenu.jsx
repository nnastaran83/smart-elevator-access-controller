import React from "react";

const BottomMenu = ({handleHomeButtonClick, handleVideoCallButtonClick}) => {
    return (
        <div className="ui bottom attached grey two item menu" style={{position: "sticky", bottom: "40px"}}>
            <a className="item" onClick={handleHomeButtonClick}>
                <i className="home icon"></i>

            </a>
            <a className="item" onClick={handleVideoCallButtonClick}>
                <i className="phone icon"></i>
                Video Call
            </a>
        </div>
    );

};

export default BottomMenu;