import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material';
import '../styles/PitchContainer.css';
import Siri from "./Siri.jsx";


const CustomBox = styled(Box)(({theme}) => ({
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '100%',
    animation: 'swing linear infinite calc(var(--speed) + var(--index) * 150ms)',
    border: '1px solid var(--pitch-line-color)',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'var(--pitch-dot-color)',
        border: '1px solid var(--pitch-dot-outline-color)',
        borderRadius: '100%',
    },
}));

const Whole = styled(Box)(({theme}) => ({
    width: 'clamp(200px, 80vmin, 800px)',
    height: 'clamp(200px, 80vmin, 800px)',
    position: 'absolute',
    borderRadius: '100%',
    background: 'var(--whole-bg-color)',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '100%',
    },
}));

const Pitch = ({index, pitchNumber}) => {
    return (
        <CustomBox
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

    return <Whole>{pitches} {/*<Siri/>*/}</Whole>;
};

export default PitchContainer;