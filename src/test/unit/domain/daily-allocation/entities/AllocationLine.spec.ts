import { v4 as uuidv4 } from 'uuid';

import { AllocationLine } from '@domain/daily-allocation/entities/AllocationLine';
import { DomainException } from '@core/results/DomainException';
import { ExceptionType } from '@core/results/ExceptionType';

jest.mock('uuid', () => ({
	v4: jest.fn(),
}));

const mockedUuidv4 = uuidv4 as unknown as jest.Mock;

describe('AllocationLine', () => {
	beforeEach(() => {
		mockedUuidv4.mockReset();
	});

	it('creates a line with generated id and default packaged quantity', () => {
		mockedUuidv4.mockReturnValue('line-id-1');

		const line = AllocationLine.createNew('allocation-1', 'client-1', 'recipe-1', 5);

		expect(line.getId()).toBe('line-id-1');
		expect(line.getDailyAllocationId()).toBe('allocation-1');
		expect(line.getClientId()).toBe('client-1');
		expect(line.getRecipeId()).toBe('recipe-1');
		expect(line.getQuantityNeeded()).toBe(5);
		expect(line.getQuantityPackaged()).toBe(0);
		expect(line.remainingQuantityToPackage()).toBe(5);
	});

	it('throws when needed quantity is zero or below', () => {
		expect(() => new AllocationLine('line-1', 'allocation-1', 'client-1', 'recipe-1', 0)).toThrow(DomainException);

		try {
			new AllocationLine('line-1', 'allocation-1', 'client-1', 'recipe-1', 0);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'The needed quantity (0) must be greater than zero.',
				type: ExceptionType.ValidationError,
			});
		}
	});

	it('throws when initial packaged quantity exceeds needed quantity', () => {
		expect(() => new AllocationLine('line-1', 'allocation-1', 'client-1', 'recipe-1', 3, 4)).toThrow(DomainException);

		try {
			new AllocationLine('line-1', 'allocation-1', 'client-1', 'recipe-1', 3, 4);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'The packaged quantity (4) exceeds the needed quantity (3).',
				type: ExceptionType.ValidationError,
			});
		}
	});

	it('updates packaged quantity when value is valid', () => {
		const line = new AllocationLine('line-1', 'allocation-1', 'client-1', 'recipe-1', 6, 1);

		line.updateQuantityPackaged(4);

		expect(line.getQuantityPackaged()).toBe(4);
		expect(line.remainingQuantityToPackage()).toBe(2);
	});

	it('throws when updating packaged quantity above needed quantity', () => {
		const line = new AllocationLine('line-1', 'allocation-1', 'client-1', 'recipe-1', 6, 1);

		expect(() => line.updateQuantityPackaged(7)).toThrow(DomainException);

		try {
			line.updateQuantityPackaged(7);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'The packaged quantity (7) exceeds the needed quantity (6).',
				type: ExceptionType.ValidationError,
			});
		}
	});
});
