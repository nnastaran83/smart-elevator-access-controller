import {useState} from 'react';

/**
 * This hook is used to handle the speech synthesis.
 * @returns {{sayText: (function(*): Promise<unknown>)}}
 */
const useSpeech = () => {
    const [utterance] = useState(new SpeechSynthesisUtterance());

    const sayText = (text) => {

        utterance.voice = speechSynthesis.getVoices()[5];
        utterance.lang = "en-US";
        utterance.text = text;
        speechSynthesis.speak(utterance);
        return new Promise((resolve, reject) => {
            utterance.onend = () => {
                resolve();
            };
            utterance.onerror = (event) => {
                reject(event);
            };
        });

    };

    return {sayText: sayText};

}

export default useSpeech;