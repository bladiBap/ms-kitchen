export interface PackageItemDTO {
	id: string;
	recipe: {
		id: string;
		name: string;
	}
	quantity: number;
}

export interface PackageDTO {
	id: string;
	orderId: string;
	code: string;
	statusPackage: number;
	client: {
		id: string;
		name: string;
	},
	address: {
		latitude: number;
		longitude: number;
		reference: string;
	};
	datePackage: Date;
	listPackageItems: PackageItemDTO[];
}
