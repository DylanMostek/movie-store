import React, { useState, useEffect, createContext, useCallback } from "react";
import { useLocation, Navigate } from "react-router-dom";

export const UserContext = createContext({
    email: "",
    roles: [],
    checkAuth: () => { }, 
});

function AuthorizeView(props) {
    const [isAuthorized, setIsAuthorized] = useState(null); 
    const [user, setUser] = useState({ email: "", roles: [] });
    const location = useLocation();

    const checkAuthorization = useCallback(async () => {
        let retryCount = 0;
        const maxRetries = 10;
        const delay = 1000;

        function wait(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        try {
            const response = await fetch("https://localhost:7131/pingauth", {
                method: "GET",
                credentials: "include",
            });
            if (response.status === 200) {
                console.log("User is authorized");
                const data = await response.json();
                setUser({ email: data.email || "", roles: data.roles || [] });
                setIsAuthorized(true);
            } else if (response.status === 401) {
                console.log("User is not authorized");
                setUser({ email: "", roles: [] });
                setIsAuthorized(false);
            } else {
                throw new Error("Unexpected status: " + response.status);
            }
        } catch (error) {
            retryCount++;
            if (retryCount > maxRetries) {
                console.error("Max retries reached:", error.message);
                setUser({ email: "", roles: [] });
                setIsAuthorized(false);
            } else {
                await wait(delay);
                return checkAuthorization();
            }
        }
    }, []);

    useEffect(() => {
        checkAuthorization();
    }, [checkAuthorization, location.pathname]); 

    if (isAuthorized === null) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-movie-dark to-indigo-900">
                <p className="text-xl text-white">Loading...</p>
            </div>
        );
    }

    const publicRoutes = ["/", "/movies", "/popular", "/new-releases", "/offers", "/categories", "/login", "/register"];
    const isPublicRoute = publicRoutes.includes(location.pathname);
    if (!isPublicRoute && !isAuthorized) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    const isAdminRoute = location.pathname === "/admin";
    const isAdminUser = user.roles.includes("Admin");
    if (isAdminRoute && !isAdminUser) {
        return <Navigate to="/" />;
    }

    return (
        <UserContext.Provider value={{ ...user, checkAuth: checkAuthorization }}>
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