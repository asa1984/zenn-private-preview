import { ResultAsync, Result, ok, err } from "neverthrow";
import matter from "gray-matter";
import yaml from "js-yaml";
import type { ZodError, ZodSchema } from "zod";

export function zodToResult<T, E>(
  schema: ZodSchema<T>,
  errorFn: (e: ZodError<T>) => E,
): (data: unknown) => Result<T, E> {
  return (data: unknown) => {
    const parseResult = schema.safeParse(data);
    return parseResult.success
      ? ok(parseResult.data)
      : err(errorFn(parseResult.error));
  };
}

export function throwableToResult<T, E>(
  fn: () => T,
  errorFn: (e: unknown) => E,
): Result<T, E> {
  return Result.fromThrowable(fn, errorFn)();
}

export function throwableToResultAsync<T, E>(
  fn: () => Promise<T>,
  errorFn: (e: unknown) => E,
): ResultAsync<T, E> {
  return ResultAsync.fromThrowable(fn, errorFn)();
}

export async function readFileText(
  filepath: string,
): Promise<Result<string, string>> {
  const file = Bun.file(filepath);
  const exists = await file.exists();
  if (!exists) return err(`${filepath}が見つかりません。`);

  return throwableToResultAsync(
    async () => {
      const text = await file.text();
      return text;
    },
    () => `${filepath}の読み取りに失敗しました。`,
  );
}

export function parseFrontmatter(
  raw: string,
): Result<ReturnType<typeof matter>, string> {
  return throwableToResult(
    () => matter(raw),
    () => "Frontmatterのパースに失敗しました。",
  );
}

export function parseYaml(
  raw: string,
): Result<ReturnType<typeof yaml.load>, string> {
  return throwableToResult(
    () => yaml.load(raw),
    () => "YAMLのパースに失敗しました。",
  );
}
