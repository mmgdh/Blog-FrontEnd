<template>
    <div>
        <div class="catalogContainer">
            <title>
                
            </title>
            <slot></slot>
        </div>
        <div class="catalogNavbar">

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from 'vue';
import title from '../../../common/Title.vue'

</script>
<style scoped lang='less'>

</style>