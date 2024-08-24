import fs from "node:fs/promises";
import z from "zod";
import { env } from "./env";
import {
  zodToResult,
  readFileText,
  readYaml,
  parseFrontmatter,
} from "./helper";

export type BookMeta = {
  slug: string;
  title: string;
  summary: string;
  topics: string[];
  published: boolean;
  price: number;
  chapterSlugs: string[];
};

export type Chapter = {
  slug: string;
  title: string;
  markdown: string;
};

const bookConfigSchema = z.object({
  title: z.string(),
  summary: z.string(),
  topics: z.array(z.string()),
  published: z.boolean(),
  price: z.number(),
  chapters: z.array(z.string()),
});

const chapterFrontmatterSchema = z.object({
  title: z.string(),
});

const parseBookConfig = zodToResult(bookConfigSchema, (e) => e.message);
const parseChapterFrontmatter = zodToResult(
  chapterFrontmatterSchema,
  (e) => e.message,
);

export async function getBookMetaBySlug(
  bookSlug: string,
): Promise<BookMeta | null> {
  const bookConfigPath = `${env.ZENN_DIR}/books/${bookSlug}/config.yaml`;
  const result = await readYaml(bookConfigPath);
  return result
    .andThen(parseBookConfig)
    .map(({ chapters, ...rest }) => ({
      ...rest,
      slug: bookSlug,
      chapterSlugs: chapters,
    }))
    .unwrapOr(null);
}

export async function getAllBookMetas(): Promise<BookMeta[]> {
  const bookDirs = await fs.readdir(`${env.ZENN_DIR}/books`, {
    withFileTypes: true,
  });
  const results = await Promise.all(
    bookDirs.map(async (bookDir) => getBookMetaBySlug(bookDir.name)),
  );
  return results.filter((result) => result !== null);
}

export async function getChapterBySlug(
  bookSlug: string,
  chapterSlug: string,
): Promise<Chapter | null> {
  const bookDir = `${env.ZENN_DIR}/books/${bookSlug}`;
  const chapterFilePath = `${bookDir}/${chapterSlug}.md`;
  const chapterRawResult = await readFileText(chapterFilePath);
  const chapterResult = chapterRawResult
    .andThen(parseFrontmatter)
    .andThen(({ data, content }) =>
      parseChapterFrontmatter(data).map(({ title }) => ({
        slug: chapterSlug,
        title,
        markdown: content,
      })),
    );
  return chapterResult.unwrapOr(null);
}

export async function getAllChapters(bookSlug: string): Promise<Chapter[]> {
  const meta = await getBookMetaBySlug(bookSlug);
  if (!meta) return [];

  const chapters = await Promise.all(
    meta.chapterSlugs.map(async (chapterSlug) =>
      getChapterBySlug(bookSlug, chapterSlug),
    ),
  ).then((chapters) => chapters.filter((chapter) => chapter !== null));

  return chapters;
}
