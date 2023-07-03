import {useCallback, useState} from 'react';

/**
 * @description Hook to use speech synthesis
 * @returns {[(function(*): Promise<unknown>)]}
 */
const useSpeech = () => {
    const [utterance] = useState(new SpeechSynthesisUtterance());

    const sayText = useCallback((text) => {

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

    }, [utterance]);

    return [sayText];

}

export default useSpeech;