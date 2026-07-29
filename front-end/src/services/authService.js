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
    emailVerified: true,
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
     * This bypass works only while running:
     *
     * npm run dev
     *
     * Vite sets import.meta.env.DEV to false
     * in production builds.
     */
    if (
        isDevelopmentBypass(
            credentials
        )
    )
    {
        return {
            user: DEV_BYPASS_USER,
            token:
                "development-bypass-token",
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
                    formData.firstName
                        .trim(),

                lastName:
                    formData.lastName
                        .trim(),

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
                password
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

export function googleOAuthLogin()
{
    window.location.href =
        "https://tncis4004.xyz/auth/google";
}

export async function getCurrentUser()
{
    return apiRequest(
        "/auth/me"
    );
}
