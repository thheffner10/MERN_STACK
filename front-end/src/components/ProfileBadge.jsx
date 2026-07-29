import React from "react";

import {
    useSettings
} from "../context/SettingsContext";

function ProfileBadge()
{
    const { settings } =
        useSettings();

    const initials =
        settings.displayName
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) =>
                part[0]?.toUpperCase()
            )
            .join("") || "U";

    return (
        <div className="profile-badge">
            <div className="profile-avatar">
                {initials}
            </div>

            <div className="profile-info">
                <h4>
                    {settings.displayName}
                </h4>

                <p>
                    Habit Flow
                </p>
            </div>
        </div>
    );
}

export default ProfileBadge;