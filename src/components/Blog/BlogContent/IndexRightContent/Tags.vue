<template>
    <div>
        <Title :id="'ArticleTags'" :title-str="'TAGS'" :size="1">
            <!-- <tag-one theme="outline" strokeLinejoin="bevel"/> -->
            <tags-outlined />
        </Title>
        <div class="TagList">
            <div class="tagCSS" v-for="tag in ArticleStore.Tags" :key="tag.id">
                <a>{{tag.tagName}}</a>
                <span>{{tag.articleCount}}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { ArticleTag } from '../../../../Entities/E_Article';
import { useArticleStore } from '../../../../Store/ArticleStore'
import Title from '../../../common/Title.vue'
// import {TagOne} from '@icon-park/vue-next';
import { TagsOutlined } from '@ant-design/icons-vue';

const ArticleStore = useArticleStore();
</script>

<style scoped lang="less">

.TagList {
    display: flex;
    padding-top: 0.5rem;
    flex-wrap: wrap;
}

.tagCSS {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    .transition-all();
    font-size: 0.75rem;
    line-height: 1rem;
    text-align: center;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    text-decoration: inherit;
    background-color: var(--background-primary);

    a {
        padding-left: 0.75rem;
        padding-right: 0.75rem;

        border-top-left-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;

        color: inherit;
        .transition-all();
    }

    span {
        color: var(--text-sub-accent);
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        opacity: 0.7;
        border-bottom-right-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
    }
}

.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    transition-duration: .15s;
}
</style>