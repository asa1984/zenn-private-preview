# Zenn Private Preview

Zennの記事を限定公開するサードパーティのGitHub Actionです。Zennの記事管理用リポジトリからプレビュー用のサイトを生成し、Cloudflare Pagesにデプロイします。

## 機能

- [zenn-markdown-html](https://www.npmjs.com/package/zenn-markdown-html)と[zenn-content-css](https://www.npmjs.com/package/zenn-content-css)を利用したZenn風のプレビューサイト
- Basic認証によるアクセス制限

## 注意事項

- このGitHub ActionはZenn公式のものではありません
- 生成されるプレビューページは、Zennが提供している埋め込みサーバーを利用しているため、商用利用は不可能です（[参照](https://github.com/zenn-dev/zenn-editor/tree/canary/packages/zenn-markdown-html#zenndev-%E3%81%A8%E5%90%8C%E3%81%98%E5%9F%8B%E3%82%81%E8%BE%BC%E3%81%BF%E8%A6%81%E7%B4%A0%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B)）
