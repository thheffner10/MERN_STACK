import React, {
    useState
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import OAuthButton
    from "../components/OAuthButton";

import {
    useAuth
} from "../context/AuthContext";

function Login()
{
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        login,
        loading
    } = useAuth();

    const [formData, setFormData] =
        useState({
            email: "",
            password: "",
            rememberMe: false
        });

    const [error, setError] =
        useState("");

    function handleChange(event)
    {
        const {
            name,
            value,
            checked,
            type
        } = event.target;

        setFormData((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    }

    async function handleSubmit(event)
    {
        event.preventDefault();

        setError("");

        try
        {
            const result =
                await login(formData);

            if (
                result.requiresVerification
            )
            {
                navigate(
                    "/verify-email",
                    {
                        state: {
                            email:
                                result.user.email
                        }
                    }
                );

                return;
            }

            navigate(
                location.state?.from ||
                    "/dashboard",
                {
                    replace: true
                }
            );
        }
        catch (requestError)
        {
            if (
                requestError.message ===
                "Failed to fetch"
            )
            {
                setError(
                    "Unable to connect to the authentication server. The backend API may not be running."
                );
            }
            else
            {
                setError(
                    requestError.message ||
                    "Unable to log in."
                );
            }
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-container">
                <div className="auth-heading">
                    <p className="page-eyebrow">
                        Welcome back
                    </p>

                    <h1>Log In</h1>

                    <p>
                        Continue tracking your habits,
                        tasks, and progress.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-field">
                        <label htmlFor="login-email">
                            Email address
                        </label>

                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <div className="field-heading">
                            <label htmlFor="login-password">
                                Password
                            </label>

                            <Link to="/forgot-password">
                                Forgot password?
                            </Link>
                        </div>

                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <label className="checkbox-field">
                        <input
                            name="rememberMe"
                            type="checkbox"
                            checked={
                                formData.rememberMe
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <span>
                            Keep me signed in
                        </span>
                    </label>

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
                            ? "Logging in..."
                            : "Log In"}
                    </button>
                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <OAuthButton mode="login" />

                <p className="auth-footer-text">
                    Don’t have an account?

                    <Link to="/register">
                        Create one
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default Login;