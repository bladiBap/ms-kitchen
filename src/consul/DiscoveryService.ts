import { singleton } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import Consul from 'consul';

import { env } from '@shared/constants/env';
import { RegisterOptions } from 'consul/lib/agent/service';
import { IDiscoveryService } from '@core/interfaces/IDiscoveryService';

@singleton()
export class DiscoveryService implements IDiscoveryService {
    private consul: Consul;
    private readonly serviceId: string;
    private readonly serviceName: string;

    constructor() {
		this.serviceName = env.MS_KITCHEN_APP_NAME;
		this.serviceId = `${this.serviceName}-${uuidv4()}`;
        this.consul = new Consul({
            host: env.CONSUL_HOST,
            port: env.CONSUL_PORT,
        });
    }

    async register() {
        const registrationDetails: RegisterOptions = {
            name: this.serviceName,
            id: this.serviceId,
            address: env.MS_KITCHEN_APP_HOST,
            port: env.MS_KITCHEN_APP_PORT,
            check: {
				name: `Health Check for ${this.serviceId}`,
                http: `http://${env.MS_KITCHEN_APP_HOST}:${env.MS_KITCHEN_APP_PORT}/api/kitchen/health`,
                interval: env.CONSUL_INTERVAL,
                timeout: env.CONSUL_TIMEOUT,
				deregistercriticalserviceafter: env.CONSUL_DEREGISTER_AFTER
            }
        };

        try {
            await this.consul.agent.service.register(registrationDetails);
            console.log(`Registrado en Consul con ID: ${this.serviceId}`);
        } catch (err) {
            console.error('Error al registrar en Consul:', err);
        }
    }

    async deregister() {
        try {
            await this.consul.agent.service.deregister(this.serviceId);
            console.log(`Deregistrado de Consul con ID: ${this.serviceId}`);
        } catch (err) {
            console.error('Error al deregistrar en Consul:', err);
        }
    }
}
