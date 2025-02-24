import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetAdaptUnit } from './configs/unocss/preset/index.js'
import { ruleUseful, ruleShadows } from './configs/unocss/rules/index.js'
// import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', '.git', 'dist'],
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetAdaptUnit(),
    presetIcons({
      scale: 1.2,
      warn: true,
      autoInstall: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        // icon: FileSystemIconLoader('./src/assets/svg-icons', (svg) => svg.replace(/#fff/, 'currentColor')),
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],

  /** 主题自定义 */
  theme: {
    colors: {
      primary: 'var(--p-color)',
    },
    backgroundColor: {},

    /** 字体大小 */
    fontSize: {
      unset: 'unset',
      inherit: 'inherit',
      initial: 'initial',
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '60px',
      '7xl': '72px',
      '8xl': '96px',
      '9xl': '128px',
    },

    /**
     * 字体类型 @example font-FSourceSansVF
     */
    fontFamily: {
      base: ['SourceSansVF'], // 全局基础字体
      FSourceSansVF: ['SourceSansVF'], // 思源黑体 变体
      FSourceSerifVF: ['SourceSerifVF'], // 思源宋体 变体
      FYouSheBiaoTiHei: ['YouSheBiaoTiHei'], // 优设标题黑
      FAlimamaShuHeiTi: ['AlimamaShuHeiTi'], // 阿里妈妈数黑体
      FDouYuFont: ['DouYuFont'], // 斗鱼追光体
      FDingTalkJinBuTi: ['DingTalkJinBuTi'], // 钉钉进步体
      FTencentSans: ['TencentSans'], // 腾讯体
      FTexGyre: ['TexGyre'], // Tex Gyre 常规 (等宽数字)
      FTexGyreBold: ['TexGyreBold'], // Tex Gyre 粗体 (等宽数字)
      FLcdD: ['LcdD'], // 液晶体
      FRajdhanil: ['Rajdhani'], // Rajdhani
      FRajdhanilLight: ['Rajdhani-Light'], // Rajdhani Light
      FRajdhanilMedium: ['Rajdhani-Medium'], // Rajdhani Medium
      FRajdhanilSemiBold: ['Rajdhani-SemiBold'], // Rajdhani SemiBold
      FRajdhanilBold: ['Rajdhani-Bold'], // Rajdhani Bold
    },
  },

  /** 自定义规则 */
  rules: [...ruleUseful, ...ruleShadows, ['bg-full', { 'background-size': '100% 100%' }]],

  /** 自定义快捷方式 */
  shortcuts: [
    ['flex-col-slide', 'flex-col justify-between'],
    ['flex-col-center', 'flex-col justify-center items-center'],
    ['flex-col-x-center', 'flex-col justify-center'],
    ['flex-col-y-center', 'flex-col items-center'],
    ['flex-center', 'justify-center items-center'],
    ['flex-x-center', 'justify-center'],
    ['flex-slide', 'justify-between'],
    ['flex-slide-center', 'justify-between items-center'],
    ['flex-y-center', 'items-center'],
    ['abs-center', 'absolute top-1/2 left-1/2 translate--1/2'],
    ['abs-x-center', 'absolute left-1/2 translate-x--1/2'],
    ['abs-y-center', 'absolute top-1/2 translate-y--1/2'],
  ],
})
