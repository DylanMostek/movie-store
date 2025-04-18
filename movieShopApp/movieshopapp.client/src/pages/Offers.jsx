import NavBar from "../Components/NavBar.jsx";
import AuthorizeView from "../Components/Authorize.jsx";

function Offers() {
    return (
        <AuthorizeView>
            <div className="min-h-screen bg-gradient-to-br from-movie-dark to-indigo-900">
                <NavBar />
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-4xl font-bold text-white mb-6">Special Offers</h1>
                    <p className="text-lg text-movie-light">
                        This page will display special offers (to be implemented).
                    </p>
                </div>
            </div>
        </AuthorizeView>
    );
}

export default Offers;