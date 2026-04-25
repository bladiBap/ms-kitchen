import { v4 as uuidv4 } from 'uuid';

import { DailyAllocation } from '@domain/daily-allocation/entities/DailyAllocation';
import { AllocationLine } from '@domain/daily-allocation/entities/AllocationLine';

jest.mock('uuid', () => ({
	v4: jest.fn(),
}));

const mockedUuidv4 = uuidv4 as unknown as jest.Mock;

describe('DailyAllocation', () => {
	beforeEach(() => {
		mockedUuidv4.mockReset();
	});

	it('creates a daily allocation with generated id and no lines', () => {
		mockedUuidv4.mockReturnValue('allocation-id-1');
		const date = new Date('2026-04-25T00:00:00.000Z');

		const allocation = DailyAllocation.createNew(date);

		expect(allocation.getId()).toBe('allocation-id-1');
		expect(allocation.getDate()).toEqual(date);
		expect(allocation.getLines()).toHaveLength(0);
	});

	it('adds lines to the allocation', () => {
		const line = new AllocationLine('line-1', 'allocation-1', 'client-1', 'recipe-1', 3, 1);
		const allocation = new DailyAllocation('allocation-1', new Date('2026-04-25T00:00:00.000Z'));

		allocation.addLine(line);

		expect(allocation.getLines()).toHaveLength(1);
		expect(allocation.getLines()[0]).toBe(line);
	});

	it('returns true when client has all requested recipes', () => {
		const allocation = new DailyAllocation('allocation-1', new Date('2026-04-25T00:00:00.000Z'), [
			new AllocationLine('line-1', 'allocation-1', 'client-1', 'recipe-1', 2, 0),
			new AllocationLine('line-2', 'allocation-1', 'client-1', 'recipe-2', 1, 0),
			new AllocationLine('line-3', 'allocation-1', 'client-2', 'recipe-3', 4, 0),
		]);

		expect(allocation.clientHasAllRecipes('client-1', ['recipe-1', 'recipe-2'])).toBe(true);
	});

	it('returns false when at least one requested recipe is missing for the client', () => {
		const allocation = new DailyAllocation('allocation-1', new Date('2026-04-25T00:00:00.000Z'), [
			new AllocationLine('line-1', 'allocation-1', 'client-1', 'recipe-1', 2, 0),
			new AllocationLine('line-2', 'allocation-1', 'client-2', 'recipe-2', 1, 0),
		]);

		expect(allocation.clientHasAllRecipes('client-1', ['recipe-1', 'recipe-2'])).toBe(false);
	});

	it('returns true for empty recipe list (vacuous truth)', () => {
		const allocation = new DailyAllocation('allocation-1', new Date('2026-04-25T00:00:00.000Z'), [
			new AllocationLine('line-1', 'allocation-1', 'client-1', 'recipe-1', 2, 0),
		]);

		expect(allocation.clientHasAllRecipes('client-1', [])).toBe(true);
	});
});
