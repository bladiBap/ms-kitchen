import axios, {
	type AxiosInstance,
	type AxiosResponse,
	type Method,
} from 'axios';

export class HttpClientBuilder {
	private _baseUrl = 'http://localhost:3000';
	private _relativeUrl = '/';
	private _method: Method = 'GET';
	private _body: unknown = undefined;
	private _headers: Record<string, string> = {};

	withUrl(url: string, method: Method = 'GET') {
		this._relativeUrl = url.startsWith('/') ? url : `/${url}`;
		this._method = method;
		return this;
	}

	withRequestBody(
		body: unknown,
		relativeUrl: string,
		method: Method = 'POST'
	) {
		this._body = body;
		this._relativeUrl = relativeUrl.startsWith('/')
			? relativeUrl
			: `/${relativeUrl}`;
		this._method = method;
		return this;
	}

	withHeader(key: string, value: string) {
		this._headers[key] = value;
		return this;
	}

	async send<T>(): Promise<AxiosResponse<T>> {
		const client: AxiosInstance = axios.create({ baseURL: this._baseUrl });
		return client.request<T>({
			url: this._relativeUrl,
			method: this._method,
			data: this._body,
			headers: this._headers,
			validateStatus: () => true,
		});
	}
}
