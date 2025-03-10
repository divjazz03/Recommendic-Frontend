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
				caution: {
					100: '#ef4444',
					200: '#b91c1c',
					300: '#7f1d1d',
				},
				'off-white': '#dodfff',
				red: '#ff5a5a',
				'dark-5': '#000000',
				'dark-4': '#09090a',
				'dark-3': '#121214',
				'dark-2': '#1c1c1f',
				'dark-1': '#222226',
				'light-5': '#ffffff',
				'light-4': '#f2f2f2',
				'light-3': '#e6e6e6',
				'light-2': '#d9d9d9',
				'light-1': '#cccccc'
			},
			screens: {
				xs: '480px'
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

