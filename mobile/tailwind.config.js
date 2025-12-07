/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#2a2a2a",      // Soft charcoal - matches web
                secondary: "#6b6b6b",    // Gray - matches web
                border: "#e5e5e5",       // Light gray - matches web
                background: "#fdfbf7",   // Warm off-white - matches web
            },
            fontFamily: {
                // Need to load fonts if we want custom ones, using defaults for now
                heading: ["System"],
                body: ["System"],
            }
        },
    },
    plugins: [],
}
