type Env = typeof process.env & {
	BASE_DIR: string;
};

export const env = process.env as Env;
