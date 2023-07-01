import {styled} from "@mui/material";

/**
 * AnimationContainer is used to create a circular container for the animation.
 */
const AnimationContainer = styled("div")(() => ({
        '--content-size': "calc(100% - var(--padding))",
        width: `clamp(200px, 80vmin, 800px)`,
        height: `clamp(200px, 80vmin, 800px)`,
        background: `var(--greyLight-1)`,
        padding: `var(--padding)`,
        position: 'absolute',
        borderRadius: '100%',

    }


));


export default AnimationContainer;