```javascript
import React from "react";

import {
    FcGoogle
} from "react-icons/fc";

import {
    useAuth
} from "../context/AuthContext";


function OAuthButton({
    mode = "login"
})
{
    const {
        loginWithGoogle,
        loading
    } = useAuth();


    const buttonText =
        mode === "register"
            ? "Sign up with Google"
            : "Sign in with Google";


    function handleGoogleLogin()
    {
        loginWithGoogle();
    }


    return (
        <button
            type="button"
            className="oauth-button"
            onClick={handleGoogleLogin}
            disabled={loading}
        >
            <FcGoogle
                className="oauth-icon"
                size={22}
                aria-hidden="true"
            />

            <span>
                {
                    loading
                        ? "Connecting..."
                        : buttonText
                }
            </span>
        </button>
    );
}


export default OAuthButton;
```
