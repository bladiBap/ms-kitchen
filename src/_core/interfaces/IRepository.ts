import { Pagination } from '@core/model/Pagination';

export interface IRepository<T> {
	create(entity: T): Promise<T>;
	getById(id: string): Promise<T | null>;
	update(entity: T): Promise<T>;
	delete(id: string): Promise<void>;
	getAll(paginacion: Pagination): Promise<T[]>;
}
