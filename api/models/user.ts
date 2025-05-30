import { Base } from '@/api/models/base';

export interface UserProps {
	name: string;
	email: string;
	uid: string;
}

export class User extends Base implements UserProps {
	name: string;
	email: string;
	uid: string;

	constructor({ name, email, uid }: UserProps) {
		super();
		this.name = name;
		this.email = email;
		this.uid = uid;
	}

	static from_json(json_data: Record<string, unknown>): User {
		return new User({
			name: json_data.name as string,
			email: json_data.email as string,
			uid: json_data.uid as string,
		});
	}
}
