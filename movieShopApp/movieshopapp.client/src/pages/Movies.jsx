import NavBar from "../Components/NavBar.jsx";
import MovieList from "../Components/MovieList.jsx";

function Movies() {
    return (
        <div className="min-h-screen bg-movie-bg-light dark:bg-movie-bg-dark">
            <NavBar />
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-movie-dark dark:text-white mb-6">All Movies</h1>
                <MovieList />
            </div>
        </div>
    );
}

export default Movies;