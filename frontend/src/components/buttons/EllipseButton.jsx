import React from 'react';
import Button from "@mui/material/Button";
import {styled} from "@mui/material";

/**
 * @param bgcolor
 * @param hovercolor
 */
const EllipseButton = styled(Button)(({theme, bgcolor, hovercolor}) => ({
    backgroundColor: bgcolor,
    width: "50px",
    height: "50px",
    borderRadius: "40px",
    "&:hover": {
        backgroundColor: hovercolor,
    },
}));


export default EllipseButton;