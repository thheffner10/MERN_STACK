import React, {
    useState
} from "react";

import {
    FcGoogle
} from "react-icons/fc";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

function OAuthButton({
    mode = "login"
})
{
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        loginWithGoogle
    } = useAuth();

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const buttonText =
        mode === "register"
            ? "Sign up with Google"
            : "Sign in with Google";

function handleGoogleLogin()
{
    loginWithGoogle();
}
    return (
        <>
            <button
                type="button"
                className="oauth-button"
                onClick={
                    handleGoogleLogin
                }
                disabled={loading}
            >
                <FcGoogle
                    className="oauth-icon"
                    size={22}
                    aria-hidden="true"
                />

                <span>
                    {loading
                        ? "Connecting..."
                        : buttonText}
                </span>
            </button>

            {error && (
                <p
                    className="form-message error oauth-error"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </>
    );
}

export default OAuthButton;
