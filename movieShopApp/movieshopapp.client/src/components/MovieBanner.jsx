import { Link } from "react-router-dom";
import HomePageImage from '../assets/HomePageImage.png';

const MovieBanner = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center py-16 px-4 bg-gradient-to-r from-movie-accent-400 to-movie-dark-900 dark:from-movie-accent-600 dark:to-movie-bg-dark min-h-[80vh] w-full">
            <div className="flex-1 max-w-lg text-center md:text-left space-y-6 px-4 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                    Discover the Latest Movies
                </h1>
                <p className="text-lg text-movie-light-100">
                    Stream your favorite films anytime, anywhere with MovieShop.
                </p>
                <Link
                    to="/movies"
                    className="inline-block px-8 py-3 bg-white dark:bg-movie-dark text-movie-accent-400 dark:text-movie-accent-400 font-semibold rounded-full hover:bg-movie-accent-400 hover:text-white dark:hover:bg-movie-accent-600 transition-colors"
                >
                    Browse Movies
                </Link>
            </div>
            <div className="flex-1 max-w-lg mt-5 md:mt-0 px-3">
                <img
                    src={HomePageImage}
                    alt="Movie Watching Guy"
                    width={5000}
                    height={5000}
                    className="rounded-lg animate-fade-in"
                    
                />
            </div>
        </div>
    );
};

export default MovieBanner;