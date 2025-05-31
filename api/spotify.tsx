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
