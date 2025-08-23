<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ProgressBar from './ProgressBar.vue';
import { useExpenses } from '../composables/useExpenses';
import { useBudgets } from '../composables/useBudgets';
import { useRouter } from 'vue-router';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const router = useRouter();
const { items: expenses, refresh: refreshExpenses, update: updateExpense, remove: removeExpense } = useExpenses();
const { items: budgets, refresh: refreshBudgets } = useBudgets();

// Edit expense modal
const isEditExpenseOpen = ref(false);
const editExpenseForm = reactive({ name: '', amount: 0 });
const editExpenseId = ref<string | number | null>(null);

// Calculate totals
const totalBudget = computed(() => budgets.value.reduce((sum, b) => sum + b.total, 0));
const totalSpend = computed(() => expenses.value.reduce((sum, e) => sum + e.amount, 0));
const numBudgets = computed(() => budgets.value.length);

// Get latest expenses (sorted by date, most recent first)
const latestExpenses = computed(() => {
	return [...expenses.value]
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 3);
});

// Get latest budgets (sorted by spent amount, highest first)
const latestBudgets = computed(() => {
	return [...budgets.value]
		.sort((a, b) => b.spent - a.spent)
		.slice(0, 3);
});

const chartEl = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

onMounted(async () => {
	await Promise.all([refreshExpenses(), refreshBudgets()]);
	
	if (!chartEl.value) return;
	
	// Use actual budget data for chart
	const chartData = latestBudgets.value.map(b => ({
		name: b.name,
		spent: b.spent,
		remaining: b.total - b.spent
	}));
	
	chart = new Chart(chartEl.value, {
		type: 'bar',
		data: {
			labels: chartData.map(d => d.name),
			datasets: [
				{
					label: 'Spent',
					data: chartData.map(d => d.spent),
					backgroundColor: '#0f172a',
				},
				{
					label: 'Remaining',
					data: chartData.map(d => d.remaining),
					backgroundColor: '#d1d5db',
				},
			],
		},
		options: {
			plugins: { legend: { position: 'top' as const } },
			responsive: true,
			scales: {
				y: { beginAtZero: true, grid: { color: '#eef0f5' } },
				x: { grid: { display: false } },
			},
		},
	});
	
	// Resize chart with panel
	new ResizeObserver(() => chart?.resize()).observe(chartEl.value);
});

function viewBudgetDetails(budgetId: string | number) {
	router.push(`/budgets/${budgetId}`);
}

function openEditExpense(expense: any) {
	editExpenseId.value = expense.id;
	editExpenseForm.name = expense.name;
	editExpenseForm.amount = expense.amount;
	isEditExpenseOpen.value = true;
}

async function updateExpenseItem() {
	if (!editExpenseId.value) return;
	
	await updateExpense(editExpenseId.value, {
		name: editExpenseForm.name.trim(),
		amount: Number(editExpenseForm.amount),
		date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
	});
	
	// Close modal and reset
	isEditExpenseOpen.value = false;
	editExpenseId.value = null;
}

async function deleteExpenseItem(expense: any) {
	await removeExpense(expense.id);
}

function exportToExcel() {
	// Create CSV content
	const headers = ['Name', 'Amount', 'Date'];
	const csvContent = [
		headers.join(','),
		...expenses.value.map(expense => [
			`"${expense.name}"`,
			expense.amount,
			`"${expense.date}"`
		].join(','))
	].join('\n');

	// Create and download file
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);
	link.setAttribute('href', url);
	link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
	link.style.visibility = 'hidden';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
</script>

<template>
	<div class="container">
		<div class="greeting">
			<div>
				<h1>Hi, musa 👋</h1>
				<div class="muted">Here's what happennning with your money, Lets Manage your expense</div>
			</div>
			<button class="button" @click="exportToExcel">Export to Excel</button>
		</div>

		<div class="stats-grid">
			<div class="panel">
				<div class="muted">Total Budget</div>
				<div style="font-weight:700;font-size:22px;margin-top:6px;">Rs {{ totalBudget }}</div>
			</div>
			<div class="panel">
				<div class="muted">Total Spend</div>
				<div style="font-weight:700;font-size:22px;margin-top:6px;">Rs {{ totalSpend }}</div>
			</div>
			<div class="panel">
				<div class="muted">Number of Budgets</div>
				<div style="font-weight:700;font-size:22px;margin-top:6px;">{{ numBudgets }}</div>
			</div>
		</div>

		<div class="grid-2col">
			<div class="panel">
				<canvas ref="chartEl" height="220"></canvas>
			</div>

			<div class="panel" style="display:flex;flex-direction:column;gap:14px;">
				<div class="section-title">Latest Budgets</div>
				<div v-for="b in latestBudgets" :key="b.id" style="border:1px solid var(--border);border-radius:10px;padding:14px;">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-12">
							<div style="font-size:22px">{{ b.icon }}</div>
							<div>
								<div style="font-weight:700">{{ b.name }}</div>
								<div class="muted">{{ b.items }} Items</div>
							</div>
						</div>
						<div style="font-weight:700">Rs {{ b.total }}</div>
					</div>
					<div class="muted" style="font-size:12px;margin:8px 0">Rs {{ b.spent }} spent</div>
					<ProgressBar :value="b.spent / b.total" />
					<div class="muted" style="font-size:12px;text-align:right;">Rs {{ b.total - b.spent }} remaining</div>
					<div style="text-align:right;margin-top:6px;">
						<button 
							@click="viewBudgetDetails(b.id)" 
							class="muted" 
							style="text-decoration:none; background:none; border:none; cursor:pointer; color:var(--muted);"
						>
							view details
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="section-title">Latest Expenses</div>
		<div class="panel">
			<table class="table">
				<thead>
					<tr>
						<th style="width:40%">Name</th>
						<th>Amount</th>
						<th>Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(e, i) in latestExpenses" :key="e.id">
						<td>{{ e.name }}</td>
						<td>{{ e.amount }}</td>
						<td>{{ e.date }}</td>
						<td>
							<div class="actions">
								<button class="icon-btn" title="edit" @click="openEditExpense(e)">✏️</button>
								<button class="icon-btn" title="delete" @click="deleteExpenseItem(e)">🗑️</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Edit Expense Modal -->
		<div v-if="isEditExpenseOpen" class="modal-overlay" @click.self="isEditExpenseOpen = false">
			<div class="modal-card">
				<div class="modal-header">
					<div class="modal-title">Edit Expense</div>
					<button class="modal-close" @click="isEditExpenseOpen = false">×</button>
				</div>
				<form @submit.prevent="updateExpenseItem" class="modal-body">
					<label class="field">
						<span class="label">Expense Name</span>
						<input class="input" v-model="editExpenseForm.name" type="text" placeholder="Expense name" />
					</label>
					<label class="field">
						<span class="label">Expense Amount</span>
						<input class="input" v-model.number="editExpenseForm.amount" type="number" placeholder="0" />
					</label>
					<div class="actions-end">
						<button type="submit" class="button button-dark">Update Expense</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1100; }
.modal-card { background: #fff; border-radius: 12px; width: 640px; max-width: calc(100% - 32px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
.modal-header { display: flex; align-items: center; justify-content: center; position: relative; padding: 20px; border-bottom: 1px solid var(--border); }
.modal-title { font-weight: 700; font-size: 22px; }
.modal-close { position: absolute; right: 16px; top: 12px; background: transparent; border: 0; font-size: 22px; cursor: pointer; }
.modal-body { padding: 16px 20px 22px; }
.field { display: block; margin-bottom: 14px; }
.label { display: block; font-weight: 700; margin-bottom: 8px; }
.input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border); font-size: 14px; }
.actions-end { display: flex; justify-content: center; }
.button-dark { background: #0f172a; }
</style>


