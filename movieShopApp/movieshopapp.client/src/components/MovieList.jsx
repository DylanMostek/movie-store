import { useEffect, useState } from "react";
import { getAllMovies } from "../services/movieServices.js";

function MovieList() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        console.log("Fetching movies...");
        getAllMovies()
            .then((data) => {
                console.log("Movies fetched:", data);
                data.forEach((movie) => {
                    console.log(`Movie: ${movie.title}, ImageUrl: ${movie.imageUrl}`);
                });
                setMovies(data);
            })
            .catch((error) => console.error("Error fetching movies:", error));
    }, []);

    return (
        <div className="bg-movie-bg-light mx-auto max-w-7xl px-4 py-7 dark:bg-movie-bg-dark">
            <h2 className="mb-8 text-center text-3xl font-bold text-movie-dark dark:text-white">
                Featured Movies
            </h2>
            {movies.length === 0 ? (
                <p className="text-center text-movie-light dark:text-movie-light-200">No movies available.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="shadow-custom flex flex-col rounded-lg bg-white transition-transform hover:shadow-lg hover:-translate-y-1 dark:bg-movie-dark-800"
                        >
                            <div className="h-98 w-full overflow-hidden rounded-t-lg p-2">
                                <img
                                    src={movie.imageUrl} 
                                    alt={movie.title}
                                    className="h-full w-full object-cover" 
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-4">
                                <h3 className="mb-2 text-xl font-semibold text-movie-dark dark:text-white">
                                    {movie.title}
                                </h3>
                                <p className="line-clamp-3 flex-1 text-movie-light dark:text-movie-light-200">
                                    {movie.overview}
                                </p>
                                <p className="text-movie-light-300 align-center mb-5 mt-2 font-bold dark:text-movie-light-100">
                                    {movie.genre}
                                </p>
                                <button className="bg-movie-accent-400 mt-auto rounded-full px-4 py-2 text-white transition-colors hover:bg-movie-accent-600">
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