import React from 'react';


const ButtonOutlinedTextAndIcon = ({color}) => {
    return (
        <button className={`ui ${color} basic labeled icon button call`}>
            <i className="phone icon"></i>
            Video Call
        </button>
    );
};

export default ButtonOutlinedTextAndIcon;