import { IRepository } from '@core/interfaces/IRepository';
import { DailyAllocation } from '@domain/daily-allocation/entities/DailyAllocation';
import { AllocationLine } from '@domain/daily-allocation/entities/AllocationLine';
import { EntityManager } from 'typeorm';

export interface IDailyAllocationRepository extends IRepository<DailyAllocation> {
    findByDate(date: Date): Promise<DailyAllocation>;
    getDailyAllocation(clientId: string, date: Date): Promise<DailyAllocation | null>;
    updatedLines(lines: AllocationLine[], em?: EntityManager): Promise<void>;
}
