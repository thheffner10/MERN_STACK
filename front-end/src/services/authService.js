import { apiRequest } from "./apiClient";

function normalizeEmail(email)
{
    return String(email || "")
        .trim()
        .toLowerCase();
}

export async function loginUser(credentials)
{
    return apiRequest(
        "/auth/login",
        {
            method: "POST",

            body: {
                email: normalizeEmail(
                    credentials.email
                ),

                password:
                    credentials.password
            },

            requiresAuthentication: false
        }
    );
}

export async function registerUser(formData)
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

                email: normalizeEmail(
                    formData.email
                ),

                password:
                    formData.password
            },

            requiresAuthentication: false
        }
    );
}

export async function requestPasswordReset(email)
{
    return apiRequest(
        "/auth/forgot-password",
        {
            method: "POST",

            body: {
                email:
                    normalizeEmail(email)
            },

            requiresAuthentication: false
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

            requiresAuthentication: false
        }
    );
}

export async function verifyUserEmail(token)
{
    return apiRequest(
        "/auth/verify-email",
        {
            method: "POST",

            body: {
                token
            },

            requiresAuthentication: false
        }
    );
}

export async function resendVerificationEmail(email)
{
    return apiRequest(
        "/auth/resend-verification",
        {
            method: "POST",

            body: {
                email:
                    normalizeEmail(email)
            },

            requiresAuthentication: false
        }
    );
}

export async function googleOAuthLogin(credential)
{
    return apiRequest(
        "/auth/google",
        {
            method: "POST",

            body: {
                credential
            },

            requiresAuthentication: false
        }
    );
}

export async function getCurrentUser()
{
    return apiRequest("/auth/me");
}