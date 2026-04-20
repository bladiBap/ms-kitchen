import { Exception } from '@core/results/Exception';

export class AllocationLineError {

	public static quantityPackagedExceedsNeeded(quantityPackaged: number, quantityNeeded: number) : Exception {
		return Exception.ValidationError(`The packaged quantity (${quantityPackaged}) exceeds the needed quantity (${quantityNeeded}).`);
	}

	public static quantityNeededMustBeGreaterThanZero(quantityNeeded: number) : Exception {
		return Exception.ValidationError(`The needed quantity (${quantityNeeded}) must be greater than zero.`);
	}
}
