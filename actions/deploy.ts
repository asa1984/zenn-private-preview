import { $ } from "bun";
import core from "@actions/core";
import { getActionInputs } from "./inputs";

function findUrls(text: string, domain: string) {
  const regex = new RegExp(`https://[a-zA-Z0-9.-]+\.${domain}`, "g");
  const matches = text.matchAll(regex);
  return [...matches].map((m) => m[0]);
}

async function main() {
  try {
    const inputs = getActionInputs();
    const { enableBasicAuth, cloudflareAccountId, cloudflareApiToken } = inputs;

    const envVars = `CLOUDFLARE_ACCOUNT_ID=${cloudflareAccountId} CLOUDFLARE_API_TOKEN=${cloudflareApiToken}`;
    const command = enableBasicAuth
      ? `${envVars} bun wrangler pages deploy --var BASIC_AUTH_USERNAME:${inputs.basicAuth.username} BASIC_AUTH_PASSWORD:${inputs.basicAuth.password} ./dist`
      : `${envVars} cd ./dist && bun wrangler pages deploy .`; // functionsをデプロイしないためにdistディレクトリに移動してからデプロイ

    const result = await $`${command}`;
    const urls = findUrls(result.text(), "pages.dev");
    const deployedUrl = urls.at(0) ?? null;

    core.setOutput("deployed-url", deployedUrl);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An unexpected error occurred");
    }
  }
}

main();
