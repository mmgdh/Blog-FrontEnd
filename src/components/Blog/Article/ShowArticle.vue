<template>
  <div v-if="CurArticle" class="MdContainerStyle ">
    <div class="main-grid">
      <div class="Blog-header">
        <span class="Blog-labels">
          <b>{{CurArticle.classify.classifyName}}</b>
          <ul>
            <li v-for="Tag in CurArticle.tags" :key="Tag.id">
              <em>#{{Tag.tagName}}</em>
            </li>
          </ul>
        </span>
        <h1 class="Blog-title">{{ CurArticle.title }}</h1>
        <div class="Blog-Author">
          <div class="flex-center">
            <img :src="refAppStore.HeadPortrait.value" alt="">
            <span class="text-color-dim">
              <strong class="text-color-normal">{{refAppStore.AuthorName.value}}</strong> 发布于
              {{CurArticle.createDateTime}}
            </span>
          </div>
        </div>
      </div>

    </div>
    <div class="main-grid">
      <div ref="articleRef" class="BlogContent">
        <MdEditor id="markdownContent" v-model="content" preview-only class="mdStyle hvr-float-shadow" />
        <!-- <div id="markdownContent" v-html="CurArticle.html"></div> -->
      </div>
      <div>
        <Introduction></Introduction>
        <Catalog class="right-box">
          <div id="toc" class="tocbotCss">刷新</div>
        </Catalog>


      </div>
    </div>

    <!-- <md-atalog :editorId="state.id" :scroll-element="scrollElement" :theme="state.theme" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, onUpdated, watch } from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useRoute } from 'vue-router'
import ArticleService from '../../../Services/ArticleService'
import { useAppStore } from '../../../Store/AppStore';
import { storeToRefs } from 'pinia';
import Introduction from '../BlogContent/IndexRightContent/Introduction.vue'
import Catalog from '../BlogContent/IndexRightContent/catalog.vue'
import * as tocbot from 'tocbot'
let router = useRoute();
let ArticleId: string;
let content = ref('');
let _Article: any = undefined

onBeforeUnmount(() => {
  tocbot.destroy()
})
const IsLoadingOver = ref()
const initTocbot = () => {
  // var nodes =document.getElementById('md-editor-v3-preview')?.children as HTMLCollection
  // // let nodes = articleRef.value.children
  // console.log(nodes,articleRef.value);
  // if (nodes.length) {
  //   for (let i = 0; i < nodes.length; i++) {
  //     let node = nodes[i]
  //     let reg = /^H[1-6]{1}$/
  //     if (reg.exec(node.tagName)) {
  //       node.id = i.toString()
  //     }
  //   }
  // }


  tocbot.init({
    tocSelector: '#toc',
    contentSelector: '#markdownContent',
    headingSelector: 'h1, h2,h3',
    scrollSmooth: true,
    // scrollSmoothOffset: -300,
    headingsOffset: -400,
    onClick: function (e) {
      e.preventDefault()
    }
  })
  // const imgs = articleRef.value.getElementsByTagName('img')
  // for (var i = 0; i < imgs.length; i++) {
  //   reactiveData.images.push(imgs[i].src)
  //   imgs[i].addEventListener('click', function (e: any) {
  //     handlePreview(e.target.currentSrc)
  //   })
  // }
}
const AppStore = useAppStore();
const refAppStore = storeToRefs(AppStore);

let CurArticle = ref(_Article)
ArticleId = router.query.ArticleId as string;

ArticleService.prototype.GetArticleById(ArticleId, true, true).then(ret => {
  CurArticle.value = ret;
  content.value = ret.content;
  AppStore.SetBannerImg(ret.imageId)
  window.scrollTo({
    top: 0
  })
  nextTick(() => {
    initTocbot()
    IsLoadingOver.value = true
  })
});
</script>
<style lang="less">
@import '../../../CSS/Box.less';
@import 'tocbot/dist/tocbot.css';
@import 'md-editor-v3/lib/style.css';

