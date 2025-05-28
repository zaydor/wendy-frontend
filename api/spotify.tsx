import { api } from '@/api/api-client';
import { REDIRECT_URI, WENDY_PLAYLIST_ID } from '@/constants/env';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const spotifyAuthQueryKey = ['spotifyAuthURL'];

export const useAuthorizeSpotify = ({
	onSuccess,
}: {
	onSuccess?: () => void;
}) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: requestSpotifyAuthorization,
		onSuccess: (data) => {
			console.log('from useAuthorizeSpotify: ', data);
			onSuccess?.();
		},
	});
};

export const useWendyPlaylist = ({ onSuccess }: { onSuccess?: () => void }) => {
	return useMutation({
		mutationFn: () => getPlaylist(WENDY_PLAYLIST_ID),
		onSuccess: (data) => {
			console.log(data);
			onSuccess?.();
		},
	});
};

const requestSpotifyAuthorization = async (): Promise<any> => {
	const params = {
		redirect_uri: REDIRECT_URI,
	};

	console.log('requestSpotifyAuthorization params: ', params);
	return await api.get('/authorize', {
		params: params,
	});
};

const getPlaylist = async (playlist_id: string): Promise<any> => {
	const params = {
		playlist_id: playlist_id,
	};
	return await api.get('/playlists', { params });
};
