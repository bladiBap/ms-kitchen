import 'reflect-metadata';
import { HandlerRegistry } from './HandlerRegistry';
export const EVENT_HANDLER_METADATA   = Symbol('EVENT_HANDLER_METADATA');

export function EventHandlerOutbox(outboxClass: any, contentClass: any): ClassDecorator {
	return (target: any) => {
		HandlerRegistry.registerMany(outboxClass, target);
		HandlerRegistry.registerOutboxRelation(contentClass, outboxClass);
		Reflect.defineMetadata(EVENT_HANDLER_METADATA, outboxClass, target);
	};
}
