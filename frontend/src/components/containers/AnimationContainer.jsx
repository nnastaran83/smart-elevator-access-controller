import React from 'react';
import {Box, styled} from "@mui/material";

const AnimationContainer = styled(Box)(({theme}) => ({
        '--content-size': "calc(100% - var(--padding))",
        width: `clamp(200px, 80vmin, 800px)`,
        height: `clamp(200px, 80vmin, 800px)`,
        padding: `var(--padding)`,
        position: 'absolute',
        borderRadius: '100%',
        "&:after": {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `var(--content-size)`,
            height: `var(--content-size)`,
            transform: `translate(-50%, -50%)`,
            borderRadius: '100%'
        }
    }

));

export default AnimationContainer;