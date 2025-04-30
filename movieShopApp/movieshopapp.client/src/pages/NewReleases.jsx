import NavBar from "../Components/NavBar.jsx";

function NewReleases() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-movie-dark to-indigo-900">
            <NavBar />
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-white mb-6">New Releases</h1>
                <p className="text-lg text-movie-light">
                    This page will display new releases (to be implemented).
                </p>
            </div>
        </div>
    );
}

export default NewReleases;