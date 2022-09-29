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
        <MdEditor  id="markdownContent" v-model="content" :editorId="state.id" preview-only
          class="mdStyle hvr-float-shadow" />
          <!-- <div id="markdownContent" v-html="CurArticle.html"></div> -->
      </div>
      <div>
        <Introduction></Introduction>
        <Catalog class="right-box">
          <div id="toc" class="ttt">刷新</div>
        </Catalog>


      </div>
    </div>

    <!-- <md-atalog :editorId="state.id" :scroll-element="scrollElement" :theme="state.theme" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount,nextTick } from 'vue';
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

const articleRef = ref()

onMounted(() => {
  console.log('获取dom元素', articleRef.value)
  // initTocbot();
})
onBeforeUnmount(() => {
  tocbot.destroy()
})
const initTocbot = () => {
  var nodes =document.getElementById('my-editor-preview')?.children as HTMLCollection
  // let nodes = articleRef.value.children
  console.log(nodes,articleRef.value);
  if (nodes.length) {
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i]
      let reg = /^H[1-6]{1}$/
      if (reg.exec(node.tagName)) {
        node.id = i.toString()
      }
    }
  }
 

  tocbot.init({
    tocSelector: '#toc',
    contentSelector: '#my-editor-preview',
    headingSelector: 'h1, h2',
    scrollSmooth: true,
    scrollSmoothOffset: -80,
    headingsOffset: -500,
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

ArticleService.prototype.GetArticleById(ArticleId, true, true).then(ret => {
  CurArticle.value = ret;
  content.value = ret.content;

  nextTick(() => {
    initTocbot()
    tocbot.refresh()
  })
  // tocbot.refresh()

});
const state = reactive({
  theme: 'dark',
  text: '标题',
  id: 'my-editor'
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

  .BlogContent {
    color: var(--text-bright);
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


.ttt>ol {
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

// .is-collapsible {
//   max-height: 1000px;
//   overflow: hidden;
//   transition: all 300ms ease-in-out;
// }

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