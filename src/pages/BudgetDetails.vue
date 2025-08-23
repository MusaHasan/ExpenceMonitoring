<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBudgets } from '../composables/useBudgets';
import { useExpenses } from '../composables/useExpenses';
import ProgressBar from '../components/ProgressBar.vue';

const route = useRoute();
const router = useRouter();
const { items: budgets, refresh: refreshBudgets, update, remove } = useBudgets();
const { items: expenses, refresh: refreshExpenses, create, update: updateExpense, remove: removeExpense } = useExpenses();

const budgetId = computed(() => route.params.id as string);
const budget = computed(() => budgets.value.find(b => b.id.toString() === budgetId.value));

// Add expense form
const expenseForm = reactive({ name: '', amount: 0 });
const isEditBudgetOpen = ref(false);
const editBudgetForm = reactive({ name: '', icon: '💰', total: 0, spent: 0, items: 0 });

// Edit expense modal
const isEditExpenseOpen = ref(false);
const editExpenseForm = reactive({ name: '', amount: 0 });
const editExpenseId = ref<string | number | null>(null);
const originalExpenseAmount = ref(0);

// Filter expenses for this budget (you might want to add budgetId to expense model later)
const budgetExpenses = computed(() => {
	// For now, show all expenses. In a real app, expenses would have budgetId
	return expenses.value.slice(0, 5); // Show first 5 expenses
});

onMounted(async () => {
	await Promise.all([refreshBudgets(), refreshExpenses()]);
	if (!budget.value) {
		router.push('/budgets');
	}
});

async function addExpense() {
	if (!expenseForm.name.trim() || !expenseForm.amount) return;
	
	await create({
		name: expenseForm.name.trim(),
		amount: Number(expenseForm.amount),
		date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
	});
	
	// Update budget's spent amount
	if (budget.value) {
		const newSpent = budget.value.spent + Number(expenseForm.amount);
		await update(budget.value.id, {
			name: budget.value.name,
			icon: budget.value.icon,
			total: budget.value.total,
			spent: newSpent,
			items: budget.value.items + 1, // Increment items count
		});
	}
	
	// Reset form
	expenseForm.name = '';
	expenseForm.amount = 0;
}

function openEditExpense(expense: any) {
	editExpenseId.value = expense.id;
	editExpenseForm.name = expense.name;
	editExpenseForm.amount = expense.amount;
	originalExpenseAmount.value = expense.amount;
	isEditExpenseOpen.value = true;
}

async function updateExpenseItem() {
	if (!editExpenseId.value || !budget.value) return;
	
	const amountDifference = Number(editExpenseForm.amount) - originalExpenseAmount.value;
	
	// Update the expense
	await updateExpense(editExpenseId.value, {
		name: editExpenseForm.name.trim(),
		amount: Number(editExpenseForm.amount),
		date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
	});
	
	// Update budget's spent amount if amount changed
	if (amountDifference !== 0) {
		const newSpent = budget.value.spent + amountDifference;
		await update(budget.value.id, {
			name: budget.value.name,
			icon: budget.value.icon,
			total: budget.value.total,
			spent: newSpent,
			items: budget.value.items,
		});
	}
	
	// Close modal and reset
	isEditExpenseOpen.value = false;
	editExpenseId.value = null;
}

async function deleteExpenseItem(expense: any) {
	if (!budget.value) return;
	
	// Delete the expense
	await removeExpense(expense.id);
	
	// Update budget's spent amount and items count
	const newSpent = budget.value.spent - expense.amount;
	const newItems = budget.value.items - 1;
	
	await update(budget.value.id, {
		name: budget.value.name,
		icon: budget.value.icon,
		total: budget.value.total,
		spent: newSpent,
		items: newItems,
	});
}

function openEditBudget() {
	if (!budget.value) return;
	editBudgetForm.name = budget.value.name;
	editBudgetForm.icon = budget.value.icon;
	editBudgetForm.total = budget.value.total;
	editBudgetForm.spent = budget.value.spent;
	editBudgetForm.items = budget.value.items;
	isEditBudgetOpen.value = true;
}

async function updateBudget() {
	if (!budget.value) return;
	await update(budget.value.id, {
		name: editBudgetForm.name.trim(),
		icon: editBudgetForm.icon,
		total: Number(editBudgetForm.total) || 0,
		spent: Number(editBudgetForm.spent) || 0,
		items: Number(editBudgetForm.items) || 0,
	});
	isEditBudgetOpen.value = false;
}

async function deleteBudget() {
	if (!budget.value) return;
	await remove(budget.value.id);
	router.push('/budgets');
}
</script>

<template>
	<div class="container" v-if="budget">
		<h2 style="margin: 4px 0 18px; font-size: 32px;">Budget Details</h2>
		
		<div class="grid-2col">
			<!-- Budget Details Card -->
			<div class="panel">
				<div class="budget-header">
					<div class="budget-info">
						<div class="budget-icon">{{ budget.icon }}</div>
						<div>
							<div class="budget-name">{{ budget.name }}</div>
							<div class="muted">{{ budget.items }} Items</div>
						</div>
					</div>
					<div class="budget-amount">Rs {{ budget.total }}</div>
				</div>
				
				<div class="budget-stats">
					<div class="stat-row">
						<span class="muted">Rs {{ budget.spent }} spent</span>
						<span class="muted">Rs {{ budget.total - budget.spent }} remaining</span>
					</div>
					<ProgressBar :value="budget.spent / budget.total" />
				</div>
				
				<div class="budget-actions">
					<button class="button button-dark" @click="openEditBudget">
						✏️ Edit
					</button>
					<button class="button button-danger" @click="deleteBudget">
						🗑️ Delete
					</button>
				</div>
			</div>

			<!-- Add Expense Card -->
			<div class="panel">
				<h3 style="margin: 0 0 16px; font-size: 18px;">Add Expense</h3>
				<form @submit.prevent="addExpense">
					<label class="field">
						<span class="label">Expense Name</span>
						<input 
							class="input" 
							v-model="expenseForm.name" 
							type="text" 
							placeholder="e.g, Home Decor" 
						/>
					</label>
					<label class="field">
						<span class="label">Expense Amount</span>
						<input 
							class="input" 
							v-model.number="expenseForm.amount" 
							type="number" 
							placeholder="e.g, 1000" 
						/>
					</label>
					<button type="submit" class="button button-dark" style="width: 100%;">
						Add new Expense
					</button>
				</form>
			</div>
		</div>

		<!-- Expenses Table -->
		<div class="section-title">Expenses</div>
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
					<tr v-for="(e, i) in budgetExpenses" :key="e.id">
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

		<!-- Edit Budget Modal -->
		<div v-if="isEditBudgetOpen" class="modal-overlay" @click.self="isEditBudgetOpen = false">
			<div class="modal-card">
				<div class="modal-header">
					<div class="modal-title">Edit Budget</div>
					<button class="modal-close" @click="isEditBudgetOpen = false">×</button>
				</div>
				<form @submit.prevent="updateBudget" class="modal-body">
					<label class="field">
						<span class="label">Name</span>
						<input class="input" v-model="editBudgetForm.name" type="text" placeholder="Budget name" />
					</label>
					<label class="field">
						<span class="label">Total Budget</span>
						<input class="input" v-model.number="editBudgetForm.total" type="number" placeholder="0" />
					</label>
					<label class="field">
						<span class="label">Spent</span>
						<input class="input" v-model.number="editBudgetForm.spent" type="number" placeholder="0" />
					</label>
					<label class="field">
						<span class="label">Items</span>
						<input class="input" v-model.number="editBudgetForm.items" type="number" placeholder="0" />
					</label>
					<div class="actions-end">
						<button type="submit" class="button button-dark">Update Budget</button>
					</div>
				</form>
			</div>
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
.budget-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.budget-info {
	display: flex;
	align-items: center;
	gap: 12px;
}

.budget-icon {
	font-size: 32px;
	width: 60px;
	height: 60px;
	background: #f3f4f6;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.budget-name {
	font-size: 20px;
	font-weight: 700;
}

.budget-amount {
	font-size: 24px;
	font-weight: 700;
}

.budget-stats {
	margin-bottom: 20px;
}

.stat-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 8px;
}

.budget-actions {
	display: flex;
	gap: 12px;
}

.button-danger {
	background: #dc2626;
}

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
