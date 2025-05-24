export type BaseEntity = {
	id: string;
	createdAt: number;
};

export type Entity<T> = {
	[K in keyof T]: T[K];
} & BaseEntity;

export type User = Entity<{
	name: string;
	email: string;
}>;

export type AuthResponse = {
	user: User;
	status: number;
};
