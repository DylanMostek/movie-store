import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "./Authorize.jsx";
import LogoutLink from "./LogoutLink.jsx";
import SearchResults from "./SearchResults.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { searchMovies } from "../services/movieServices.js";

function NavBar() {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    console.log("NavBar user state:", user);

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
        <nav className="bg-movie-dark-900 dark:bg-movie-bg-dark text-white py-4 px-6 flex items-center justify-between shadow-md sticky top-0 z-50">
            
            <Link to="/" className="text-2xl font-bold text-movie-accent-400 dark:text-movie-accent hover:text-movie-accent-600 transition-colors">
                MovieShop
            </Link>

            {/* Navigation Links and Search */}
            <div className="flex items-center gap-4 lg:gap-8">
                <div className="hidden lg:flex items-center gap-6">
                    <Link to="/" className="text-movie-light dark:text-movie-light-100 hover:text-movie-accent-400 dark:hover:text-movie-accent-400 transition-colors">
                        Home
                    </Link>
                    <Link to="/movies" className="text-movie-light dark:text-movie-light-100 hover:text-movie-accent-400 dark:hover:text-movie-accent-400 transition-colors">
                        Movies
                    </Link>
                    <Link to="/categories" className="text-movie-light dark:text-movie-light-100 hover:text-movie-accent-400 dark:hover:text-movie-accent-400 transition-colors">
                        Categories
                    </Link>
                    <Link to="/new-releases" className="text-movie-light dark:text-movie-light-100 hover:text-movie-accent-400 dark:hover:text-movie-accent-400 transition-colors">
                        New Releases
                    </Link>
                    <Link to="/offers" className="text-movie-light dark:text-movie-light-100 hover:text-movie-accent-400 dark:hover:text-movie-accent-400 transition-colors">
                        Offers
                    </Link>
                    {isLoggedIn && isAdmin && (
                        <Link to="/admin" className="text-movie-light dark:text-movie-light-100 hover:text-movie-accent-400 dark:hover:text-movie-accent-400 transition-colors">
                            Admin
                        </Link>
                    )}
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <form onSubmit={handleSearch}>
                        <div className="flex items-center bg-movie-dark-800 dark:bg-movie-dark rounded-lg px-3 py-2 w-48 lg:w-64">
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={handleInputChange}
                                className="bg-transparent text-movie-light dark:text-white focus:outline-none w-full"
                            />
                            <button type="submit" className="text-movie-light dark:text-white hover:text-movie-accent-400">
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
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-movie-accent-400 text-white font-semibold hover:bg-movie-accent-600 transition-colors"
                        >
                            {initials}
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-movie-light-100 dark:bg-movie-dark-800 rounded-lg shadow-custom py-2 animate-fade-in">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-movie-dark dark:text-movie-light-100 hover:bg-movie-accent-400 hover:text-white transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/settings"
                                    className="block px-4 py-2 text-movie-dark dark:text-movie-light-100 hover:bg-movie-accent-400 hover:text-white transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    Settings
                                </Link>
                                <Link
                                    to="/cart"
                                    className="block px-4 py-2 text-movie-dark dark:text-movie-light-100 hover:bg-movie-accent-400 hover:text-white transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    Cart
                                </Link>
                                <LogoutLink
                                    className="block px-4 py-2 text-movie-dark dark:text-movie-light-100 hover:bg-movie-accent-400 hover:text-white transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
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