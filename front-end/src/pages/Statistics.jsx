import React, { useMemo } from "react";

import { useHabits } from "../context/HabitContext";
import { useTodos } from "../context/TodoContext";

import SummaryCard from "../components/SummaryCard";
import ProgressRing from "../components/ProgressRing";

import "../styles/statistics.css";

const DAY_IN_MILLISECONDS =
    24 * 60 * 60 * 1000;

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

function getLastSevenDays()
{
    const today = new Date();

    return Array.from(
        { length: 7 },
        (_, index) =>
        {
            const date = new Date(today);

            date.setDate(
                today.getDate() - (6 - index)
            );

            return {
                dateKey: formatDateKey(date),

                label: date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                ),

                shortDate:
                    date.toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric"
                        }
                    )
            };
        }
    );
}

function getHabitCompletionCount(
    habit,
    dateKeys
)
{
    const completionSet = new Set(
        habit.completions || []
    );

    return dateKeys.filter(
        (dateKey) =>
            completionSet.has(dateKey)
    ).length;
}

function Statistics()
{
    const {
        habits,
        getCurrentStreak,
        getLongestStreak,
        completedToday
    } = useHabits();

    const { todos } = useTodos();

    const lastSevenDays = useMemo(
        () => getLastSevenDays(),
        []
    );

    const recentDateKeys =
        lastSevenDays.map(
            (day) => day.dateKey
        );

    const dailyActivity = useMemo(
        () =>
            lastSevenDays.map((day) =>
            {
                const count =
                    habits.filter((habit) =>
                        (
                            habit.completions ||
                            []
                        ).includes(
                            day.dateKey
                        )
                    ).length;

                const percentage =
                    habits.length === 0
                        ? 0
                        : Math.round(
                              (count /
                                  habits.length) *
                                  100
                          );

                return {
                    ...day,
                    count,
                    percentage
                };
            }),
        [habits, lastSevenDays]
    );

    const completedHabitsToday =
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
        completedHabitsToday +
        completedTasks;

    const overallCompletion =
        totalItems === 0
            ? 0
            : Math.round(
                  (totalCompleted /
                      totalItems) *
                      100
              );

    const totalHabitCompletions =
        habits.reduce(
            (total, habit) =>
                total +
                (
                    habit.completions || []
                ).length,
            0
        );

    const bestCurrentStreak =
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

    const bestLongestStreak =
        habits.length === 0
            ? 0
            : Math.max(
                  ...habits.map((habit) =>
                      getLongestStreak(
                          habit.completions ||
                              []
                      )
                  )
              );

    const habitStatistics =
        habits
            .map((habit) =>
            {
                const recentCompletions =
                    getHabitCompletionCount(
                        habit,
                        recentDateKeys
                    );

                return {
                    ...habit,
                    recentCompletions,

                    recentPercentage:
                        Math.round(
                            (
                                recentCompletions /
                                7
                            ) * 100
                        ),

                    currentStreak:
                        getCurrentStreak(
                            habit.completions ||
                                []
                        ),

                    longestStreak:
                        getLongestStreak(
                            habit.completions ||
                                []
                        )
                };
            })
            .sort(
                (first, second) =>
                    second.recentPercentage -
                    first.recentPercentage
            );

    const priorityCounts =
        todos.reduce(
            (counts, todo) =>
            {
                const priority =
                    todo.priority || "Medium";

                counts[priority] =
                    (counts[priority] || 0) +
                    1;

                return counts;
            },
            {
                High: 0,
                Medium: 0,
                Low: 0
            }
        );

    const sevenDayAverage =
        dailyActivity.length === 0
            ? 0
            : Math.round(
                  dailyActivity.reduce(
                      (total, day) =>
                          total +
                          day.percentage,
                      0
                  ) /
                      dailyActivity.length
              );

    return (
        <main className="statistics-page">
            <header className="page-header">
                <p className="page-eyebrow">
                    Progress analytics
                </p>

                <h1>Statistics</h1>

                <p>
                    Review your recent consistency,
                    streaks, and task completion.
                </p>
            </header>

            <section className="statistics-summary-grid">
                <SummaryCard
                    title="Overall Today"
                    value={`${overallCompletion}%`}
                    icon="📈"
                />

                <SummaryCard
                    title="Current Streak"
                    value={`${bestCurrentStreak} Days`}
                    icon="🔥"
                />

                <SummaryCard
                    title="Longest Streak"
                    value={`${bestLongestStreak} Days`}
                    icon="🏆"
                />

                <SummaryCard
                    title="Habit Completions"
                    value={totalHabitCompletions}
                    icon="✅"
                />
            </section>

            <section className="statistics-layout">
                <article className="statistics-panel weekly-panel">
                    <div className="statistics-panel-header">
                        <div>
                            <h2>
                                Last Seven Days
                            </h2>

                            <p>
                                Percentage of habits
                                completed each day.
                            </p>
                        </div>

                        <div className="weekly-average">
                            <strong>
                                {sevenDayAverage}%
                            </strong>

                            <span>
                                Daily average
                            </span>
                        </div>
                    </div>

                    <div
                        className="weekly-chart"
                        role="img"
                        aria-label="Habit completion percentages for the last seven days"
                    >
                        {dailyActivity.map(
                            (day) => (
                                <div
                                    className="weekly-column"
                                    key={day.dateKey}
                                >
                                    <div className="weekly-value">
                                        {day.percentage}%
                                    </div>

                                    <div className="weekly-bar-track">
                                        <div
                                            className="weekly-bar-fill"
                                            style={{
                                                height:
                                                    `${day.percentage}%`
                                            }}
                                        />
                                    </div>

                                    <strong>
                                        {day.label}
                                    </strong>

                                    <span>
                                        {day.shortDate}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </article>

                <article className="statistics-panel completion-panel">
                    <div>
                        <h2>
                            Today’s Completion
                        </h2>

                        <p>
                            Habits and tasks completed
                            today.
                        </p>
                    </div>

                    <ProgressRing
                        percent={overallCompletion}
                    />

                    <div className="completion-details">
                        <div>
                            <span>
                                Habits
                            </span>

                            <strong>
                                {completedHabitsToday}/
                                {habits.length}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Tasks
                            </span>

                            <strong>
                                {completedTasks}/
                                {todos.length}
                            </strong>
                        </div>
                    </div>
                </article>
            </section>

            <section className="statistics-layout lower-statistics-layout">
                <article className="statistics-panel">
                    <div className="statistics-panel-header">
                        <div>
                            <h2>
                                Habit Performance
                            </h2>

                            <p>
                                Completion during the
                                last seven days.
                            </p>
                        </div>
                    </div>

                    {habitStatistics.length === 0 ? (
                        <div className="empty-state">
                            <h3>
                                No habits available
                            </h3>

                            <p>
                                Add habits to see
                                performance statistics.
                            </p>
                        </div>
                    ) : (
                        <div className="habit-statistics-list">
                            {habitStatistics.map(
                                (habit) => (
                                    <div
                                        className="habit-statistic-row"
                                        key={habit.id}
                                    >
                                        <div className="habit-statistic-heading">
                                            <div>
                                                <h3>
                                                    {
                                                        habit.name
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        habit.recentCompletions
                                                    }
                                                    /7 days
                                                    completed
                                                </p>
                                            </div>

                                            <strong>
                                                {
                                                    habit.recentPercentage
                                                }
                                                %
                                            </strong>
                                        </div>

                                        <div className="statistic-progress-track">
                                            <div
                                                className="statistic-progress-fill"
                                                style={{
                                                    width:
                                                        `${habit.recentPercentage}%`
                                                }}
                                            />
                                        </div>

                                        <div className="habit-streak-details">
                                            <span>
                                                Current:
                                                {" "}
                                                {
                                                    habit.currentStreak
                                                }
                                                {" "}
                                                days
                                            </span>

                                            <span>
                                                Best:
                                                {" "}
                                                {
                                                    habit.longestStreak
                                                }
                                                {" "}
                                                days
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </article>

                <article className="statistics-panel task-breakdown-panel">
                    <div>
                        <h2>
                            Task Breakdown
                        </h2>

                        <p>
                            Current tasks grouped by
                            priority.
                        </p>
                    </div>

                    <div className="priority-list">
                        <div className="priority-row high">
                            <div>
                                <span className="priority-dot" />

                                High Priority
                            </div>

                            <strong>
                                {priorityCounts.High}
                            </strong>
                        </div>

                        <div className="priority-row medium">
                            <div>
                                <span className="priority-dot" />

                                Medium Priority
                            </div>

                            <strong>
                                {priorityCounts.Medium}
                            </strong>
                        </div>

                        <div className="priority-row low">
                            <div>
                                <span className="priority-dot" />

                                Low Priority
                            </div>

                            <strong>
                                {priorityCounts.Low}
                            </strong>
                        </div>
                    </div>

                    <div className="task-completion-summary">
                        <span>
                            Completed tasks
                        </span>

                        <strong>
                            {completedTasks}/
                            {todos.length}
                        </strong>
                    </div>
                </article>
            </section>
        </main>
    );
}

export default Statistics;