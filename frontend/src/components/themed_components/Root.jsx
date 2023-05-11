import {styled} from "@mui/material";

/**
 * Styled root component.
 * Changes the padding respectively to the screen size.
 */
const Root = styled('div')(({theme}) => ({
    [theme.breakpoints.down('md')]: {
        padding: "0.1rem",
    },
    [theme.breakpoints.up('md')]: {
        padding: "2rem",
    },
    [theme.breakpoints.up('lg')]: {
        padding: "2rem",
    },
}));

export default Root;