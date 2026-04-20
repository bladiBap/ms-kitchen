import { EntityManager } from 'typeorm';

export const IUnitOfWorkToken = Symbol('IUnitOfWork');
export interface IUnitOfWork {
	start(): Promise<void>;
	commit(): Promise<void>;
	rollback(): Promise<void>;
	getEntityManager(): EntityManager;
}
