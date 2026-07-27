import React from "react";

function CalendarDay({
    dayNumber,
    dateKey,
    isCurrentMonth,
    isToday,
    completed,
    onToggle
})
{
    const classNames = [
        "calendar-day",
        !isCurrentMonth ? "outside-month" : "",
        isToday ? "today" : "",
        completed ? "completed" : ""
    ]
        .filter(Boolean)
        .join(" ");

    function handleClick()
    {
        if (!isCurrentMonth || !dateKey)
        {
            return;
        }

        onToggle(dateKey);
    }

    return (
        <button
            type="button"
            className={classNames}
            onClick={handleClick}
            disabled={!isCurrentMonth}
            aria-label={
                dateKey
                    ? `${dateKey}${
                          completed
                              ? ", completed"
                              : ", not completed"
                      }`
                    : "Outside current month"
            }
        >
            <span className="calendar-day-number">
                {dayNumber}
            </span>

            {completed && (
                <span
                    className="calendar-completion-mark"
                    aria-hidden="true"
                >
                    ✓
                </span>
            )}
        </button>
    );
}

export default CalendarDay;