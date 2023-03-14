import React from "react";


const ContactList = () => {
    const array = Array.from({length: 10}, (_, index) => index + 1);
    return (
        <div className="ui container">
            <div className="ui selection divided list" style={{textAlign: "start"}}>
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
        </div>

    );


};

export default ContactList;



