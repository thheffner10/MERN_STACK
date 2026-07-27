import React, {
    lazy,
    Suspense
} from "react";

import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import { useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Dashboard = lazy(
    () => import("./pages/Dashboard")
);

const Habits = lazy(
    () => import("./pages/Habits")
);

const Tasks = lazy(
    () => import("./pages/Tasks")
);

const CalendarPage = lazy(
    () => import("./pages/CalendarPage")
);

const Statistics = lazy(
    () => import("./pages/Statistics")
);

const Settings = lazy(
    () => import("./pages/Settings")
);

function PublicLayout()
{
    return (
        <>
            <Navbar />

            <Outlet />

            <Footer />
        </>
    );
}

function DashboardRedirect()
{
    const {
        isAuthenticated
    } = useAuth();

    return (
        <Navigate
            to={
                isAuthenticated
                    ? "/dashboard"
                    : "/login"
            }
            replace
        />
    );
}

function RouteLoading()
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

            <p>Loading page...</p>
        </main>
    );
}

function Router()
{
    return (
        <BrowserRouter>
            <Suspense fallback={<RouteLoading />}>
                <Routes>
                    <Route
                        element={<PublicLayout />}
                    >
                        <Route
                            path="/"
                            element={<Landing />}
                        />

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                        <Route
                            path="/forgot-password"
                            element={
                                <ForgotPassword />
                            }
                        />

                        <Route
                            path="/reset-password"
                            element={
                                <ResetPassword />
                            }
                        />

                        <Route
                            path="/verify-email"
                            element={
                                <VerifyEmail />
                            }
                        />
                    </Route>

                    <Route
                        element={<ProtectedRoute />}
                    >
                        <Route
                            element={
                                <DashboardLayout />
                            }
                        >
                            <Route
                                path="/dashboard"
                                element={
                                    <Dashboard />
                                }
                            />

                            <Route
                                path="/habits"
                                element={
                                    <Habits />
                                }
                            />

                            <Route
                                path="/tasks"
                                element={
                                    <Tasks />
                                }
                            />

                            <Route
                                path="/calendar"
                                element={
                                    <CalendarPage />
                                }
                            />

                            <Route
                                path="/statistics"
                                element={
                                    <Statistics />
                                }
                            />

                            <Route
                                path="/settings"
                                element={
                                    <Settings />
                                }
                            />
                        </Route>
                    </Route>

                    <Route
                        path="/app"
                        element={
                            <DashboardRedirect />
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />
                        }
                    />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default Router;