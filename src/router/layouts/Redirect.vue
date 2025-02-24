<template>
  <div></div>
</template>

<script setup>
import { unref } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'Redirect',
})

const { currentRoute, replace } = useRouter()
const { params, query } = unref(currentRoute)
const name = params.name

Reflect.deleteProperty(params, 'name')

replace({
  name,
  query,
  params,
})
</script>
