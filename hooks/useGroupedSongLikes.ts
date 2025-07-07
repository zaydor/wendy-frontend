import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const SONG_LIKES_STORAGE_KEY = 'likedSongUrisByUser';

type SongLikesByUser = Record<string, string[]>; // uid -> array of song URIs

export function useGroupedSongLikes() {
	const [songLikesByUser, setSongLikesByUser] = useState<SongLikesByUser>({});

	// Load from AsyncStorage on mount
	useEffect(() => {
		AsyncStorage.getItem(SONG_LIKES_STORAGE_KEY).then((stored) => {
			if (stored) {
				try {
					const obj = JSON.parse(stored) as SongLikesByUser;
					setSongLikesByUser(obj);
				} catch {
					setSongLikesByUser({});
				}
			}
		});
	}, []);

	// Save to AsyncStorage whenever songLikesByUser changes
	useEffect(() => {
		AsyncStorage.setItem(
			SONG_LIKES_STORAGE_KEY,
			JSON.stringify(songLikesByUser)
		);
	}, [songLikesByUser]);

	// Toggle like/unlike for a specific user and song URI
	function toggleSongLike(uid: string, songUri: string) {
		setSongLikesByUser((prev) => {
			const prevLikes = prev[uid] ? new Set(prev[uid]) : new Set<string>();
			if (prevLikes.has(songUri)) {
				prevLikes.delete(songUri);
			} else {
				prevLikes.add(songUri);
			}
			return { ...prev, [uid]: Array.from(prevLikes) };
		});
	}

	// Check if a specific song is liked by a user
	function isSongLiked(uid: string, songUri: string) {
		return !!songLikesByUser[uid]?.includes(songUri);
	}

	return { songLikesByUser, toggleSongLike, isSongLiked };
}
