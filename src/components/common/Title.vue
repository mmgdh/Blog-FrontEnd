<template>
    <p :id="id" class="TitleCSS" :style="FontStyle">
        <slot class="IconCSS" :style="IconStyle"></slot>
        <b>{{ titleStr }}</b>
        <span class="SpanCSS" :style="SpanStyle"></span>
    </p>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
const { titleStr, id, size } = defineProps<{
    id: string
    titleStr: string,
    size: number
}>()
let SpanStyle = {
    width: size * 3 + 'rem'
}
let FontStyle = {
    fontSize: size + 'rem',

}
let IconStyle = {
    size: size + 'rem',
}
</script>

<style scoped lang="less">
.TitleCSS {
    position: relative;
    color: var(--text-bright);
    opacity: 0.9;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;

    b{
        padding-left: .5rem;
    }

}

.SpanCSS {
    bottom: 0;
    position: absolute;
    height: 0.25rem;
    border-radius: 9999px;
    background: var(--header_gradient_css);
}
</style>