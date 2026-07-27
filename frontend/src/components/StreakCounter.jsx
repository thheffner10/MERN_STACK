import React from 'react';

function StreakCounter({days})
{

return (

<div className="streak-box">

<h2>
🔥 Current Streak
</h2>

<h1>
{days}
</h1>

<p>
Days Consistent
</p>

</div>

);

}


export default StreakCounter;