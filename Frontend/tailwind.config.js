/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f3e8ff',
                    100: '#e9d5ff',
                    200: '#d8b4fe',
                    300: '#c084fc',
                    400: '#a855f7',
                    500: '#a855f7',
                    600: '#9333ea', // Primary Purple
                    700: '#7e22ce',
                    800: '#6b21a8', // Deep Purple
                    900: '#581c87',
                }
            }
        },
    },
    plugins: [],
}
