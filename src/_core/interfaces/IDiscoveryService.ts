export interface IDiscoveryService {
	register(): Promise<void>;
	deregister(): Promise<void>;
}
