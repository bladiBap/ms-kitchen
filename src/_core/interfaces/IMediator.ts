import { IRequest } from '@core/interfaces/IRequest';

export interface IMediator {
	send<TResponse>(request: IRequest<TResponse>): Promise<TResponse>;
	publish<TEvent>(event: TEvent): Promise<void>;
}
