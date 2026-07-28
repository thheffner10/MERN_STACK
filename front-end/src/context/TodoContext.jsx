import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";

import {
    createTodo,
    editTodo,
    getTodos,
    removeTodo,
    toggleTodoCompletion
} from "../services/todoService";

import {
    useAuth
} from "./AuthContext";

const TodoContext =
    createContext(null);

function getTodoId(todo)
{
    return todo.id || todo._id;
}

export function TodoProvider({
    children
})
{
    const {
        isAuthenticated,
        user
    } = useAuth();

    const [todos, setTodos] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const loadTodos =
        useCallback(async () =>
        {
            if (!isAuthenticated)
            {
                setTodos([]);
                return;
            }

            setLoading(true);
            setError("");

            try
            {
                const result =
                    await getTodos(user.id);

                setTodos(
                    Array.isArray(result)
                        ? result
                        : []
                );
            }
            catch (requestError)
            {
                setError(
                    requestError.message ||
                    "Unable to load tasks."
                );
            }
            finally
            {
                setLoading(false);
            }
        }, [isAuthenticated, user]);

    useEffect(() =>
    {
        loadTodos();
    }, [loadTodos]);

    async function addTodo(todo)
    {

        const createdTodo =
        await createTodo({
            ...todo,
            userId: user.id
        });

        setTodos((previous) => [
            ...previous,
            createdTodo
        ]);

        return createdTodo;
    }

    async function updateTodo(
        updatedTodo
    )
    {
        const savedTodo =
            await editTodo({
                ...updatedTodo,
                userId: user.id
            });

        const savedTodoId =
            getTodoId(savedTodo);

        setTodos((previous) =>
            previous.map((todo) =>
                getTodoId(todo) ===
                savedTodoId
                    ? savedTodo
                    : todo
            )
        );

        return savedTodo;
    }

    async function deleteTodo(id)
    {
        await removeTodo(id, user.id);

        setTodos((previous) =>
            previous.filter(
                (todo) =>
                    getTodoId(todo) !== id
            )
        );
    }

    async function toggleTodo(id)
    {
        const updatedTodo =
            await toggleTodoCompletion(
                id,
                user.id
            );

        const updatedTodoId =
            getTodoId(updatedTodo);

        setTodos((previous) =>
            previous.map((todo) =>
                getTodoId(todo) ===
                updatedTodoId
                    ? updatedTodo
                    : todo
            )
        );

        return updatedTodo;
    }

    return (
        <TodoContext.Provider
            value={{
                todos,
                loading,
                error,
                loadTodos,
                addTodo,
                updateTodo,
                deleteTodo,
                toggleTodo
            }}
        >
            {children}
        </TodoContext.Provider>
    );
}

export function useTodos()
{
    const context =
        useContext(TodoContext);

    if (!context)
    {
        throw new Error(
            "useTodos must be used inside TodoProvider."
        );
    }

    return context;
}