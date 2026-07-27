import React from "react";

import TodoList from "../components/TodoList";

function Tasks()
{
    return (
        <main className="management-page">
            <header className="page-header">
                <div>
                    <p className="page-eyebrow">
                        Task management
                    </p>

                    <h1>Your Tasks</h1>

                    <p>
                        Manage priorities, due dates,
                        and daily responsibilities.
                    </p>
                </div>
            </header>

            <div className="management-panel">
                <TodoList />
            </div>
        </main>
    );
}

export default Tasks;