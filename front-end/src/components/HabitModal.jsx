import React, {
    useEffect,
    useState
} from "react";

import "../styles/modal.css";

function HabitModal({
    isOpen,
    onClose,
    onSave,
    existingHabit
})
{
    const [habit, setHabit] = useState({
        name: "",
        description: "",
        category: "General",
        frequency: "Daily",
        streak: 0
    });

    useEffect(() =>
    {
        if (existingHabit)
        {
            setHabit({
                ...existingHabit,
                completions:
                    existingHabit.completions || []
            });
        }
        else
        {
            setHabit({
                name: "",
                description: "",
                category: "General",
                frequency: "Daily",
                streak: 0,
                completions: []
            });
        }
    }, [existingHabit, isOpen]);

    if (!isOpen)
    {
        return null;
    }

    function handleChange(event)
    {
        const {
            name,
            value
        } = event.target;

        setHabit((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    function submitHabit(event)
    {
        event.preventDefault();

        const trimmedName =
            habit.name.trim();

        if (!trimmedName)
        {
            return;
        }

        onSave({
        ...habit,
        name: trimmedName,

        _id: existingHabit
        ? (existingHabit._id || existingHabit.id)
        : undefined,

        completions: existingHabit
            ? existingHabit.completions || []
            : []
        });

        onClose();
    }

    return (
        <div
            className="modal-overlay"
            role="presentation"
            onMouseDown={(event) =>
            {
                if (
                    event.target ===
                    event.currentTarget
                )
                {
                    onClose();
                }
            }}
        >
            <section
                className="habit-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="habit-modal-title"
            >
                <h2 id="habit-modal-title">
                    {existingHabit
                        ? "Edit Habit"
                        : "Create Habit"}
                </h2>

                <form onSubmit={submitHabit}>
                    <label htmlFor="habit-name">
                        Habit
                    </label>

                    <input
                        id="habit-name"
                        name="name"
                        value={habit.name}
                        onChange={handleChange}
                        placeholder="Example: Exercise"
                        autoFocus
                        required
                    />

                    <label htmlFor="habit-description">
                        Description
                    </label>

                    <textarea
                        id="habit-description"
                        name="description"
                        value={habit.description}
                        onChange={handleChange}
                        placeholder="Describe your goal"
                    />

                    <label htmlFor="habit-category">
                        Category
                    </label>

                    <select
                        id="habit-category"
                        name="category"
                        value={habit.category}
                        onChange={handleChange}
                    >
                        <option>General</option>
                        <option>Health</option>
                        <option>Fitness</option>
                        <option>Learning</option>
                        <option>Productivity</option>
                    </select>

                    <label htmlFor="habit-frequency">
                        Frequency
                    </label>

                    <select
                        id="habit-frequency"
                        name="frequency"
                        value={habit.frequency}
                        onChange={handleChange}
                    >
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>

                    <div className="modal-buttons">
                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            {existingHabit
                                ? "Save Changes"
                                : "Create Habit"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default HabitModal;