import React from 'react';
import '../styles/Siri.css';
import {Box} from "@mui/material";

const Siri = () => {
    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            fontSize: "70vmin",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
        }>
            <div className="rainbow-container">
                <div className="green"></div>
                <div className="pink"></div>
                <div className="blue"></div>
            </div>
        </Box>


    );
}

export default Siri;