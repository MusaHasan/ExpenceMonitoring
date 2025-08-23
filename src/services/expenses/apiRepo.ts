import { ExpensesRepository, Expense } from './types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, {
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return (await res.json()) as T;
}

export const apiRepo: ExpensesRepository = {
	async list() {
		return http<Expense[]>('/expenses');
	},
	async create(expense) {
		return http<Expense>('/expenses', {
			method: 'POST',
			body: JSON.stringify(expense),
		});
	},
	async update(id, expense) {
		return http<Expense>(`/expenses/${id}`, {
			method: 'PUT',
			body: JSON.stringify(expense),
		});
	},
	async delete(id) {
		await http<void>(`/expenses/${id}`, { method: 'DELETE' });
	},
};

