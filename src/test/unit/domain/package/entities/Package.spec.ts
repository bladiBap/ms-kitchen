import { v4 as uuidv4 } from 'uuid';

import { Package } from '@domain/package/entities/Package';
import { PackageItem } from '@domain/package/entities/PackageItem';
import { PackageCompletedEvent } from '@domain/package/events/PackageCompletedEvent';
import { StatusPackage } from '@domain/package/types/StatusPackage';
import { DomainException } from '@core/results/DomainException';
import { ExceptionType } from '@core/results/ExceptionType';

jest.mock('uuid', () => ({
	v4: jest.fn(),
}));

const mockedUuidv4 = uuidv4 as unknown as jest.Mock;

describe('Package', () => {
	beforeEach(() => {
		mockedUuidv4.mockReset();
	});

	it('creates a new package with generated id and provided values', () => {
		mockedUuidv4.mockReturnValue('package-id-1');
		const datePackage = new Date('2026-04-25T00:00:00.000Z');

		const pkg = Package.createNew('order-1', 'PKG-001', StatusPackage.CREATED, 'client-1', 'address-1', datePackage);

		expect(pkg.getId()).toBe('package-id-1');
		expect(pkg.getOrderId()).toBe('order-1');
		expect(pkg.getCode()).toBe('PKG-001');
		expect(pkg.getStatusPackage()).toBe(StatusPackage.CREATED);
		expect(pkg.getClientId()).toBe('client-1');
		expect(pkg.getAddressId()).toBe('address-1');
		expect(pkg.getDatePackage()).toEqual(datePackage);
		expect(pkg.getListPackageItems()).toHaveLength(0);
		expect(pkg.isCompleted()).toBe(false);
	});

	it('throws validation error when code is empty', () => {
		expect(() => new Package('package-1', 'order-1', '   ', StatusPackage.CREATED, 'client-1', 'address-1', new Date('2026-04-25T00:00:00.000Z'))).toThrow(DomainException);

		try {
			new Package('package-1', 'order-1', '   ', StatusPackage.CREATED, 'client-1', 'address-1', new Date('2026-04-25T00:00:00.000Z'));
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'Code is required.',
				type: ExceptionType.ValidationError,
			});
		}
	});

	it('adds package items when package is in created status', () => {
		const item = new PackageItem('item-1', 'recipe-1', 'package-1', 2);
		const pkg = new Package('package-1', 'order-1', 'PKG-001', StatusPackage.CREATED, 'client-1', 'address-1', new Date('2026-04-25T00:00:00.000Z'));

		pkg.addPackageItem(item);

		expect(pkg.getListPackageItems()).toHaveLength(1);
		expect(pkg.getListPackageItems()[0]).toBe(item);
	});

	it('throws when adding items to a completed package', () => {
		const item = new PackageItem('item-1', 'recipe-1', 'package-1', 2);
		const pkg = new Package('package-1', 'order-1', 'PKG-001', StatusPackage.COMPLETED, 'client-1', 'address-1', new Date('2026-04-25T00:00:00.000Z'));

		expect(() => pkg.addPackageItem(item)).toThrow(DomainException);

		try {
			pkg.addPackageItem(item);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'Cannot add item to a package that is already DELIVERED.',
				type: ExceptionType.ValidationError,
			});
		}
	});

	it('changes package status to completed and emits completed event', () => {
		const pkg = new Package('package-1', 'order-1', 'PKG-001', StatusPackage.CREATED, 'client-1', 'address-1', new Date('2026-04-25T00:00:00.000Z'));

		pkg.changeToCompleted();

		expect(pkg.getStatusPackage()).toBe(StatusPackage.COMPLETED);
		expect(pkg.isCompleted()).toBe(true);
		expect(pkg.getDomainEvents()).toHaveLength(1);
		expect(pkg.getDomainEvents()[0]).toBeInstanceOf(PackageCompletedEvent);
		expect(pkg.getDomainEvents()[0]).toMatchObject({
			orderId: 'order-1',
			packageId: 'package-1',
		});
	});

	it('throws when changing status to completed from a non-created status', () => {
		const pkg = new Package('package-1', 'order-1', 'PKG-001', StatusPackage.COMPLETED, 'client-1', 'address-1', new Date('2026-04-25T00:00:00.000Z'));

		expect(() => pkg.changeToCompleted()).toThrow(DomainException);

		try {
			pkg.changeToCompleted();
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'Cannot change order status from 1 to 1.',
				type: ExceptionType.ValidationError,
			});
		}
	});
});
