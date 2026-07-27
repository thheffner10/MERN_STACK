import React, {
    useMemo,
    useState
} from "react";

import { useHabits } from "../context/HabitContext";

import Calendar from "../components/Calendar";
import SummaryCard from "../components/SummaryCard";

import "../styles/calendar.css";

function formatDateKey(date)
{
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getMonthLabel(date)
{
    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric"
        }
    );
}

function CalendarPage()
{
    const {
        habits,
        updateHabit,
        getCurrentStreak,
        getLongestStreak
    } = useHabits();

    const [displayedDate, setDisplayedDate] =
        useState(new Date());

    const [selectedHabitId, setSelectedHabitId] =
        useState(
            habits.length > 0
                ? habits[0].id
                : ""
        );

    const selectedHabit =
        habits.find(
            (habit) =>
                String(habit.id) ===
                String(selectedHabitId)
        ) || null;

    const monthlyCompletions = useMemo(
        () =>
        {
            if (!selectedHabit)
            {
                return 0;
            }

            const year =
                displayedDate.getFullYear();

            const month =
                displayedDate.getMonth();

            return (
                selectedHabit.completions || []
            ).filter((dateKey) =>
            {
                const date =
                    new Date(`${dateKey}T00:00:00`);

                return (
                    date.getFullYear() === year &&
                    date.getMonth() === month
                );
            }).length;
        },
        [selectedHabit, displayedDate]
    );

    const daysInMonth = new Date(
        displayedDate.getFullYear(),
        displayedDate.getMonth() + 1,
        0
    ).getDate();

    const monthlyPercentage =
        daysInMonth === 0
            ? 0
            : Math.round(
                  (monthlyCompletions /
                      daysInMonth) *
                      100
              );

    const currentStreak =
        selectedHabit
            ? getCurrentStreak(
                  selectedHabit.completions || []
              )
            : 0;

    const longestStreak =
        selectedHabit
            ? getLongestStreak(
                  selectedHabit.completions || []
              )
            : 0;

    function moveMonth(amount)
    {
        setDisplayedDate(
            (previousDate) =>
                new Date(
                    previousDate.getFullYear(),
                    previousDate.getMonth() +
                        amount,
                    1
                )
        );
    }

    function returnToCurrentMonth()
    {
        setDisplayedDate(new Date());
    }

    function toggleCompletionDate(dateKey)
    {
        if (!selectedHabit)
        {
            return;
        }

        const currentCompletions =
            selectedHabit.completions || [];

        const alreadyCompleted =
            currentCompletions.includes(dateKey);

        const updatedCompletions =
            alreadyCompleted
                ? currentCompletions.filter(
                      (completion) =>
                          completion !== dateKey
                  )
                : [
                      ...currentCompletions,
                      dateKey
                  ];

        updateHabit({
            ...selectedHabit,
            completions:
                updatedCompletions.sort()
        });
    }

    const isCurrentMonth =
        displayedDate.getFullYear() ===
            new Date().getFullYear() &&
        displayedDate.getMonth() ===
            new Date().getMonth();

    return (
        <main className="calendar-page">
            <header className="page-header">
                <p className="page-eyebrow">
                    Completion history
                </p>

                <h1>Habit Calendar</h1>

                <p>
                    Review previous completions and
                    update your habit history.
                </p>
            </header>

            {habits.length === 0 ? (
                <section className="empty-state">
                    <h2>No habits available</h2>

                    <p>
                        Create a habit before using
                        the completion calendar.
                    </p>
                </section>
            ) : (
                <>
                    <section className="calendar-controls">
                        <div className="calendar-habit-selector">
                            <label htmlFor="calendar-habit">
                                Habit
                            </label>

                            <select
                                id="calendar-habit"
                                value={selectedHabitId}
                                onChange={(event) =>
                                    setSelectedHabitId(
                                        event.target.value
                                    )
                                }
                            >
                                {habits.map((habit) => (
                                    <option
                                        key={habit.id}
                                        value={habit.id}
                                    >
                                        {habit.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="calendar-navigation">
                            <button
                                type="button"
                                className="calendar-nav-button"
                                onClick={() =>
                                    moveMonth(-1)
                                }
                                aria-label="Previous month"
                            >
                                ←
                            </button>

                            <div className="calendar-month-heading">
                                <h2>
                                    {getMonthLabel(
                                        displayedDate
                                    )}
                                </h2>

                                <p>
                                    Select a day to
                                    toggle completion.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="calendar-nav-button"
                                onClick={() =>
                                    moveMonth(1)
                                }
                                aria-label="Next month"
                            >
                                →
                            </button>
                        </div>

                        <button
                            type="button"
                            className="calendar-today-button"
                            onClick={
                                returnToCurrentMonth
                            }
                            disabled={isCurrentMonth}
                        >
                            Current month
                        </button>
                    </section>

                    <section className="calendar-summary-grid">
                        <SummaryCard
                            title="Completed This Month"
                            value={`${monthlyCompletions}/${daysInMonth}`}
                            icon="✅"
                        />

                        <SummaryCard
                            title="Monthly Completion"
                            value={`${monthlyPercentage}%`}
                            icon="📈"
                        />

                        <SummaryCard
                            title="Current Streak"
                            value={`${currentStreak} Days`}
                            icon="🔥"
                        />

                        <SummaryCard
                            title="Longest Streak"
                            value={`${longestStreak} Days`}
                            icon="🏆"
                        />
                    </section>

                    <Calendar
                        habit={selectedHabit}
                        displayedDate={
                            displayedDate
                        }
                        onToggleDate={
                            toggleCompletionDate
                        }
                    />

                    <section className="calendar-legend">
                        <div>
                            <span className="legend-box completed" />
                            Completed
                        </div>

                        <div>
                            <span className="legend-box today" />
                            Today
                        </div>

                        <div>
                            <span className="legend-box" />
                            Not completed
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}

export default CalendarPage;