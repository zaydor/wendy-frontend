import { API_URL } from '@/constants/env';

type RequestOptions = {
	method?: string;
	headers?: Record<string, string>;
	body?: any;
	cookie?: string;
	params?: Record<string, string | number | boolean | undefined | null>;
	cache?: RequestCache;
};

function buildUrlWithParams(
	url: string,
	params?: RequestOptions['params']
): string {
	if (!params) return url;
	const filteredParams = Object.fromEntries(
		Object.entries(params).filter(
			([, value]) => value !== undefined && value !== null
		)
	);

	if (Object.keys(filteredParams).length === 0) return url;
	const queryString = new URLSearchParams(
		filteredParams as Record<string, string>
	).toString();

	return `${url}?${queryString}`;
}

async function fetchApi<T>(
	url: string,
	options: RequestOptions = {}
): Promise<T> {
	const { method = 'GET', headers, body, params, cache = 'no-store' } = options;

	const fullUrl = buildUrlWithParams(`${API_URL}${url}`, params);

	let fetchBody: BodyInit | undefined = undefined;
	let fetchHeaders: Record<string, string> = { ...headers };

	if (body instanceof FormData) {
		fetchBody = body;
		delete fetchHeaders['Content-Type'];
	} else if (body !== undefined) {
		fetchBody = JSON.stringify(body);
		fetchHeaders['Content-Type'] = 'application/json';
	}

	const response = await fetch(fullUrl, {
		method,
		headers: fetchHeaders,
		body: fetchBody,
		cache,
		mode: 'cors',
		credentials: 'include',
	});

	return response as T;
}

export const api = {
	get<T>(url: string, options?: RequestOptions): Promise<T> {
		return fetchApi<T>(url, { ...options, method: 'GET' });
	},
	post<T>(url: string, options?: RequestOptions): Promise<T> {
		return fetchApi<T>(url, { ...options, method: 'POST' });
	},
	put<T>(url: string, options?: RequestOptions): Promise<T> {
		return fetchApi<T>(url, { ...options, method: 'PUT' });
	},
	delete<T>(url: string, options?: RequestOptions): Promise<T> {
		return fetchApi<T>(url, { ...options, method: 'DELETE' });
	},
	patch<T>(url: string, options?: RequestOptions): Promise<T> {
		return fetchApi<T>(url, { ...options, method: 'PATCH' });
	},
};
