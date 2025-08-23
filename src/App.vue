<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import Sidebar from './components/Sidebar.vue';

const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
	isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<template>
	<div class="app">
		<Sidebar :is-collapsed="isSidebarCollapsed" />
		
		<div class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
			<header class="topbar">
				<button class="toggle-btn" @click="toggleSidebar">
					{{ isSidebarCollapsed ? '☰' : '✕' }}
				</button>
				<div class="page-title">Dashboard</div>
			</header>
			<RouterView />
		</div>
	</div>
</template>

<style scoped>
.app {
	display: flex;
	height: 100vh;
}

.main-content {
	flex: 1;
	margin-left: 250px;
	transition: margin-left 0.3s ease;
}

.main-content.sidebar-collapsed {
	margin-left: 60px;
}

.topbar {
	background: #121a27;
	color: #fff;
	padding: 16px 24px;
	display: flex;
	align-items: center;
	gap: 16px;
}

.toggle-btn {
	background: transparent;
	border: none;
	color: #fff;
	font-size: 18px;
	cursor: pointer;
	padding: 4px;
	border-radius: 4px;
	transition: background-color 0.2s ease;
}

.toggle-btn:hover {
	background: rgba(255, 255, 255, 0.1);
}

.page-title {
	font-size: 18px;
	font-weight: 600;
}
</style>


