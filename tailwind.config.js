/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],

	content: [
		"./index.html",
		"./src/**/*.{ts,tsx}",
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}"
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		fontFamily: {
			poppins: [
				'Poppins',
				'sans-serif'
			]
		},
		extend: {
			colors: {
				'primary-500': '#0c1d33',
				'primary-600': '#091627',
				'secondary-500': '#ccd8ff',
				'secondary-600': '#b3c3ff',
				'main': '#091627',
				'main-light': '#0e233e',
				caution: {
					100: '#ef4444',
					200: '#b91c1c',
					300: '#7f1d1d',
				},
				'off-white': '#dodfff',
				'dark-5': '#000000',
				'dark-4': '#09090a',
				'dark-3': '#121214',
				'dark-2': '#1c1c1f',
				'dark-1': '#222226',
				'light-5': '#FEFEFE',
				'light-4': '#f9f9f9',
				'light-3': '#e9e9e9',
				'light-2': '#d9d9d9',
				'light-1': '#c9c9c9'
			},
			
			screens: {
				xs: '480px',
				large: '1560px'
			},
			fontFamily: {
				berkshire: [
					'Berkshire Swash',
					'serif'
				],
				labelle: [
					'La Belle Aurore',
					'sans-serif'
				]
			},
			keyframes: {
				border: {
					to: {"--border-angle": "360deg"}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}

