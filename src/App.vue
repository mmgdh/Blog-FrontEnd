<template>
  <div ref="test">
    <h1>hahah</h1>
  </div>
  <router-view ></router-view>
</template>
<script setup lang="ts">
import { onBeforeMount,ref,onMounted } from 'vue'
import { useArticleStore } from './Store/ArticleStore'
import { useAppStore } from './Store/AppStore'
import { useRouter } from 'vue-router'

const ParamStore = useAppStore();
const ArticleStore = useArticleStore();
const router = useRouter();

onBeforeMount(async () => {
  ParamStore.GetAllParameter().then(() => {

    router.push('./BlogMain');
  });
  await ArticleStore.GetTags();
  await ArticleStore.GetClassifies();
  await ArticleStore.GetArticleCount();

})
const test=ref()
onMounted(()=>{
  console.log('测试ref',test.value.children)
})
</script>
<style lang="less">

</style>
