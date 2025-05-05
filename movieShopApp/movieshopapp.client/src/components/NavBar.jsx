import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoutLink from "./LogoutLink.jsx";
import SearchResults from "./SearchResults.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { searchMovies } from "../services/movieServices.js";

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({ email: "", roles: [] });
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const checkAuth = async () => {
        try {
            const response = await fetch("https://localhost:7131/pingauth", {
                method: "GET",
                credentials: "include",
            });
            if (response.status === 200) {
                const data = await response.json();
                setUser({ email: data.email || "", roles: data.roles || [] });
            } else {
                setUser({ email: "", roles: [] });
            }
        } catch (error) {
            console.error("Error checking auth:", error);
            setUser({ email: "", roles: [] });
        }
    };

+    useEffect(() => {
        checkAuth();
    }, [location.pathname]); 

    const isLoggedIn = user && user.email;
    const isAdmin = user?.roles?.includes("Admin");
    const initials = isLoggedIn ? user.email.slice(0, 2).toUpperCase() : "";

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            const results = await searchMovies(searchQuery);
            setSearchResults(results);
        } catch (error) {
            console.error("Error searching:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.trim()) {
            setIsLoading(true);
            try {
                const results = await searchMovies(value);
                setSearchResults(results);
            } catch (error) {
                console.error("Error searching:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const toggleProfileDropdown = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <nav className="bg-movie-dark-900 sticky top-0 z-50 flex items-center justify-between px-6 py-4 text-white shadow-md dark:bg-movie-bg-dark">
            <Link to="/" className="text-movie-accent-400 text-2xl font-bold transition-colors hover:text-movie-accent-600 dark:text-movie-accent">
                MovieShop
            </Link>

            {/* Navigation Links and Search */}
            <div className="flex items-center gap-4 lg:gap-8">
                <div className="hidden items-center gap-6 lg:flex">
                    <Link to="/" className="text-movie-light transition-colors hover:text-movie-accent-400 dark:text-movie-light-100 dark:hover:text-movie-accent-400">
                        Home
                    </Link>
                    <Link to="/movies" className="text-movie-light transition-colors hover:text-movie-accent-400 dark:text-movie-light-100 dark:hover:text-movie-accent-400">
                        Movies
                    </Link>
                    <Link to="/categories" className="text-movie-light transition-colors hover:text-movie-accent-400 dark:text-movie-light-100 dark:hover:text-movie-accent-400">
                        Categories
                    </Link>
                    <Link to="/new-releases" className="text-movie-light transition-colors hover:text-movie-accent-400 dark:text-movie-light-100 dark:hover:text-movie-accent-400">
                        New Releases
                    </Link>
                    <Link to="/offers" className="text-movie-light transition-colors hover:text-movie-accent-400 dark:text-movie-light-100 dark:hover:text-movie-accent-400">
                        Offers
                    </Link>
                    {isLoggedIn && isAdmin && (
                        <Link to="/admin" className="text-movie-light transition-colors hover:text-movie-accent-400 dark:text-movie-light-100 dark:hover:text-movie-accent-400">
                            Admin
                        </Link>
                    )}
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <form onSubmit={handleSearch}>
                        <div className="bg-movie-dark-800 flex w-48 items-center rounded-lg px-3 py-2 dark:bg-movie-dark lg:w-64">
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={handleInputChange}
                                className="w-full bg-transparent text-movie-light focus:outline-none dark:text-white"
                            />
                            <button type="submit" className="text-movie-light hover:text-movie-accent-400 dark:text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </button>
                        </div>
                    </form>
                    <SearchResults results={searchResults} isLoading={isLoading} />
                </div>

                <ThemeToggle />

                {isLoggedIn ? (
                    <div className="relative">
                        {/* Profile Circle */}
                        <button
                            onClick={toggleProfileDropdown}
                            className="bg-movie-accent-400 flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white transition-colors hover:bg-movie-accent-600"
                        >
                            {initials}
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="bg-movie-light-100 shadow-custom animate-fade-in absolute right-0 mt-2 w-48 rounded-lg py-2 dark:bg-movie-dark-800">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-movie-dark transition-colors hover:bg-movie-accent-400 hover:text-white dark:text-movie-light-100"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/settings"
                                    className="block px-4 py-2 text-movie-dark transition-colors hover:bg-movie-accent-400 hover:text-white dark:text-movie-light-100"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    Settings
                                </Link>
                                <Link
                                    to="/cart"
                                    className="block px-4 py-2 text-movie-dark transition-colors hover:bg-movie-accent-400 hover:text-white dark:text-movie-light-100"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    Cart
                                </Link>
                                <LogoutLink
                                    className="block px-4 py-2 text-movie-dark transition-colors hover:bg-movie-accent-400 hover:text-white dark:text-movie-light-100"
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        setUser({ email: "", roles: [] }); // Reset user state on logout
                                        checkAuth(); // Re-check auth after logout
                                    }}
                                >
                                    Logout
                                </LogoutLink>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/register")}
                            className="px-4 py-2 border-2 border-movie-accent-400 text-movie-accent-400 rounded-lg hover:bg-movie-accent-400 hover:text-white transition-colors"
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-4 py-2 bg-movie-accent-400 text-white rounded-lg hover:bg-movie-accent-600 transition-colors"
                        >
                            Log In
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavBar;