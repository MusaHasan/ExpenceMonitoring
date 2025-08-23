import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Dashboard from './components/Dashboard.vue';
import Budgets from './pages/Budgets.vue';
import Expenses from './pages/Expenses.vue';
import BudgetDetails from './pages/BudgetDetails.vue';

const routes: RouteRecordRaw[] = [
	{ path: '/', name: 'dashboard', component: Dashboard },
	{ path: '/budgets', name: 'budgets', component: Budgets },
	{ path: '/expenses', name: 'expenses', component: Expenses },
	{ path: '/budgets/:id', name: 'budget-details', component: BudgetDetails },
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});


