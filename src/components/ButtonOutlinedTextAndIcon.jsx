import React from 'react';


const ButtonOutlinedTextAndIcon = ({color, handleClick}) => {


    return (
        <button className={`ui ${color} basic labeled icon button call`} onClick={handleClick}>
            <i className="phone icon"></i>
            Video Call
        </button>
    );

};

export default ButtonOutlinedTextAndIcon;