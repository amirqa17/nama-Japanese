import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components: false,
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    geminiApiKey: '',
  },
  app: {
    head: {
      title: 'NAMA — Real conversational Japanese',
      meta: [
        { name: 'description', content: 'Practice the Japanese people actually use in dates, texts, work, and everyday life.' },
        { name: 'theme-color', content: '#10131a' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
