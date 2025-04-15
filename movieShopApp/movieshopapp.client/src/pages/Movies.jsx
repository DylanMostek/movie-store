import NavBar from "../Components/NavBar.jsx";
import AuthorizeView from "../Components/Authorize.jsx"; 
function Movies() {
    return (
        <AuthorizeView>
            <div className="min-h-screen bg-gradient-to-br from-movie-dark to-indigo-900">
                <NavBar />
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-4xl font-bold text-white mb-6">Movies</h1>
                    <p className="text-movie-light">
                        Explore movies bruv. Coming soon!
                    </p>
                </div>
            </div>
        </AuthorizeView>
    );
}

export default Movies;