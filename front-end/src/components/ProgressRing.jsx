import React from "react";


function ProgressRing({percent})
{

    const radius = 50;

    const circumference =
        2 * Math.PI * radius;


    const offset =
        circumference -
        (percent / 100) *
        circumference;


    return (

        <div className="progress-ring">


            <svg width="120" height="120">


                <circle

                    className="ring-background"

                    cx="60"

                    cy="60"

                    r={radius}

                />


                <circle

                    className="ring-progress"

                    cx="60"

                    cy="60"

                    r={radius}

                    strokeDasharray={circumference}

                    strokeDashoffset={offset}

                />


            </svg>


            <div className="ring-text">

                {percent}%

            </div>


        </div>

    );

}


export default ProgressRing;