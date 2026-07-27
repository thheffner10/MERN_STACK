import React, {
    useState
} from "react";

import { Link } from "react-router-dom";

import {
    requestPasswordReset
} from "../services/authService";

function ForgotPassword()
{
    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    async function handleSubmit(event)
    {
        event.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try
        {
            const result =
                await requestPasswordReset(
                    email
                );

            setMessage(result.message);
        }
        catch (requestError)
        {
            setError(
                requestError.message ||
                "Unable to send the reset link."
            );
        }
        finally
        {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-container">
                <div className="auth-heading">
                    <p className="page-eyebrow">
                        Account recovery
                    </p>

                    <h1>Forgot Password?</h1>

                    <p>
                        Enter your email address and
                        we’ll send you a password
                        reset link.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-field">
                        <label htmlFor="recovery-email">
                            Email address
                        </label>

                        <input
                            id="recovery-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            autoComplete="email"
                            required
                        />
                    </div>

                    {message && (
                        <p
                            className="form-message success"
                            role="status"
                        >
                            {message}
                        </p>
                    )}

                    {error && (
                        <p
                            className="form-message error"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Link"}
                    </button>
                </form>

                {message && (
                    <Link
                        className="demo-action-link"
                        to="/reset-password?token=demo-reset-token"
                    >
                        Open demo reset link
                    </Link>
                )}

                <p className="auth-footer-text">
                    Remembered your password?

                    <Link to="/login">
                        Return to login
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default ForgotPassword;