import {
    apiRequest
} from "./apiClient";


const DEV_BYPASS_ENABLED =
    import.meta.env.DEV;


export const DEV_BYPASS_ACCOUNT = {
    email: "dev@example.com",
    password: "Dev12345!"
};


const DEV_BYPASS_USER = {
    id: "development-bypass-user",
    firstName: "Development",
    lastName: "User",
    email: DEV_BYPASS_ACCOUNT.email,
    isVerified: true,
    provider: "development-bypass"
};


function normalizeEmail(email)
{
    return String(email || "")
        .trim()
        .toLowerCase();
}


function isDevelopmentBypass(
    credentials
)
{
    return (
        DEV_BYPASS_ENABLED &&
        normalizeEmail(
            credentials.email
        ) ===
            DEV_BYPASS_ACCOUNT.email &&
        credentials.password ===
            DEV_BYPASS_ACCOUNT.password
    );
}


export async function loginUser(
    credentials
)
{
    /*
     * Development-only login bypass.
     *
     * Works only in development mode.
     */

    if (
        isDevelopmentBypass(
            credentials
        )
    )
    {
        return {
            user: DEV_BYPASS_USER,
            requiresVerification: false
        };
    }


    return apiRequest(
        "/auth/login",
        {
            method: "POST",

            body: {
                email:
                    normalizeEmail(
                        credentials.email
                    ),

                password:
                    credentials.password
            },

            requiresAuthentication:
                false
        }
    );
}


export async function registerUser(
    formData
)
{
    return apiRequest(
        "/auth/register",
        {
            method: "POST",

            body: {
                firstName:
                    formData.firstName.trim(),

                lastName:
                    formData.lastName.trim(),

                email:
                    normalizeEmail(
                        formData.email
                    ),

                password:
                    formData.password
            },

            requiresAuthentication:
                false
        }
    );
}


export async function requestPasswordReset(
    email
)
{
    return apiRequest(
        "/auth/forgot-password",
        {
            method: "POST",

            body: {
                email:
                    normalizeEmail(email)
            },

            requiresAuthentication:
                false
        }
    );
}


export async function resetUserPassword({
    token,
    password
})
{
    return apiRequest(
        "/auth/reset-password",
        {
            method: "POST",

            body: {
                token,
                newPassword: password
            },

            requiresAuthentication:
                false
        }
    );
}


export async function verifyUserEmail(
    token
)
{
    return apiRequest(
        "/auth/verify-email",
        {
            method: "POST",

            body: {
                token
            },

            requiresAuthentication:
                false
        }
    );
}


export async function resendVerificationEmail(
    email
)
{
    return apiRequest(
        "/auth/resend-verification",
        {
            method: "POST",

            body: {
                email:
                    normalizeEmail(email)
            },

            requiresAuthentication:
                false
        }
    );
}


/*
 * Passport Google OAuth login.
 *
 * This does not return a token or user object.
 * Passport handles authentication through
 * the Express session cookie.
 */
export function googleOAuthLogin()
{
    window.location.href =
        "https://tncis4004.xyz/api/auth/google";
}


/*
 * Retrieves the currently authenticated user
 * from the Passport session.
 */
export async function getCurrentUser()
{
    return apiRequest(
        "/auth/me",
        {
            method: "GET",
            requiresAuthentication: true
        }
    );
}


/*
 * Logs the user out through Passport.
 * This clears the Express session.
 */
export async function logoutUser()
{
    return apiRequest(
        "/auth/logout",
        {
            method: "POST",
            requiresAuthentication: true
        }
    );
}