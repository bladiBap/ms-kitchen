import { inject, injectable } from 'tsyringe';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { IUnitOfWork } from '@core/interfaces/IUnitOfWork';
import { AppDataSourceToken } from '@infrastructure/persistence/data-source/DataSource';

@injectable()
export class UnitOfWork implements IUnitOfWork {
	private queryRunner!: QueryRunner;
	private readonly dataSource: DataSource;
	private readonly ramdomName: string;

	constructor(@inject(AppDataSourceToken) dataSource: DataSource) {
		this.dataSource = dataSource;
		this.ramdomName = Math.random().toString(36).substring(2, 15);
	}

	async start(): Promise<void> {
		console.log(`Starting transaction with random name: ${this.ramdomName}`);
		this.queryRunner = this.dataSource.createQueryRunner();
		await this.queryRunner.connect();
		await this.queryRunner.startTransaction();
	}

	async commit(): Promise<void> {
		try {
			await this.queryRunner.commitTransaction();
		} catch (err) {
			await this.queryRunner.rollbackTransaction();
			throw err;
		} finally {
			await this.queryRunner.release();
		}
	}

	async rollback(): Promise<void> {
		try {
			await this.queryRunner.rollbackTransaction();
		} catch (err) {
			console.error('Error during transaction rollback:', err);
			throw err;
		} finally {
			await this.queryRunner.release();
		}
	}

	getEntityManager(): EntityManager {
		return this.queryRunner.manager;
	}
}
