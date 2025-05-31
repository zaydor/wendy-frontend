import { api } from '@/api/api-client';
import { Playlist } from '@/api/models/playlist';
import {
	ApiResponse,
	AuthUrlResponse,
	DataResponse,
	ErrorResponse,
	StandardResponse,
} from '@/api/models/responses';
import { REDIRECT_URI, WENDY_PLAYLIST_ID } from '@/constants/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { Tracks } from './models/tracks';
import { Wendy } from './models/wendy';

const spotifyWendyQueryKey = ['wendyPlaylist'];

export const localStoragePersistor = createAsyncStoragePersister({
	storage: AsyncStorage,
	key: 'wendy-playlist-cache',
});

export const getWendyQueryOptions = () => {
	return queryOptions({
		queryKey: spotifyWendyQueryKey,
		queryFn: getWendy,
		staleTime: Infinity,
		gcTime: 1000 * 60 * 60 * 24,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchOnMount: false,
	});
};

export const useWendy = () => {
	const query = useQuery({
		...getWendyQueryOptions(),
	});

	if (query.data) {
		console.log('Using CACHED Wendy data - no API call needed!');
	}

	return query;
};

export const useAuthorizeSpotify = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (auth_url: string) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: requestSpotifyAuthorization,
		onSuccess: (data) => {
			if (data.status === 200) {
				const res: AuthUrlResponse = data as AuthUrlResponse;
				const auth_url = res.auth_url;
				onSuccess?.(auth_url);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

export const useSpotifyCallback = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: (code: string) => spotifyCallback(code),
		onSuccess: (data: ApiResponse) => {
			if (data.status === 200) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const spotifyCallback = async (code: string): Promise<ApiResponse> => {
	const params = {
		code: code,
		redirect_uri: REDIRECT_URI,
	};
	return await api.get('/callback', { params });
};

const requestSpotifyAuthorization = async (): Promise<ApiResponse> => {
	const params = {
		redirect_uri: REDIRECT_URI,
	};
	return await api.get('/authorize', {
		params: params,
	});
};

const getPlaylist = async (playlist_id: string): Promise<ApiResponse> => {
	const params = {
		playlist_id: playlist_id,
	};
	return await api.get('/playlists', { params });
};

export const useAvailableDevices = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: getAvailableDevices,
		onSuccess: (data: ApiResponse) => {
			if (data.status === 200) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const getAvailableDevices = async (): Promise<ApiResponse> => {
	return await api.get('/me/player/devices');
};

export const useGetCurrentlyPlaying = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: getCurrentlyPlaying,
		onSuccess: (data: ApiResponse) => {
			if (data.status === 200) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const getCurrentlyPlaying = async (): Promise<ApiResponse> => {
	return await api.get('/me/player/currently-playing');
};

export const useStartPlayback = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: ({
			device_id,
			context_uri,
			uris,
			offset,
			position,
		}: {
			device_id: string;
			context_uri: string;
			uris: string[];
			offset?: number;
			position?: number;
		}) => startPlayback(device_id, context_uri, uris, offset, position),
		onSuccess: (data: ApiResponse) => {
			if (data.status === 204) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const startPlayback = async (
	device_id: string,
	context_uri: string,
	uris: string[],
	offset?: number,
	position?: number
): Promise<ApiResponse> => {
	const params = {
		device_id: device_id,
		context_uri: context_uri,
		uris: uris,
		offset: offset ? offset : undefined,
		position: position ? position : undefined,
	};
	return await api.put('/me/player/play', { params });
};

export const usePausePlayback = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: pausePlayback,
		onSuccess: (data: ApiResponse) => {
			if (data.status === 204) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const pausePlayback = async (device_id: string): Promise<ApiResponse> => {
	const params = {
		device_id: device_id,
	};
	return await api.put('/me/player/pause', { params });
};

export const useSkipToNext = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: skipToNext,
		onSuccess: (data: ApiResponse) => {
			if (data.status === 204) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const skipToNext = async (device_id: string): Promise<ApiResponse> => {
	const params = {
		device_id: device_id,
	};
	return await api.post('/me/player/next', { params });
};

export const useSkipToPrevious = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: skipToPrevious,
		onSuccess: (data: ApiResponse) => {
			if (data.status === 204) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const skipToPrevious = async (device_id: string): Promise<ApiResponse> => {
	const params = {
		device_id: device_id,
	};
	return await api.post('/me/player/previous', { params });
};

export const useSeekToPosition = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: ({
			device_id,
			position_ms,
		}: {
			device_id: string;
			position_ms: number;
		}) => seekToPosition(device_id, position_ms),
		onSuccess: (data: ApiResponse) => {
			if (data.status === 204) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const seekToPosition = async (
	device_id: string,
	position_ms: number
): Promise<ApiResponse> => {
	const params = {
		device_id: device_id,
		position_ms: position_ms,
	};
	return await api.put('/me/player/seek', { params });
};

export const useSetRepeatMode = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: ({
			device_id,
			state,
		}: {
			device_id: string;
			state: 'off' | 'track' | 'context';
		}) => setRepeatMode(device_id, state),
		onSuccess: (data: ApiResponse) => {
			if (data.status === 204) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const setRepeatMode = async (
	device_id: string,
	state: 'off' | 'track' | 'context'
): Promise<ApiResponse> => {
	const params = {
		device_id: device_id,
		state: state,
	};
	return await api.put('/me/player/repeat', { params });
};

export const useToggleShuffle = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: ({ device_id, state }: { device_id: string; state: boolean }) =>
			toggleShuffle(device_id, state),
		onSuccess: (data: ApiResponse) => {
			if (data.status === 204) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const toggleShuffle = async (
	device_id: string,
	state: boolean
): Promise<ApiResponse> => {
	const params = {
		device_id: device_id,
		state: state,
	};
	return await api.put('/me/player/shuffle', { params });
};

export const useGetRecentlyPlayedTracks = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: ({
			limit,
			after,
			before,
		}: {
			limit: number;
			after: number;
			before: number;
		}) => getRecentlyPlayedTracks(limit, after, before),
		onSuccess: (data: ApiResponse) => {
			if (data.status === 200) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const getRecentlyPlayedTracks = async (
	limit: number,
	after: number,
	before: number
): Promise<ApiResponse> => {
	const params = {
		limit: limit,
		after: after,
		before: before,
	};
	return await api.get('/me/player/recently-played', { params });
};

export const useGetUserQueue = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: getUserQueue,
		onSuccess: (data: ApiResponse) => {
			if (data.status === 200) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const getUserQueue = async (): Promise<ApiResponse> => {
	return await api.get('/me/player/queue');
};

export const useAddToQueue = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: ({ uri, device_id }: { uri: string; device_id: string }) =>
			addToQueue(uri, device_id),
		onSuccess: (data: ApiResponse) => {
			if (data.status === 204) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const addToQueue = async (
	uri: string,
	device_id: string
): Promise<ApiResponse> => {
	const params = {
		uri: uri,
		device_id: device_id,
	};
	return await api.post('/me/player/queue', { params });
};

export const useGetCurrentSpotifyUserProfile = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: getCurrentSpotifyUserProfile,
		onSuccess: (data: ApiResponse) => {
			if (data.status === 200) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const getCurrentSpotifyUserProfile = async (): Promise<ApiResponse> => {
	return await api.get('/me');
};

export const useAddTracksToPlaylist = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: ({
			playlist_id,
			uris,
		}: {
			playlist_id: string;
			uris: string[];
		}) => addTracksToPlaylist(playlist_id, uris),
		onSuccess: (data: ApiResponse) => {
			if (data.status === 201) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const addTracksToPlaylist = async (
	playlist_id: string,
	uris: string[]
): Promise<ApiResponse> => {
	const params = {
		playlist_id: playlist_id,
		uris: uris,
	};
	return await api.post('/playlists/tracks', { params });
};

export const useGetArtist = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (data: StandardResponse) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: (artist_id: string) => getArtist(artist_id),
		onSuccess: (data: ApiResponse) => {
			if (data.status === 200) {
				const res: StandardResponse = data as StandardResponse;
				onSuccess?.(res);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const getArtist = async (artist_id: string): Promise<ApiResponse> => {
	const params = {
		artist_id: artist_id,
	};
	return await api.get('/artists', { params });
};

export const getWendy = async (): Promise<Wendy> => {
	const playlist_response = await getPlaylist(WENDY_PLAYLIST_ID);
	if (playlist_response.status !== 200) {
		throw new Error('Failed to fetch Wendy playlist');
	}
	const playlist = Playlist.from_json((playlist_response as DataResponse).data);
	console.log('Wendy Playlist fetched from API:', playlist.name);
	let hasNext = true;
	let offset = playlist.tracks.items.length;

	while (hasNext) {
		const params = {
			playlist_id: playlist.id,
			limit: 100,
			offset,
		};
		const response = (await api.get('/playlists/tracks', {
			params,
		})) as DataResponse;
		const tracks = Tracks.from_json(response.data);

		if (tracks && tracks.items) {
			playlist.tracks.items = playlist.tracks.items.concat(tracks.items);
		}

		if (tracks && tracks.next) {
			offset += tracks.items.length;
		} else {
			hasNext = false;
		}
	}
	return new Wendy(playlist);
};
