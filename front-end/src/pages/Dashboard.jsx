import React from "react";

import { useHabits } from "../context/HabitContext";
import { useTodos } from "../context/TodoContext";

import DashboardHeader from "../components/DashboardHeader";
import SummaryCard from "../components/SummaryCard";
import ProgressRing from "../components/ProgressRing";
import HabitList from "../components/HabitList";
import TodoList from "../components/TodoList";
import QuoteWidget from "../components/QuoteWidget";

import "../styles/dashboard.css";

function Dashboard()
{
    const {
        habits,
        getCurrentStreak,
        completedToday
    } = useHabits();

    const { todos } = useTodos();

    const completedHabits =
        habits.filter(
            (habit) =>
                completedToday(habit)
        ).length;

    const completedTasks =
        todos.filter(
            (todo) => todo.completed
        ).length;

    const totalItems =
        habits.length + todos.length;

    const totalCompleted =
        completedHabits +
        completedTasks;

    const progress =
        totalItems === 0
            ? 0
            : Math.round(
                  (
                      totalCompleted /
                      totalItems
                  ) * 100
              );

    const longestCurrentStreak =
        habits.length === 0
            ? 0
            : Math.max(
                  ...habits.map((habit) =>
                      getCurrentStreak(
                          habit.completions ||
                              []
                      )
                  )
              );

    return (
        <main className="dashboard">
            <DashboardHeader />

            <section className="summary-grid">
                <SummaryCard
                    title="Current Streak"
                    value={
                        `${longestCurrentStreak} Days`
                    }
                    icon="🔥"
                />

                <SummaryCard
                    title="Habits Today"
                    value={
                        `${completedHabits}/${habits.length}`
                    }
                    icon="✅"
                />

                <SummaryCard
                    title="Tasks Complete"
                    value={
                        `${completedTasks}/${todos.length}`
                    }
                    icon="📝"
                />
            </section>

            <section className="dashboard-columns">
                <div className="dashboard-panel">
                    <HabitList
                        limit={3}
                        compact
                    />
                </div>

                <div className="dashboard-panel">
                    <TodoList
                        limit={3}
                        compact
                    />
                </div>
            </section>

            <section className="progress-panel">
                <div>
                    <h2>
                        Daily Completion
                    </h2>

                    <p>
                        Completion across today’s
                        habits and tasks.
                    </p>
                </div>

                <ProgressRing
                    percent={progress}
                />
            </section>

            <QuoteWidget />
        </main>
    );
}

export default Dashboard;