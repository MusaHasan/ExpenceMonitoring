<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useExpenses } from '../composables/useExpenses';

const { source, items, loading, error, refresh, create, update, remove } = useExpenses();

const isEditOpen = ref(false);
const editId = ref<string | number | null>(null);
const editForm = reactive({ name: '', amount: 0, date: '' });

const isCreateOpen = ref(false);
const createForm = reactive({ name: '', amount: 0, date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }) });

onMounted(() => {
	refresh();
});

function openEdit(index: number) {
	const row = items.value[index];
	if (!row) return;
	editId.value = row.id;
	editForm.name = row.name;
	editForm.amount = row.amount;
	editForm.date = row.date;
	isEditOpen.value = true;
}

function closeEdit() {
	isEditOpen.value = false;
	editId.value = null;
}

async function updateExpense() {
	if (editId.value === null) return;
	await update(editId.value, {
		name: editForm.name.trim(),
		amount: Number(editForm.amount) || 0,
		date: editForm.date,
	});
	closeEdit();
}

function openCreate() {
	isCreateOpen.value = true;
}
function closeCreate() {
	isCreateOpen.value = false;
}
async function createExpense() {
	await create({
		name: createForm.name.trim(),
		amount: Number(createForm.amount) || 0,
		date: createForm.date,
	});
	createForm.name = '';
	createForm.amount = 0;
	closeCreate();
}
</script>

<template>
	<div class="container">
		<h2 style="margin: 4px 0 8px; font-size: 32px;">My Expenses</h2>
		<div class="muted" style="margin-bottom: 16px;">Latest Expenses</div>

		<div class="panel" style="margin-bottom:12px; display:flex; gap:12px; align-items:center;">
			<label class="muted">Data source:</label>
			<select v-model="source" @change="refresh()" class="input" style="max-width:200px;">
				<option value="local">Local storage</option>
				<option value="api">REST API</option>
			</select>
			<button class="button" @click="openCreate">+ Add Expense</button>
			<span v-if="loading" class="muted">Loading...</span>
			<span v-if="error" style="color:#b91c1c;">{{ error }}</span>
		</div>

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
					<tr v-for="(e, i) in items" :key="e.id">
						<td>{{ e.name }}</td>
						<td>{{ e.amount }}</td>
						<td>{{ e.date }}</td>
						<td>
							<div class="actions">
								<button class="icon-btn" title="edit" @click="openEdit(i)">✏️</button>
								<button class="icon-btn" title="delete" @click="remove(e.id)">🗑️</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Edit Modal -->
		<div v-if="isEditOpen" class="modal-overlay" @click.self="closeEdit">
			<div class="modal-card">
				<div class="modal-header">
					<div class="modal-title">Edit Expense</div>
					<button class="modal-close" @click="closeEdit">×</button>
				</div>
				<form @submit.prevent="updateExpense" class="modal-body">
					<label class="field">
						<span class="label">Name</span>
						<input class="input" v-model="editForm.name" type="text" placeholder="Name" />
					</label>
					<label class="field">
						<span class="label">Amount</span>
						<input class="input" v-model.number="editForm.amount" type="number" placeholder="0" />
					</label>
					<div class="actions-end">
						<button type="submit" class="button button-dark">Update Expense</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Create Modal -->
		<div v-if="isCreateOpen" class="modal-overlay" @click.self="closeCreate">
			<div class="modal-card">
				<div class="modal-header">
					<div class="modal-title">Create Expense</div>
					<button class="modal-close" @click="closeCreate">×</button>
				</div>
				<form @submit.prevent="createExpense" class="modal-body">
					<label class="field">
						<span class="label">Name</span>
						<input class="input" v-model="createForm.name" type="text" placeholder="Name" />
					</label>
					<label class="field">
						<span class="label">Amount</span>
						<input class="input" v-model.number="createForm.amount" type="number" placeholder="0" />
					</label>
					<label class="field">
						<span class="label">Date</span>
						<input class="input" v-model="createForm.date" type="text" placeholder="August 20, 2025" />
					</label>
					<div class="actions-end">
						<button type="submit" class="button button-dark">Create Expense</button>
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


