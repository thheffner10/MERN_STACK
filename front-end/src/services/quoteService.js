const QUOTE_API_URL =
    "https://dummyjson.com/quotes/random";

const FALLBACK_QUOTE = {
    quote:
        "Small steps, repeated consistently, create meaningful progress.",
    author: "Habit Tracker"
};

export async function getRandomQuote(signal)
{
    try
    {
        const response = await fetch(
            QUOTE_API_URL,
            {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                signal
            }
        );

        if (!response.ok)
        {
            throw new Error(
                `Quote request failed with status ${response.status}.`
            );
        }

        const data = await response.json();

        if (
            typeof data.quote !== "string" ||
            typeof data.author !== "string"
        )
        {
            throw new Error(
                "The quote API returned an unexpected response."
            );
        }

        return {
            quote: data.quote,
            author: data.author
        };
    }
    catch (error)
    {
        if (error.name === "AbortError")
        {
            throw error;
        }

        console.error(
            "Unable to load quote:",
            error
        );

        return FALLBACK_QUOTE;
    }
}