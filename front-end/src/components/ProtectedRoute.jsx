import React from "react";

import {
    Navigate,
    Outlet,
    useLocation
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";


function ProtectedRoute()
{
    const {
        isAuthenticated,
        checkingSession
    } = useAuth();


    const location =
        useLocation();


    if (checkingSession)
    {
        return (
            <main
                className="route-loading"
                role="status"
                aria-live="polite"
            >
                <div
                    className="route-loading-spinner"
                    aria-hidden="true"
                />

                <p>
                    Checking authentication...
                </p>
            </main>
        );
    }


    if (!isAuthenticated)
    {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from:
                        location.pathname
                }}
            />
        );
    }


    return <Outlet />;
}


export default ProtectedRoute;
