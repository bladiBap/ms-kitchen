import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

export interface IIntegrationMessageConsumer<T extends IntegrationMessage> {
    /**
     * @param message El mensaje recibido que extiende de IntegrationMessage.
     * @param cancellationToken (Opcional) Token para cancelar la operación.
     */
    handle(message: T, cancellationToken?: AbortSignal): Promise<void>;
}
