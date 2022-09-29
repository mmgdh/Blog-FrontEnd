<template>
  <div class="container">
    <div class="Board">
      <div class="BoardContent">
        <h2>
          <p>
            EDITOR'S SELECTION</p>
          <span>
            推荐文章
          </span>
        </h2>
      </div>
      <span class="BoardBack"></span>
    </div>
    <ul>
      <li v-for="article in Ref_ArticleList" :key="article.id">
        <ArticleCardVue :ArticleData="article" />
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '../../../Store/ArticleStore'
import { storeToRefs } from 'pinia';
import ArticleCardVue from '../Article/ArticleCard.vue'

let ArticleStore = useArticleStore();
let router = useRouter()
let refStore = storeToRefs(ArticleStore);
let ArticleList: any = undefined;
let Ref_ArticleList = ref(ArticleList)
refStore.RecommemtArticle.value.then(x => {
  Ref_ArticleList.value = x;
})
</script>

<style scoped lang="less">
@import '../../../CSS/CommomCSS.less';

.container {
  display: flex;
  flex-direction: column;
  .py(2rem);
  .gap(2rem);
  .box-border();
}

.Board {
  .relative();
  .overflow-hidden();
  border-radius: 1rem;
  height: auto;

  .BoardContent {
    width: calc(100% - .5rem);
    height: calc(100% - .5rem);
    margin: .25rem;
    position: relative;
    z-index: 10;
    padding-bottom: 2.5rem;
    opacity: .9;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    .px(2rem);
    border-radius: 1rem;
    background-color: var(--background-primary);
    font-weight: bold;

    h2 {
      padding-bottom: 4rem;
      font-size: 1.875rem;
      line-height: 2.25rem;
      font-weight: inherit;

      p {
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        .gradient-font()
      }

      span {
        font-size: 1.5rem;
        line-height: 2rem;
        font-weight: 600;
        position: relative;
        color: var(--text-bright);
      }
    }
  }

  .BoardBack {
    position: absolute;
    z-index: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: var(--header_gradient_css);
  }
}

ul {
  .gap(2rem);
  display: grid;
}

@media (min-width: 1024px) {
  .container {
    display: grid;
    grid-template-columns: 245px minmax(0, 1fr);
  }

  .lg\:h-auto {
    height: auto;
  }

  ul {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}









// .linear-gradient {
//   background-image: linear-gradient(90deg, #f90, #3c9);
//   background-clip: text;
//   line-height: 80px;
//   font-size: 60px;
//   color: transparent;
//   animation: hueRotate 5s linear infinite;
// }

// @keyframes hueRotate {
//   from {
//     filter: hue-rotate(0);
//   }

//   to {
//     // hue-rotate滤镜除了支持deg，还支持其它CSS3单位，比如圈数turn、弧度rad等
//     filter: hue-rotate(360deg); // 360度旋转
//   }
// }
</style>