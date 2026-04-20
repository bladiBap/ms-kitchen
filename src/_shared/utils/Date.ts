export class DateUtils {

	static formatDate(date: Date | string): Date {
		if (typeof date === 'string') {
			date = new Date(date);
		}
        
		const year = date.getFullYear();
		const month = (Number) ((date.getMonth() + 1).toString().padStart(2, '0'));
		const day = (Number) (date.getDate().toString().padStart(2, '0'));
        
		const newDate = new Date(year, month - 1, day);
		return newDate;
	}

	static yesterday(date: Date): Date {
		const yesterday = new Date(date);
		yesterday.setDate(date.getDate() - 1);
		return this.formatDate(yesterday);
	}

	static tomorrow(date: Date ): Date {
		const tomorrow = new Date(date);
		tomorrow.setDate(date.getDate() + 1);
		return this.formatDate(tomorrow);
	}

	static addDays(date: Date, days: number): Date {
		const newDate = new Date(date);
		newDate.setDate(date.getDate() + days);
		return this.formatDate(newDate);
	}
}