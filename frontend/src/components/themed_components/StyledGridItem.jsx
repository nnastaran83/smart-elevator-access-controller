import React from "react";
import {styled} from "@mui/material";

const StyledGridItem = styled('Grid')(({theme}) => ({
    [theme.breakpoints.down('md')]: {
        maxHeight: "50%",
        width: "100%"
    },
    [theme.breakpoints.up('md')]: {
        maxWidth: "50%",
        height: "100%"
    },

}));

export default StyledGridItem;