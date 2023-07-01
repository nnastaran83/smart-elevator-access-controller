// eslint-disable-next-line react/prop-types
const Pitch = ({index, pitchNumber}) => {
    return (
        <div
            className="pitch"
            style={{
                '--index': index + 1,
                '--pitch-n': pitchNumber,
                width: `calc((var(--content-size) / var(--pitch-n)) * var(--index))`,
                height: `calc((var(--content-size) / var(--pitch-n)) * var(--index))`,
                animation: 'swing linear infinite calc(var(--speed) + var(--index) * 150ms)',

            }}
        />
    );
};

export default Pitch;