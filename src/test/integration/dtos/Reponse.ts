import { Exeption } from './Exception';

export class ResponseDto<T> {
	public isSuccess!: boolean;
	public error?: Exeption;
	public value?: T;
}
