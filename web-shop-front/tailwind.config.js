/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        borderWidth: {
            '0': '0',
            '2': '2px',
            '4': '4px',
            '8': '8px',
            '10': '10px'
        },
        extend: {
            zIndex: {
                '200': '200',
            },
            colors: {
                'first-ls': '#f3f3f3',
                'second-ls': '#383636'
            }
        },
    },
    plugins: [require('@tailwindcss/forms'), ],
}