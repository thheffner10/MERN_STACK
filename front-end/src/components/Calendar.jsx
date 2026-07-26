import React from "react";

import CalendarDay from "./CalendarDay";

const WEEKDAY_LABELS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
];

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

function buildCalendarDays(year, month)
{
    const firstDay = new Date(year, month, 1);

    const lastDay = new Date(
        year,
        month + 1,
        0
    );

    const leadingDays =
        firstDay.getDay();

    const daysInMonth =
        lastDay.getDate();

    const totalCells = 42;

    return Array.from(
        { length: totalCells },
        (_, index) =>
        {
            const dayOffset =
                index - leadingDays + 1;

            const date = new Date(
                year,
                month,
                dayOffset
            );

            const isCurrentMonth =
                date.getMonth() === month;

            return {
                date,
                dateKey: formatDateKey(date),
                dayNumber: date.getDate(),
                isCurrentMonth
            };
        }
    );
}

function Calendar({
    habit,
    displayedDate,
    onToggleDate
})
{
    const year =
        displayedDate.getFullYear();

    const month =
        displayedDate.getMonth();

    const calendarDays =
        buildCalendarDays(year, month);

    const todayKey =
        formatDateKey(new Date());

    const completionSet =
        new Set(habit.completions || []);

    return (
        <section className="calendar">
            <div className="calendar-weekdays">
                {WEEKDAY_LABELS.map(
                    (weekday) => (
                        <div
                            key={weekday}
                            className="calendar-weekday"
                        >
                            {weekday}
                        </div>
                    )
                )}
            </div>

            <div className="calendar-grid">
                {calendarDays.map(
                    ({
                        dateKey,
                        dayNumber,
                        isCurrentMonth
                    }) => (
                        <CalendarDay
                            key={dateKey}
                            dayNumber={dayNumber}
                            dateKey={dateKey}
                            isCurrentMonth={
                                isCurrentMonth
                            }
                            isToday={
                                dateKey === todayKey
                            }
                            completed={
                                completionSet.has(
                                    dateKey
                                )
                            }
                            onToggle={
                                onToggleDate
                            }
                        />
                    )
                )}
            </div>
        </section>
    );
}

export default Calendar;