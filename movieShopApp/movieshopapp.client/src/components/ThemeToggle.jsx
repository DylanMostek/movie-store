import { useState, useEffect } from 'react';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage or system preference for the Theme 
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-movie-dark-800 dark:bg-movie-dark-200 text-movie-light dark:text-movie-dark hover:bg-movie-accent-400 dark:hover:bg-movie-accent-600 transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? (
                <div className="items-center flex-1 items-center" >
                    {"🌙" }
                </div>
            ) : (
                    <div className="items-center flex-1 items-center" >
                        {"☀️"}
                    </div>
            )}
        </button>
    );
};

export default ThemeToggle;