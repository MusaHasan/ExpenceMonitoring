import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	base: '/ExpenceManagement/',
	plugins: [vue()],
	define: {
		'process.env': {},
	},
	server: {
		port: 5173,
	},
});


