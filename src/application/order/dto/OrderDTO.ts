export interface OrderDTO {
    id: string;
    dateOrdered: string;
    dateCreatedOn: string;
    status: number;
    orderItems: OrderItemDTO[];
}

export interface OrderItemDTO {
    id: string;
    quantity: number;
    status: number;
    recipe: RecipeDTO;
}

export interface RecipeDTO {
    id: string;
    name: string;
    instructions: string;
    ingredients: IngredientDTO[];
}

export interface IngredientDTO {
    id: string;
    name: string;
	quantity: number;
    measurementUnit: MeasurementUnitDTO;
}

export interface MeasurementUnitDTO {
	id: number;
	name: string;
	simbol: string;
}
