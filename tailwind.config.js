import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
				worksans: ['"Work Sans"', 'sans-serif'],
				syne: ['Syne', 'sans-serif']
			},
			colors: {
				blue: {
					500: '#3b82f6',
					600: '#2563eb'
				}
			}
		}
	},
	plugins: [typography]
};
