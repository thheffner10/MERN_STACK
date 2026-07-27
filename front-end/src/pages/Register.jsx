import React, {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import OAuthButton
    from "../components/OAuthButton";

import {
    useAuth
} from "../context/AuthContext";

function Register()
{
    const navigate =
        useNavigate();

    const {
        register,
        loading
    } = useAuth();

    const [formData, setFormData] =
        useState({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        });

    const [error, setError] =
        useState("");

    function handleChange(event)
    {
        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    function validateForm()
    {
        if (
            formData.password.length < 8
        )
        {
            return (
                "Password must contain at least " +
                "8 characters."
            );
        }

        if (
            formData.password !==
            formData.confirmPassword
        )
        {
            return (
                "Password confirmation does not match."
            );
        }

        return "";
    }

    async function handleSubmit(event)
    {
        event.preventDefault();

        setError("");

        const validationError =
            validateForm();

        if (validationError)
        {
            setError(validationError);
            return;
        }

        try
        {
            await register(formData);

            navigate(
                "/verify-email",
                {
                    state: {
                        email:
                            formData.email
                                .trim()
                                .toLowerCase()
                    }
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
                    "Unable to connect to the registration server. The backend API may not be running."
                );
            }
            else
            {
                setError(
                    requestError.message ||
                    "Unable to create the account."
                );
            }
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-container auth-container-wide">
                <div className="auth-heading">
                    <p className="page-eyebrow">
                        Get started
                    </p>

                    <h1>Create Account</h1>

                    <p>
                        Create your account and begin
                        building consistent routines.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="first-name">
                                First name
                            </label>

                            <input
                                id="first-name"
                                name="firstName"
                                value={
                                    formData.firstName
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="given-name"
                                placeholder="John"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="last-name">
                                Last name
                            </label>

                            <input
                                id="last-name"
                                name="lastName"
                                value={
                                    formData.lastName
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="family-name"
                                placeholder="Johnathon"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="register-email">
                            Email address
                        </label>

                        <input
                            id="register-email"
                            name="email"
                            type="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="register-password">
                                Password
                            </label>

                            <input
                                id="register-password"
                                name="password"
                                type="password"
                                value={
                                    formData.password
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="new-password"
                                placeholder="Create a password"
                                required
                            />

                            <small>
                                Use at least 8 characters.
                            </small>
                        </div>

                        <div className="form-field">
                            <label htmlFor="confirm-password">
                                Confirm password
                            </label>

                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="new-password"
                                placeholder="Repeat your password"
                                required
                            />
                        </div>
                    </div>

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
                            ? "Creating account..."
                            : "Create Account"}
                    </button>
                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <OAuthButton mode="register" />

                <p className="auth-footer-text">
                    Already have an account?

                    <Link to="/login">
                        Log in
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default Register;