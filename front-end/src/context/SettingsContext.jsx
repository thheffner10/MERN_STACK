import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import { useAuth } from "./AuthContext";

const SettingsContext =
    createContext(null);

function createDefaultSettings(user)
{
    const firstName =
        user?.firstName?.trim() || "";

    const lastName =
        user?.lastName?.trim() || "";

    const displayName = [
        firstName,
        lastName
    ]
        .filter(Boolean)
        .join(" ");

    return {
        displayName:
            displayName || "New User",

        email:
            user?.email || "",

        dailyReminder: false,
        reminderTime: "18:00",
        weeklySummary: false,
        streakWarnings: false
    };
}

function getSettingsStorageKey(user)
{
    if (!user?.id)
    {
        return null;
    }

    return (
        `habit-tracker-settings:${user.id}`
    );
}

function readStoredSettings(
    user,
    storageKey
)
{
    const defaults =
        createDefaultSettings(user);

    if (!storageKey)
    {
        return defaults;
    }

    try
    {
        const storedValue =
            localStorage.getItem(
                storageKey
            );

        if (!storedValue)
        {
            return defaults;
        }

        const storedSettings =
            JSON.parse(storedValue);

        return {
            ...defaults,
            ...storedSettings,

            /*
             * Authentication is the source
             * of truth for account email.
             */
            email:
                user?.email ||
                defaults.email
        };
    }
    catch
    {
        localStorage.removeItem(
            storageKey
        );

        return defaults;
    }
}

export function SettingsProvider({
    children
})
{
    const { user } = useAuth();

    const storageKey = useMemo(
        () =>
            getSettingsStorageKey(user),
        [user]
    );

    const [settings, setSettings] =
        useState(() =>
            createDefaultSettings(user)
        );

    useEffect(() =>
    {
        setSettings(
            readStoredSettings(
                user,
                storageKey
            )
        );
    }, [user, storageKey]);

    useEffect(() =>
    {
        if (!storageKey)
        {
            return;
        }

        localStorage.setItem(
            storageKey,
            JSON.stringify(settings)
        );
    }, [settings, storageKey]);

    function updateSettings(changes)
    {
        setSettings((previous) => ({
            ...previous,
            ...changes,

            /*
             * Prevent settings from silently
             * changing the account email.
             */
            email:
                user?.email ||
                previous.email
        }));
    }

    function resetSettings()
    {
        const defaults =
            createDefaultSettings(user);

        setSettings(defaults);

        if (storageKey)
        {
            localStorage.removeItem(
                storageKey
            );
        }
    }

    function clearSettings()
    {
        resetSettings();
    }

    return (
        <SettingsContext.Provider
            value={{
                settings,
                updateSettings,
                resetSettings,
                clearSettings
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings()
{
    const context =
        useContext(SettingsContext);

    if (!context)
    {
        throw new Error(
            "useSettings must be used inside SettingsProvider."
        );
    }

    return context;
}