import { IRequest } from '@common/Core/Abstractions/IResquest';
import { IResult } from '@common/Core/Abstractions/IResult';

export class CreatePackageCommand implements IRequest<IResult> {
	_result!: IResult;
	constructor(
        public readonly clientId: number,
        public readonly date: Date,
        public readonly recipeIds: number[]
	) {}

}
