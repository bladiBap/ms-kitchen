import { v4 as uuidv4 } from 'uuid';

import { PackageItem } from '@domain/package/entities/PackageItem';

jest.mock('uuid', () => ({
	v4: jest.fn(),
}));

const mockedUuidv4 = uuidv4 as unknown as jest.Mock;

describe('PackageItem', () => {
	beforeEach(() => {
		mockedUuidv4.mockReset();
	});

	it('creates a new package item with generated id and provided values', () => {
		mockedUuidv4.mockReturnValue('package-item-id-1');

		const packageItem = PackageItem.createNew('recipe-1', 'package-1', 4);

		expect(packageItem.getId()).toBe('package-item-id-1');
		expect(packageItem.getRecipeId()).toBe('recipe-1');
		expect(packageItem.getPackageId()).toBe('package-1');
		expect(packageItem.getQuantity()).toBe(4);
	});
});
