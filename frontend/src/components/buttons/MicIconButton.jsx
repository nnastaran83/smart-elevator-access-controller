import {IconButton} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

/**
 * MicIconButton is used to display the mic icon button.
 * @param listening
 * @returns {JSX.Element}
 * @constructor
 */
// eslint-disable-next-line react/prop-types
const MicIconButton = ({listening}) => {
    return (
        <IconButton sx={{
            background: listening ? "rgba(106,245,82,0.18)" : "rgba(255,17,17,0.18)",
            color: listening ? "#1aa600" : "#ff0c0c", width: "50px", height: "50px"
        }}>
            {listening ? <MicIcon/> : <MicOffIcon/>}
        </IconButton>
    );
};

export default MicIconButton;