import { readFileText, parseFrontmatter, zodToResult } from "./helper";
import { env } from "./env";
import fs from "node:fs/promises";
import z from "zod";
import { ok, err } from "neverthrow";

export type Article = {
  slug: string;
  title: string;
  emoji: string;
  type: "tech" | "idea";
  topics: string[];
  published: boolean;
  markdown: string;
};

export type ArticleMeta = Omit<Article, "markdown">;

const articleFrontmatterSchema = z.object({
  title: z.string(),
  emoji: z.string(),
  type: z.union([z.literal("tech"), z.literal("idea")]),
  topics: z.array(z.string()),
  published: z.boolean(),
});

const parseArticleFrontmatter = zodToResult(
  articleFrontmatterSchema,
  (e) => e.message,
);

export async function getAllArticleMetas(): Promise<ArticleMeta[]> {
  const files = await fs.readdir(`${env.ZENN_DIR}/articles`, {
    withFileTypes: true,
  });

  const results = await Promise.all(
    files.map((file) =>
      readFileText(`${env.ZENN_DIR}/articles/${file.name}`).then((result) => {
        const slug = file.name.replace(/\.md$/, "");

        const meta = result
          .andThen((text) => parseFrontmatter(text))
          .andThen(({ data }) => parseArticleFrontmatter(data))
          .map((validated) => ({ ...validated, slug }));
        return meta;
      }),
    ),
  );

  const metas = results
    .filter((result) => result.isOk())
    .map((result) => result.value);

  return metas;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const path = `${env.ZENN_DIR}/articles/${slug}.md`;
  const file = Bun.file(path);
  if (!(await file.exists())) return null;
  const raw = await file.text();

  const article = parseFrontmatter(raw)
    .andThen(({ data, content }) => {
      const result = parseArticleFrontmatter(data);
      if (result.isErr()) return err(result.error);
      return ok({ ...result.value, markdown: content });
    })
    .map((validated) => ({ ...validated, slug }));

  return article.unwrapOr(null);
}
