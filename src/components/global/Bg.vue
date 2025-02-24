<template>
  <div ref="bgRef" v-bind="$attrs">
    <slot></slot>
  </div>
</template>

<script setup>
import { imgURL } from '@/utils/global/asset'
import { ref, watch, onMounted } from 'vue'

// base64 编码的加载失败图片
const fallbackBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8H20PAAAFsUlEQVR4Xu2bS2gU1R3Hf8c8DQzD5O...' // (省略 base64 数据)

defineOptions({
  name: 'Bg',
  inheritAttrs: false,
})

const props = defineProps({
  src: String,
  public: { type: Boolean, default: false },
  size: { type: String, default: 'cover' },
  pos: { type: String, default: 'center' },
  repeat: { type: Boolean, default: false },
  prefix: { type: [Boolean, String] },
  proxy: { type: Boolean },
  lazy: { type: Boolean, default: false },
  backSrc: String,
  backPrefix: { type: [Boolean, String] },
  backProxy: { type: Boolean },
  fallback: { type: Boolean, default: true },
})

const emit = defineEmits(['load', 'error'])

const bgRef = ref(null)

const sizeMap = {
  auto: 'auto',
  cover: 'cover',
  contain: 'contain',
  full: '100% 100%',
}

const positionMap = {
  top: 'top',
  'top-left': 'top left',
  'top-right': 'top right',
  bottom: 'bottom',
  'bottom-left': 'bottom left',
  'bottom-right': 'bottom right',
  left: 'left',
  'left-top': 'left top',
  'left-bottom': 'left bottom',
  right: 'right',
  'right-top': 'right top',
  'right-bottom': 'right bottom',
  center: 'center',
}

const loadImage = (url) => {
  const image = new Image()
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(url)
    image.onerror = () => reject(url)
    image.src = url
  })
}

const getSrcUrl = () => imgURL(props.src, props.prefix, props.proxy)
const getBackSrcUrl = () => imgURL(props.backSrc, props.backPrefix, props.backProxy)

const setBgStyle = (property, value) => {
  if (bgRef.value) {
    bgRef.value.style[property] = value
  }
}

// 获取有效的图片 URL (src、backSrc、fallbackBase64)
const getValidImageUrl = async () => {
  let url = getSrcUrl()
  let backUrl = null
  if (props.backSrc) {
    backUrl = getBackSrcUrl()
  }
  if (!url && props.fallback) {
    url = backUrl || fallbackBase64
  }
  try {
    await loadImage(url)
    return url
  } catch {
    return backUrl || fallbackBase64
  }
}

const setBgImage = (url) => {
  setBgStyle('backgroundImage', `url('${url}')`)
}
const setBgSizeStyle = (size = props.size) => {
  let bgSize = sizeMap[size]
  if (!bgSize) {
    const sizeArr = size.includes(',') ? size.split(',') : size.split(' ')
    sizeArr.forEach((s, i) => {
      if (String(Number(s)) === String(s)) {
        sizeArr[i] = `${s}px`
      }
    })
    bgSize = sizeArr.join(' ')
  }
  setBgStyle('backgroundSize', bgSize)
}

const setBgPositionStyle = (pos = props.pos) => {
  let bgPosition = positionMap[pos]
  if (!bgPosition) {
    const posArr = pos.includes(',') ? pos.split(',') : pos.split(' ')
    posArr.forEach((p, i) => {
      if (String(Number(p)) === String(p)) {
        posArr[i] = `${p}px`
      }
    })
    bgPosition = posArr.join(' ')
  }
  setBgStyle('backgroundPosition', bgPosition)
}

const setBgRepeatStyle = (repeat = props.repeat) => {
  setBgStyle('backgroundRepeat', repeat ? 'repeat' : 'no-repeat')
}

const computeStyles = async () => {
  const url = await getValidImageUrl()
  setBgImage(url)
  setBgSizeStyle()
  setBgPositionStyle()
  setBgRepeatStyle()
}

watch(
  () => [props.src, props.backSrc, props.size, props.pos, props.repeat],
  async ([newSrc, newBackSrc, newSize, newPos, newRepeat], [oldSrc, oldBackSrc, oldSize, oldPos, oldRepeat]) => {
    if (newSrc !== oldSrc || newBackSrc !== oldBackSrc) {
      const url = await getValidImageUrl()
      setBgImage(url)
    }
    if (newSize !== oldSize) {
      setBgSizeStyle(newSize)
    }
    if (newPos !== oldPos) {
      setBgPositionStyle(newPos)
    }
    if (newRepeat !== oldRepeat) {
      setBgRepeatStyle(newRepeat)
    }
  }
)

const observer = new IntersectionObserver(
  async (entries) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        await computeStyles()
        observer.unobserve(bgRef.value)
      }
    })
  },
  {
    threshold: 0.1,
  }
)

onMounted(() => {
  if (props.lazy && bgRef.value) {
    observer.observe(bgRef.value)
  } else {
    computeStyles()
  }
})
</script>

<style scoped></style>
