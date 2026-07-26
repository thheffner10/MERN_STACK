import React from "react";
function Landing()
{

    return (

        <main>


            <section className="hero">


                <h1>

                    Build Better Habits

                </h1>


                <p>

                    Track your goals.
                    Build streaks.
                    Improve every day.

                </p>


                <button>

                    Get Started

                </button>


            </section>



            <section className="features">


                <h2>

                    Everything You Need

                </h2>


                <div className="feature-grid">


                    <div className="card">

                        <h3>

                            Habit Tracking

                        </h3>

                        <p>

                            Create and maintain
                            daily habits.

                        </p>

                    </div>



                    <div className="card">

                        <h3>

                            Streak System

                        </h3>

                        <p>

                            Stay motivated with
                            progress streaks.

                        </p>

                    </div>



                    <div className="card">

                        <h3>

                            To-Do Lists

                        </h3>

                        <p>

                            Organize daily tasks
                            alongside habits.

                        </p>

                    </div>


                </div>


            </section>


        </main>

    );

}


export default Landing;