import { PackageAllCompletedOutboxMessage } from '@domain/package/events/outbox/PackageAllCompletedOutboxMessage';
import { PackageCompletedOutboxMessage } from '@domain/package/events/outbox/PackageCompletedOutboxMessage';

export const EventMap: Record<string, any> = {
	'PackageCompletedOutboxMessage': PackageCompletedOutboxMessage,
	'PackageAllCompletedOutboxMessage': PackageAllCompletedOutboxMessage
};
