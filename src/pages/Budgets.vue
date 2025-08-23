<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useBudgets } from '../composables/useBudgets';
import ProgressBar from '../components/ProgressBar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { source, items, loading, error, refresh, create, update, remove } = useBudgets();

const isEditOpen = ref(false);
const editId = ref<string | number | null>(null);
const editForm = reactive({ name: '', icon: '💰', total: 0, spent: 0, items: 0 });

const isCreateOpen = ref(false);
const createForm = reactive({ name: '', icon: '💰', total: 0, spent: 0, items: 0 });

const iconOptions = ['💰', '🚌', '🍔', '👕', '🏠', '📱', '🎮', '📚', '💊', '🎬'];

onMounted(() => {
	refresh();
});

function openEdit(index: number) {
	const row = items.value[index];
	if (!row) return;
	editId.value = row.id;
	editForm.name = row.name;
	editForm.icon = row.icon;
	editForm.total = row.total;
	editForm.spent = row.spent;
	editForm.items = row.items;
	isEditOpen.value = true;
}

function closeEdit() {
	isEditOpen.value = false;
	editId.value = null;
}

async function updateBudget() {
	if (editId.value === null) return;
	await update(editId.value, {
		name: editForm.name.trim(),
		icon: editForm.icon,
		total: Number(editForm.total) || 0,
		spent: Number(editForm.spent) || 0,
		items: Number(editForm.items) || 0,
	});
	closeEdit();
}

function openCreate() {
	isCreateOpen.value = true;
}

function closeCreate() {
	isCreateOpen.value = false;
}

async function createBudget() {
	await create({
		name: createForm.name.trim(),
		icon: createForm.icon,
		total: Number(createForm.total) || 0,
		spent: Number(createForm.spent) || 0,
		items: Number(createForm.items) || 0,
	});
	createForm.name = '';
	createForm.icon = '💰';
	createForm.total = 0;
	createForm.spent = 0;
	createForm.items = 0;
	closeCreate();
}

function viewBudgetDetails(budgetId: string | number) {
	router.push(`/budgets/${budgetId}`);
}
</script>

<template>
	<div class="container">
		<h2 style="margin: 4px 0 8px; font-size: 32px;">My Budgets</h2>

		<div class="panel" style="margin-bottom:12px; display:flex; gap:12px; align-items:center;">
			<label class="muted">Data source:</label>
			<select v-model="source" @change="refresh()" class="input" style="max-width:200px;">
				<option value="local">Local storage</option>
				<option value="api">REST API</option>
			</select>
			<span v-if="loading" class="muted">Loading...</span>
			<span v-if="error" style="color:#b91c1c;">{{ error }}</span>
		</div>

		<div class="cards-grid">
			<!-- Create card -->
			<div class="panel create-card" @click="openCreate" style="cursor:pointer;">
				<div style="text-align:center; width:100%;">
					<div style="font-size:36px; line-height:1;">+</div>
					<div style="margin-top:8px; font-weight:700;">Create New Budget</div>
				</div>
			</div>

			<!-- Budget cards -->
			<div
				v-for="(b, i) in items"
				:key="b.id"
				class="panel budget-card"
			>
				<div class="card-top">
					<div class="left">
						<div class="emoji">{{ b.icon }}</div>
						<div>
							<div class="card-title">{{ b.name }}</div>
							<div class="muted">{{ b.items }} Items</div>
						</div>
					</div>
					<div class="amount">Rs {{ b.total }}</div>
				</div>
				<div class="muted" style="font-size:12px; margin:8px 0;">Rs {{ b.spent }} spent</div>
				<ProgressBar :value="b.spent / b.total" />
				<div class="muted remain">Rs {{ b.total - b.spent }} remaining</div>
				<div class="details">
					<button class="icon-btn" title="edit" @click="openEdit(i)">✏️</button>
					<button class="icon-btn" title="delete" @click="remove(b.id)">🗑️</button>
					<button 
						@click="viewBudgetDetails(b.id)" 
						class="muted" 
						style="text-decoration:none; background:none; border:none; cursor:pointer; color:var(--muted); font-size:12px;"
					>
						view details
					</button>
				</div>
			</div>
		</div>

		<!-- Edit Modal -->
		<div v-if="isEditOpen" class="modal-overlay" @click.self="closeEdit">
			<div class="modal-card">
				<div class="modal-header">
					<div class="modal-title">Edit Budget</div>
					<button class="modal-close" @click="closeEdit">×</button>
				</div>
				<form @submit.prevent="updateBudget" class="modal-body">
					<label class="field">
						<span class="label">Name</span>
						<input class="input" v-model="editForm.name" type="text" placeholder="Budget name" />
					</label>
					<label class="field">
						<span class="label">Icon</span>
						<select class="input" v-model="editForm.icon">
							<option v-for="icon in iconOptions" :key="icon" :value="icon">{{ icon }}</option>
						</select>
					</label>
					<label class="field">
						<span class="label">Total Budget</span>
						<input class="input" v-model.number="editForm.total" type="number" placeholder="0" />
					</label>
					<label class="field">
						<span class="label">Spent</span>
						<input class="input" v-model.number="editForm.spent" type="number" placeholder="0" />
					</label>
					<label class="field">
						<span class="label">Items</span>
						<input class="input" v-model.number="editForm.items" type="number" placeholder="0" />
					</label>
					<div class="actions-end">
						<button type="submit" class="button button-dark">Update Budget</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Create Modal -->
		<div v-if="isCreateOpen" class="modal-overlay" @click.self="closeCreate">
			<div class="modal-card">
				<div class="modal-header">
					<div class="modal-title">Create Budget</div>
					<button class="modal-close" @click="closeCreate">×</button>
				</div>
				<form @submit.prevent="createBudget" class="modal-body">
					<label class="field">
						<span class="label">Name</span>
						<input class="input" v-model="createForm.name" type="text" placeholder="Budget name" />
					</label>
					<label class="field">
						<span class="label">Icon</span>
						<select class="input" v-model="createForm.icon">
							<option v-for="icon in iconOptions" :key="icon" :value="icon">{{ icon }}</option>
						</select>
					</label>
					<label class="field">
						<span class="label">Total Budget</span>
						<input class="input" v-model.number="createForm.total" type="number" placeholder="0" />
					</label>
					<label class="field">
						<span class="label">Spent</span>
						<input class="input" v-model.number="createForm.spent" type="number" placeholder="0" />
					</label>
					<label class="field">
						<span class="label">Items</span>
						<input class="input" v-model.number="createForm.items" type="number" placeholder="0" />
					</label>
					<div class="actions-end">
						<button type="submit" class="button button-dark">Create Budget</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<style scoped>
.cards-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
}
.create-card {
	height: 180px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-style: dashed;
}
.budget-card { min-height: 180px; }
.card-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.left { display:flex; align-items:center; gap:12px; }
.emoji { font-size: 28px; }
.card-title { font-weight: 700; }
.amount { font-weight: 700; font-size: 22px; }
.remain { font-size: 12px; text-align: right; margin-top: 6px; }
.details { text-align: right; margin-top: 10px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; }

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

@media (max-width: 980px) {
	.cards-grid { grid-template-columns: 1fr; }
}
</style>


