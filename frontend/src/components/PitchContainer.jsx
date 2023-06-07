import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material';
import '../styles/PitchContainer.css';
import Siri from "./Siri.jsx";


const AnimationBox = styled(Box)(({theme}) => ({
    animation: 'swing linear infinite calc(var(--speed) + var(--index) * 150ms)',
}));

const Pitch = ({index, pitchNumber}) => {
    return (
        <AnimationBox
            className="pitch"
            style={{
                '--index': index + 1,
                '--pitch-n': pitchNumber,
                '--content-size': `calc(100% - var(--padding))`,
                '--pitch-line-color-2': 'white',
                width: `calc((var(--content-size) / var(--pitch-n)) * var(--index))`,
                height: `calc((var(--content-size) / var(--pitch-n)) * var(--index))`,
            }}
        />
    );
};


const PitchContainer = () => {
    const pitchNumber = 20; // Number of pitches
    const pitches = Array.from({length: pitchNumber}, (_, i) => (
        <Pitch index={i} pitchNumber={pitchNumber} key={i}/>
    ));

    return <Box className={"whole-container"}>{pitches} {/*<Siri/>*/}</Box>;
};

export default PitchContainer;