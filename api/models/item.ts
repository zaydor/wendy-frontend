import { SpotifyUser } from '@/api/models/spotify-user';
import { Track } from '@/api/models/track';

export interface ItemProps {
	added_at: string;
	added_by: SpotifyUser;
	is_local: boolean;
	primary_color: string | null;
	track: Track;
	video_thumbnail: Record<string, string>;
}

export class Item implements ItemProps {
	added_at: string;
	added_by: SpotifyUser;
	is_local: boolean;
	primary_color: string | null;
	track: Track;
	video_thumbnail: Record<string, string>;

	constructor({
		added_at,
		added_by,
		is_local,
		primary_color,
		track,
		video_thumbnail,
	}: ItemProps) {
		this.added_at = added_at;
		this.added_by = added_by;
		this.is_local = is_local;
		this.primary_color = primary_color;
		this.track = track;
		this.video_thumbnail = video_thumbnail;
	}

	static from_json(json_data: Record<string, unknown>): Item {
		return new Item({
			added_at: json_data.added_at as string,
			added_by: SpotifyUser.from_json(
				json_data.added_by as Record<string, unknown>
			),
			is_local: json_data.is_local as boolean,
			primary_color: json_data.primary_color as string | null,
			track: Track.from_json(json_data.track as Record<string, unknown>),
			video_thumbnail: json_data.video_thumbnail as Record<string, string>,
		});
	}
}
