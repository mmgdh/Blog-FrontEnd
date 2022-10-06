<template>
  <Toggle :status="appStore.themeConfig.theme === 'theme-dark'" @changeStatus="handleChange">
    <template v-if="theme === 'theme-light'">
      <BulbFilled class="iconStyle" :style="{color: 'yellow'}" />

      <!-- <sun-one theme="filled" :style="svg" size="15" :fill="svgStyle.fill"/> -->
    </template>
    <template v-else>
      <bulb-outlined class="iconStyle" />
      <!-- <moon theme="filled" size="15" :style="svg" :fill="svgStyle.fill"/> -->
    </template>

  </Toggle>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Toggle from './Toggle.vue'
import { useAppStore } from '../../../../Store/AppStore'
import { BulbOutlined,BulbFilled } from '@ant-design/icons-vue';
// import {SunOne,Moon} from '@icon-park/vue-next';

const appStore = useAppStore()
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
.iconStyle {
  .light{
    color: yellow;
  }
}
</style>
