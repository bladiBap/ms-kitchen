import { IRequest } from '@common/Core/Abstractions/IResquest';
import { IResult } from '@common/Core/Abstractions/IResult';

export class DeleteAddressCommand implements IRequest<IResult> {
	_result!: IResult;
	constructor(
        public readonly id: number
	) {}
}
