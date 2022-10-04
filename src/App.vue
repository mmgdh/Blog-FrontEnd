<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, onMounted } from 'vue'
import { useArticleStore } from './Store/ArticleStore'
import { useAppStore } from './Store/AppStore'
import { useRouter } from 'vue-router'

const ParamStore = useAppStore();
const ArticleStore = useArticleStore();
const router = useRouter();

onBeforeMount(async () => {
  ParamStore.GetAllParameter().then(() => {
    () => router.push('/BlogMain')
});
await ArticleStore.GetTags();
await ArticleStore.GetClassifies();
await ArticleStore.GetArticleCount();

})
</script>
<style lang="less">

</style>
