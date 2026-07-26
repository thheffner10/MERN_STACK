import React from "react";

import {
    NavLink,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar()
{
    const navigate = useNavigate();

    const { logout } = useAuth();

    const links = [

        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "🏠"
        },

        {
            name: "Habits",
            path: "/habits",
            icon: "✅"
        },

        {
            name: "Tasks",
            path: "/tasks",
            icon: "📝"
        },

        {
            name: "Calendar",
            path: "/calendar",
            icon: "📅"
        },

        {
            name: "Statistics",
            path: "/statistics",
            icon: "📊"
        },

        {
            name: "Settings",
            path: "/settings",
            icon: "⚙"
        }

    ];

    return (

        <aside className="sidebar">

            <div className="sidebar-logo">

                HabitFlow

            </div>

            <nav>

                {
                    links.map((link) => (

                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "active"
                                    : ""
                            }
                        >

                            <span>

                                {link.icon}

                            </span>

                            {link.name}

                        </NavLink>

                    ))
                }

            </nav>

            <button
                className="logout-button"
                onClick={() =>
                {
                    logout();

                    navigate("/login");
                }}
            >

                Logout

            </button>

        </aside>

    );
}

export default Sidebar;