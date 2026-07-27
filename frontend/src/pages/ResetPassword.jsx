import React, {
    useState
} from "react";

import {
    Link,
    useNavigate,
    useSearchParams
} from "react-router-dom";

import {
    resetUserPassword
} from "../services/authService";

function ResetPassword()
{
    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const token =
        searchParams.get("token") || "";

    const [formData, setFormData] =
        useState({
            password: "",
            confirmPassword: ""
        });

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    function handleChange(event)
    {
        setFormData((previous) => ({
            ...previous,
            [event.target.name]:
                event.target.value
        }));
    }

    async function handleSubmit(event)
    {
        event.preventDefault();

        setMessage("");
        setError("");

        if (
            formData.password.length < 8
        )
        {
            setError(
                "Password must contain at least 8 characters."
            );

            return;
        }

        if (
            formData.password !==
            formData.confirmPassword
        )
        {
            setError(
                "Password confirmation does not match."
            );

            return;
        }

        setLoading(true);

        try
        {
            const result =
                await resetUserPassword({
                    token,
                    password:
                        formData.password
                });

            setMessage(result.message);

            window.setTimeout(() =>
            {
                navigate("/login");
            }, 1200);
        }
        catch (requestError)
        {
            setError(
                requestError.message ||
                "Unable to reset the password."
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
                        Secure your account
                    </p>

                    <h1>Choose New Password</h1>

                    <p>
                        Enter a new password for your
                        account.
                    </p>
                </div>

                {!token ? (
                    <div className="form-message error">
                        This reset link is missing its
                        token.

                        <Link to="/forgot-password">
                            Request another link
                        </Link>
                    </div>
                ) : (
                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-field">
                            <label htmlFor="new-password">
                                New password
                            </label>

                            <input
                                id="new-password"
                                name="password"
                                type="password"
                                value={
                                    formData.password
                                }
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="new-password-confirmation">
                                Confirm password
                            </label>

                            <input
                                id="new-password-confirmation"
                                name="confirmPassword"
                                type="password"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={handleChange}
                                autoComplete="new-password"
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
                                ? "Resetting..."
                                : "Reset Password"}
                        </button>
                    </form>
                )}
            </section>
        </main>
    );
}

export default ResetPassword;