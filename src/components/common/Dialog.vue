<template>
    <div class="dialog" :class="{ 'is-show': props.modelValue }" :style="display ? 'display: none' : ''">

        <!-- 不透明遮罩 -->
        <div class="dialog-modal" @click.self="closeDialog"></div>

        <!-- 主体 -->
        <div class="dialog-main">

            <div class="dialog-head">
                <!-- <button class="button icon-botton" @click="closeDialog">x</button> -->
            </div>

            <!-- 内容区 -->
            <div class="dialog-body">
                <slot></slot>
            </div>

        </div>

    </div>
</template>
<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
    modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue);
const display = ref(true)
let timer = 0

// 关闭弹窗
const closeDialog = () => {
    clearTimeout(timer)
    visible.value = false
    timer = setTimeout(() => {
        display.value = false
        clearTimeout(timer)
    }, 300)
}

watch(() => props.modelValue, (currentValue) => {
    if (currentValue) {
        clearTimeout(timer)
        display.value = false
        timer = setTimeout(() => {
            visible.value = currentValue
            clearTimeout(timer)
        }, 20)
    } else {
        closeDialog()
    }
})

watch(() => visible.value, (currentValue) => {
    if (!currentValue) {
        emit('update:modelValue', currentValue)
    }
})

onBeforeUnmount(() => {
    clearTimeout(timer)
})
</script>
<style scoped lang="less">
.dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 9999;
    visibility: hidden;
    opacity: 0;
    transition: 0.3s;
    display: flex;
    justify-content: center;

    &.is-show {
        visibility: visible;
        opacity: 1;

        .dialog-main {
            transform: translateY(0);
        }
    }

    .dialog-modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .dialog-main {
        display: inline-block;
        transition: 0.3s;
        min-width: 40rem;
        // min-height: calc(var(--search-modal-height) - var(--search-modal-searchbox-height) - var(--search-modal-spacing) - var(--search-modal-footer-height));
        background-color: var(--background-primary);
        position: relative;
        top: 40px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
        transform: translateY(-10%);
        height: 40rem;
    }

    .dialog-head {
        text-align: right;
    }

    .dialog-body {
        text-align: center;
    }
}

@media screen and (max-width: 768px) {
    .dialog {
        flex-direction: column;
        justify-content: flex-end;

        .dialog-main {
            min-width: unset;
            width: 100%;
            border-radius: 20px 20px 0 0;
            transform: translateY(10%);
        }
    }
}
</style>