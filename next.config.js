/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      new URL("https://images.silpo.ua/**"),
      new URL("https://src.zakaz.atbmarket.com/**"),
    ],
  },
};

export default config;
