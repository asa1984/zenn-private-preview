import { $ } from "bun";
import core from "@actions/core";
import github from "@actions/github";

async function main() {
  try {
    const isPrivate = github.context.payload.repository?.private as boolean;

    const command = isPrivate
      ? "ZENN_DIR=.. bun run build"
      : `ZENN_DIR=.. ZENN_GITHUB_REPOSITORY_URL=${github.context.serverUrl}/${github.context.repo.owner}/${github.context.repo.repo} bun run build`;

    await $`${command}`;
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An unexpected error occurred");
    }
  }
}

main();
