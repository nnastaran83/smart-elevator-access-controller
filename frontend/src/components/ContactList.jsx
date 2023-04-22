import React, {useEffect, useState} from "react";

/**
 * ContactList component is used to display a list of contacts.
 * @returns {JSX.Element}
 * @component
 */
const ContactList = () => {

    const [facetimeAddress, setFacetimeAddress] = useState("");
    const array = Array.from({length: 20}, (_, index) => index + 1);

    useEffect(() => {
        console.log(facetimeAddress)

    })
    const initiateFacetimeCall = (e) => {

        window.location.href = `${e.target.dataset.facetimelink}`;

    };

    return (
        <div className="ui selection divided list scrolling"
             style={{textAlign: "start", overflowY: "auto", minHeight: "550px", maxHeight: "550px"}}>
            {
                array.map((value, index) => {
                    return (
                        <div
                            onClick={initiateFacetimeCall}
                            data-facetimelink="https://facetime.apple.com/join#v=1&p=eirO5sQQEe2uZZoVRAPR/A&k=FBPfijzErLjI-5nhKOnPf5XxCXD4ItPWAPR24IoKze8"
                            className="item"
                            key={index}
                        >
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



