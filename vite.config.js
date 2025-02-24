import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import UnoCSS from 'unocss/vite'
import Legacy from '@vitejs/plugin-legacy'
import { configKey, appConfig, getExternal } from './src/config'

// https://vite.dev/config/
export default defineConfig(async ({ command, mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const viteEnv = wrapperEnv(env)
  const { VITE_DROP_CONSOLE, VITE_LEGACY } = viteEnv
  const isBuild = command === 'build'

  const vitePlugins = [
    vue(),
    UnoCSS(),
    AutoImport({
      dts: 'types/auto-imports.d.ts',
      imports: ['vue', 'vue-router'],
      dirs: ['src/utils/global/**/*'],
      resolvers: [VantResolver()],
      vueTemplate: true,
    }),
    Components({
      version: 3,
      dts: 'types/components.d.ts',
      resolvers: [VantResolver()],
    }),
  ]

  if (isBuild && VITE_LEGACY) {
    vitePlugins.push(Legacy({ targets: ['Chrome 64'], modernPolyfills: false }))
  }

  return {
    root,
    base: './',
    plugins: vitePlugins,
    resolve: {
      alias: {
        '@': resolve(root, 'src'),
        '#': resolve(root, 'types'),
      },
    },
    css: {},
    server: {
      port: 8000,
      host: true,
      proxy: devProxy(),
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2048,
      assetsInlineLimit: 1024,
      sourcemap: false,
      minify: VITE_LEGACY ? 'terser' : 'esbuild',
      terserOptions: VITE_LEGACY
        ? {
            compress: {
              keep_infinity: true,
              drop_console: VITE_DROP_CONSOLE,
            },
          }
        : undefined,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name].[hash].js',
          entryFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
          },
        },
        external: [],
        plugins: [],
      },
    },
  }
})

function wrapperEnv(envConf) {
  const viteEnv = {}

  Object.entries(envConf).forEach(([key, value]) => {
    let realname = value.replace(/\\n/g, '\n')
    realname = realname === 'true' ? true : realname === 'false' ? false : realname

    if (key === 'VITE_PORT' && realname) {
      realname = Number(realname)
    }

    viteEnv[key] = realname
    if (typeof realname === 'string') {
      process.env[key] = realname
    } else if (typeof realname === 'object') {
      process.env[key] = JSON.stringify(realname)
    }
  })

  return viteEnv
}

function devProxy() {
  const groups = appConfig.apiGroup
  const groupKeys = Object.keys(appConfig.apiGroup)
  const urlReg = /^http(s)?:\/\//

  const proxy = groupKeys.reduce((acc, key) => {
    let { url, devUrl, enableProxy = false, origin, ws = false } = groups[key]
    if (!enableProxy) {
      return acc
    }
    url = devUrl || url
    if (typeof url === 'string') {
      const protocol = 'http'
      const target = urlReg.test(url) ? url : `${protocol}:${url}`
      if (origin) {
        origin = urlReg.test(origin) ? origin : `${protocol}:${origin}`
      }

      acc[`/${key}`] = {
        ws,
        target,
        secure: false,
        rewrite: (path) => path.replace(new RegExp(`^\/${key}`), ''),
        changeOrigin: true,
        ...(origin ? { headers: { Origin: origin, Referer: origin } } : {}),
      }
    }
    return acc
  }, {})

  return proxy
}
