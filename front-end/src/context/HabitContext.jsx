import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";

import {
    createHabit,
    editHabit,
    getHabits,
    removeHabit,
    toggleHabitCompletion
} from "../services/habitService";

import {
    useAuth
} from "./AuthContext";

const HabitContext =
    createContext(null);

function getLocalDateKey(
    date = new Date()
)
{
    const year =
        date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getHabitId(habit)
{
    return habit.id || habit._id;
}

export function HabitProvider({
    children
})
{
    const {
        isAuthenticated,
        user
} = useAuth();

    const [habits, setHabits] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const loadHabits =
        useCallback(async () =>
        {
            if (!isAuthenticated)
            {
                setHabits([]);
                return;
            }

            setLoading(true);
            setError("");

            try
            {
                const result =
                    await getHabits(user.id);

                setHabits(
                    Array.isArray(result)
                        ? result
                        : []
                );
            }
            catch (requestError)
            {
                setError(
                    requestError.message ||
                    "Unable to load habits."
                );
            }
            finally
            {
                setLoading(false);
            }
        }, [isAuthenticated, user]);

    useEffect(() =>
    {
        loadHabits();
    }, [loadHabits]);

    async function addHabit(habit)
    {
        console.log("CONTEXT RECEIVED:", habit);

        const createdHabit =
        await createHabit({
            ...habit,
            userId: user.id
        });

        setHabits((previous) => [
            ...previous,
            createdHabit
        ]);

        return createdHabit;
    }

    async function updateHabit(
        updatedHabit
    )
    {
        console.log("Updating habit:", updatedHabit);
        const savedHabit =
            await editHabit({
                ...updatedHabit,
                userId: user.id
            });

        const savedHabitId =
        getHabitId(updatedHabit);

        setHabits((previous) =>
            previous.map((habit) =>
                getHabitId(habit) === savedHabitId
                    ? updatedHabit
                    : habit
            )
        );

        return savedHabit;
    }

    async function deleteHabit(id)
    {
        await removeHabit(id, user.id);

        setHabits((previous) =>
            previous.filter(
                (habit) =>
                    getHabitId(habit) !== id
            )
        );
    }

    async function toggleHabit(id)
    {
        const today =
            getLocalDateKey();

        const updatedHabit =
            await toggleHabitCompletion(
                id,
                user.id,
                today
            );

        const updatedHabitId =
            getHabitId(updatedHabit);

        setHabits((previous) =>
            previous.map((habit) =>
                getHabitId(habit) ===
                updatedHabitId
                    ? updatedHabit
                    : habit
            )
        );

        return updatedHabit;
    }

    function completedToday(habit)
    {
        const today =
            getLocalDateKey();

        return (
            habit.completions || []
        ).includes(today);
    }

    function getCurrentStreak(
        completions = []
    )
    {
        const completedDates =
            new Set(completions);

        let streak = 0;
        const currentDate =
            new Date();

        while (true)
        {
            const dateKey =
                getLocalDateKey(
                    currentDate
                );

            if (
                !completedDates.has(
                    dateKey
                )
            )
            {
                break;
            }

            streak++;

            currentDate.setDate(
                currentDate.getDate() -
                    1
            );
        }

        return streak;
    }

    function getLongestStreak(
        completions = []
    )
    {
        const dates = [
            ...new Set(completions)
        ].sort();

        if (dates.length === 0)
        {
            return 0;
        }

        let longest = 1;
        let current = 1;

        for (
            let index = 1;
            index < dates.length;
            index++
        )
        {
            const previous =
                new Date(
                    `${dates[index - 1]}T00:00:00`
                );

            const next =
                new Date(
                    `${dates[index]}T00:00:00`
                );

            const difference =
                Math.round(
                    (next - previous) /
                    86400000
                );

            if (difference === 1)
            {
                current++;
                longest = Math.max(
                    longest,
                    current
                );
            }
            else
            {
                current = 1;
            }
        }

        return longest;
    }

    return (
        <HabitContext.Provider
            value={{
                habits,
                loading,
                error,
                loadHabits,
                addHabit,
                updateHabit,
                deleteHabit,
                toggleHabit,
                completedToday,
                getCurrentStreak,
                getLongestStreak
            }}
        >
            {children}
        </HabitContext.Provider>
    );
}

export function useHabits()
{
    const context =
        useContext(HabitContext);

    if (!context)
    {
        throw new Error(
            "useHabits must be used inside HabitProvider."
        );
    }

    return context;
}