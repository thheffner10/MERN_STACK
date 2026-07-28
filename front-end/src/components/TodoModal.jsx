import React, {
    useEffect,
    useState
} from "react";

function TodoModal({
    isOpen,
    onClose,
    onSave,
    existingTodo
})
{
    const [todo, setTodo] = useState({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: ""
    });

    useEffect(() =>
    {
        if (existingTodo)
        {
            setTodo({
                title: "",
                description: "",
                priority: "Medium",
                dueDate: "",
                ...existingTodo
            });
        }
        else
        {
            setTodo({
                title: "",
                description: "",
                priority: "Medium",
                dueDate: ""
            });
        }
    }, [existingTodo, isOpen]);

    if (!isOpen)
    {
        return null;
    }

    function update(event)
    {
        const {
            name,
            value
        } = event.target;

        setTodo((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    function submit(event)
    {
        event.preventDefault();

        const trimmedTitle =
            todo.title.trim();

        if (!trimmedTitle)
        {
            return;
        }

        onSave({
            ...todo,

            title: trimmedTitle,

            id: existingTodo
                ? existingTodo.id
                : Date.now(),

            completed: existingTodo
                ? existingTodo.completed
                : false
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
                aria-labelledby="todo-modal-title"
            >
                <h2 id="todo-modal-title">
                    {existingTodo
                        ? "Edit Task"
                        : "Create Task"}
                </h2>

                <form onSubmit={submit}>
                    <label htmlFor="todo-title">
                        Task
                    </label>

                    <input
                        id="todo-title"
                        name="title"
                        value={todo.title}
                        onChange={update}
                        placeholder="Example: Finish assignment"
                        autoFocus
                        required
                    />

                    <label htmlFor="todo-description">
                        Description
                    </label>

                    <textarea
                        id="todo-description"
                        name="description"
                        value={todo.description}
                        onChange={update}
                        placeholder="Describe the task or include any important details."
                    />

                    <label htmlFor="todo-priority">
                        Priority
                    </label>

                    <select
                        id="todo-priority"
                        name="priority"
                        value={todo.priority}
                        onChange={update}
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>

                    <label htmlFor="todo-due-date">
                        Due Date
                    </label>

                    <input
                        id="todo-due-date"
                        type="date"
                        name="dueDate"
                        value={todo.dueDate}
                        onChange={update}
                    />

                    <div className="modal-buttons">
                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            {existingTodo
                                ? "Save Changes"
                                : "Create Task"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default TodoModal;