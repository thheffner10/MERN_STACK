import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import { getRandomQuote } from "../services/quoteService";

import "../styles/quote.css";

function QuoteWidget()
{
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadQuote = useCallback(
        async (signal, isRefresh = false) =>
        {
            if (isRefresh)
            {
                setRefreshing(true);
            }
            else
            {
                setLoading(true);
            }

            setError("");

            try
            {
                const result =
                    await getRandomQuote(signal);

                setQuote(result);
            }
            catch (requestError)
            {
                if (
                    requestError.name !==
                    "AbortError"
                )
                {
                    setError(
                        "The quote could not be loaded."
                    );
                }
            }
            finally
            {
                if (!signal?.aborted)
                {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        },
        []
    );

    useEffect(() =>
    {
        const controller =
            new AbortController();

        loadQuote(controller.signal);

        return () =>
        {
            controller.abort();
        };
    }, [loadQuote]);

    async function handleRefresh()
    {
        const controller =
            new AbortController();

        await loadQuote(
            controller.signal,
            true
        );
    }

    return (
        <section
            className="quote-widget"
            aria-labelledby="quote-widget-title"
        >
            <div className="quote-widget-heading">
                <div>
                    <p className="quote-eyebrow">
                        Daily motivation
                    </p>

                    <h2 id="quote-widget-title">
                        Keep Your Momentum
                    </h2>
                </div>

                <button
                    type="button"
                    className="quote-refresh-button"
                    onClick={handleRefresh}
                    disabled={
                        loading || refreshing
                    }
                    aria-label="Load another motivational quote"
                >
                    {refreshing
                        ? "Loading..."
                        : "New Quote"}
                </button>
            </div>

            {loading ? (
                <div
                    className="quote-loading"
                    role="status"
                >
                    <div
                        className="quote-loading-line quote-loading-long"
                        aria-hidden="true"
                    />

                    <div
                        className="quote-loading-line quote-loading-medium"
                        aria-hidden="true"
                    />

                    <span>
                        Loading motivation...
                    </span>
                </div>
            ) : (
                <figure className="quote-content">
                    <span
                        className="quote-mark"
                        aria-hidden="true"
                    >
                        “
                    </span>

                    <blockquote>
                        {quote?.quote}
                    </blockquote>

                    <figcaption>
                        — {quote?.author}
                    </figcaption>
                </figure>
            )}

            {error && (
                <p
                    className="quote-error"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </section>
    );
}

export default QuoteWidget;