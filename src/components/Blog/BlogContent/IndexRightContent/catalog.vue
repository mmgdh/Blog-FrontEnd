<template>
    <div id="catalogCard">
        <div class="catalogContainer">
            <Title :id="'catalog'" :title-str="'文章目录'" :size="1.2">
                <read-outlined />
            </Title>
            <div class="slotCSS">
                <slot id="toc" class="rr"></slot>
            </div>

        </div>
        <div class="catalogNavbar">

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from 'vue';
import Title from '../../../common/Title.vue'
import { ReadOutlined } from '@ant-design/icons-vue';
</script>
<style scoped lang='less'>

#catalogCard {
    position: sticky;
    top: 0;
}
</style>