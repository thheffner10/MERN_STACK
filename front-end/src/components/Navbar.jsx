import React from "react";
import {
    Link
}
from "react-router-dom";


function Navbar()
{

    return (

        <nav className="navbar">


            <div className="logo">

                HabitTracker

            </div>


            <div className="nav-links">


                <Link to="/">

                    Home

                </Link>


                <Link to="/login">

                    Login

                </Link>


                <Link to="/register">

                    Sign Up

                </Link>

                <Link to="/dashboard">
                    
                    Dashboard
                
                </Link>


            </div>


        </nav>

    );

}


export default Navbar;