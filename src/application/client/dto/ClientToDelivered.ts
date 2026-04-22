export interface IRecipeDTO {
    id: string;
    name: string;
}

export interface IAddressDTO {
    id: string;
    address: string;
    reference: string;
    latitude: number;
    longitude: number;
}

export interface IClientDeliveredDTO {
    id: string;
    clientName: string;
    address: IAddressDTO;
    recipes: IRecipeDTO[];
}

