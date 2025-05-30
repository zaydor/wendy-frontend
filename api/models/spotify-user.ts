import { Base } from '@/api/models/base';

export interface SpotifyUserProps {
	external_urls: Record<string, string>;
	href: string;
	id: string;
	type: string;
	uri: string;
}

export class SpotifyUser extends Base implements SpotifyUserProps {
	external_urls: Record<string, string>;
	href: string;
	id: string;
	type: string;
	uri: string;

	constructor({ external_urls, href, id, type, uri }: SpotifyUserProps) {
		super();
		this.external_urls = external_urls;
		this.href = href;
		this.id = id;
		this.type = type;
		this.uri = uri;
	}

	static from_json(json_data: Record<string, unknown>): SpotifyUser {
		return new SpotifyUser({
			external_urls: json_data.external_urls as Record<string, string>,
			href: json_data.href as string,
			id: json_data.id as string,
			type: json_data.type as string,
			uri: json_data.uri as string,
		});
	}
}
