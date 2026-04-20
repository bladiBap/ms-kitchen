export class OrderExeption {

	public static notFoundById (id: number): Error {
		return new Error(`Order with id ${id} not found.`);
	}
}