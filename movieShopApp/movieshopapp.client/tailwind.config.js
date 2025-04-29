/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class', 
    theme: {
        extend: {
            colors: {
                "movie-dark": {
                    DEFAULT: "#1a202c",
                    800: "#2d3748",
                    900: "#171923",
                },
                "movie-light": {
                    DEFAULT: "#e2e8f0",
                    100: "#f7fafc",
                    200: "#edf2f7",
                    300: "#DDDDDD"
                },
                "movie-accent": {
                    DEFAULT: "#f6ad55",
                    400: "#fbd38d",
                    600: "#ed8936",
                },
                "movie-bg-light": "#f7fafc",
                "movie-bg-dark": "#0d1219",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};