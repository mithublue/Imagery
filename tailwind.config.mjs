/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: '#FF6B6B',
				secondary: '#4ECDC4',
				accent: '#45B7D1',
				background: '#1A1A2E',
				surface: '#16213E',
			},
		},
	},
	plugins: [],
}

