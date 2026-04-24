import { object } from 'zod';
import { dateOnlyProperty } from '@api/zod/common/dateOnlyProperty';

export const GetOrderByDayBodySchema = object({
	date: dateOnlyProperty,
});
