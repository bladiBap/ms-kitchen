import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

class IngredientItem {
	public Id: string;
	public CantidadValor: number;

	constructor(id: string, cantidadValor: number) {
		this.Id = id;
		this.CantidadValor = cantidadValor;
	}
}

export class RecipeCreated extends IntegrationMessage {
	public RecetaId: string;
	public Nombre: string;
	public Instrucciones: string;
	public IngredientesId: IngredientItem[];

	constructor(recetaId: string, nombre: string, instrucciones: string, ingredientesId: IngredientItem[]) {
		super();
		this.RecetaId = recetaId;
		this.Nombre = nombre;
		this.Instrucciones = instrucciones;
		this.IngredientesId = ingredientesId;
	}
}
