import React, {useContext, useEffect} from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import {Divider} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import RegisteredUsersContext from "../../context/RegisteredUsersProvider.jsx";


/**
 * ContactList component is used to display the list of contacts.
 * @returns {JSX.Element}
 * @constructor
 */
const ContactList = () => {
    const {registeredUsers} = useContext(RegisteredUsersContext);

    let floorMapping = registeredUsers.reduce((acc, user) => {
        let key = `Floor ${user['floor_number']}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(user.name);
        return acc;
    }, {});

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
            <ListSubheader key="200" sx={{bgcolor: "#f5f5f5", fontSize: "25px"}}>
                Contacts
            </ListSubheader>
            <Divider/>
            {Object.keys(floorMapping).map((floor) => (
                <li key={`section-${floor}`}>
                    <ul>
                        <ListSubheader sx={{bgcolor: "#f5f5f5", fontSize: "15px"}}>
                            {`${floor}`}
                        </ListSubheader>

                        {floorMapping[floor].map((name, index) => (
                            <React.Fragment key={`item-${floor}-${name}-${index}`}>
                                <ListItemButton>
                                    <Avatar
                                        sx={{
                                            marginRight: "10px",
                                            bgcolor: () => "#" + Math.random().toString(16).substr(-6)
                                        }}
                                    >{`${name.charAt(0)}`}</Avatar>
                                    <ListItemText primary={`${name}`}/>
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



