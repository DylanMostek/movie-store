import { useState } from "react";
import { AuthorizedUser } from "../Components/Authorize.jsx";
import NavBar from "../Components/NavBar.jsx";

function AdminDashboard() {
    const [movie, setMovie] = useState({
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
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovie((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear form error for this field
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

        const movieData = {
            ...movie,
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
            const response = await fetch("https://localhost:7131/api/movies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(movieData),
            });

            if (response.ok) {
                setMessage("Movie added successfully!");
                setMovie({
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
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to add movie.");
            }
        } catch (err) {
            setError("An error occurred while adding the movie.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <NavBar />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                    Admin Dashboard
                </h1>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-8">
                    <div className="text-center">
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Welcome, <AuthorizedUser value="email" />!
                            <span className="ml-2">Your roles: <AuthorizedUser value="roles" /></span>
                        </p>
                    </div>

                    <h2 className="text-3xl font-semibold text-gray-800 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-3">
                        Add a New Movie
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                            </div>

                            {/* Overview */}
                            <div>
                                <label htmlFor="overview" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                {formErrors.overview && <p className="text-red-500 text-sm mt-1">{formErrors.overview}</p>}
                            </div>

                            {/* Image URL*/}
                            <div>
                                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Image URL
                                </label>
                                <input
                                    type="text"
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={movie.imageUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Enter image URL"
                                />
                                {movie.imageUrl && (
                                    <div className="mt-4">
                                        <img
                                            src={movie.imageUrl}
                                            alt="Preview"
                                            className="w-32 h-48 object-cover rounded-lg shadow-sm"
                                            onError={(e) => (e.target.src = "/default-movie.jpg")}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Genres */}
                            <div>
                                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {movie.genre.map((g, index) => (
                                        <span
                                            key={index}
                                            className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm flex items-center"
                                        >
                                            {g}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag("genre", index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                {formErrors.rating && <p className="text-red-500 text-sm mt-1">{formErrors.rating}</p>}
                            </div>

                            {/* Release Date */}
                            <div>
                                <label htmlFor="dateReleased" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                {formErrors.dateReleased && <p className="text-red-500 text-sm mt-1">{formErrors.dateReleased}</p>}
                            </div>

                            {/* Duration */}
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                {formErrors.duration && <p className="text-red-500 text-sm mt-1">{formErrors.duration}</p>}
                            </div>

                            {/* Buy Price */}
                            <div>
                                <label htmlFor="buyPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                {formErrors.buyPrice && <p className="text-red-500 text-sm mt-1">{formErrors.buyPrice}</p>}
                            </div>

                            {/* Trailer URL */}
                            <div>
                                <label htmlFor="trailerUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Trailer URL
                                </label>
                                <input
                                    type="text"
                                    id="trailerUrl"
                                    name="trailerUrl"
                                    value={movie.trailerUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Enter trailer URL"
                                />
                            </div>

                            {/* Directors */}
                            <div>
                                <label htmlFor="director" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {movie.director.map((d, index) => (
                                        <span
                                            key={index}
                                            className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm flex items-center"
                                        >
                                            {d}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag("director", index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actors */}
                            <div>
                                <label htmlFor="actor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {movie.actor.map((a, index) => (
                                        <span
                                            key={index}
                                            className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm flex items-center"
                                        >
                                            {a}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag("actor", index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Languages */}
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {movie.language.map((l, index) => (
                                        <span
                                            key={index}
                                            className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm flex items-center"
                                        >
                                            {l}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag("language", index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 text-white"
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
                                    Adding Movie...
                                </>
                            ) : (
                                "Add Movie"
                            )}
                        </button>
                    </form>

                    {message && (
                        <div className="mt-6 p-4 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-lg text-center">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mt-6 p-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;