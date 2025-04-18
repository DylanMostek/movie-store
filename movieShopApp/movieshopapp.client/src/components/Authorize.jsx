import React, { useState, useEffect, createContext } from "react";
import { useLocation, Navigate } from "react-router-dom";

// Create a context to share user information (like email and roles) with other components
export const UserContext = createContext({ email: "", roles: [] });

function AuthorizeView(props) {
    const [isAuthorized, setIsAuthorized] = useState(null); // null = loading; false = not authorized
    const [user, setUser] = useState({ email: "", roles: [] });
    const location = useLocation();

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 10;
        const delay = 1000; 

        function wait(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        async function checkAuthorization(url, options) {
            try {
                const response = await fetch(url, { ...options, credentials: "include" });
                if (response.status === 200) {
                    console.log("User is authorized");
                    const data = await response.json();
                    setUser({ email: data.email || "", roles: data.roles || [] });
                    setIsAuthorized(true);
                } else if (response.status === 401) {
                    console.log("User is not authorized");
                    setIsAuthorized(false);
                } else {
                    throw new Error("Unexpected status: " + response.status);
                }
            } catch (error) {
                retryCount++;
                if (retryCount > maxRetries) {
                    console.error("Max retries reached:", error.message);
                    setIsAuthorized(false);
                } else {
                    await wait(delay);
                    return checkAuthorization(url, options); 
                }
            }
        }

        checkAuthorization("https://localhost:7131/pingauth", { method: "GET" });
    }, []);

    if (isAuthorized === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-movie-dark to-indigo-900 flex items-center justify-center">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    const publicRoutes = ["/", "/login", "/register"];
    const isPublicRoute = publicRoutes.includes(location.pathname);
    const isAdminRoute = location.pathname === "/admin";
    const isAdminUser = user.roles.includes("Admin");

    if (!isPublicRoute && !isAuthorized) {
        return <Navigate to="/login" />;
    }

    if (isAuthorized && isAdminUser && !isPublicRoute && !isAdminRoute) {
        return <Navigate to="/admin" />;
    }

    return (
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    );
}

export function AuthorizedUser(props) {
    const user = React.useContext(UserContext);
    if (props.value === "email") {
        return <span>{user.email}</span>;
    } else if (props.value === "roles") {
        return <span>{user.roles.join(", ")}</span>;
    }
    return null;
}

export default AuthorizeView;