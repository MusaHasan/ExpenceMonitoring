import { BudgetsRepository, Budget } from './types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, {
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return (await res.json()) as T;
}

export const apiRepo: BudgetsRepository = {
	async list() {
		return http<Budget[]>('/budgets');
	},
	async create(budget) {
		return http<Budget>('/budgets', {
			method: 'POST',
			body: JSON.stringify(budget),
		});
	},
	async update(id, budget) {
		return http<Budget>(`/budgets/${id}`, {
			method: 'PUT',
			body: JSON.stringify(budget),
		});
	},
	async delete(id) {
		await http<void>(`/budgets/${id}`, { method: 'DELETE' });
	},
};



