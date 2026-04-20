import { Exception } from '@core/results/Exception';
import { StatusPackage } from '@domain/package/types/StatusPackage';

export class PackageError {
	public static codeIsRequired(): Exception {
		return Exception.ValidationError('Code is required.');
	}

	public static canNotChangeStatus ( currentStatus: StatusPackage, newStatus: StatusPackage ) : Exception {
		return Exception.ValidationError(`Cannot change order status from ${currentStatus} to ${newStatus}.`);
	}

	public static packageMustHaveAtLeastOneItem(): Exception {
		return Exception.ValidationError('The package must have at least one item.');
	}

	public static cannotAddItemToDeliveredPackage(): Exception {
		return Exception.ValidationError('Cannot add item to a package that is already DELIVERED.');
	}
}
