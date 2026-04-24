
import { container } from 'tsyringe';
import { Result } from '@core/results/Result';
import { IUnitOfWork, IUnitOfWorkToken } from '@core/interfaces/IUnitOfWork';
import { handlerError } from '@shared/utils/Handlers';

/**
 * Decorador para manejar transacciones en métodos de handlers.
 * Inicia una transacción antes de ejecutar el método, y luego hace commit o rollback dependiendo del resultado.
 * @returns Un descriptor de método modificado para manejar transacciones.
 */
export function Transactional() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const uow = container.resolve<IUnitOfWork>(IUnitOfWorkToken);
			await uow.start();
			try {
				const result: Result = await originalMethod.apply(this, args);
				if (result.isFailure) {
					console.log('aplicando rollback por resultado de operación fallida');
					await uow.rollback();
					return result;
				} else {
					console.log('aplicando commit por resultado de operación exitosa');
					await uow.commit();
					return result;
				}
			} catch (error) {
				console.error('\x1b[31m%s\x1b[0m', 'Error en el handler, aplicando rollback:', error);
				await uow.rollback();
				return handlerError(error);
			}
		};

		return descriptor;
	};
}

/**
 *	Decorador para manejar transacciones en event handlers.
 *	Inicia una transacción antes de ejecutar el handler, y luego hace commit o rollback dependiendo del resultado.
 * @returns Un descriptor de método modificado para manejar transacciones en event handlers.
 */
export function TransactionalEventHandler() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const uow = container.resolve<IUnitOfWork>(IUnitOfWorkToken);
			await uow.start();
			try {
				await originalMethod.apply(this, args);
				await uow.commit();
			} catch (error) {
				console.error('\x1b[31m%s\x1b[0m', 'Error en el event handler, aplicando rollback:', error);
				await uow.rollback();
			}
		};

		return descriptor;
	};
}

export function TransactionalWithResult() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const uow = container.resolve<IUnitOfWork>(IUnitOfWorkToken);
			await uow.start();
			try {
				const result: unknown = await originalMethod.apply(this, args);
				await uow.commit();
				return result;
			} catch (error) {
				console.error('\x1b[31m%s\x1b[0m', 'Error en el handler, aplicando rollback:', error);
				await uow.rollback();
				return handlerError(error);
			}
		};
		return descriptor;
	}
}
