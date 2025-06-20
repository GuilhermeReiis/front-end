// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://127.0.0.1:8000/api'
    }
  }
})
