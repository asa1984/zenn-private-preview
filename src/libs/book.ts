export type Book = {
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

export type ChapterMeta = Omit<Chapter, "markdown">;

export async function getAllBooks(): Promise<Book[]> {}

export async function getBookBySlug(slug: string): Promise<Book | null> {}

export async function getAllChapterMetas(
  slug: string,
): Promise<ChapterMeta[]> {}

export async function getChapterBySlug(
  bookSlug: string,
  chapterSlug: string,
): Promise<Chapter | null> {}
