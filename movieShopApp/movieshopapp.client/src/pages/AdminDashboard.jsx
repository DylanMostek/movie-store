import { useState, useEffect } from "react";
import { AuthorizedUser } from "../Components/Authorize.jsx";
import NavBar from "../Components/NavBar.jsx";

function AdminDashboard() {
    const [movie, setMovie] = useState({
        id: null, 
        title: "",
        overview: "",
        imageUrl: "",
        genre: [],
        rating: 0,
        dateReleased: "",
        duration: 0,
        rentPrice: 0,
        buyPrice: 0,
        trailerUrl: "",
        director: [],
        actor: [],
        language: [],
    });
    const [currentInput, setCurrentInput] = useState({
        genre: "",
        director: "",
        actor: "",
        language: "",
    });
    const [movies, setMovies] = useState([]); // State to store every movies
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false); // Track if editing movie

    // Fetch all movies
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch("https://localhost:7131/api/movies", {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setMovies(data);
                } else {
                    setError("Failed to fetch movies.");
                }
            } catch (err) {
                setError("An error occurred while fetching movies.");
                console.error(err);
            }
        };
        fetchMovies();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovie((prev) => ({
            ...prev,
            [name]: value,
        }));
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleTagInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddTag = (field, e) => {
        if (e.key === "Enter" && currentInput[field].trim()) {
            e.preventDefault();
            setMovie((prev) => ({
                ...prev,
                [field]: [...prev[field], currentInput[field].trim()],
            }));
            setCurrentInput((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const handleRemoveTag = (field, index) => {
        setMovie((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!movie.title.trim()) errors.title = "Title is required.";
        if (!movie.overview.trim()) errors.overview = "Overview is required.";
        if (!movie.dateReleased) errors.dateReleased = "Release Date is required.";
        if (movie.rating < 1 || movie.rating > 5) errors.rating = "Rating must be between 1 and 5.";
        if (movie.duration <= 0) errors.duration = "Duration must be greater than 0.";
        if (movie.rentPrice < 0) errors.rentPrice = "Rent Price must be non-negative.";
        if (movie.buyPrice < 0) errors.buyPrice = "Buy Price must be non-negative.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            setError("Please fix the errors in the form.");
            return;
        }

        // excluding id cause it will be handled by the db
        const { id, ...movieDataWithoutId } = movie; 
        const movieData = {
            ...(isEditing ? { id } : movieDataWithoutId), // Include id only when editing
            dateReleased: movie.dateReleased ? new Date(movie.dateReleased).toISOString().split("T")[0] : "",
            rating: parseInt(movie.rating) || 0,
            duration: parseInt(movie.duration) || 0,
            rentPrice: parseFloat(movie.rentPrice) || 0,
            buyPrice: parseFloat(movie.buyPrice) || 0,
            genre: movie.genre.join(", "),
            director: movie.director.join(", "),
            actor: movie.actor.join(", "),
            language: movie.language.join(", "),
        };

        try {
            const url = isEditing
                ? `https://localhost:7131/api/movies/${movie.id}`
                : "https://localhost:7131/api/movies";
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(movieData),
            });

            if (response.ok) {
                const updatedMovie = await response.json();
                if (isEditing) {
                    setMessage("Movie updated successfully!");
                    setMovies((prev) =>
                        prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m))
                    );
                } else {
                    setMessage("Movie added successfully!");
                    setMovies((prev) => [...prev, updatedMovie]);
                }
                setMovie({
                    id: null,
                    title: "",
                    overview: "",
                    imageUrl: "",
                    genre: [],
                    rating: 0,
                    dateReleased: "",
                    duration: 0,
                    rentPrice: 0,
                    buyPrice: 0,
                    trailerUrl: "",
                    director: [],
                    actor: [],
                    language: [],
                });
                setCurrentInput({
                    genre: "",
                    director: "",
                    actor: "",
                    language: "",
                });
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                setError(errorData.message || `Failed to ${isEditing ? "update" : "add"} movie.`);
            }
        } catch (err) {
            setError(`An error occurred while ${isEditing ? "updating" : "adding"} the movie.`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (movieToEdit) => {
        setMovie({
            ...movieToEdit,
            genre: movieToEdit.genre ? movieToEdit.genre.split(", ").filter(g => g.trim()) : [],
            director: movieToEdit.director ? movieToEdit.director.split(", ").filter(d => d.trim()) : [],
            actor: movieToEdit.actor ? movieToEdit.actor.split(", ").filter(a => a.trim()) : [],
            language: movieToEdit.language ? movieToEdit.language.split(", ").filter(l => l.trim()) : [],
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" }); 
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;

        try {
            const response = await fetch(`https://localhost:7131/api/movies/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                setMovies((prev) => prev.filter((m) => m.id !== id));
                setMessage("Movie deleted successfully!");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to delete movie.");
            }
        } catch (err) {
            setError("An error occurred while deleting the movie.");
            console.error(err);
        }
    };

    const handleCancelEdit = () => {
        setMovie({
            id: null,
            title: "",
            overview: "",
            imageUrl: "",
            genre: [],
            rating: 0,
            dateReleased: "",
            duration: 0,
            rentPrice: 0,
            buyPrice: 0,
            trailerUrl: "",
            director: [],
            actor: [],
            language: [],
        });
        setCurrentInput({
            genre: "",
            director: "",
            actor: "",
            language: "",
        });
        setIsEditing(false);
        setFormErrors({});
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <NavBar />
            <div className="container mx-auto px-6 py-12">
                <h1 className="mb-8 text-center text-4xl font-bold text-gray-800 dark:text-white">
                    Admin Dashboard
                </h1>
                <div className="space-y-8 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
                    <div className="text-center">
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Welcome, <AuthorizedUser value="email" />!
                            <span className="ml-2">Your roles: <AuthorizedUser value="roles" /></span>
                        </p>
                    </div>

                    <h2 className="border-b-2 border-gray-200 pb-3 text-3xl font-semibold text-gray-800 dark:text-white dark:border-gray-700">
                        {isEditing ? "Edit Movie" : "Add a New Movie"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={movie.title}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${formErrors.title ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter movie title"
                                />
                                {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
                            </div>

                            <div>
                                <label htmlFor="overview" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Overview <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="overview"
                                    name="overview"
                                    value={movie.overview}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${formErrors.overview ? "border-red-500" : "border-gray-300"}`}
                                    rows="3"
                                    placeholder="Enter movie overview"
                                />
                                {formErrors.overview && <p className="mt-1 text-sm text-red-500">{formErrors.overview}</p>}
                            </div>

                            {/* Image URL and Preview */}
                            <div>
                                <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Image URL
                                </label>
                                <input
                                    type="text"
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={movie.imageUrl}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Enter image URL"
                                />
                                {movie.imageUrl && (
                                    <div className="mt-4">
                                        <img
                                            src={movie.imageUrl}
                                            alt="Preview"
                                            className="h-48 w-32 rounded-lg object-cover shadow-sm"
                                            onError={(e) => (e.target.src = "/default-movie.jpg")}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Genres */}
                            <div>
                                <label htmlFor="genre" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Genres
                                </label>
                                <input
                                    type="text"
                                    id="genre"
                                    name="genre"
                                    value={currentInput.genre}
                                    onChange={handleTagInputChange}
                                    onKeyDown={(e) => handleAddTag("genre", e)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Type a genre and press Enter"
                                />
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {movie.genre.map((g, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800 dark:bg-indigo-700 dark:text-indigo-200"
                                        >
                                            {g}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag("genre", index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label htmlFor="rating" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Rating (1-5)
                                </label>
                                <input
                                    type="number"
                                    id="rating"
                                    name="rating"
                                    value={movie.rating}
                                    onChange={handleChange}
                                    min="1"
                                    max="5"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${formErrors.rating ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter rating"
                                />
                                {formErrors.rating && <p className="mt-1 text-sm text-red-500">{formErrors.rating}</p>}
                            </div>

                            {/* Release Date */}
                            <div>
                                <label htmlFor="dateReleased" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Release Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="dateReleased"
                                    name="dateReleased"
                                    value={movie.dateReleased}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${formErrors.dateReleased ? "border-red-500" : "border-gray-300"}`}
                                />
                                {formErrors.dateReleased && <p className="mt-1 text-sm text-red-500">{formErrors.dateReleased}</p>}
                            </div>

                            {/* Lengths */}
                            <div>
                                <label htmlFor="duration" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    value={movie.duration}
                                    onChange={handleChange}
                                    min="0"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${formErrors.duration ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter duration"
                                />
                                {formErrors.duration && <p className="mt-1 text-sm text-red-500">{formErrors.duration}</p>}
                            </div>

                            {/* Rent Price */}
                            <div>
                                <label htmlFor="rentPrice" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Rent Price ($)
                                </label>
                                <input
                                    type="number"
                                    id="rentPrice"
                                    name="rentPrice"
                                    value={movie.rentPrice}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${formErrors.rentPrice ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter rent price"
                                />
                                {formErrors.rentPrice && <p className="mt-1 text-sm text-red-500">{formErrors.rentPrice}</p>}
                            </div>

                            {/*  biuying Price */}
                            <div>
                                <label htmlFor="buyPrice" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Buy Price ($)
                                </label>
                                <input
                                    type="number"
                                    id="buyPrice"
                                    name="buyPrice"
                                    value={movie.buyPrice}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${formErrors.buyPrice ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter buy price"
                                />
                                {formErrors.buyPrice && <p className="mt-1 text-sm text-red-500">{formErrors.buyPrice}</p>}
                            </div>

                            {/* Trailer URL */}
                            <div>
                                <label htmlFor="trailerUrl" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Trailer URL
                                </label>
                                <input
                                    type="text"
                                    id="trailerUrl"
                                    name="trailerUrl"
                                    value={movie.trailerUrl}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Enter trailer URL"
                                />
                            </div>

                            <div>
                                <label htmlFor="director" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Directors
                                </label>
                                <input
                                    type="text"
                                    id="director"
                                    name="director"
                                    value={currentInput.director}
                                    onChange={handleTagInputChange}
                                    onKeyDown={(e) => handleAddTag("director", e)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Type a director and press Enter"
                                />
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {movie.director.map((d, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800 dark:bg-indigo-700 dark:text-indigo-200"
                                        >
                                            {d}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag("director", index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="actor" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Actors
                                </label>
                                <input
                                    type="text"
                                    id="actor"
                                    name="actor"
                                    value={currentInput.actor}
                                    onChange={handleTagInputChange}
                                    onKeyDown={(e) => handleAddTag("actor", e)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Type an actor and press Enter"
                                />
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {movie.actor.map((a, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800 dark:bg-indigo-700 dark:text-indigo-200"
                                        >
                                            {a}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag("actor", index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="language" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Languages
                                </label>
                                <input
                                    type="text"
                                    id="language"
                                    name="language"
                                    value={currentInput.language}
                                    onChange={handleTagInputChange}
                                    onKeyDown={(e) => handleAddTag("language", e)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Type a language and press Enter"
                                />
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {movie.language.map((l, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800 dark:bg-indigo-700 dark:text-indigo-200"
                                        >
                                            {l}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag("language", index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="mr-3 h-5 w-5 animate-spin text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        {isEditing ? "Updating Movie..." : "Adding Movie..."}
                                    </>
                                ) : (
                                    isEditing ? "Update Movie" : "Add Movie"
                                )}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex-1 rounded-lg bg-gray-500 py-3 font-semibold text-white transition duration-300 hover:bg-gray-600"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>

                    {message && (
                        <div className="mt-6 rounded-lg bg-green-100 p-4 text-center text-green-800 dark:bg-green-800 dark:text-green-200">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mt-6 rounded-lg bg-red-100 p-4 text-center text-red-800 dark:bg-red-800 dark:text-red-200">
                            {error}
                        </div>
                    )}
                </div>

                {/* Movies List */}
                <div className="mt-12 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
                    <h2 className="mb-6 border-b-2 border-gray-200 pb-3 text-3xl font-semibold text-gray-800 dark:text-white dark:border-gray-700">
                        Manage Movies
                    </h2>
                    {movies.length === 0 ? (
                        <p className="text-center text-gray-600 dark:text-gray-300">No movies available.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-700">
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Title</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Genre</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Release Date</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Rating</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Duration (min)</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Rent Price ($)</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Buy Price ($)</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movies.map((m) => (
                                        <tr key={m.id} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{m.title}</td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{m.genre}</td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{m.dateReleased}</td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{m.rating}</td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{m.duration}</td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{m.rentPrice.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{m.buyPrice.toFixed(2)}</td>
                                            <td className="flex gap-2 px-4 py-2">
                                                <button
                                                    onClick={() => handleEdit(m)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(m.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;