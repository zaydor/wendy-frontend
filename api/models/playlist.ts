import { Base } from '@/api/models/base';
import { Image } from '@/api/models/image';
import { SpotifyUser } from '@/api/models/spotify-user';
import { Tracks } from '@/api/models/tracks';

export interface PlaylistProps {
	collaborative: boolean;
	description: string;
	external_urls: Record<string, any>;
	followers: Record<string, any>;
	href: string;
	id: string;
	images: Image[];
	name: string;
	owner: SpotifyUser;
	primary_color: string | null;
	isPublic: boolean;
	snapshot_id: string;
	tracks: Tracks;
	type: string;
	uri: string;
}

export class Playlist extends Base implements PlaylistProps {
	collaborative: boolean;
	description: string;
	external_urls: Record<string, any>;
	followers: Record<string, any>;
	href: string;
	id: string;
	images: Image[];
	name: string;
	owner: SpotifyUser;
	primary_color: string | null;
	isPublic: boolean;
	snapshot_id: string;
	tracks: Tracks;
	type: string;
	uri: string;

	constructor({
		collaborative,
		description,
		external_urls,
		followers,
		href,
		id,
		images,
		name,
		owner,
		primary_color,
		isPublic,
		snapshot_id,
		tracks,
		type,
		uri,
	}: PlaylistProps) {
		super();
		this.collaborative = collaborative;
		this.description = description;
		this.external_urls = external_urls;
		this.followers = followers;
		this.href = href;
		this.id = id;
		this.images = images;
		this.name = name;
		this.owner = owner;
		this.primary_color = primary_color;
		this.isPublic = isPublic;
		this.snapshot_id = snapshot_id;
		this.tracks = tracks;
		this.type = type;
		this.uri = uri;
	}

	static from_json(json_data: Record<string, unknown>): Playlist {
		return new Playlist({
			collaborative: json_data.collaborative as boolean,
			description: json_data.description as string,
			external_urls: json_data.external_urls as Record<string, any>,
			followers: json_data.followers as Record<string, any>,
			href: json_data.href as string,
			id: json_data.id as string,
			images: (json_data.images as Record<string, unknown>[]).map((image) =>
				Image.from_json(image)
			),
			name: json_data.name as string,
			owner: SpotifyUser.from_json(json_data.owner as Record<string, unknown>),
			primary_color: json_data.primary_color as string | null,
			isPublic: json_data.public as boolean,
			snapshot_id: json_data.snapshot_id as string,
			tracks: Tracks.from_json(json_data.tracks as Record<string, unknown>),
			type: json_data.type as string,
			uri: json_data.uri as string,
		});
	}
}
