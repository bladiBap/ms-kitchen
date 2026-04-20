export class PackageError {
    
	public static notFoundById (id: number): Error {
		return new Error(`Package with id ${id} not found.`);
	}
}