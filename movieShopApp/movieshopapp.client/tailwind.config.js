/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "movie-dark": "#1E2A44", // background
                "movie-light": "#D1D5DB", // secondary text
                "movie-accent": "#FBBF24", // buttons
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"], 
                cursive: ["Dancing Script", "cursive"], // logo font 
            },
        },
    },
    plugins: [],
};