import React, {
    useEffect,
    useState
} from "react";

import {
    Link,
    useLocation,
    useSearchParams
} from "react-router-dom";

import {
    resendVerificationEmail,
    verifyUserEmail
} from "../services/authService";

function VerifyEmail()
{
    const location = useLocation();

    const [searchParams] =
        useSearchParams();

    const token =
        searchParams.get("token");

    const email =
        location.state?.email || "";

    const [status, setStatus] =
        useState(
            token
                ? "verifying"
                : "waiting"
        );

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [resending, setResending] =
        useState(false);

    useEffect(() =>
    {
        if (!token)
        {
            return;
        }

        let active = true;

        async function verify()
        {
            try
            {
                const result =
                    await verifyUserEmail(
                        token
                    );

                if (active)
                {
                    setMessage(
                        result.message
                    );

                    setStatus("verified");
                }
            }
            catch (requestError)
            {
                if (active)
                {
                    setError(
                        requestError.message
                    );

                    setStatus("error");
                }
            }
        }

        verify();

        return () =>
        {
            active = false;
        };
    }, [token]);

    async function handleResend()
    {
        setResending(true);
        setError("");
        setMessage("");

        try
        {
            const result =
                await resendVerificationEmail(
                    email ||
                    "demo@example.com"
                );

            setMessage(result.message);
        }
        catch (requestError)
        {
            setError(
                requestError.message ||
                "Unable to resend verification."
            );
        }
        finally
        {
            setResending(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-container">
                <div className="verification-icon">
                    {status === "verified"
                        ? "✓"
                        : "✉"}
                </div>

                <div className="auth-heading">
                    <p className="page-eyebrow">
                        Email verification
                    </p>

                    <h1>
                        {status === "verified"
                            ? "Email Verified"
                            : "Check Your Email"}
                    </h1>

                    <p>
                        {status === "verifying" &&
                            "We are verifying your email address."}

                        {status === "waiting" &&
                            `A verification message was sent${
                                email
                                    ? ` to ${email}`
                                    : ""
                            }.`}

                        {status === "verified" &&
                            "Your account is ready to use."}

                        {status === "error" &&
                            "The verification link could not be completed."}
                    </p>
                </div>

                {status === "verifying" && (
                    <p
                        className="form-message info"
                        role="status"
                    >
                        Verifying email...
                    </p>
                )}

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

                {status === "waiting" && (
                    <>
                        <button
                            type="button"
                            className="auth-submit-button"
                            onClick={handleResend}
                            disabled={resending}
                        >
                            {resending
                                ? "Sending..."
                                : "Resend Verification"}
                        </button>

                        <Link
                            className="demo-action-link"
                            to="/verify-email?token=demo-verification-token"
                        >
                            Open demo verification link
                        </Link>
                    </>
                )}

                <p className="auth-footer-text">
                    <Link to="/login">
                        Return to login
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default VerifyEmail;
