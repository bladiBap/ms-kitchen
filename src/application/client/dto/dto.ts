export interface IRecipeDTO {
    id: number;
    name: string;
}

export interface IAddressDTO {
    id: number;
    address: string;
    reference: string;
    latitude: number;
    longitude: number;
}

export interface IClientDeliveredDTO {
    id: number;
    clientName: string;
    address: IAddressDTO;
    recipes: IRecipeDTO[];
}

