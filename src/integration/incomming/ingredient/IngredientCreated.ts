import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

export class IngredientCreated extends IntegrationMessage {
	public IngredienteId: string;
	public Nombre: string;
	public UnidadId: number;

	constructor(ingredientId: string, name: string, unitId: number) {
		super();
		this.IngredienteId = ingredientId;
		this.Nombre = name;
		this.UnidadId = unitId;
	}
}

