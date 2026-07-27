import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import {
    AuthProvider
} from "./context/AuthContext";

import {
    HabitProvider
} from "./context/HabitContext";

import {
    TodoProvider
} from "./context/TodoContext";

import {
    SettingsProvider
} from "./context/SettingsContext";

import "./styles/global.css";
import "./styles/landing.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/modal.css";
import "./styles/todo.css";
import "./styles/layout.css";
import "./styles/calendar.css";
import "./styles/settings.css";

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>
        <AuthProvider>
            <SettingsProvider>
                <HabitProvider>
                    <TodoProvider>
                        <App />
                    </TodoProvider>
                </HabitProvider>
            </SettingsProvider>
        </AuthProvider>
    </React.StrictMode>
);