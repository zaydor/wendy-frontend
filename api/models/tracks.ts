import { Base } from '@/api/models/base';
import { Item } from '@/api/models/item';

export interface TracksProps {
	href: string;
	items: Item[];
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
}

export class Tracks extends Base implements TracksProps {
	href: string;
	items: Item[];
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;

	constructor({
		href,
		items,
		limit,
		next,
		offset,
		previous,
		total,
	}: TracksProps) {
		super();
		this.href = href;
		this.items = items;
		this.limit = limit;
		this.next = next;
		this.offset = offset;
		this.previous = previous;
		this.total = total;
	}

	static from_json(json_data: Record<string, unknown>): Tracks {
		return new Tracks({
			href: json_data.href as string,
			items: (json_data.items as Item[]) || [],
			limit: json_data.limit as number,
			next: json_data.next as string | null,
			offset: json_data.offset as number,
			previous: json_data.previous as string | null,
			total: json_data.total as number,
		});
	}
}
