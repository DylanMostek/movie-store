import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import { UserContext } from "../Components/Authorize.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { checkAuth } = useContext(UserContext); // Access checkAuth from context

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

      console.log("Sending login request to:", loginUrl, "with body:", { email, password });
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      console.log("Login response status:", response.status);
      console.log("Login response headers:", [...response.headers.entries()]);
      const setCookieHeader = response.headers.get("set-cookie");
      console.log("Set-Cookie header:", setCookieHeader || "None");
      const responseBody = await response.text();
      console.log("Login response body:", responseBody || "Empty");
      if (response.ok) {
        console.log("Login successful, updating auth state");
        await checkAuth(); 
        setError("Login successful!");
        setTimeout(() => navigate("/"), 500);
      } else {
        let errorData;
        try {
          errorData = JSON.parse(responseBody);
        } catch {
          errorData = { message: response.status === 401 ? "Invalid email or password" : "Unknown error" };
        }
        console.log("Login error data:", errorData);
        setError(errorData.message || "Error logging in.");
      }
    } catch (error) {
      console.error("Login request failed:", error);
      setError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="bg-movie-bg-light min-h-screen dark:bg-movie-bg-dark">
      <NavBar />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="shadow-custom w-full max-w-md space-y-6 rounded-xl bg-white p-8 dark:bg-movie-dark-800">
          <h3 className="text-center text-3xl font-bold text-movie-dark dark:text-white">Login</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-movie-light dark:text-movie-light-200">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full rounded-lg bg-gray-100 px-4 py-2 text-movie-dark focus:outline-none focus:ring-2 focus:ring-movie-accent-400 dark:bg-movie-dark dark:text-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-movie-light dark:text-movie-light-200">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="w-full rounded-lg bg-gray-100 px-4 py-2 text-movie-dark focus:outline-none focus:ring-2 focus:ring-movie-accent-400 dark:bg-movie-dark dark:text-white"
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
                className="text-movie-accent-400 h-4 w-4 rounded bg-gray-100 focus:ring-movie-accent-400 dark:bg-movie-dark"
              />
              <label htmlFor="rememberMe" className="ml-2 text-movie-light dark:text-movie-light-200">
                Remember Me
              </label>
            </div>
            <button
              type="submit"
              className="bg-movie-accent-400 w-full rounded-lg py-3 font-semibold text-white transition-colors hover:bg-movie-accent-600"
            >
              Login
            </button>
            <button
              type="button"
              onClick={goToRegister}
              className="border-movie-accent-400 text-movie-accent-400 w-full rounded-lg border-2 bg-transparent py-3 transition-colors hover:bg-movie-accent-400 hover:text-white"
            >
              Don't have an account? Register
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

export default Login;