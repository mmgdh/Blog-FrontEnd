<template>
  <div class="toggler" @click="changeStatus">
    <div class="slider" :style="{
      transform: toggleStyle.transform,
      backgroundColor: toggleStyle.background
    }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
const props = defineProps({
  status: Boolean
})
const emit = defineEmits(['changeStatus'])
let { status } = toRefs(props)

onMounted(() => {
  changeTransform()
})

let toggleStyle = reactive({
  transform: '',
  background: '#6e40c9'
})
let toggleStatus = status.value

const changeStatus = () => {
  toggleStatus = !toggleStatus
  changeTransform()
  emit('changeStatus', toggleStatus)
}

const changeTransform = () => {
  const transform = toggleStatus ? '28px' : '0'
  toggleStyle.transform = `translateX(${transform})`
  const backgroundColor = toggleStatus ? '#6e40c9' : '#100E16'
  toggleStyle.background = backgroundColor
}
</script>

<style lang="less" scoped>
.toggler {
  position: relative;
  width: 40px;
  height: 22px;
  background-color: var(--background-primary);
  border-radius: 24px;
  border: 3px solid rgba(110, 64, 201, 0.35);
  box-sizing: border-box;
  transition: background-color 250ms ease;
}

.slider {
  top: -6px;
  left: -6px;
  width: 28px;
  height: 28px;
  background-color: #6e40c9;
  border-radius: 50%;
  transition: all 250ms cubic-bezier(0.4, 0.03, 0, 1) 0s;
  position: absolute;
}
</style>
