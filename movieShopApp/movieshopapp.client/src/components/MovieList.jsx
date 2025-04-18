import { useEffect, useState } from "react";
import { getAllMovies } from "../services/movieServices.js";

function MovieList() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        console.log("Fetching movies...");
        getAllMovies()
            .then((data) => {
                console.log("Movies fetched:", data);
                setMovies(data);
            })
            .catch((error) => console.error("Error fetching movies:", error));
    }, []);

    return (
        <div className="py-8 px-4 bg-movie-bg-light dark:bg-movie-bg-dark max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-movie-dark dark:text-white text-center mb-8">
                Featured Movies
            </h2>
            {movies.length === 0 ? (
                <p className="text-center text-movie-light dark:text-movie-light-200">No movies available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="bg-white dark:bg-movie-dark-800 rounded-lg shadow-custom hover:shadow-lg transition-transform hover:-translate-y-1 flex flex-col"
                        >
                            <div className="w-full h-96 overflow-hidden rounded-t-lg">
                                <img
                                    src={movie.imageUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                    onError={(e) => {
                                        e.target.src = "/default-movie.jpg";
                                    }}
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-xl font-semibold text-movie-dark dark:text-white mb-2">
                                    {movie.title}
                                </h3>
                                <p className="text-movie-light dark:text-movie-light-200 mb-4 line-clamp-3">
                                    {movie.overview}
                                </p>
                                <button className="mt-auto bg-movie-accent-400 text-white py-2 px-4 rounded-full hover:bg-movie-accent-600 transition-colors">
                                    Buy it, NOW!!
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MovieList;