.MdContainerStyle {
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.main-grid {
  display: flex;
  flex-direction: column;

  .Blog-header {
    margin-bottom: 1rem;

    .Blog-labels {
      position: relative;
      bottom: -0.375rem;

      b {
        border-radius: .375rem;
        display: inline-flex;
        font-size: .75rem;
        line-height: 1rem;
        opacity: .9;
        padding: .125rem;
        --tw-text-opacity: 1;
        color: rgba(255, 255, 255, var(--tw-text-opacity));
        text-transform: uppercase;
        text-shadow: 0 2px 2px rgba(0, 0, 0, .5);
      }

      ul {
        display: inline-flex;
        padding-left: .5rem;

        li {
          font-size: .875rem;
          line-height: 1.25rem;
          margin-right: .75rem;
          opacity: .7;
          --tw-text-opacity: 1;
          color: rgba(255, 255, 255, var(--tw-text-opacity));
          text-shadow: 0 2px 2px rgb(0 0 0 / 50%);
        }
      }
    }

    .Blog-title {
      margin-top: .5rem;
      margin-bottom: 1rem;
      font-size: clamp(1.2rem, 1rem + 3.5vw, 4rem);
      text-shadow: 0 2px 2px rgb(0 0 0 / 50%);
      line-height: 1.1;
      color: rgba(255, 255, 255, 1);
    }

    .Blog-Author {
      margin-top: 2rem;
      margin-bottom: 1rem;
      justify-content: flex-start;
      align-items: center;
      flex-direction: row;
      display: flex;

      .flex-center {
        display: flex;
        flex-direction: row;
        align-items: center;

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

  // .BlogContent {
  //   color: var(--text-bright);
  // }

  #markdownContent {
    word-wrap: break-word;
    word-break: break-all;
    background-color: var(--background-secondary);
    border-radius: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, .1), 0 10px 10px -5px rgba(0, 0, 0, .04);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
}


.tocbotCss>ol {
  list-style: none;
  counter-reset: li;
  padding-left: 1.5rem;

  >li {
    font: bold;

    &.is-active-li>.node-name--H1 {
      color: var(--text-accent);
    }

    &.is-active-li>.node-name--H2 {
      color: var(--text-accent);
    }

    &.is-active-li>.node-name--H3 {
      color: var(--text-accent);
    }
  }

  ol li {
    font-weight: 600;
    // @apply font-semibold mt-1.5 mb-1.5;
    padding-left: 1.5rem;

    &.is-active-li>.node-name--H2 {
      color: var(--text-accent);
    }

    &.is-active-li>.node-name--H3 {
      color: var(--text-accent);
    }

    ol li {
      font-weight: 600;
      // @apply font-medium mt-1.5 mb-1.5;
      padding-left: 1.5rem;

      &.is-active-li .node-name--H3 {
        color: var(--text-accent);
      }
    }
  }

  ol,
  ol ol {
    position: relative;
  }

  >li::before,
  ol>li::before,
  ol ol>li::before,
  ol ol ol>li::before,
  ol ol ol ol>li::before {
    content: '•';
    color: var(--text-accent);
    display: inline-block;
    width: 1em;
    margin-left: -1.15em;
    padding: 0;
    font-weight: bold;
    text-shadow: 0 0 0.5em var(--accent-2);
  }

  >li::before {
    font-size: large // @apply text-xl;
  }

  >li>ol::before,
  >li>ol>li>ol::before {
    content: '';
    border-left: 1px solid var(--text-accent);
    position: absolute;
    opacity: 0.35;
    left: -1em;
    top: 0;
    bottom: 0;
  }

  >li>ol::before {
    left: -1.25em;
    border-left: 2px solid var(--text-accent);
  }
}


@media (min-width:1024px) {
  .main-grid {
    display: grid;
    gap: var(--gap);
    grid-template-columns: minmax(0, 1fr) 320px;

    #markdownContent {
      margin-bottom: 0;
      padding: 3.5rem;
    }
  }
}

#md-editor-v3-preview {

  p {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    line-height: 2;

    code {
      color: var(--text-normal);
      margin: 0;
      border-radius: 3px;
      overflow-wrap: break-word;
      background-color: var(--bg-accent-05);
      word-wrap: break-word;
      padding: 0.1rem 0.3rem;
      border-radius: 0.3rem;
      color: var(--text-accent) !important;

      .code-block {
        color: var(--text-normal);
      }
    }
  }

  blockquote {
    position: relative;
    padding: 0.5rem 1rem 0.5rem 2rem;
    color: var(--text-normal);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    margin-bottom: 2em;
    margin-top: 2em;
    margin-right: 0 !important;
    border-left: 3px var(--text-accent) solid;
    border-top: transparent;
    border-bottom: transparent;
    border-right: transparent;
    background: linear-gradient(135deg, var(--background-primary), var(--background-primary) 41.07%, var(--background-secondary) 76.05%, var(--background-secondary));

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 2px;
      width: 76%;
      background: linear-gradient(90deg, var(--text-accent), var(--background-secondary) 76.05%);
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 45%;
      background: linear-gradient(90deg, var(--text-accent), var(--background-primary) 45%);
    }
  }

  hr {
    position: relative;
    -webkit-margin-before: 0;
    margin-block-start: 0;
    -webkit-margin-after: 0;
    margin-block-end: 0;
    border: none;
    height: 1px;
    padding: 2.5em 0;

    &:before {
      content: "§";
      display: inline-block;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -44%) rotate(60deg);
      transform-origin: 50% 50%;
      color: var(--text-sub-accent);
      background-color: var(--background-secondary);
      z-index: 10;
      padding: 0.25rem;
      border-radius: 60%;
    }

    &:after {
      position: absolute;
      content: "";
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      background: var(--header_gradient_css);
      height: 3px;
      width: 26%;
      border-radius: 9999px;
      opacity: .26;
      margin: 2.5em auto;
    }
  }




  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: .5rem;
    padding-top: 1.75rem;
    position: relative;
    color: var(--text-bright);
    font-weight: 600;
  }

  h1:after,
  h2:after,
  h3:after,
  h4:after,
  h5:after,
  h6:after {
    border-radius: 9999px;
    height: .25rem;
    position: absolute;
    bottom: 0;
    width: 6rem;
    content: "";
    background: var(--header_gradient_css);
  }
}
</style>