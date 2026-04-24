import { singleton, container } from 'tsyringe';
import { IMediator } from '@core/interfaces/IMediator';
import { IRequest } from '@core/interfaces/IRequest';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';
import { DomainEvent } from '@core/abstraction/DomainEvent';
import { OutboxMessage } from '@outbox/model/OutboxMessage';
import { HandlerRegistry } from '@shared/registry/HandlerRegistry';
import { IEventHandlerOutbox } from '@core/interfaces/IEventHandlerOutbox';
import { IEventDomainHandler } from '@core/interfaces/IEventDomainHandler';

@singleton()
export class Mediator implements IMediator {
	async send<TResponse>(request: IRequest<TResponse>): Promise<TResponse> {
		const token = request.constructor.name;
		const handler = container.resolve<IRequestHandler<IRequest<TResponse>, TResponse>>(token);
		return await handler.handle(request);
	}

	async publish(event: DomainEvent): Promise<void> {
		const token = event.constructor.name;
		const handler = container.resolve<IEventDomainHandler<DomainEvent>>(token);
		return await handler.handle(event);
	}

	async publishOutbox<TContent extends DomainEvent>(outboxMessage: OutboxMessage<TContent>): Promise<void> {
		const token = outboxMessage.content.constructor.name;
		const handler = container.resolve<IEventDomainHandler<OutboxMessage<TContent>>>(token);
		return await handler.handle(outboxMessage);
	}

	async publishOutboxMessage<TEvent extends DomainEvent>(message: OutboxMessage<TEvent>): Promise<void> {
		const content = message.content;

		if (!content) {
			console.error(`[Outbox] Mensaje ${message.id} ignorado por falta de contenido.`);
			return;
		}

		const contentConstructor = content.constructor;
		const specializedClass = HandlerRegistry.resolveOutboxClassFor(contentConstructor);

		let eventToPublish: any = message;

		if (specializedClass) {
			const specializedInstance = new specializedClass(content);
			Object.assign(specializedInstance, message);
			eventToPublish = specializedInstance;
		}

		const handlerTypes = HandlerRegistry.resolveMany(eventToPublish.constructor);

		if (handlerTypes.length === 0) {
			console.warn(`[Outbox] No se encontró un Handler para: ${eventToPublish.constructor.name}`);
			return;
		}

		const handlers = handlerTypes.map(t => container.resolve<IEventHandlerOutbox<any>>(t));

		const tasks = handlers.map(h => h.handle(eventToPublish));
		const results = await Promise.allSettled(tasks);

		this.handleResults(results, handlerTypes);
	}

	private handleResults(results: PromiseSettledResult<void>[], types: any[]) {
		results.forEach((r, i) => {
			if (r.status === 'rejected') {
				console.error(`[Outbox Error] en ${types[i].name}:`, r.reason);
				throw r.reason;
			}
		});
	}
}
