import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().optional(),
  TZ: z.string().optional(),

  ZENN_DIR: z.string(),
  ZENN_GITHUB_REPOSITORY_URL: z.string().optional(),
  BASIC_AUTH_USERNAME: z.string().optional(),
  BASIC_AUTH_PASSWORD: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
