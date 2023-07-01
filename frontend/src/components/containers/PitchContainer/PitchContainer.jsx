import '../../../styles/PitchContainer.css';
import AnimationContainer from "../AnimationContainer.jsx";
import Pitch from "./Pitch.jsx";

/**
 * PitchContainer contains the circular lines that animate around the center of the screen.
 * @returns {JSX.Element}
 * @constructor
 */
const PitchContainer = () => {
    const pitchNumber = 20; // Number of pitches
    const pitches = Array.from({length: pitchNumber}, (_, i) => (
        <Pitch index={i} pitchNumber={pitchNumber} key={i}/>
    ));

    return <AnimationContainer>{pitches}</AnimationContainer>;
};

export default PitchContainer;