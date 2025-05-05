import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import { UserContext } from "../Components/Authorize.jsx";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { checkAuth } = useContext(UserContext); // Access checkAuth from context

    const goToLogin = () => {
        navigate("/login");
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "confirmPassword") setConfirmPassword(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7131/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (response.ok) {
                setError("Registration successful!");
                await checkAuth(); 
                setTimeout(() => navigate("/"), 500);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error registering.");
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
                <div className="w-full max-w-md space-y-6 rounded-xl bg-gray-800 p-8 shadow-lg">
                    <h3 className="text-center text-3xl font-bold text-white">Register</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-movie-light">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-movie-accent"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="mb-2 block text-movie-light">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-movie-accent"
                                placeholder="Enter your password"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="mb-2 block text-movie-light">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-movie-accent"
                                placeholder="Confirm your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-movie-accent py-3 font-semibold text-white transition duration-300 hover:bg-yellow-600"
                        >
                            Register
                        </button>
                        <button
                            type="button"
                            onClick={goToLogin}
                            className="w-full rounded-lg border-2 border-movie-accent bg-transparent py-3 text-movie-accent transition duration-300 hover:bg-movie-accent hover:text-white"
                        >
                            Already have an account? Login
                        </button>
                    </form>
                    {error && (
                        <p className={`text-center ${error.includes("successful") ? "text-green-400" : "text-red-400"}`}>
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;