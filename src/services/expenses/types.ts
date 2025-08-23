export interface Expense {
	id: string | number;
	name: string;
	amount: number;
	date: string;
}

export interface ExpensesRepository {
	list(): Promise<Expense[]>;
	create(expense: Omit<Expense, 'id'>): Promise<Expense>;
	update(id: string | number, expense: Omit<Expense, 'id'>): Promise<Expense>;
	delete(id: string | number): Promise<void>;
}
