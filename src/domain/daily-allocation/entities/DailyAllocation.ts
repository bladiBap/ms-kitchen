import { v4 as uuidv4 } from 'uuid';
import { AggregateRoot } from '@core/abstraction/AgregateRoot';
import { AllocationLine } from '@domain/daily-allocation/entities/AllocationLine';

export class DailyAllocation extends AggregateRoot {
	private date: Date;
	private lines: AllocationLine[];

	constructor(id: string, date: Date, lines: AllocationLine[] = []) {
		super(id);
		this.date = date;
		this.lines = lines;
	}

	public static createNew(date: Date): DailyAllocation {
		return new DailyAllocation(uuidv4(), date);
	}

	public addLine(line: AllocationLine) {
		this.lines.push(line);
	}

	public clientHasAllRecipes(clientId: string, recipesIds: string[]): boolean {
		const clientRecipeIds = new Set(
			this.lines
				.filter(line => line.getClientId() === clientId)
				.map(line => line.getRecipeId())
		);
		return recipesIds.every(recipeId => clientRecipeIds.has(recipeId));
	}

	public getLines(): AllocationLine[] {
		return this.lines;
	}

	public getDate(): Date {
		return this.date;
	}
}
