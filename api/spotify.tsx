import { api } from '@/api/api-client';
import { Playlist, PlaylistProps } from '@/api/models/playlist';
import {
	ApiResponse,
	AuthUrlResponse,
	DataResponse,
	ErrorResponse,
	StandardResponse,
} from '@/api/models/responses';
import { REDIRECT_URI, WENDY_PLAYLIST_ID } from '@/constants/env';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const spotifyAuthQueryKey = ['spotifyAuthURL'];

export const useAuthorizeSpotify = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (auth_url: string) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	const queryClient = useQueryClient();
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

export const useWendyPlaylist = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (playlist: PlaylistProps) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	return useMutation({
		mutationFn: () => getPlaylist(WENDY_PLAYLIST_ID),
		onSuccess: (data: ApiResponse) => {
			if (data.status === 200) {
				const res: DataResponse = data as DataResponse;
				const playlist: Playlist = Playlist.from_json(res.data);
				onSuccess?.(playlist);
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
