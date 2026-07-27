import React from "react";

import HabitList from "../components/HabitList";

function Habits()
{
    return (
        <main className="management-page">
            <header className="page-header">
                <div>
                    <p className="page-eyebrow">
                        Habit management
                    </p>

                    <h1>Your Habits</h1>

                    <p>
                        Create routines, record daily
                        completion, and maintain streaks.
                    </p>
                </div>
            </header>

            <div className="management-panel">
                <HabitList />
            </div>
        </main>
    );
}

export default Habits;