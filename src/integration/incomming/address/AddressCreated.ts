import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

export class AddressCreated extends IntegrationMessage {
	public CalendarioId: string;
	public DireccionId: string;
	public Fecha: Date;
	public Direccion: string;
	public Latitud: number;
	public Longitud: number;

	constructor(
		calendarioId: string,
		direccionId: string,
		fecha: Date,
		direccion: string,
		latitud: number,
		longitud: number
	) {
		super();
		this.CalendarioId = calendarioId;
		this.DireccionId = direccionId;
		this.Fecha = fecha;
		this.Direccion = direccion;
		this.Latitud = latitud;
		this.Longitud = longitud;
	}
}
