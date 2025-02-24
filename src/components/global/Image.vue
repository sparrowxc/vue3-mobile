<template>
  <img ref="imgRef" v-bind="$attrs" @load="handleLoad" @error="handleError" :src="imgSrc" />
</template>

<script setup>
import { imgURL } from '@/utils/global/asset'
import { ref, watch, onMounted } from 'vue'

const fallbackBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8H20PAAAFsUl...'

defineOptions({
  name: 'Image',
  inheritAttrs: false,
})

const props = defineProps({
  src: String,
  public: { type: Boolean, default: false },
  lazy: { type: Boolean, default: false },
  backSrc: String,
  backPrefix: { type: [Boolean, String] },
  backProxy: { type: Boolean },
  fallback: { type: Boolean, default: true },
})

const imgRef = ref(null)
const imgSrc = ref('')
const loading = ref(true)
const error = ref(false)

const getSrcUrl = () => imgURL(props.src, props.prefix, props.proxy)
const getBackSrcUrl = () => imgURL(props.backSrc, props.backPrefix, props.backProxy)

const loadImage = (url) => {
  const image = new Image()

  return new Promise((resolve, reject) => {
    if (image.decode) {
      image.src = url
      image
        .decode()
        .then(() => resolve(url))
        .catch(() => reject(url))
    } else {
      image.onload = () => resolve(url)
      image.onerror = () => reject(url)
      image.src = url
    }
  })
}

const getValidImageUrl = async () => {
  let url = getSrcUrl()
  if (!url && props.fallback) {
    url = getBackSrcUrl()
  }
  try {
    await loadImage(url)
    return url
  } catch {
    return fallbackBase64
  }
}

const setImgSrc = async () => {
  loading.value = true
  error.value = false
  const url = await getValidImageUrl()
  imgSrc.value = url
}

const handleLoad = () => {
  loading.value = false
  error.value = false
  emit('load')
}

// 处理图片加载失败
const handleError = () => {
  loading.value = false
  error.value = true
  emit('error')
}

const observer = new IntersectionObserver(
  async (entries) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        await setImgSrc()
        observer.unobserve(imgRef.value)
      }
    })
  },
  { threshold: 0.1 }
)

onMounted(() => {
  if (props.lazy && imgRef.value) {
    observer.observe(imgRef.value)
  } else {
    setImgSrc()
  }
})

watch(
  () => [props.src, props.backSrc],
  async ([newSrc, newBackSrc], [oldSrc, oldBackSrc]) => {
    if (newSrc !== oldSrc || newBackSrc !== oldBackSrc) {
      await setImgSrc()
    }
  }
)
</script>

<style scoped></style>
