import React from 'react';


const ButtonOutlinedTextAndIcon = ({color, text, handleClick}) => {


    return (
        <button className={`ui ${color} basic labeled icon button call`} onClick={handleClick}>
            <i className="phone icon"></i>
            {text}
        </button>
    );

};

export default ButtonOutlinedTextAndIcon;