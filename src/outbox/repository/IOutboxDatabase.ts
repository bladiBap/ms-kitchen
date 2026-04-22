import { EntityManager } from 'typeorm';


export interface IOutboxDatabase {
    getManager (): EntityManager;
}