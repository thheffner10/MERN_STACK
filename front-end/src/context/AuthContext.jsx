import React, {
    createContext,
    useContext,
    useMemo,
    useState
} from "react";

import {
    googleOAuthLogin,
    loginUser,
    registerUser
} from "../services/authService";

const AuthContext =
    createContext(null);

const LOCAL_AUTH_STORAGE_KEY =
    "habit-tracker-auth";

const SESSION_AUTH_STORAGE_KEY =
    "habit-tracker-session-auth";

function parseStoredAuthentication(
    value
)
{
    if (!value)
    {
        return {
            user: null,
            token: null
        };
    }

    try
    {
        const parsed =
            JSON.parse(value);

        return {
            user:
                parsed.user || null,

            token:
                parsed.token || null
        };
    }
    catch
    {
        return {
            user: null,
            token: null
        };
    }
}

function readStoredAuthentication()
{
    const localValue =
        localStorage.getItem(
            LOCAL_AUTH_STORAGE_KEY
        );

    if (localValue)
    {
        return {
            ...parseStoredAuthentication(
                localValue
            ),

            rememberMe: true
        };
    }

    const sessionValue =
        sessionStorage.getItem(
            SESSION_AUTH_STORAGE_KEY
        );

    return {
        ...parseStoredAuthentication(
            sessionValue
        ),

        rememberMe: false
    };
}

function clearAuthenticationStorage()
{
    localStorage.removeItem(
        LOCAL_AUTH_STORAGE_KEY
    );

    sessionStorage.removeItem(
        SESSION_AUTH_STORAGE_KEY
    );
}

function saveAuthentication({
    user,
    token,
    rememberMe
})
{
    clearAuthenticationStorage();

    const storage =
        rememberMe
            ? localStorage
            : sessionStorage;

    const storageKey =
        rememberMe
            ? LOCAL_AUTH_STORAGE_KEY
            : SESSION_AUTH_STORAGE_KEY;

    storage.setItem(
        storageKey,
        JSON.stringify({
            user,
            token
        })
    );
}

export function AuthProvider({
    children
})
{
    const initialAuthentication =
        useMemo(
            () =>
                readStoredAuthentication(),
            []
        );

    const [user, setUser] =
        useState(
            initialAuthentication.user
        );

    const [token, setToken] =
        useState(
            initialAuthentication.token
        );

    const [
        rememberMe,
        setRememberMe
    ] = useState(
        initialAuthentication.rememberMe
    );

    const [loading, setLoading] =
        useState(false);

    async function login(credentials)
    {
        setLoading(true);

        try
        {
            const result =
                await loginUser(
                    credentials
                );

            if (
                result.requiresVerification
            )
            {
                return result;
            }

            const nextUser =
                result.user;

            const nextToken =
                result.token;

            const shouldRemember =
                Boolean(
                    credentials.rememberMe
                );

            setUser(nextUser);
            setToken(nextToken);
            setRememberMe(
                shouldRemember
            );

            saveAuthentication({
                user: nextUser,
                token: nextToken,
                rememberMe:
                    shouldRemember
            });

            return result;
        }
        finally
        {
            setLoading(false);
        }
    }

    async function register(formData)
    {
        setLoading(true);

        try
        {
            return await registerUser(
                formData
            );
        }
        finally
        {
            setLoading(false);
        }
    }

function loginWithGoogle()
{
    googleOAuthLogin();
}
    function updateAuthenticatedUser(
        changes
    )
    {
        setUser((previousUser) =>
        {
            if (!previousUser)
            {
                return null;
            }

            const updatedUser = {
                ...previousUser,
                ...changes
            };

            if (token)
            {
                saveAuthentication({
                    user: updatedUser,
                    token,
                    rememberMe
                });
            }

            return updatedUser;
        });
    }

    function markEmailVerified()
    {
        updateAuthenticatedUser({
            emailVerified: true
        });
    }

    function logout()
    {
        clearAuthenticationStorage();

        setUser(null);
        setToken(null);
        setRememberMe(false);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,

isAuthenticated:
    Boolean(user),

                login,
                register,
                loginWithGoogle,
                logout,
                updateAuthenticatedUser,
                markEmailVerified
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth()
{
    const context =
        useContext(AuthContext);

    if (!context)
    {
        throw new Error(
            "useAuth must be used inside AuthProvider."
        );
    }

    return context;
}
