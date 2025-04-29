const API_BASE_URL = 'https://localhost:7131';

export const searchMovies = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Movie/search?query=${encodeURIComponent(query)}`, {
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map(movie => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview || 'No description available',
            coverImageUrl: movie.imageUrl || '/default-movie.jpg'
        }));
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
};

export const getAllMovies = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Movie`, {
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map(movie => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview || 'No description available',
            genre: movie.genre || 'No genre available',
            coverImageUrl: movie.imageUrl || '/default-movie.jpg'
        }));
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
};