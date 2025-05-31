import { Image } from '@/api/models/image';
import { SpotifyUser } from '@/api/models/spotify-user';
import { Playlist } from './playlist';
import { Tracks } from './tracks';
import { WendyEntry } from './wendy-entry';

export interface WendyProps {
	name: string;
	description: string;
	followers: Record<string, any>;
	href: string;
	id: string;
	owner: SpotifyUser;
	uri: string;
	images: Image[];
	wendyTracks: WendyEntry[];
}

export class Wendy implements WendyProps {
	name: string;
	description: string;
	followers: Record<string, any>;
	href: string;
	id: string;
	owner: SpotifyUser;
	uri: string;
	images: Image[];
	wendyTracks: WendyEntry[];
	numberOfWendies: number;

	constructor(playlist: Playlist) {
		this.name = playlist.name;
		this.description = playlist.description;
		this.followers = playlist.followers;
		this.href = playlist.href;
		this.id = playlist.id;
		this.owner = playlist.owner;
		this.uri = playlist.uri;
		this.images = playlist.images;
		this.wendyTracks = this.convertTracksToWendyEntries(playlist.tracks);
		this.numberOfWendies = this.wendyTracks.length;
	}

	convertTracksToWendyEntries(tracks: Tracks): WendyEntry[] {
		const entries: WendyEntry[] = [];
		let currentTracks: string[] = [];
		let entryId = 1;

		for (const item of tracks.items) {
			const trackUri = item.track.uri;
			if (trackUri === EXCLUDED_TRACK_URI) continue;

			currentTracks.push(trackUri);

			if (currentTracks.length === 4) {
				entries.push(
					new WendyEntry({
						id: entryId++,
						wendyTracks: [...currentTracks],
						added_at: item.added_at,
						added_by: item.added_by,
					})
				);
				currentTracks = [];
			}
		}

		// Add any remaining tracks as a final entry
		if (currentTracks.length > 0) {
			const lastItem = tracks.items[tracks.items.length - 1];
			entries.push(
				new WendyEntry({
					id: entryId++,
					wendyTracks: [...currentTracks],
					added_at: lastItem.added_at,
					added_by: lastItem.added_by,
				})
			);
		}

		return entries;
	};
}
