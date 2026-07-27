import {
    apiRequest
} from "./apiClient";

export async function getTodos()
{
    const result =
        await apiRequest("/tasks");

    return result.tasks || result.todos || result;
}

export async function createTodo(todo)
{
    const result =
        await apiRequest(
            "/tasks",
            {
                method: "POST",
                body: todo
            }
        );

    return result.task || result.todo || result;
}

export async function editTodo(todo)
{
    const todoId =
        todo.id || todo._id;

    const result =
        await apiRequest(
            `/tasks/${todoId}`,
            {
                method: "PUT",
                body: todo
            }
        );

    return result.task || result.todo || result;
}

export async function removeTodo(
    todoId
)
{
    return apiRequest(
        `/tasks/${todoId}`,
        {
            method: "DELETE"
        }
    );
}

export async function toggleTodoCompletion(
    todoId
)
{
    const result =
        await apiRequest(
            `/tasks/${todoId}/toggle`,
            {
                method: "PATCH"
            }
        );

    return result.task || result.todo || result;
}