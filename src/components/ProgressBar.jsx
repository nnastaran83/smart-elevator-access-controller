import React from "react";
import {CircularProgressbarWithChildren, buildStyles} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import RadialSeparators from './RadialSeperators';
import ChangingProgressProvider from './ChangingProgressProvider';


const ProgressBar = ({load}) => {
    return (
        <div className="circular-progressbar-container">
            {
                load && <ChangingProgressProvider values={[0, 100]}>
                    {percentage => (
                        <CircularProgressbarWithChildren
                            value={percentage}
                            strokeWidth={1}
                            styles={buildStyles({

                                textColor: "white",
                                pathColor: "#FF1493",
                                trailColor: "white",
                                pathTransition:
                                    percentage === 0 ? "none" : "stroke-dashoffset 0.5s ease 0s"

                            })}
                        >
                            <RadialSeparators
                                count={110}
                                style={{
                                    background: "#fff",
                                    width: "10px",
                                    // This needs to be equal to props.strokeWidth
                                    height: `${1}%`

                                }}
                            />
                        </CircularProgressbarWithChildren>

                    )}
                </ChangingProgressProvider>
            }


        </div>);
};

export default ProgressBar;