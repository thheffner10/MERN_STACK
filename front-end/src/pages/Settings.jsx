import React, {
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import {
    useSettings
} from "../context/SettingsContext";

import {
    useHabits
} from "../context/HabitContext";

import {
    useTodos
} from "../context/TodoContext";

import "../styles/settings.css";

function Settings()
{
    const {
        settings,
        updateSettings,
        resetSettings,
        clearSettings
    } = useSettings();

    const { clearHabits } =
        useHabits();

    const { clearTodos } =
        useTodos();

    const [formData, setFormData] =
        useState(settings);

    const [message, setMessage] =
        useState("");

    useEffect(() =>
    {
        setFormData(settings);
    }, [settings]);

    function handleChange(event)
    {
        const {
            name,
            type,
            checked,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    }

    function handleSubmit(event)
    {
        event.preventDefault();

        updateSettings({
            displayName:
                formData.displayName.trim(),

            dailyReminder:
                formData.dailyReminder,

            reminderTime:
                formData.reminderTime,

            weeklySummary:
                formData.weeklySummary,

            streakWarnings:
                formData.streakWarnings
        });

        setMessage(
            "Your settings have been saved."
        );

        window.setTimeout(() =>
        {
            setMessage("");
        }, 2500);
    }

    function handleReset()
    {
        const confirmed =
            window.confirm(
                "Reset your preferences to their default values?"
            );

        if (!confirmed)
        {
            return;
        }

        resetSettings();

        setMessage(
            "Settings were reset to their defaults."
        );
    }

    function clearLocalApplicationData()
    {
        const confirmed =
            window.confirm(
                "Clear your locally stored habits, tasks, and preferences? This action cannot be undone."
            );

        if (!confirmed)
        {
            return;
        }

        clearHabits();
        clearTodos();
        clearSettings();

        setMessage(
            "Your local application data has been cleared."
        );
    }

    const initials =
        formData.displayName
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) =>
                part[0]?.toUpperCase()
            )
            .join("") || "U";

    return (
        <main className="settings-page">
            <header className="page-header">
                <p className="page-eyebrow">
                    Preferences
                </p>

                <h1>Settings</h1>

                <p>
                    Manage your profile,
                    reminders, and account
                    preferences.
                </p>
            </header>

            <form
                className="settings-layout"
                onSubmit={handleSubmit}
            >
                <div className="settings-main-column">
                    <section className="settings-panel">
                        <div className="settings-section-heading">
                            <div>
                                <h2>Profile</h2>

                                <p>
                                    Choose how your name
                                    appears in the
                                    application.
                                </p>
                            </div>

                            <div
                                className="settings-avatar"
                                aria-hidden="true"
                            >
                                {initials}
                            </div>
                        </div>

                        <div className="settings-form-grid">
                            <div className="form-field">
                                <label htmlFor="settings-name">
                                    Display name
                                </label>

                                <input
                                    id="settings-name"
                                    name="displayName"
                                    value={
                                        formData.displayName
                                    }
                                    onChange={handleChange}
                                    autoComplete="name"
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="settings-email">
                                    Account email
                                </label>

                                <input
                                    id="settings-email"
                                    type="email"
                                    value={
                                        formData.email
                                    }
                                    readOnly
                                    aria-readonly="true"
                                />

                                <small>
                                    Changing your login
                                    email requires the
                                    account API.
                                </small>
                            </div>
                        </div>
                    </section>

                    <section className="settings-panel">
                        <div className="settings-section-heading">
                            <div>
                                <h2>
                                    Notifications
                                </h2>

                                <p>
                                    Configure reminders
                                    and progress
                                    notifications.
                                </p>
                            </div>
                        </div>

                        <div className="settings-option-list">
                            <label className="settings-toggle-row">
                                <div>
                                    <strong>
                                        Daily reminder
                                    </strong>

                                    <span>
                                        Receive a reminder
                                        to complete today’s
                                        habits.
                                    </span>
                                </div>

                                <input
                                    name="dailyReminder"
                                    type="checkbox"
                                    checked={
                                        formData.dailyReminder
                                    }
                                    onChange={handleChange}
                                />
                            </label>

                            {formData.dailyReminder && (
                                <div className="settings-time-row">
                                    <label htmlFor="reminder-time">
                                        Reminder time
                                    </label>

                                    <input
                                        id="reminder-time"
                                        name="reminderTime"
                                        type="time"
                                        value={
                                            formData.reminderTime
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                </div>
                            )}

                            <label className="settings-toggle-row">
                                <div>
                                    <strong>
                                        Weekly summary
                                    </strong>

                                    <span>
                                        Receive a summary
                                        of your weekly
                                        completion.
                                    </span>
                                </div>

                                <input
                                    name="weeklySummary"
                                    type="checkbox"
                                    checked={
                                        formData.weeklySummary
                                    }
                                    onChange={handleChange}
                                />
                            </label>

                            <label className="settings-toggle-row">
                                <div>
                                    <strong>
                                        Streak warnings
                                    </strong>

                                    <span>
                                        Warn when an active
                                        streak may be lost.
                                    </span>
                                </div>

                                <input
                                    name="streakWarnings"
                                    type="checkbox"
                                    checked={
                                        formData.streakWarnings
                                    }
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </section>

                    {message && (
                        <p
                            className="form-message success"
                            role="status"
                        >
                            {message}
                        </p>
                    )}

                    <div className="settings-actions">
                        <button type="submit">
                            Save Settings
                        </button>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={handleReset}
                        >
                            Reset Preferences
                        </button>
                    </div>
                </div>

                <aside className="settings-side-column">
                    <section className="settings-panel">
                        <h2>
                            Account Security
                        </h2>

                        <p>
                            Manage your login
                            credentials and account
                            verification.
                        </p>

                        <div className="settings-link-list">
                            <Link to="/forgot-password">
                                Change password
                            </Link>

                            <Link to="/verify-email">
                                Verify email
                            </Link>
                        </div>
                    </section>

                    <section className="settings-panel danger-panel">
                        <h2>Local Data</h2>

                        <p>
                            Remove your locally saved
                            habits, tasks, and
                            preferences.
                        </p>

                        <button
                            type="button"
                            className="danger-button"
                            onClick={
                                clearLocalApplicationData
                            }
                        >
                            Clear Local Data
                        </button>
                    </section>
                </aside>
            </form>
        </main>
    );
}

export default Settings;