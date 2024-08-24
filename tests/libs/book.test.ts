import { expect, test } from "bun:test";
import {
  getAllBooks,
  getBookBySlug,
  getAllChapterMetas,
  getChapterBySlug,
} from "@/libs/book";

test("全ての本を取得する", async () => {
  const books = await getAllBooks();
  books.sort((a, b) => a.slug.localeCompare(b.slug));
  expect(books).toHaveLength(2);
  expect(books[0]).toEqual({
    slug: "private-book",
    title: "プライベートな本",
    summary: "プラーベートな本の説明",
    topics: ["test", "private"],
    published: false,
    price: 0,
    chapterSlugs: ["01-first", "02-second"],
  });
  expect(books[1]).toEqual({
    slug: "valid-book",
    title: "正常な本",
    summary: "正常な本の説明",
    topics: ["test", "valid"],
    published: true,
    price: 0,
    chapterSlugs: ["01-first", "02-second"],
  });
});

test("指定したslugの本を取得する", async () => {
  const book = await getBookBySlug("valid-book");
  expect(book).toEqual({
    slug: "valid-book",
    title: "正常な本",
    summary: "正常な本の説明",
    topics: ["test", "valid"],
    published: true,
    price: 0,
    chapterSlugs: ["01-first", "02-second"],
  });
});

test("指定したslugの本が存在しない場合はnullを返す", async () => {
  const book = await getBookBySlug("not-found");
  expect(book).toBeNull();
});

test("全てのチャプターのメタデータを取得する", async () => {
  const metas = await getAllChapterMetas("valid-book");
  metas.sort((a, b) => a.slug.localeCompare(b.slug));
  expect(metas).toHaveLength(2);
  expect(metas[0]).toEqual({
    slug: "01-first",
    title: "1番目",
  });
  expect(metas[1]).toEqual({
    slug: "02-second",
    title: "2番目",
  });
});

test("指定したslugのチャプターを取得する", async () => {
  const chapter = await getChapterBySlug("valid-book", "01-first");
  expect(chapter).toEqual({
    slug: "01-first",
    title: "1番目",
    markdown: `
1番目のチャプターです。
`,
  });
});

test("指定したslugのチャプターが存在しない場合はnullを返す", async () => {
  const chapter = await getChapterBySlug("valid-book", "not-found");
  expect(chapter).toBeNull();
});
