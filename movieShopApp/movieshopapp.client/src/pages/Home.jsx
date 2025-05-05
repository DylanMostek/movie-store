import NavBar from "../Components/NavBar.jsx";
import MovieBanner from "../Components/MovieBanner.jsx";
import MovieList from "../Components/MovieList.jsx";

function Home() {
    return (
        <div className="min-h-screen bg-movie-bg-light dark:bg-movie-bg-dark">
            <NavBar />
            <main>
                <MovieBanner />
                <MovieList />
            </main>
        </div>
    );
}

export default Home;