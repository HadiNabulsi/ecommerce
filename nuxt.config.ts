// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // تعيين تاريخ التوافق لـ Nitro
  compatibilityDate: '2025-05-02',
  nitro: {
    compatibilityDate: '2025-05-02'
  },
  devtools: { enabled: false },
  
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/css/main.css',
    '~/assets/css/cart.css'
  ],
  
  modules: [
    '@pinia/nuxt'
  ],
  
  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/components/cart', prefix: 'Cart' },
    { path: '~/components/common', prefix: 'Common' },
    { path: '~/components/product', prefix: 'Product' },
    { path: '~/components/ui', prefix: 'Ui' },
    { path: '~/components/layout', prefix: 'Layout' }
  ],
  
  plugins: [
    '~/plugins/components.js'
  ],
  
  app: {
    head: {
      title: 'E-Commerce Store',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Comprehensive E-Commerce Store' }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
          crossorigin: 'anonymous',
          defer: true
        }
      ]
    }
  },
  
  runtimeConfig: {
    public: {
      apiBase: 'https://fakestoreapi.com'
    }
  }
})
