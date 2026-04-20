export interface OrderDTO {
    id: number;
    dateOrdered: string;
    dateCreatedOn: string;
    status: number;
    orderItems: OrderItemDTO[];
}

export interface OrderItemDTO {
    id: number;
    quantity: number;
    status: number;
    recipe: RecipeDTO;
}

export interface RecipeDTO {
    id: number;
    name: string;
    instructions: string;
    ingredients: IngredientDTO[];
}

export interface IngredientDTO {
    id: number;
    name: string;
    measurementUnit: MeasurementUnitDTO;
}

export interface MeasurementUnitDTO {
    id: number;
    name: string;
    simbol: string;
}