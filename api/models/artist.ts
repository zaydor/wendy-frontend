import { Base } from '@/api/models/base';

export interface ArtistProps {
	external_urls: Record<string, string>;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

export class Artist extends Base implements ArtistProps {
	external_urls: Record<string, string>;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;

	constructor({ external_urls, href, id, name, type, uri }: ArtistProps) {
		super();
		this.external_urls = external_urls;
		this.href = href;
		this.id = id;
		this.name = name;
		this.type = type;
		this.uri = uri;
	}

	static from_json(json_data: Record<string, unknown>): Artist {
		return new Artist({
			external_urls: json_data.external_urls as Record<string, string>,
			href: json_data.href as string,
			id: json_data.id as string,
			name: json_data.name as string,
			type: json_data.type as string,
			uri: json_data.uri as string,
		});
	}
}
