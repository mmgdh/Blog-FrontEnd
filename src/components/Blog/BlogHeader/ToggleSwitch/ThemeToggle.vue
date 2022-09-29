<template>
  <Toggle :status="defaultStatus" @changeStatus="handleChange">
    <template v-if="theme === 'theme-light'">
      <!-- <sun-one theme="filled" :style="svg" size="15" :fill="svgStyle.fill"/> -->
    </template>
    <template v-else>
      <!-- <moon theme="filled" size="15" :style="svg" :fill="svgStyle.fill"/> -->
    </template>

  </Toggle>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Toggle from './Toggle.vue'
import { useAppStore } from '../../../../Store/AppStore'
// import {SunOne,Moon} from '@icon-park/vue-next';

const appStore = useAppStore()
let defaultStatus = appStore.themeConfig.theme === 'theme-dark' ? true : false
let theme = computed(() => {
  return appStore.themeConfig.theme
})
let svg = computed(() => svgStyle.value)
const svgStyle = ref({
  fill: "#f8e71c",
  margin: '6.5px'
})

const handleChange = (status: boolean) => {
  appStore.toggleTheme(status)
}
</script>

<style lang="less" scoped>

</style>
