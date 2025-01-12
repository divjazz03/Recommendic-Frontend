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
				'primary-500': '#0025d9',
				'primary-600': '#0020bf',
				'secondary-500': '#ccd8ff',
				'secondary-600': '#b3c3ff',
				caution: {
					100: '#ef4444',
					200: '#b91c1c',
					300: '#7f1d1d',
				},
				'off-white': '#dodfff',
				red: '#ff5a5a',
				'dark-1': '#000000',
				'dark-2': '#09090a',
				'dark-3': '#101012',
				'dark-4': '#1f1f22',
				'dark-5': '#262d3c',
				'light-1': '#ffffff',
				'light-2': '#efefef',
				'light-3': '#7878a3',
				'light-4': '#5c5c7b',
			},
			screens: {
				xs: '480px'
			},
			fontFamily: {
				berkshire: [
					'Berkshire Swash',
					'serif'
				]
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: 0
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: 0
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [import('tailwindcss-animate'), require("tailwindcss-animate")],
}

