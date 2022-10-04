<template>
    <div class="Feature">
        <HorizontalArticleVue :articledata="ArticleStore.TopArticle"></HorizontalArticleVue>
        <BlogFeatureList></BlogFeatureList>
    </div>
</template>

<script setup lang='ts'>
import { onBeforeMount, ref,watch } from 'vue';
import HorizontalArticleVue from '../Article/HorizontalArticle.vue';
import { useArticleStore } from '../../../Store/ArticleStore'
import { storeToRefs } from 'pinia';
import BlogFeatureList from './BlogFeatureList.vue';
import { Article } from '../../../Entities/E_Article';
let ArticleStore = useArticleStore();
let refStore = storeToRefs(ArticleStore);

</script>

<style>

</style>