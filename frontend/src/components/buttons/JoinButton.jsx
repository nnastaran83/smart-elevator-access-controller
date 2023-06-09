import React, {useState} from 'react';
import Button from "@mui/material/Button";
import {styled} from "@mui/material";

const JoinButton = styled(Button)(({theme, bgcolor, hovercolor}) => ({
    backgroundColor: bgcolor,
    width: "50px",
    height: "50px",
    borderRadius: "40px",
    "&:hover": {
        backgroundColor: hovercolor,
    },
}));


export default JoinButton;