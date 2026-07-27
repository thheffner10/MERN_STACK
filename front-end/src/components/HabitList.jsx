import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useHabits } from "../context/HabitContext";

import HabitCard from "./HabitCard";
import HabitModal from "./HabitModal";

function HabitList({
    limit,
    showHeader = true,
    compact = false
})
{
    const {
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabit
    } = useHabits();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);

    const displayedHabits =
        typeof limit === "number"
            ? habits.slice(0, limit)
            : habits;

    function openCreate()
    {
        setEditingHabit(null);
        setModalOpen(true);
    }

    function openEdit(habit)
    {
        setEditingHabit(habit);
        setModalOpen(true);
    }

    function closeModal()
    {
        setModalOpen(false);
        setEditingHabit(null);
    }

    function saveHabit(habit)
    {
        if (editingHabit)
        {
            updateHabit(habit);
        }
        else
        {
            addHabit(habit);
        }

        closeModal();
    }

    return (
        <section
            className={
                compact
                    ? "habit-section compact-section"
                    : "habit-section"
            }
        >
            {showHeader && (
                <div className="section-header">
                    <div>
                        <h2>
                            {typeof limit === "number"
                                ? "Today's Habits"
                                : "Your Habits"}
                        </h2>

                        <p className="section-description">
                            Build consistency one day at a time.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreate}
                    >
                        + New Habit
                    </button>
                </div>
            )}

            {displayedHabits.length === 0 ? (
                <div className="empty-state">
                    <h3>No habits yet</h3>

                    <p>
                        Create your first habit to begin
                        tracking your progress.
                    </p>

                    <button
                        type="button"
                        onClick={openCreate}
                    >
                        Create Habit
                    </button>
                </div>
            ) : (
                <div className="habit-grid">
                    {displayedHabits.map((habit) => (
                        <HabitCard
                            key={habit.id || habit._id}
                            habit={habit}
                            onDelete={deleteHabit}
                            onToggle={toggleHabit}
                            onEdit={openEdit}
                        />
                    ))}
                </div>
            )}

            {typeof limit === "number" &&
                habits.length > limit && (
                    <Link
                        to="/habits"
                        className="view-all-link"
                    >
                        View all habits
                    </Link>
                )}

            <HabitModal
                isOpen={modalOpen}
                existingHabit={editingHabit}
                onSave={saveHabit}
                onClose={closeModal}
            />
        </section>
    );
}

export default HabitList;