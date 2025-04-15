import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
            });

            if (response.ok) {
                setError("Registration successful!");
                navigate("/login"); 
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
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full space-y-6">
                    <h3 className="text-3xl font-bold text-white text-center">Register</h3>
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
                        <div>
                            <label htmlFor="confirmPassword" className="block text-movie-light mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-movie-accent"
                                placeholder="Confirm your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-movie-accent text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-300"
                        >
                            Register
                        </button>
                        <button
                            type="button"
                            onClick={goToLogin}
                            className="w-full py-3 bg-transparent border-2 border-movie-accent text-movie-accent rounded-lg hover:bg-movie-accent hover:text-white transition duration-300"
                        >
                            Already have an account? Login
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

export default Register;