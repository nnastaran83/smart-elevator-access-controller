import React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import {Divider} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import {useSelector} from "react-redux";

/**
 * ContactList component is used to display the list of contacts.
 * @returns {JSX.Element}
 * @constructor
 */
// eslint-disable-next-line react/prop-types
const ContactList = ({handleContactButtonClick, floorNumber}) => {
    const registeredUsers = useSelector((state) =>
        floorNumber
            ? state.contactList.registeredUsers.filter(
                (user) => user.floor_number === floorNumber
            )
            : state.contactList.registeredUsers
    );
    console.log(registeredUsers);

    // Group users by floor number
    let floorMapping = registeredUsers.reduce((acc, user) => {
        let key = `Floor ${user["floor_number"]}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(user);
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
                "& ul": {padding: 0},
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

                        {floorMapping[floor].map((user, index) => (
                            <React.Fragment key={`item-${floor}-${user.name}-${index}`}>
                                <ListItemButton
                                    data-uid={user.uid}
                                    data-token={user.messaging_token}
                                    data-email={user.email}
                                    onClick={handleContactButtonClick}
                                >
                                    <Avatar
                                        sx={{
                                            marginRight: "10px",
                                            bgcolor: () =>
                                                "#" + Math.random().toString(16).substr(-6),
                                        }}
                                    >{`${user.name.charAt(0)}`}</Avatar>
                                    <ListItemText primary={`${user.name}`}/>
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
