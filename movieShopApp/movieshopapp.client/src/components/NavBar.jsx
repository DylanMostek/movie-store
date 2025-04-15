import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Components/Authorize.jsx";
import LogoutLink from "../Components/LogoutLink.jsx";

function NavBar() {
    const navigate = useNavigate();
    const user = useContext(UserContext);

    const isLoggedIn = user && user.email;
    const isAdmin = user?.roles?.includes("Admin");

    return (
        <nav className="bg-movie-dark text-white py-4 px-6 flex justify-between items-center shadow-md">
            <div>
                {isLoggedIn ? (
                    <span className="text-2xl font-bold text-movie-accent">
                        {isAdmin ? "Admin" : user.email}
                    </span>
                ) : (
                    <Link to="/" className="text-2xl font-bold font-cursive">
                        Movie Site
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-6">
                <Link to="/" className="text-movie-light hover:text-movie-accent transition duration-300">
                    Home
                </Link>
                <Link to="/movies" className="text-movie-light hover:text-movie-accent transition duration-300">
                    Movies
                </Link>
                <Link to="/popular" className="text-movie-light hover:text-movie-accent transition duration-300">
                    Popular
                </Link>
                <Link to="/new-releases" className="text-movie-light hover:text-movie-accent transition duration-300">
                    New Releases
                </Link>
                <Link to="/offers" className="text-movie-light hover:text-movie-accent transition duration-300">
                    Offers
                </Link>
                {/* Show Admin link if the user is an admin , TODO does not work for some reason*/}
                {isLoggedIn && isAdmin && (
                    <Link to="/admin" className="text-movie-light hover:text-movie-accent transition duration-300">
                        Admin
                    </Link>
                )}

                {isLoggedIn ? (
                    <LogoutLink className="text-movie-accent hover:text-yellow-600 transition duration-300">
                        Logout
                    </LogoutLink>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/register")}
                            className="px-4 py-2 border-2 border-movie-accent text-movie-accent rounded-lg hover:bg-movie-accent hover:text-white transition duration-300"
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-4 py-2 bg-movie-accent text-white rounded-lg hover:bg-yellow-600 transition duration-300"
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