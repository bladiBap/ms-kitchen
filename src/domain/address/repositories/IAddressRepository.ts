import { IRepository } from '@core/interfaces/IRepository';
import { Address } from '@domain/address/entities/Address';

export const IAddressRepositoryToken = Symbol.for('IAddressRepository');
export interface IAddressRepository extends IRepository<Address> {
    getRecipesByClient(date: Date): Promise<{clientId: string, recipeId: string, quantity: number}[]>;
    getClientsForDeliveredInformation(date: Date): Promise<any[]>;
    getAddressByDateAndClientId(clientId: string, date: Date): Promise<Address | null>;
}
