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
                '150': '150'
            },
            colors: {
                'first-ls': '#f3f3f3',
                'second-ls': '#383636',
                'navbar-text': '#eee',
                'navbar-link-hover': '#f90',
                'navbar-bg': '#232f3e'
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [require('@tailwindcss/forms'), ],
}