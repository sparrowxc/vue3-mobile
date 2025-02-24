import mobileForever from 'postcss-mobile-forever'

export default {
  plugins: [
    /** @repo https://github.com/wswmsword/postcss-mobile-forever */
    mobileForever({
      viewportWidth: 375,
      appSelector: 'body',
      maxDisplayWidth: 580,
      // appSelector: '#app',
      // mobileUnit: 'vw',
      //   enableMediaQuery: true,
    }),
  ],
}
