import { BudgetsRepository, Budget } from './types';

const STORAGE_KEY = 'budgets_v1';

function read(): Budget[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as Budget[]) : [];
	} catch {
		return [];
	}
}

function write(data: Budget[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId(): string {
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const localStorageRepo: BudgetsRepository = {
	async list() {
		return read();
	},
	async create(budget) {
		const item: Budget = { id: generateId(), ...budget };
		const data = read();
		data.push(item);
		write(data);
		return item;
	},
	async update(id, budget) {
		const data = read();
		const idx = data.findIndex((b) => b.id === id);
		if (idx !== -1) {
			data[idx] = { id, ...budget };
			write(data);
			return data[idx];
		}
		throw new Error('Budget not found');
	},
	async delete(id) {
		const data = read().filter((b) => b.id !== id);
		write(data);
	},
};

