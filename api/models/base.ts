export abstract class Base {
	to_json(): Record<string, unknown> {
		const json: Record<string, unknown> = {};
		for (const key of Object.keys(this)) {
			const value = (this as any)[key];
			if (typeof value !== 'function' && !key.startsWith('__')) {
				json[key] = value;
			}
		}
		return json;
	}

	static from_json<T extends Base>(
		this: new (...args: any[]) => T,
		json_data: Record<string, unknown>
	) {
		throw new Error('from_json must be implemented by subclasses');
	}
}
