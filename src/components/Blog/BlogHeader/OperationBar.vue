<template>
    <div class="BarStyle">
        <span class="pointer" @click="topage('/Login')">登录</span>
        <ThemeToggle class="pointer"></ThemeToggle>
    </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'
import ThemeToggle from './ToggleSwitch/ThemeToggle.vue'
let router = useRouter()
let topage = (url: string) => {
    router.push(url)
}
</script>

<style scoped lang="less">
// * {
//     Padding-right: 10px;
// }

.BarStyle {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    width: 100px;
    font-size: 20px;
}
.pointer{
    cursor: pointer;
}
</style>