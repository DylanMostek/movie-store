import NavBar from "../Components/NavBar.jsx";
import AuthorizeView from "../Components/Authorize.jsx";
import HomePageImage from '../assets/HomePageImage.png';

function Home() {
    return (
        <AuthorizeView>
            <div className="min-h-screen bg-gradient-to-br from-movie-dark to-indigo-900">
                <NavBar />
                <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
                    <div className="max-w-lg text-center md:text-left space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                            Discover the Latest Movies & Enjoy Them Anytime
                        </h1>
                        <p className="text-lg text-movie-light">
                            Start Watching
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            <a
                                href="/movies"
                                className="px-6 py-3 bg-movie-accent text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300"
                            >
                                Browse Movies
                            </a>
                        </div>
                    </div>
                    <div className="mt-10 md:mt-0">
                        <img
                            src={HomePageImage}
                            alt="Person watching movies"
                            className="w-full max-w-md rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </AuthorizeView>
    );
}

export default Home;