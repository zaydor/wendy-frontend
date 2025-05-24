import { api } from '@/api/api-client';
import { User } from '@/api/types';
import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { z } from 'zod';

const userQueryKey = ['user'];

export const getUser = async (): Promise<User> => {
	const response = (await api.get('/me')) as { data: any };
	return response.data;
};

export const getUserQueryOptions = () => {
	return queryOptions({
		queryKey: userQueryKey,
		queryFn: getUser,
	});
};

export const useUser = () => useQuery(getUserQueryOptions());

export const useLogin = ({ onSuccess }: { onSuccess?: () => void }) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: loginWithEmailAndPassword,
		onSuccess: (data) => {
			console.log('from auth: ', data);
			queryClient.setQueryData(userQueryKey, data.user);
			onSuccess?.();
		},
	});
};

export const useRegister = ({ onSuccess }: { onSuccess?: () => void }) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: registerWithEmailAndPassword,
		onSuccess: (data) => {
			console.log(data);
			queryClient.setQueryData(userQueryKey, data.user);
			onSuccess?.();
		},
	});
};

export const useLogout = ({ onSuccess }: { onSuccess?: () => void }) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.setQueryData(userQueryKey, null);
			onSuccess?.();
		},
	});
};

const registerWithEmailAndPassword = (data: RegisterInput): Promise<any> => {
	const formData = new FormData();
	formData.append('email', data.email);
	formData.append('name', data.name);
	formData.append('password', data.password);
	formData.append('confirm', data.confirm);
	return api.post('/register', {
		body: formData,
	});
};

const loginWithEmailAndPassword = async (data: LoginInput): Promise<any> => {
	const formData = new FormData();
	formData.append('email', data.email);
	formData.append('password', data.password);
	return await api.post('/login', {
		body: formData,
	});
};

const logout = (): Promise<void> => {
	return api.post('/logout');
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
