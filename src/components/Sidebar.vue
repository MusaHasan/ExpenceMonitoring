<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface Props {
	isCollapsed: boolean;
}

defineProps<Props>();

const navItems = [
	{ path: '/', label: 'Dashboard', icon: '📊' },
	{ path: '/budgets', label: 'Budgets', icon: '💰' },
	{ path: '/expenses', label: 'Expenses', icon: '📝' },
];
</script>

<template>
	<aside class="sidebar" :class="{ collapsed: isCollapsed }">
		<div class="sidebar-header">
			<div v-if="!isCollapsed" class="logo">Expense Manager</div>
			<div v-else class="logo-collapsed">EM</div>
		</div>
		
		<nav class="sidebar-nav">
			<RouterLink
				v-for="item in navItems"
				:key="item.path"
				:to="item.path"
				class="nav-item"
				:class="{ active: $route.path === item.path }"
			>
				<span class="nav-icon">{{ item.icon }}</span>
				<span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
			</RouterLink>
		</nav>
	</aside>
</template>

<style scoped>
.sidebar {
	width: 250px;
	background: #1e293b;
	color: #fff;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	transition: width 0.3s ease;
	z-index: 1000;
}

.sidebar.collapsed {
	width: 60px;
}

.sidebar-header {
	padding: 20px;
	border-bottom: 1px solid #334155;
}

.logo {
	font-size: 18px;
	font-weight: 700;
}

.logo-collapsed {
	font-size: 16px;
	font-weight: 700;
	text-align: center;
}

.sidebar-nav {
	padding: 20px 0;
}

.nav-item {
	display: flex;
	align-items: center;
	padding: 12px 20px;
	color: #cbd5e1;
	text-decoration: none;
	transition: all 0.2s ease;
	gap: 12px;
}

.nav-item:hover {
	background: #334155;
	color: #fff;
}

.nav-item.active {
	background: #3b82f6;
	color: #fff;
}

.nav-icon {
	font-size: 18px;
	min-width: 20px;
}

.nav-label {
	font-weight: 500;
}

.collapsed .nav-item {
	justify-content: center;
	padding: 12px;
}
</style>

