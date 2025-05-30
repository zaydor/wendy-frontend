import { Artist } from '@/api/models/artist';
import { Base } from '@/api/models/base';
import { Image } from '@/api/models/image';

export interface AlbumProps {
	album_type: string;
	artists: Artist[];
	available_markets: string[];
	external_urls: Record<string, string>;
	href: string;
	id: string;
	images: Image[];
	name: string;
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	type: string;
	uri: string;
}

export class Album extends Base implements AlbumProps {
	album_type: string;
	artists: Artist[];
	available_markets: string[];
	external_urls: Record<string, string>;
	href: string;
	id: string;
	images: Image[];
	name: string;
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	type: string;
	uri: string;

	constructor({
		album_type,
		artists,
		available_markets,
		external_urls,
		href,
		id,
		images,
		name,
		release_date,
		release_date_precision,
		total_tracks,
		type,
		uri,
	}: AlbumProps) {
		super();
		this.album_type = album_type;
		this.artists = artists;
		this.available_markets = available_markets;
		this.external_urls = external_urls;
		this.href = href;
		this.id = id;
		this.images = images;
		this.name = name;
		this.release_date = release_date;
		this.release_date_precision = release_date_precision;
		this.total_tracks = total_tracks;
		this.type = type;
		this.uri = uri;
	}

	static from_json(json_data: Record<string, unknown>): Album {
		return new Album({
			album_type: json_data['album_type'] as string,
			artists: (json_data['artists'] as Artist[]) || [],
			available_markets: (json_data['available_markets'] as string[]) || [],
			external_urls:
				(json_data['external_urls'] as Record<string, string>) || {},
			href: json_data['href'] as string,
			id: json_data['id'] as string,
			images: (json_data['images'] as Image[]) || [],
			name: json_data['name'] as string,
			release_date: json_data['release_date'] as string,
			release_date_precision: json_data['release_date_precision'] as string,
			total_tracks: json_data['total_tracks'] as number,
			type: json_data['type'] as string,
			uri: json_data['uri'] as string,
		});
	}
}
