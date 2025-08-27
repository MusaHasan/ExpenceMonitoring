import { ref } from 'vue';
import { apiRepo } from '../services/budgets/apiRepo';
import { localStorageRepo } from '../services/budgets/localStorageRepo';
import type { BudgetsRepository, Budget } from '../services/budgets/types';

export type DataSource = 'local' | 'api';

export function useBudgets() {
	const source = ref<DataSource>('local');
	const items = ref<Budget[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	function getRepo(): BudgetsRepository {
		return source.value === 'api' ? apiRepo : localStorageRepo;
	}

	async function seedLocalFromApiIfEmpty() {
		const current = await localStorageRepo.list();
		if (current.length === 0) {
			try {
				const apiItems = await apiRepo.list();
				for (const it of apiItems) {
					await localStorageRepo.create({ name: it.name, icon: it.icon, total: it.total, spent: it.spent, items: it.items });
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
			error.value = e?.message ?? 'Failed to load budgets';
		} finally {
			loading.value = false;
		}
	}

	async function create(payload: Omit<Budget, 'id'>) {
		await getRepo().create(payload);
		await refresh();
	}

	async function update(id: string | number, payload: Omit<Budget, 'id'>) {
		await getRepo().update(id, payload);
		await refresh();
	}

	async function remove(id: string | number) {
		await getRepo().delete(id);
		await refresh();
	}

	return { source, items, loading, error, refresh, create, update, remove };
}



