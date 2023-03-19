import React, { useEffect, useState } from "react";

const ChangingProgressProvider = (props) => {
    const interval = 1000;
    const [valuesIndex, setValueIndex] = useState(0);
    const handler = () => {
        setValueIndex(
            (valuesIndex + 1) % props.values.length
        );
    };


    useEffect(() => {
        setTimeout(handler, interval);
    }, []);


    return props.children(props.values[valuesIndex]);
};


export default ChangingProgressProvider;