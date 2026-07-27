import React from 'react';

function ProgressBar({percent})
{

return (

<div className="progress-container">


<div
className="progress-fill"
style={{
width:`${percent}%`
}}
>

</div>


</div>

);

}


export default ProgressBar;