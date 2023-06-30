import '../../styles/Rainbow.css';

/**
 * RainbowContainer contains the rainbow animation for siri.
 * @returns {JSX.Element}
 * @constructor
 */
const RainbowContainer = () => {
    return (
        <div className="rainbow-container">
            <div className="green"></div>
            <div className="pink"></div>
            <div className="blue"></div>
        </div>
    );
};

export default RainbowContainer;