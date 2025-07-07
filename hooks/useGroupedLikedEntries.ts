import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'likedWendyEntryIdsByUser';

type LikesByUser = Record<string, number[]>; // uid -> array of entry IDs

export function useGroupedLikedEntries() {
	const [likesByUser, setLikesByUser] = useState<LikesByUser>({});

	// Load from AsyncStorage on mount
	useEffect(() => {
		AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
			if (stored) {
				try {
					const obj = JSON.parse(stored) as LikesByUser;
					setLikesByUser(obj);
				} catch {
					setLikesByUser({});
				}
			}
		});
	}, []);

	// Save to AsyncStorage whenever likesByUser changes
	useEffect(() => {
		AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(likesByUser));
	}, [likesByUser]);

	// Toggle like/unlike for a specific user and entry
	function toggleLike(uid: string, entryId: number) {
		setLikesByUser((prev) => {
			const prevLikes = prev[uid] ? new Set(prev[uid]) : new Set<number>();
			if (prevLikes.has(entryId)) {
				prevLikes.delete(entryId);
			} else {
				prevLikes.add(entryId);
			}
			return { ...prev, [uid]: Array.from(prevLikes) };
		});
	}

	// Check if a specific entry is liked by a user
	function isLiked(uid: string, entryId: number) {
		return !!likesByUser[uid]?.includes(entryId);
	}

	return { likesByUser, toggleLike, isLiked };
}
