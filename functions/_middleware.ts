import { handleMiddleware } from "hono/cloudflare-pages";
import { basicAuth } from "hono/basic-auth";

export const onRequest = handleMiddleware(async (c, next) => {
  return basicAuth({
    username: c.env.BASIC_AUTH_USERNAME,
    password: c.env.BASIC_AUTH_PASSWORD,
  })(c, next);
});
