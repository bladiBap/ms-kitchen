import { PackageCompletedOutboxMessage } from '@domain/package/events/outbox/PackageCompletedOutboxMessage';

export const EventMap: Record<string, any> = {
	'PackageCompleted': PackageCompletedOutboxMessage,
};
