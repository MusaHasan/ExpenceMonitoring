import { ExpensesRepository, Expense } from './types';

const STORAGE_KEY = 'expenses_v1';

function read(): Expense[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as Expense[]) : [];
	} catch {
		return [];
	}
}

function write(data: Expense[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId(): string {
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const localStorageRepo: ExpensesRepository = {
	async list() {
		return read();
	},
	async create(expense) {
		const item: Expense = { id: generateId(), ...expense };
		const data = read();
		data.push(item);
		write(data);
		return item;
	},
	async update(id, expense) {
		const data = read();
		const idx = data.findIndex((e) => e.id === id);
		if (idx !== -1) {
			data[idx] = { id, ...expense };
			write(data);
			return data[idx];
		}
		throw new Error('Expense not found');
	},
	async delete(id) {
		const data = read().filter((e) => e.id !== id);
		write(data);
	},
};
