import React, {useEffect, useState} from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import {Divider} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";

///**
// * ContactList component is used to display a list of contacts.
// * @returns {JSX.Element}
// * @component
// */
//const ContactList = () => {
//    const [facetimeAddress, setFacetimeAddress] = useState("");
//    const array = Array.from({length: 20}, (_, index) => index + 1);
//
//    useEffect(() => {
//        console.log(facetimeAddress)
//
//    })
//    const initiateFacetimeCall = (e) => {
//
//        window.location.href = `${e.target.dataset.facetimelink}`;
//
//    };
//
//    return (
//        <div className="ui selection divided list scrolling"
//             style={{textAlign: "start", overflowY: "auto", minHeight: "550px", maxHeight: "550px"}}>
//            {
//                array.map((value, index) => {
//                    return (
//                        <div
//                            onClick={initiateFacetimeCall}
//                            data-facetimelink="https://facetime.apple.com/join#v=1&p=eirO5sQQEe2uZZoVRAPR/A&k=FBPfijzErLjI-5nhKOnPf5XxCXD4ItPWAPR24IoKze8"
//                            className="item"
//                            key={index}
//                        >
//                            <img className="ui avatar image" src="/icons/number-1.png" alt={"1"}/>
//                            <div className="content">
//                                <div className="header">Apartment number {value}</div>
//                            </div>
//                        </div>
//                    )
//                })
//            }
//        </div>
//    );
//};
//


const ContactList = () => {
    return (
        <List
            sx={{
                width: "100%",
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: "100%",
                "& ul": {padding: 0}
            }}
            subheader={<li/>}
        >
            <ListSubheader sx={{bgcolor: "#f5f5f5", fontSize: "25px"}}>
                Contacts
            </ListSubheader>
            <Divider/>
            {[1, 2, 3, 4].map((sectionId) => (
                <li key={`section-${sectionId}`}>
                    <ul>
                        <ListSubheader sx={{bgcolor: "#f5f5f5", fontSize: "15px"}}>
                            {`Floor ${sectionId}`}
                        </ListSubheader>

                        {["Nas", "Shir", "Shila"].map((item) => (
                            <React.Fragment>
                                <ListItemButton key={`item-${sectionId}-${item}`}>
                                    <Avatar
                                        sx={{
                                            marginRight: "10px",
                                            bgcolor: () => "#" + Math.random().toString(16).substr(-6)
                                        }}
                                    >{`${sectionId}`}</Avatar>
                                    <ListItemText primary={`${item}`}/>
                                </ListItemButton>
                                <Divider/>
                            </React.Fragment>
                        ))}
                    </ul>
                </li>
            ))}
        </List>
    );
};
export default ContactList;



