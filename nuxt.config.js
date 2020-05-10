// const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    // titleTemplate: '%s - ' + process.env.npm_package_name,
    // title: process.env.npm_package_name || '',
    titleTemplate: '%s - ' + 'harrison\' blog',
    // title: 'harrison\' blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdn.bootcdn.net/ajax/libs/font-awesome/5.13.0/css/all.min.css' },
      // {
      //   rel: 'stylesheet',
      //   href:
      //     'https://cdn.bootcss.com/github-markdown-css/4.0.0/github-markdown.min.css'
      // },
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.0/styles/solarized-light.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.11.1/katex.min.css'
      }
    ],
    script: [
      { src: 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.11.1/katex.min.js' }
    ]
  },
  server: {
    host: '127.0.0.1',
    port: '3002'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: '~/components/Loading.vue',
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/main.css',
    '@/assets/css/animate.css',
    '@/assets/css/scrollbar.css',
    '@/assets/css/route.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/axios'
    // '@/plugins/katex'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/color-mode'
    // '@nuxtjs/moment'
    // '@nuxtjs/vuetify'
  ],
  colorMode: {
    preference: 'light'
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true,
    retry: false
  },
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8080/blog',
      pathRewrite: {
        '^/api': '/'
      }
    }
  },
  router: {
    // middleware: ['auth', 'device'],
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  // vuetify: {
  //   customVariables: ['~/assets/variables.scss'],
  //   theme: {
  //     dark: true,
  //     themes: {
  //       dark: {
  //         primary: colors.blue.darken2,
  //         accent: colors.grey.darken3,
  //         secondary: colors.amber.darken3,
  //         info: colors.teal.lighten1,
  //         warning: colors.amber.base,
  //         error: colors.deepOrange.accent4,
  //         success: colors.green.accent3
  //       }
  //     }
  //   }
  // },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
    // analyze: true
  }
}
