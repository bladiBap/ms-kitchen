import { object } from 'zod';
import { dateOnlyProperty } from '@api/zod/common/dateOnlyProperty';

export const CreateOrderBodySchema = object({
	date: dateOnlyProperty,
});
