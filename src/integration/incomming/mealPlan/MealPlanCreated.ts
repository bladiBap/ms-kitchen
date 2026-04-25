// {
//   "PlanId": "86ee207a-4de3-487e-88df-bd17a811346a",
//   "PacienteId": "8fe998c5-bf70-49f9-ba34-17149b9aef8d",
//   "FechaInicio": "2026-04-22T00:00:00",
//   "Duracion": 30,
//   "Requerido": true,
//   "Dietas": [
//     {
//       "DietaId": "5a3f7578-3c87-4e32-85f6-c9dc768bb273",
//       "FechaConsumo": "2026-04-22T00:00:00",
//       "Recetas": [
//         {
//           "RecetaId": "e5555555-5555-5555-5555-555555555555",
//           "Orden": 1,
//           "TiempoId": 1
//         },
//         {
//           "RecetaId": "c3333333-3333-3333-3333-333333333333",
//           "Orden": 2,
//           "TiempoId": 2
//         }
//       ]
//     },
//     {
//       "DietaId": "4bb23acf-62ed-4d88-b100-f116e890aee8",
//       "FechaConsumo": "2026-04-23T00:00:00",
//       "Recetas": [
//         {
//           "RecetaId": "d4444444-4444-4444-4444-444444444444",
//           "Orden": 1,
//           "TiempoId": 1
//         }
//       ]
//     }
//   ],
//   "Id": "055cef4f-5266-4f3c-acdd-9985ce94a717",
//   "CreatedAt": "2026-04-24T21:00:13.2823809+00:00",
//   "CorrelationId": null,
//   "Source": null
// }

import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

class Receta {
	public RecetaId: string;

	constructor(RecetaId: string) {
		this.RecetaId = RecetaId;
	}
}

class Dieta {
	public DietaId: string;
	public FechaConsumo: Date;
	public Recetas: Receta[];

	constructor(DietaId: string, FechaConsumo: Date, Recetas: Receta[]) {
		this.DietaId = DietaId;
		this.FechaConsumo = FechaConsumo;
		this.Recetas = Recetas;
	}
}


export class MealPlanCreated extends IntegrationMessage {
	public PlanId: string;
	public PacienteId: string;
	public FechaInicio: Date;
	public Duracion: number;
	public Requerido: boolean;
	public Dietas: Dieta[];

	constructor(
		PlanId: string,
		PacienteId: string,
		FechaInicio: Date,
		Duracion: number,
		Requerido: boolean,
		Dietas: Dieta[]
	) {
		super();
		this.PlanId = PlanId;
		this.PacienteId = PacienteId;
		this.FechaInicio = FechaInicio;
		this.Duracion = Duracion;
		this.Requerido = Requerido;
		this.Dietas = Dietas;
	}
}
