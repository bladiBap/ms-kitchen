import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

export class AddressUpdated extends IntegrationMessage {
	public CalendarioId: string;
	public DireccionId: string;
	public Fecha: Date;
	public NuevaDireccion: string;
	public NuevaLatitud: number;
	public NuevaLongitud: number;

	constructor(
		calendarioId: string,
		direccionId: string,
		fecha: Date,
		nuevaDireccion: string,
		nuevaLatitud: number,
		nuevaLongitud: number
	) {
		super();
		this.CalendarioId = calendarioId;
		this.DireccionId = direccionId;
		this.Fecha = fecha;
		this.NuevaDireccion = nuevaDireccion;
		this.NuevaLatitud = nuevaLatitud;
		this.NuevaLongitud = nuevaLongitud;
	}
}
