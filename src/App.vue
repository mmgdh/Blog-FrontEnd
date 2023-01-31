<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, onMounted } from 'vue'
import { useArticleStore } from './Store/ArticleStore'
import { useAppStore } from './Store/AppStore'

const ParamStore = useAppStore();
const ArticleStore = useArticleStore();

onBeforeMount(async () => {
    await ParamStore.GetAllParameter()
    await ArticleStore.GetTags();
    await ArticleStore.GetClassifies();
    await ArticleStore.GetArticleCount();
    
  }
)
</script>
<style lang="less">

</style>
