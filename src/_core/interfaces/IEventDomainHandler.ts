export interface IEventDomainHandler<TEvent> {
    handle(event: TEvent): Promise<void>;
}
