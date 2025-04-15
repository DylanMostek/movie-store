import NavBar from "../Components/NavBar.jsx";

function Popular() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-movie-dark to-indigo-900">
            <NavBar />
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-white mb-6">Popular Movies</h1>
                <p className="text-movie-light">
                    Most popular movies right now. Coming soon!
                </p>
            </div>
        </div>
    );
}

export default Popular;