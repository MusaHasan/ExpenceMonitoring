export interface Budget {
	id: string | number;
	name: string;
	icon: string;
	total: number;
	spent: number;
	items: number;
}

export interface BudgetsRepository {
	list(): Promise<Budget[]>;
	create(budget: Omit<Budget, 'id'>): Promise<Budget>;
	update(id: string | number, budget: Omit<Budget, 'id'>): Promise<Budget>;
	delete(id: string | number): Promise<void>;
}

