import NavBar from "../Components/NavBar.jsx";

function Categories() {
    return (
        <div className="min-h-screen bg-movie-bg-light dark:bg-movie-bg-dark">
            <NavBar />
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-movie-dark dark:text-white mb-6">Categories</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Action', 'Sci-Fi', 'Drama'].map((category) => (
                        <div
                            key={category}
                            className="bg-white dark:bg-movie-dark-800 rounded-lg shadow-custom p-6 hover:shadow-lg transition-shadow"
                        >
                            <h2 className="text-xl font-semibold text-movie-dark dark:text-white">{category}</h2>
                            <p className="text-movie-light dark:text-movie-light-200 mt-2">
                                Explore our collection of {category.toLowerCase()} movies.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Categories;