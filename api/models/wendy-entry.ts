import { SpotifyUser } from './spotify-user';

export interface WendyEntryProps {
	id: number;
	wendyTracks: string[];
	added_at: string;
	added_by: SpotifyUser;
}

export class WendyEntry implements WendyEntryProps {
	id: number;
	wendyTracks: string[];
	added_at: string;
	added_by: SpotifyUser;

	constructor({ id, wendyTracks, added_at, added_by }: WendyEntryProps) {
		this.id = id;
		this.wendyTracks = wendyTracks;
		this.added_at = added_at;
		this.added_by = added_by;
	}
}
