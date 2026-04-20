export interface IMapper<Domain, Entity> {
	toDomain(entity: Entity): Domain;
	toPersistence(domain: Domain): Entity;
}
