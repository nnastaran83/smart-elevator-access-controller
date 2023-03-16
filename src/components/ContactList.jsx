import React from "react";
import ButtonOutlinedTextAndIcon from "./ButtonOutlinedTextAndIcon";


const ContactList = () => {
    const array = Array.from({length: 20}, (_, index) => index + 1);
    return (
        <div className="ui selection divided list scrolling"
             style={{textAlign: "start", overflowY: "auto", maxHeight: "600px"}}>
            {
                array.map((value, index) => {
                    return (
                        <div className="item" key={index}>
                            <img className="ui avatar image" src="/icons/number-1.png" alt={"1"}/>
                            <div className="content">
                                <div className="header">Apartment number {value}</div>
                            </div>
                        </div>
                    )
                })
            }

        </div>


    );


};

export default ContactList;



