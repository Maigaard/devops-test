require("dotenv").config();

export default {
  // ssr: false,
  // target: "static",
  // generate: {
  //   // fallback: 'index.html'
  //   routes: ["/auth/connect/storyblok"]
  // },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module"
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/dotenv",
    [
      "@storyblok/nuxt-auth",
      {
        id: process.env.CONFIDENTIAL_CLIENT_ID,
        secret: process.env.CONFIDENTIAL_CLIENT_SECRET,
        redirect_uri: process.env.CONFIDENTIAL_CLIENT_REDIRECT_URI
      }
    ]
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
