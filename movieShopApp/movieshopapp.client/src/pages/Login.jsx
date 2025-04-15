import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value, checked } = event.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "rememberMe") setRememberMe(checked);
    };
    const goToRegister = () => {
        navigate("/register");
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            const loginUrl = rememberMe
                ? "https://localhost:7131/login?useCookies=true"
                : "https://localhost:7131/login?useSessionCookies=true";

            const response = await fetch(loginUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (response.ok) {
                setError("Login successful!");
                navigate("/"); 
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error logging in.");
            }
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-movie-dark to-indigo-900">
            <NavBar />
            <div className="flex items-center justify-center px-4 py-16">
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full space-y-6">
                    <h3 className="text-3xl font-bold text-white text-center">Login</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-movie-light mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-movie-accent"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-movie-light mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-movie-accent"
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 text-movie-accent focus:ring-movie-accent bg-gray-700 rounded"
                            />
                            <label htmlFor="rememberMe" className="ml-2 text-movie-light">
                                Remember Me
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-movie-accent text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-300"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={goToRegister}
                            className="w-full py-3 bg-transparent border-2 border-movie-accent text-movie-accent rounded-lg hover:bg-movie-accent hover:text-white transition duration-300"
                        >
                            Dont have an account? Register
                        </button>
                    </form>
                    {error && (
                        <p
                            className={`text-center ${error.includes("successful") ? "text-green-400" : "text-red-400"
                                }`}
                        >
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;