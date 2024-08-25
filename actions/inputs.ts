import core from "@actions/core";

export type ActionInputs =
  | {
      cloudflareAccountId: string;
      cloudflareApiToken: string;
      enableBasicAuth: true;
      basicAuth: {
        username: string;
        password: string;
      };
    }
  | {
      cloudflareAccountId: string;
      cloudflareApiToken: string;
      enableBasicAuth: false;
    };

export function getActionInputs(): ActionInputs {
  const cloudflareAccountId = core.getInput("cloudflare-account-id", {
    required: true,
  });
  const cloudflareApiToken = core.getInput("cloudflare-api-token", {
    required: true,
  });
  const enableBasicAuth =
    core.getInput("enable-basic-auth", { required: true }) === "true";
  return enableBasicAuth
    ? {
        cloudflareAccountId,
        cloudflareApiToken,
        enableBasicAuth,
        basicAuth: {
          username: core.getInput("basic-auth-username", {
            required: true,
          }),
          password: core.getInput("basic-auth-password", {
            required: true,
          }),
        },
      }
    : {
        cloudflareAccountId,
        cloudflareApiToken,
        enableBasicAuth,
      };
}
