import { EntityManager } from 'typeorm';

export const IEntityManagerProviderToken = Symbol('IEntityManagerProvider');

export interface IEntityManagerProvider {
    getManager(): EntityManager;
}
