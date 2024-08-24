import { expect, test } from "bun:test";
import { getAllArticleMetas, getArticleBySlug } from "@/libs/article";

test("全記事のメタデータを取得する", async () => {
  const metas = await getAllArticleMetas();
  metas.sort((a, b) => a.slug.localeCompare(b.slug));

  expect(metas).toHaveLength(2);
  expect(metas[0]).toEqual({
    slug: "private-article",
    title: "プライベートな記事",
    emoji: "🔒",
    type: "idea",
    topics: ["test", "private"],
    published: false,
  });
  expect(metas[1]).toEqual({
    slug: "valid-article",
    title: "正常な記事",
    emoji: "👍",
    type: "tech",
    topics: ["test", "valid"],
    published: true,
  });
});

test("slugを指定して記事を読み込む", async () => {
  const article = await getArticleBySlug("valid-article");
  expect(article).toEqual({
    slug: "valid-article",
    title: "正常な記事",
    emoji: "👍",
    type: "tech",
    topics: ["test", "valid"],
    published: true,
    markdown: `
正常な記事です。
`,
  });
});

test("不正なfrontmatterの記事を読み込む", async () => {
  const article = await getArticleBySlug("invalid-frontmatter");
  expect(article).toBeNull();
});

test("存在しない記事を読み込む", async () => {
  const article = await getArticleBySlug("not-found");
  expect(article).toBeNull();
});

test("Markdownではないファイルを読み込む", async () => {
  const article = await getArticleBySlug("not-markdown");
  expect(article).toBeNull();
});
