```javascript
import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    loginUser,
    registerUser,
    googleOAuthLogin,
    getCurrentUser,
    logoutUser
} from "../services/authService";


const AuthContext =
    createContext(null);


export function AuthProvider({
    children
})
{
    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    /*
     * Check whether a Passport session
     * already exists when the app loads.
     */
    useEffect(() =>
    {
        async function loadCurrentUser()
        {
            try
            {
                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);
            }
            catch(error)
            {
                setUser(null);
            }
            finally
            {
                setLoading(false);
            }
        }


        loadCurrentUser();

    }, []);



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


            setUser(
                result.user
            );


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



    /*
     * Passport Google OAuth.
     *
     * This redirects the browser
     * to the backend.
     *
     * Authentication completion happens
     * through the Passport callback route.
     */
    function loginWithGoogle()
    {
        googleOAuthLogin();
    }



    /*
     * Refresh the user after OAuth redirect
     * or any authentication change.
     */
    async function refreshUser()
    {
        try
        {
            const currentUser =
                await getCurrentUser();

            setUser(currentUser);

            return currentUser;
        }
        catch(error)
        {
            setUser(null);
            return null;
        }
    }



    async function logout()
    {
        try
        {
            await logoutUser();
        }
        finally
        {
            setUser(null);
        }
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


            return {
                ...previousUser,
                ...changes
            };
        });
    }



    function markEmailVerified()
    {
        updateAuthenticatedUser({
            emailVerified: true
        });
    }



    return (
        <AuthContext.Provider
            value={{
                user,

                loading,

                isAuthenticated:
                    Boolean(user),

                login,

                register,

                loginWithGoogle,

                logout,

                refreshUser,

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
```
