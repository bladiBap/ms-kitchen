import { EntityManager } from 'typeorm';
import { IRepository } from '@core/interfaces/IRepository';
import { DailyAllocation } from '@domain/daily-allocation/entities/DailyAllocation';
import { AllocationLine } from '@domain/daily-allocation/entities/AllocationLine';

export const IDailyAllocationRepositoryToken = Symbol('IDailyAllocationRepository');

export interface IDailyAllocationRepository extends IRepository<DailyAllocation> {
    getByDate(date: Date): Promise<DailyAllocation | null>;
    getDailyAllocation(clientId: string, date: Date): Promise<DailyAllocation | null>;
    updatedLines(lines: AllocationLine[], em?: EntityManager): Promise<void>;
	getClientsIdsByDate(date: Date): Promise<string[]>;
}
