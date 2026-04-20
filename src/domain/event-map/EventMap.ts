import { PackageCompleted } from '@domain/package/events/PackageCompleted';

export const EventMap: Record<string, any> = {
	'PackageCompleted': PackageCompleted,
};
