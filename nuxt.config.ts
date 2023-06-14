// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from "@nuxt/kit";

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
	css: [resolve("./assets/main.css")],
	// ssr:false,
	runtimeConfig: {
		CLIENT_ID: process.env.CLIENT_ID,
		CLIENT_SECRET: process.env.CLIENT_SECRET,
		BASE_URL: process.env.BASE_URL,
	},
});
