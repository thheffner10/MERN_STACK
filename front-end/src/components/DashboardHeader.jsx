import React from "react";

import ProfileBadge from "./ProfileBadge";

import {
    useSettings
} from "../context/SettingsContext";

function DashboardHeader()
{
    const { settings } =
        useSettings();

    const hour =
        new Date().getHours();

    let greeting =
        "Good Evening";

    if (hour < 12)
    {
        greeting =
            "Good Morning";
    }
    else if (hour < 18)
    {
        greeting =
            "Good Afternoon";
    }

    const firstName =
        settings.displayName
            .trim()
            .split(/\s+/)[0] ||
        "there";

    return (
        <header className="dashboard-top">
            <div>
                <h1>
                    {greeting}, {firstName} 👋
                </h1>

                <p>
                    Stay consistent and keep
                    improving.
                </p>
            </div>

            <ProfileBadge />
        </header>
    );
}

export default DashboardHeader;