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

    async function handleGoogleLogin()
    {
        setLoading(true);
        setError("");

        try
        {
            /*
             * The completed Google Identity
             * Services integration will pass
             * Google's credential token here.
             */
            await loginWithGoogle();

            const destination =
                location.state?.from ||
                "/dashboard";

            navigate(
                destination,
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
                    "Unable to connect to the authentication server."
                );
            }
            else
            {
                setError(
                    requestError.message ||
                    "Google authentication failed."
                );
            }
        }
        finally
        {
            setLoading(false);
        }
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