import zennMarkdownToHtml from "zenn-markdown-html";

export function markdownToHtml(markdown: string): string {
	return zennMarkdownToHtml(markdown, {
		embedOrigin: "https://embed.zenn.studio",
	});
}
