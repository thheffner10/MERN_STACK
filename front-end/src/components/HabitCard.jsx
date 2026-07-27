import React from "react";

import { useHabits } from "../context/HabitContext";

function HabitCard({
    habit,
    onDelete,
    onToggle,
    onEdit
})
{
    const {
        getCurrentStreak,
        completedToday
    } = useHabits();

    const streak = getCurrentStreak(
        habit.completions || []
    );

    const isCompleted = completedToday(habit);

    return (
        <article
            className={
                isCompleted
                    ? "habit-card completed"
                    : "habit-card"
            }
        >
            <div className="habit-card-header">
                <div>
                    <h3>{habit.name}</h3>

                    <p>{habit.description}</p>
                </div>

                <span className="habit-category">
                    {habit.category}
                </span>
            </div>

            <div className="habit-meta">
                <span>
                    🔥 {streak} day streak
                </span>

                <span>
                    {habit.frequency}
                </span>
            </div>

            <div className="habit-status">
                {isCompleted
                    ? "Completed today"
                    : "Not completed today"}
            </div>

            <div className="card-actions">
                <button
                    type="button"
                    onClick={() => onToggle(habit.id)}
                >
                    {isCompleted
                        ? "Undo"
                        : "Complete"}
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(habit)}
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(habit.id)}
                >
                    Delete
                </button>
            </div>
        </article>
    );
}

export default HabitCard;