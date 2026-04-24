import { EntityManager } from 'typeorm';

export const IOutboxDatabaseToken = Symbol.for('IOutboxDatabase');
export interface IOutboxDatabase {
    getManager (): EntityManager;
}
