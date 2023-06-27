import {useState} from 'react';

/**
 *useSpeech hook is used to speak the given text.
 * @returns {{sayText: (function(*=): void)}}
 */
const useSpeech = () => {
    const [utterance] = useState(new SpeechSynthesisUtterance());

    const sayText = (text) => {
        utterance.voice = speechSynthesis.getVoices()[5];
        utterance.lang = "en-US";
        utterance.text = text;
        speechSynthesis.speak(utterance);

    };

    return {sayText: sayText};

}

export default useSpeech;