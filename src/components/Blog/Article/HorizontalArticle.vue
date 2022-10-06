<template>
    <div class="article-container">
        <span class="article-tag">
            <b>
                <pushpin-outlined /> Top
            </b>
        </span>
        <div v-if="articledata" class="feature-article">
            <div class="feature-thumbnail" @click="ToDetail">
                <img v-if="articledata" :src="ImgUrl + articledata.imageId" />
                <img v-else src="../../../Img/backgroud.png" />
                <span class="thumbnail-screen"></span>
            </div>
            <div class="feature-content" v-if="articledata">
                <span>
                    <b> {{articledata.classify.classifyName}} </b>
                    <ul v-for="tag in articledata.tags">
                        <li><em>[{{tag.tagName}}]</em></li>
                    </ul>
                </span>
                <h1 @click="ToDetail">{{articledata.title}}</h1>
                <p>{{articledata.description}}</p>
                <div class="article-footer">
                    <div class="flex-center">
                        <img :src="refPictureUrl" alt="">
                        <span class="text-color-dim">
                            <strong class="text-color-normal">{{AuthorName}}</strong> 发布于
                            {{new Date(articledata.createDateTime).toLocaleDateString()}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang='ts'>
import { ref, onBeforeMount, watch, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { Article } from '../../../Entities/E_Article';
import UploadService from "../../../Services/UploadService"
import { useAppStore } from '../../../Store/AppStore';
import { storeToRefs } from 'pinia';
import { PushpinOutlined } from '@ant-design/icons-vue';
const ImgUrl = UploadService.prototype.getImageUri()
let router = useRouter()
const props = defineProps<{
    articledata: Article | undefined
}>()
let articledata =toRef(props,"articledata");
const ParamStore = useAppStore();
const refParamStore = storeToRefs(ParamStore);
var refPictureUrl = ref(`${refParamStore.HeadPortrait.value}`);
const AuthorName = refParamStore.AuthorName;
watch(refParamStore.HeadPortrait, (newValue, oldValue) => {
    refPictureUrl.value = `${newValue}`;
})
const ToDetail = () => {
    if (articledata.value) {
        router.push({
            path: '/ShowArticle/' + articledata.value.id
        })
    }

}
</script>

<style scoped lang="less">
@import '../../../CSS/Article.less';

@ComputerHeight: 28rem;
@phoneHeight: 120%;


.feature-article {
    transition: transform .2s ease-in-out;
    background-color: var(--background-secondary);
    border-radius: 1rem;
    display: grid;
    overflow: hidden;
    position: relative;
    top: 0;
    --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    z-index: 99;

    .feature-thumbnail {
        position: relative;

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
            z-index: 20;

        }

        span {
            opacity: .4;
            pointer-events: none;
            position: absolute;
            width: 120%;
            z-index: 30;
            background: var(--header_gradient_css)
        }

        &:after {
            pointer-events: none;
            content: "";
            position: absolute;
            z-index: 35;
            left: 71%;
            top: 0;
            height: @ComputerHeight;
            width: 50%;
            background: var(--gradient-cover);
        }

        .thumbnail-screen {
            mix-blend-mode: screen;
        }

    }

    .feature-content {
        display: flex;
        flex-direction: column;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        padding-bottom: 1.5rem;
        position: relative;
        z-index: 40;
        grid-row: span 2/span 2;

        b {
            font-size: .75rem;
            line-height: 1rem;
            color: var(--text-accent);
            text-transform: uppercase;

        }

        ul {
            display: inline-flex;
            font-size: .75rem;
            line-height: 1rem;
            padding-left: 1rem;
        }

        p {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            word-wrap: break-word;
            word-break: break-all;
            font-size: 1rem;
            line-height: 1.5rem;
            margin-bottom: .5rem;
        }

        h1 {
            font-weight: 800;
            font-size: 1.5rem;
            line-height: 2rem;
            margin-bottom: 1.5rem;
            color: var(--text-bright);
            cursor: pointer;
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

            img {
                border-radius: 9999px;
                margin-right: 0.5rem;
                height: 28px;
                width: 28px;
                cursor: pointer;
                max-width: 100%;
            }

            strong {
                padding-right: 0.375rem;
            }
        }
    }


}

.flex-center {
    display: flex;
    flex-direction: row;
    align-items: center;

}

@media (min-width: 1024px) {
    .feature-article {
        height: @ComputerHeight;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: none;

        .feature-thumbnail {
            span {
                height: @ComputerHeight;
            }

            img {
                height: @ComputerHeight;
            }
        }

        .feature-content {
            padding: 3rem;
            grid-row: auto;

            h1 {
                font-size: 2.25rem;
                line-height: 2.5rem;
                margin-top: 1rem;
                margin-bottom: 2rem;
            }

            b {
                font-size: 1rem;
                line-height: 1.5rem;
            }

            ul {
                font-size: 1rem;
                line-height: 1.5rem;
            }
        }
    }
}

@media (max-width:1023px) {
    .feature-article>div:first-of-type:after {
        top: 13%;
        left: 0;
        height: @phoneHeight;
        width: 100%;
        background: var(--article-cover);
    }

    .feature-article {
        width: 100%;
        height: @ComputerHeight;
        grid-template-rows: repeat(3, minmax(0, 1fr));

        .feature-thumbnail {
            span {
                height: @phoneHeight;
            }

            img {
                height: @phoneHeight;
            }
        }
    }
}
</style>