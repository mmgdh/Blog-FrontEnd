<template>
    <div v-if="ArticleData" class="article-container">
        <span v-show="showTitle" class="article-tag">
            <b><fire-outlined /> Feature</b>
        </span>
        <div class="article">
            <div class="article-thumbnail" @click="ToDetail">
                <img :src="ImgUrl + ArticleData.imageId" alt="">
                <span class="thumbnail-screen"></span>
            </div>
            <div class="article-content">
                <span>
                    <b>{{ArticleData.classify.classifyName}}</b>
                    <ul>
                        <li v-for="Tag in ArticleData.tags" :key="Tag.id">
                            <em>[{{Tag.tagName}}]</em>
                        </li>
                    </ul>
                </span>
                <h1 @click="ToDetail">{{ArticleData.title}}</h1>
                <p>{{ArticleData.description}}</p>

                <div class="article-footer">
                    <div class="flex-center">
                        <img :src="refPictureUrl" alt="">
                        <span class="text-color-dim">
                            <strong class="text-color-normal">{{AuthorName}}</strong> 发布于 {{new Date(ArticleData.createDateTime).toLocaleDateString()}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Article } from '../../../Entities/E_Article';
import UploadService from "../../../Services/UploadService"
import { useAppStore } from '../../../Store/AppStore';
import { useArticleStore } from '../../../Store/ArticleStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'
import { FireOutlined } from '@ant-design/icons-vue';

let router = useRouter()

const ImgUrl = UploadService.prototype.getImageUri()
const { ArticleData } = defineProps<{
    ArticleData: Article
}>()
const ParamStore = useAppStore();
const ArticleStore =useArticleStore();
const refParamStore = storeToRefs(ParamStore)
var showTitle =ref(false)
showTitle.value=ArticleStore.RecommemtArticle.findIndex(x=>x.id==ArticleData.id)>-1
var refPictureUrl = ref(`${refParamStore.HeadPortrait.value}`);
const AuthorName = refParamStore.AuthorName;
watch(refParamStore.HeadPortrait, (newValue, oldValue) => {
    refPictureUrl.value = `${newValue}`;
})

const ToDetail = () => {
    router.push({
        path: '/ShowArticle/'+ArticleData.id
    })
}
</script>
<style scoped lang='less'>

@import '../../../CSS/Article.less';

@media (min-width: 1024px) {
    .feature-article .feature-content h1 {
        font-size: 2.25rem;
        line-height: 2.5rem;
        margin-top: 1rem;
        margin-bottom: 2rem;
    }
}

.article-container {
    border-radius: 1rem;
    height: 100%;
    list-style-type: none;
    position: relative;

    .article {
        background-color: var(--background-secondary);
        border-radius: 1rem;
        display: grid;
        height: 100%;
        overflow: hidden;
        position: relative;
        top: 0;
        --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
        z-index: 10;
        grid-template-rows: repeat(3, minmax(0, 1fr));
        transition: transform .2s ease-in-out;

        .article-thumbnail {
            position: relative;
            grid-row: span 1/span 1;

            img {
                cursor: pointer;
                background-repeat: no-repeat;
                background-size: cover;
                display: block;
                -o-object-fit: cover;
                object-fit: cover;
                position: absolute;
                left: 0;
                width: 120%;
                height: 120%;
                z-index: 20;

            }

            .thumbnail-screen {
                height: 120%;
                opacity: .4;
                pointer-events: none;
                position: absolute;
                left: 0;
                width: 100%;
                z-index: 30;
                max-width: 120%;
                mix-blend-mode: screen;
                background: linear-gradient(130deg, rgb(36, 198, 220), rgb(84, 51, 255) 41.07%, rgb(255, 0, 153) 76.05%);
            }
        }

        .article-thumbnail:after {
            pointer-events: none;
            content: "";
            position: absolute;
            z-index: 35;
            top: 13%;
            left: 0;
            height: 120%;
            width: 100%;
            background: var(--article-cover);
        }

        .article-content {
            background-color: transparent;
            display: flex;
            flex-direction: column;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
            padding-bottom: 1.5rem;
            position: relative;
            z-index: 40;
            grid-row: span 2/span 2;




            h1 {
                cursor: pointer;
                font-weight: 800;
                font-size: 1.5rem;
                line-height: 2rem;
                color: var(--text-bright);

                margin-top: 1rem;
                margin-bottom: 1.25rem;
            }

            p {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp:5;
                -webkit-box-orient:vertical;
                font-size: 1rem;
            }

            span {
                filter: drop-shadow(0 2px 1px rgba(0, 0, 0, .1));

                ul {
                    display: inline-flex;
                    font-size: .75rem;
                    line-height: 1rem;
                    padding-left: 1rem;
                    
                    li{
                        padding-right: 0.25rem;
                    }
                }

                b {
                    font-size: .75rem;
                    line-height: 1rem;
                    color: var(--text-accent);
                    text-transform: uppercase;
                }
            }

            .article-footer {
                display: flex;
                align-items: flex-end;
                align-content: flex-end;
                justify-content: flex-start;
                flex: 1 1 0%;
                font-size: .875rem;
                line-height: 1.25rem;
                width: 100%;
                margin-top: 1rem;

                img {
                    border-radius: 9999px;
                    margin-right: 0.5rem;
                    height: 28px;
                    width: 28px;
                    cursor: pointer;
                    max-width: 100%;
                }
            }
        }
    }
}

</style>