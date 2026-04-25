import { IRepository } from '@core/interfaces/IRepository';
import { Calendar } from '@domain/calendar/entities/Calendar';

export const ICalendarRepositoryToken = Symbol.for('ICalendarRepository');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICalendarRepository extends IRepository<Calendar> {

}
