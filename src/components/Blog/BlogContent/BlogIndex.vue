<template>
  <div>
    <BlogFeatureVue></BlogFeatureVue>
    <Title :id="'Articlelist'" :title-str="'文章列表'" :size="2">
      <file-text-outlined />
    </Title>
    <div class="IndexContainer">
      <div class="IndexBlogList">
        <ArticleClssifyList></ArticleClssifyList>
        <BlogList></BlogList>
      </div>
      <div class="IndexRightContent">
        <Introduction></Introduction>
        <TagsVue class="right-box"></TagsVue>
        <friendLinkVue class="right-box"></friendLinkVue>
        <Notice class="right-box"></Notice>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BlogList from '../Article/BlogList.vue'
import Introduction from './IndexRightContent/Introduction.vue'
import ArticleClssifyList from '../Article/ArticleClassifyList.vue';
import BlogFeatureVue from './BlogFeature.vue';
import Title from '../../common/Title.vue';
import TagsVue from './IndexRightContent/Tags.vue';
import Notice from './IndexRightContent/Notice.vue';
import friendLinkVue from './IndexRightContent/friendLink.vue';
import { FileTextOutlined } from '@ant-design/icons-vue';
import { useAppStore } from '../../../Store/AppStore'
import { useArticleStore } from '../../../Store/ArticleStore'
import { onBeforeMount } from 'vue';

const AppStore = useAppStore();
const ArticleStore = useArticleStore()

onBeforeMount(() => {
  ArticleStore.GetIndexArticle()
})


AppStore.SetBannerImg('')

</script>
<style scoped>
@import '../../../CSS/Box.less';

.IndexContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.IndexRightContent {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .IndexContainer {
    display: grid;
    gap: var(--gap);
    grid-template-columns: minmax(0, 1fr) 320px;
  }
}
</style>