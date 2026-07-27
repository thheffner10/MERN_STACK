import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useTodos } from "../context/TodoContext";

import TodoCard from "./TodoCard";
import TodoModal from "./TodoModal";

function TodoList({
    limit,
    showHeader = true,
    compact = false
})
{
    const {
        todos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo
    } = useTodos();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    const displayedTodos =
        typeof limit === "number"
            ? todos.slice(0, limit)
            : todos;

    function openCreate()
    {
        setEditingTodo(null);
        setModalOpen(true);
    }

    function openEdit(todo)
    {
        setEditingTodo(todo);
        setModalOpen(true);
    }

    function closeModal()
    {
        setModalOpen(false);
        setEditingTodo(null);
    }

    function saveTodo(todo)
    {
        if (editingTodo)
        {
            updateTodo(todo);
        }
        else
        {
            addTodo(todo);
        }

        closeModal();
    }

    return (
        <section
            className={
                compact
                    ? "todo-section compact-section"
                    : "todo-section"
            }
        >
            {showHeader && (
                <div className="section-header">
                    <div>
                        <h2>
                            {typeof limit === "number"
                                ? "Today's Tasks"
                                : "Your Tasks"}
                        </h2>

                        <p className="section-description">
                            Organize work that needs your attention.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreate}
                    >
                        + New Task
                    </button>
                </div>
            )}

            {displayedTodos.length === 0 ? (
                <div className="empty-state">
                    <h3>No tasks yet</h3>

                    <p>
                        Create a task to start organizing
                        your day.
                    </p>

                    <button
                        type="button"
                        onClick={openCreate}
                    >
                        Create Task
                    </button>
                </div>
            ) : (
                <div className="todo-grid">
                    {displayedTodos.map((todo) => (
                        <TodoCard
                            key={todo.id}
                            todo={todo}
                            onDelete={deleteTodo}
                            onToggle={toggleTodo}
                            onEdit={openEdit}
                        />
                    ))}
                </div>
            )}

            {typeof limit === "number" &&
                todos.length > limit && (
                    <Link
                        to="/tasks"
                        className="view-all-link"
                    >
                        View all tasks
                    </Link>
                )}

            <TodoModal
                isOpen={modalOpen}
                existingTodo={editingTodo}
                onSave={saveTodo}
                onClose={closeModal}
            />
        </section>
    );
}

export default TodoList;