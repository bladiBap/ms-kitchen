export interface IEventHandlerOutbox<TEvent> {
    handle(event: TEvent): Promise<void>;
}
