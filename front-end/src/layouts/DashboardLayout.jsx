import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import "../styles/layout.css";

function DashboardLayout()
{
    return (
        <div className="app-layout">

            <Sidebar />

            <main className="app-content">

                <Outlet />

            </main>

        </div>
    );
}

export default DashboardLayout;