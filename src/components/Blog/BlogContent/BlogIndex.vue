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
import { FileTextOutlined } from '@ant-design/icons-vue';

</script>
<style scoped>
.IndexContainer {
  display: flex;
  flex-direction: column;
}

.IndexRightContent {
  display: flex;
  flex-direction: column;
}

.right-box {
  background-color: var(--background-secondary);
  border-radius: 1rem;
  margin-bottom: 2rem;
  padding: 2rem;
  /* position: relative; */
  --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, .1), 0 10px 10px -5px rgba(0, 0, 0, .04);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  width: 100%;
}

@media (min-width: 1024px) {
  .IndexContainer {
    display: grid;
    gap: var(--gap);
    grid-template-columns: minmax(0, 1fr) 320px;
  }
}
</style>