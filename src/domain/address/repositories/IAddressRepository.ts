import { IRepository } from '@core/interfaces/IRepository';
import { Address } from '@domain/address/entities/Address';

export interface IAddressRepository extends IRepository<Address> {
    getPerClientNeeds(date: Date): Promise<{clientId: string, recipeId: string, quantity: number}[]>;
    getClientsForDeliveredInformation(date: Date): Promise<any[]>;
    getAddressByDateAndClientId(clientId: number, date: Date): Promise<Address | null>;
}
