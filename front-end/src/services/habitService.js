import {
    apiRequest
} from "./apiClient";

export async function getHabits()
{
    const result =
        await apiRequest("/habits");

    return result.habits || result;
}

export async function createHabit(
    habit
)
{
    const result =
        await apiRequest(
            "/habits",
            {
                method: "POST",
                body: habit
            }
        );

    return result.habit || result;
}

export async function editHabit(
    habit
)
{
    const habitId =
        habit.id || habit._id;

    const result =
        await apiRequest(
            `/habits/${habitId}`,
            {
                method: "PUT",
                body: habit
            }
        );

    return result.habit || result;
}

export async function removeHabit(habitId, userId)
{
    return apiRequest(
        "/deletehabit",
        {
            method: "DELETE",
            body:
            {
                habitId,
                userId
            }
        }
    );
}

export async function toggleHabitCompletion(
    habitId,
    userId,
    date
)
{
    const result =
        await apiRequest(
            `/habits/${habitId}/toggle`,
            {
                method: "POST",
                body: {
                    userId,
                    date
                }
            }
        );

    return result.habit || result;
}