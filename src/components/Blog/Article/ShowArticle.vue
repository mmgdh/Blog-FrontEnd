<template>
  <div class="MdContainerStyle ">
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
            <img :src="refParamStore.HeadPortrait.value" alt="">
            <span class="text-color-dim">
              <strong class="text-color-normal">{{refParamStore.AuthorName.value}}</strong> 发布于
              {{CurArticle.createDateTime}}
            </span>
          </div>
        </div>
      </div>

    </div>
    <div class="main-grid">
      <div ref="articleRef" class="BlogContent">
        <MdEditor id="markdownContent" v-model="content" :editorId="state.id" preview-only
          class="mdStyle hvr-float-shadow" />
      </div>
      <div class="rightContent">
        <Introduction></Introduction>
        <Catalog class="right-box">
          <div id="toc">12132131</div>
        </Catalog>


      </div>
    </div>

    <!-- <md-atalog :editorId="state.id" :scroll-element="scrollElement" :theme="state.theme" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useRoute } from 'vue-router'
import ArticleService from '../../../Services/ArticleService'
import { useAppStore } from '../../../Store/AppStore';
import { storeToRefs } from 'pinia';
import Introduction from '../BlogContent/IndexRightContent/Introduction.vue'
import Catalog from '../BlogContent/IndexRightContent/catalog.vue'
import tocbot from 'tocbot'
let router = useRoute();
let ArticleId: string;
let content = ref('');
let _Article: any = undefined

const articleRef = ref()

onMounted(() => {
  console.log('获取dom元素', articleRef.value)
  initTocbot();
})

const initTocbot = () => {
  let nodes = articleRef.value.children
  if (nodes.length) {
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i]
      let reg = /^H[1-4]{1}$/
      if (reg.exec(node.tagName)) {
        node.id = i
      }
    }
  }

  tocbot.init({
    tocSelector: '#toc',
    contentSelector: '#markdownContent',
    headingSelector: 'h1, h2, h3',
    hasInnerContainers: true,
    positionFixedClass: 'is-position-fixed',
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

const ParamStore = useAppStore();
const refParamStore = storeToRefs(ParamStore);

let CurArticle = ref(_Article)
ArticleId = router.query.ArticleId as string;

ArticleService.prototype.GetArticleById(ArticleId, true, false).then(ret => {
  CurArticle.value = ret;
  content.value = ret.content;
  // initTocbot()
  // tocbot.refresh()

});
const state = reactive({
  theme: 'dark',
  text: '标题',
  id: 'my-editor'
});

</script>
<style scoped lang="less">
@import '../../../CSS/Box.less';

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

  .BlogContent {
    color: var(--text-bright);
  }

  .RightContent {
    .catalogContainer {
      margin-bottom: 1rem;
      background-color: var(--background-secondary);
      border-radius: 1rem;
      margin-bottom: 2rem;
      padding: 2rem;
      position: relative;
      --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, .1), 0 10px 10px -5px rgba(0, 0, 0, .04);
      box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
      width: 100%;

      .catalogContent {}
    }
  }

  #markdownContent {
    word-wrap: break-word;
    word-break: break-all;
    background-color: var(--background-secondary);
    border-radius: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, .1), 0 10px 10px -5px rgba(0, 0, 0, .04);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

    h1 {
      font-size: 1.875rem;
      line-height: 2.25rem;
      color: var(--text-bright);
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

    a {
      color: var(--text-bright);
    }
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
</style>