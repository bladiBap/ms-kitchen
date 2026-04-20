import { singleton, container } from 'tsyringe';
import { IMediator } from '@core/interfaces/IMediator';
import { IRequest } from '@core/interfaces/IRequest';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

@singleton()
export class Mediator implements IMediator {
	async send<TResponse>(request: IRequest<TResponse>): Promise<TResponse> {
		const token = request.constructor.name;
		const handler = container.resolve<IRequestHandler<IRequest<TResponse>, TResponse>>(token);
		return await handler.handle(request);
	}
	async publish<TEvent>(event: TEvent): Promise<void> {
		console.log('Event published:', event);
		return Promise.resolve();
	}
}
