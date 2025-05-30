import { Album } from '@/api/models/album';
import { Artist } from '@/api/models/artist';
import { Base } from '@/api/models/base';

export interface TrackProps {
	album: Album;
	artists: Artist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	episode: boolean;
	explicit: boolean;
	external_ids: Record<string, string>;
	external_urls: Record<string, string>;
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string | null;
	track: boolean;
	track_number: number;
	type: string;
	uri: string;
}

export class Track extends Base implements TrackProps {
	album: Album;
	artists: Artist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	episode: boolean;
	explicit: boolean;
	external_ids: Record<string, string>;
	external_urls: Record<string, string>;
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string | null;
	track: boolean;
	track_number: number;
	type: string;
	uri: string;

	constructor({
		album,
		artists,
		available_markets,
		disc_number,
		duration_ms,
		episode,
		explicit,
		external_ids,
		external_urls,
		href,
		id,
		is_local,
		name,
		popularity,
		preview_url,
		track,
		track_number,
		type,
		uri,
	}: TrackProps) {
		super();
		this.album = album;
		this.artists = artists;
		this.available_markets = available_markets;
		this.disc_number = disc_number;
		this.duration_ms = duration_ms;
		this.episode = episode;
		this.explicit = explicit;
		this.external_ids = external_ids;
		this.external_urls = external_urls;
		this.href = href;
		this.id = id;
		this.is_local = is_local;
		this.name = name;
		this.popularity = popularity;
		this.preview_url = preview_url;
		this.track = track;
		this.track_number = track_number;
		this.type = type;
		this.uri = uri;
	}

	static from_json(json_data: Record<string, unknown>): Track {
		return new Track({
			album: Album.from_json(json_data['album'] as Record<string, unknown>),
			artists: (json_data['artists'] as Artist[]) || [],
			available_markets: (json_data['available_markets'] as string[]) || [],
			disc_number: json_data['disc_number'] as number,
			duration_ms: json_data['duration_ms'] as number,
			episode: json_data['episode'] as boolean,
			explicit: json_data['explicit'] as boolean,
			external_ids: json_data['external_ids'] as Record<string, string>,
			external_urls: json_data['external_urls'] as Record<string, string>,
			href: json_data['href'] as string,
			id: json_data['id'] as string,
			is_local: json_data['is_local'] as boolean,
			name: json_data['name'] as string,
			popularity: json_data['popularity'] as number,
			preview_url: json_data['preview_url'] as string | null,
			track: json_data['track'] as boolean,
			track_number: json_data['track_number'] as number,
			type: json_data['type'] as string,
			uri: json_data['uri'] as string,
		});
	}
}
