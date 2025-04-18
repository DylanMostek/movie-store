const SearchResults = ({ results, isLoading }) => {
    console.log("SearchResults component rendering:", { results, isLoading });

    if (isLoading) {
        return (
            <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg p-4 text-center text-gray-600">
                Searching...
            </div>
        );
    }

    if (!results || results.length === 0) {
        return null;
    }

    return (
        <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-10 mt-2 border border-gray-200">
            {results.map((movie) => (
                <div
                    key={movie.id}
                    className="p-4 border-b border-gray-200 hover:bg-gray-50 flex items-center gap-4 cursor-pointer"
                >
                    <div className="w-16 h-24 flex-shrink-0 overflow-hidden rounded">
                        <img
                            src={movie.coverImageUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/default-movie.jpg";
                            }}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-800 truncate">
                            {movie.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {movie.overview}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;