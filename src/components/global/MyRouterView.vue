<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="transitionName" @before-leave="handleBeforeLeave" @after-leave="handleAfterLeave">
      <keep-alive :include="aliveList" :max="props.max">
        <component :is="Component" :key="route.name" :class="{ 'absolute top-0 left-0 w-full': onChange }" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAlive, aliveRemove } from '@/hooks/useAlive'
import { useRouterHistory } from '@/hooks/useRouterHistory'

defineOptions({
  name: 'MyRouterView',
  inheritAttrs: false,
})

const props = defineProps({
  max: {
    type: Number,
    default: 8,
  },
})

const route = useRoute()
const { transitionName } = useRouterHistory({
  onBack: (to, from) => {
    aliveRemove(from.name)
  },
})
const { aliveList } = useAlive(true)

const onChange = ref(false)

const handleBeforeLeave = () => {
  document.body.style.overflow = 'hidden'
  onChange.value = true
}

const handleAfterLeave = () => {
  document.body.style.overflow = ''
  onChange.value = false
}
</script>

<style scoped>
.push-enter-active {
  animation-name: push-in;
  animation-duration: 0.4s;
}

.push-leave-active {
  animation-name: push-out;
  animation-duration: 0.4s;
}

/* 进场 */
@keyframes push-in {
  0% {
    transform: translate(100%, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}

/* 退场 */
@keyframes push-out {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
}

.back-enter-active {
  animation-name: back-in;
  animation-duration: 0.4s;
}

.back-leave-active {
  animation-name: back-out;
  animation-duration: 0.4s;
}
/* 返回进场 */
@keyframes back-in {
  0% {
    transform: translate(-100%, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}

/* 返回退场 */
@keyframes back-out {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(100%, 0);
  }
}
</style>
