<template>
  <ul class="ArticleList">
    <li v-for="_Article in Ref_ArticleList" :key="_Article.id">
      <ArticleCardVue :ArticleData="_Article">

      </ArticleCardVue>
    </li>
  </ul>

  <div class="PageStyle">
    <a-pagination :show-quick-jumper="false" v-model="refPage.page" :total="ArticleCount" :page-size='pageRequest.pageSize'
      show-less-items @change="onChange" class="paginationCSS" />
  </div>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount, watch } from 'vue'
import { useArticleStore } from '../../../Store/ArticleStore'
import { storeToRefs } from 'pinia';
import ArticleCardVue from './ArticleCard.vue';

let ArticleStore = useArticleStore();
let refStore = storeToRefs(ArticleStore);
let refPage = refStore.PageRequestParm;
let Ref_ArticleList = refStore.CurPageArticles;
let ArticleCount = refStore.CurArticleCount;
let ShowQuikJumper = ref(false)

watch(refPage.value, () => {
  ArticleStore.GetArticleByPage();
})

watch(ArticleCount, (newvalue, oldvalue) => {
  if (ArticleCount.value > 30) {
    ShowQuikJumper.value = true;
  }
})

ArticleStore.$patch((state) => {
  state.PageRequestParm.page = 1;
  state.PageRequestParm.pageSize = 9
});


let pageRequest = refStore.PageRequestParm;
//页码改变
const onChange = (pageNumber: number) => {
  refPage.value.page = pageNumber;
}
//日期转换
const ToDate = (DateTime: Date) => {
  let NewDate = new Date(DateTime);
  return NewDate.toLocaleDateString();
}

</script>

<style scoped lang="less">
.ArticleList {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;

}



@media (min-width: 768px) {
  .ArticleList {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .ArticleList {
    grid-template-columns: repeat(3, 1fr);
  }

}

.PageStyle {
  
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  margin: 10px;
}
</style>