export type ApiResponse =
	| StandardResponse
	| ErrorResponse
	| AuthUrlResponse
	| TokenInfoResponse
	| DataResponse;

export function createApiResponse(json: any): ApiResponse {
	if (isErrorResponse(json)) {
		return json as ErrorResponse;
	}
	if (isAuthUrlResponse(json)) {
		return json as AuthUrlResponse;
	}
	if (isTokenInfoResponse(json)) {
		return json as TokenInfoResponse;
	}
	if (isDataResponse(json)) {
		return json as DataResponse;
	}
	return json as StandardResponse;
}

export interface StandardResponse {
	message: string;
	status: number;
}

export interface ErrorResponse extends StandardResponse {
	error: string;
}

export interface AuthUrlResponse extends StandardResponse {
	auth_url: string;
}

export interface TokenInfoResponse extends StandardResponse {
	token_info: Record<string, unknown>;
}

export interface DataResponse extends StandardResponse {
	data: Record<string, unknown>;
}

export function isErrorResponse(resp: any): resp is ErrorResponse {
	return typeof resp?.error === 'string';
}

export function isAuthUrlResponse(resp: any): resp is AuthUrlResponse {
	return typeof resp?.auth_url === 'string';
}

export function isTokenInfoResponse(resp: any): resp is TokenInfoResponse {
	return typeof resp?.token_info === 'string';
}

export function isDataResponse(resp: any): resp is DataResponse {
	return typeof resp?.data === 'object' && resp.data !== null;
}
