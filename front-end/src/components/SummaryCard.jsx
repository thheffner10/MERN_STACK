import React from "react";


function SummaryCard({

    title,

    value,

    icon

})
{

    return (

        <div className="summary-card">


            <div className="summary-icon">

                {icon}

            </div>


            <div>

                <p>

                    {title}

                </p>


                <h2>

                    {value}

                </h2>

            </div>


        </div>

    );

}


export default SummaryCard;