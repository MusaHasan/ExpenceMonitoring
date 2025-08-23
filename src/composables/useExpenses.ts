import { ref } from 'vue';
import { apiRepo } from '../services/expenses/apiRepo';
import { localStorageRepo } from '../services/expenses/localStorageRepo';
import type { ExpensesRepository, Expense } from '../services/expenses/types';

export type DataSource = 'local' | 'api';

export function useExpenses() {
	const source = ref<DataSource>('local');
	const items = ref<Expense[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	function getRepo(): ExpensesRepository {
		return source.value === 'api' ? apiRepo : localStorageRepo;
	}

	async function seedLocalFromApiIfEmpty() {
		const current = await localStorageRepo.list();
		if (current.length === 0) {
			try {
				const apiItems = await apiRepo.list();
				for (const it of apiItems) {
					await localStorageRepo.create({ name: it.name, amount: it.amount, date: it.date });
				}
			} catch (e) {
				// ignore seed failures; user may be offline
			}
		}
	}

	async function refresh() {
		loading.value = true;
		error.value = null;
		try {
			if (source.value === 'local') {
				await seedLocalFromApiIfEmpty();
			}
			items.value = await getRepo().list();
		} catch (e: any) {
			error.value = e?.message ?? 'Failed to load expenses';
		} finally {
			loading.value = false;
		}
	}

	async function create(payload: Omit<Expense, 'id'>) {
		await getRepo().create(payload);
		await refresh();
	}

	async function update(id: string | number, payload: Omit<Expense, 'id'>) {
		await getRepo().update(id, payload);
		await refresh();
	}

	async function remove(id: string | number) {
		await getRepo().delete(id);
		await refresh();
	}

	return { source, items, loading, error, refresh, create, update, remove };
}
