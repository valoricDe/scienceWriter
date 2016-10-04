interface Array<T> {
	spliceWithArray(index: number, deleteCount?: number, newItems?: T[]): T[];
	observe(listener: (changeData: any) => void, fireImmediately?: boolean): any;
	intercept<T>(handler: any): any;
	clear(): T[];
	peek(): T[];
	replace(newItems: T[]): T[];
	find(predicate: (item: T, index: number, array: Array<T>) => boolean, thisArg?: any, fromIndex?: number): T;
	remove(value: T): boolean;
}