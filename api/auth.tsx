import { api } from '@/api/api-client';
import {
	ApiResponse,
	DataResponse,
	ErrorResponse,
} from '@/api/models/responses';
import { User, UserProps } from '@/api/models/user';
import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { z } from 'zod';

const userQueryKey = ['user'];

export const getUser = async (): Promise<User> => {
	const response = await api.get('/me');
	if (response.status !== 200) {
		throw new Error('Failed to fetch user');
	}
	const res: DataResponse = response as DataResponse;
	const user = User.from_json(res.data);
	return user;
};

export const getUserQueryOptions = () => {
	return queryOptions({
		queryKey: userQueryKey,
		queryFn: getUser,
	});
};

export const useUser = () => useQuery(getUserQueryOptions());

export const useLogin = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (user: UserProps) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: loginWithEmailAndPassword,
		onSuccess: (data: ApiResponse) => {
			if (data.status === 200) {
				const res: DataResponse = data as DataResponse;
				const user: User = User.from_json(res.data);
				queryClient.setQueryData(userQueryKey, user);
				onSuccess?.(user);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

export const useRegister = ({
	onSuccess,
	onError,
}: {
	onSuccess?: (user: UserProps) => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: registerWithEmailAndPassword,
		onSuccess: (data: ApiResponse) => {
			if (data.status === 200) {
				const res: DataResponse = data as DataResponse;
				const user: User = User.from_json(res.data);
				queryClient.setQueryData(userQueryKey, user);
				onSuccess?.(user);
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

export const useLogout = ({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: (error: ErrorResponse) => void;
}) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: logout,
		onSuccess: (data: ApiResponse) => {
			if (data.status === 200) {
				queryClient.setQueryData(userQueryKey, null);
				onSuccess?.();
			} else {
				const res: ErrorResponse = data as ErrorResponse;
				onError?.(res);
			}
		},
	});
};

const registerWithEmailAndPassword = (
	data: RegisterInput
): Promise<ApiResponse> => {
	const formData = new FormData();
	formData.append('email', data.email);
	formData.append('name', data.name);
	formData.append('password', data.password);
	formData.append('confirm', data.confirm);
	return api.post('/register', {
		body: formData,
	});
};

const loginWithEmailAndPassword = async (
	data: LoginInput
): Promise<ApiResponse> => {
	const formData = new FormData();
	formData.append('email', data.email);
	formData.append('password', data.password);
	return await api.post('/login', {
		body: formData,
	});
};

const logout = async (): Promise<ApiResponse> => {
	return await api.get('/logout');
};

export const loginInputSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchema = z
	.object({
		email: z
			.string()
			.email('Invalid email address')
			.min(1, 'Email is required'),
		name: z.string().min(1, 'Name is required'),
		password: z.string().min(6, 'Password must be at least 6 characters long'),
		confirm: z.string().min(6, 'Password must be at least 6 characters long'),
	})
	.refine((data) => data.password === data.confirm, {
		message: 'Passwords do not match',
		path: ['confirm'],
	});

export type RegisterInput = z.infer<typeof registerInputSchema>;
