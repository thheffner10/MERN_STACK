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
    const location =
        useLocation();

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
                        result.message ||
                        "Your email has been verified."
                    );

                    setStatus("verified");
                }
            }
            catch (requestError)
            {
                if (active)
                {
                    setError(
                        requestError.message ||
                        "The verification link is invalid or expired."
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
        if (!email)
        {
            setError(
                "No email address was provided. Return to login or registration and try again."
            );

            return;
        }

        setResending(true);
        setError("");
        setMessage("");

        try
        {
            const result =
                await resendVerificationEmail(
                    email
                );

            setMessage(
                result.message ||
                "A new verification email has been sent."
            );
        }
        catch (requestError)
        {
            setError(
                requestError.message ||
                "Unable to resend the verification email."
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
                <div
                    className="verification-icon"
                    aria-hidden="true"
                >
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
                            : status === "error"
                                ? "Verification Failed"
                                : "Check Your Email"}
                    </h1>

                    <p>
                        {status === "verifying" &&
                            "We are verifying your email address."}

                        {status === "waiting" &&
                            (
                                email
                                    ? `A verification message was sent to ${email}.`
                                    : "Open the verification link sent to your email address."
                            )}

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
                    <button
                        type="button"
                        className="auth-submit-button"
                        onClick={handleResend}
                        disabled={
                            resending ||
                            !email
                        }
                    >
                        {resending
                            ? "Sending..."
                            : "Resend Verification"}
                    </button>
                )}

                {status === "error" && email && (
                    <button
                        type="button"
                        className="auth-submit-button"
                        onClick={handleResend}
                        disabled={resending}
                    >
                        {resending
                            ? "Sending..."
                            : "Send a New Verification Link"}
                    </button>
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
