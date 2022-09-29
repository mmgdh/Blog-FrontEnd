<template>
  <div class="CardContainer">
    <div class="card">
      <div class="UserPicture"></div>
      <div class="info">
        <h1>{{AuthorName}}</h1>
        <h2>Full Stack developer</h2>

      </div>
      <div class="linkCSS">
        <github-outlined class="col" :style="{fontSize: '3rem'}" />
      </div>
      <div class="detail">
        <div class="col">
          <h3>{{ArticleStore.AllArticleCount}}</h3>
          <h4>文章</h4>
        </div>
        <div class="col">
          <h3>{{ArticleStore.Classifies.length}}</h3>
          <h4>分类</h4>
        </div>
        <div class="col">
          <h3>{{ArticleStore.Tags.length}}</h3>
          <h4>标签</h4>
        </div>
      </div>
    </div>
    <span class="BoardBack"></span>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../../../../Store/AppStore';
import { useArticleStore } from '../../../../Store/ArticleStore';
import { onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { GithubOutlined } from '@ant-design/icons-vue';

const ParamStore = useAppStore();
const refParamStore = storeToRefs(ParamStore);
const ArticleStore = useArticleStore();
var refPictureUrl = ref(`url(${refParamStore.HeadPortrait.value})`)
const AuthorName = refParamStore.AuthorName;
watch(refParamStore.HeadPortrait, (newValue, oldValue) => {
  refPictureUrl.value = `url(${newValue})`
})



</script>
<style scoped lang="less">
@import '../../../../CSS/CommomCSS.less';

.CardContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 20rem;
  transition: all 0.4s ease-in-out;
  .py(2rem);
  .gap(2rem);
  .box-border();

  &:hover {
    height: 30rem;

    .BoardBack {
      height: 28rem;
    }

    .card {
      height: 27.5rem;


      .UserPicture {
        height: 200px;
        width: 200px;
        border-radius: 60px;
      }

      .info {
        display: flex;
        padding: 200px 0px 10px 0px;
      }

      .linkCSS,
      .detail,
      .buttons {
        opacity: 1;
        z-index: 0;
        transform: translateX(0px);
        transition-timing-function: linear;
        transition-duration: 0s, 0.3s, 0.3s;
        transition-property: z-index, opacity, transform;
        transition-delay: 0s, 0.2s, 0.2s;
      }
    }
  }

  .BoardBack {
    position: absolute;
    z-index: -10;
    top: 0;
    width: 100%;
    height: 15rem;
    background: var(--header_gradient_css);
    border-radius: 1rem;
    transition: all 0.4s ease-in-out;
  }

  .card {
    color: var(--text-normal);
    position: absolute;
    margin: .25rem;
    padding-bottom: 2.5rem;
    width: calc(100% - .5rem);
    height: 14.5rem;
    background: var(--background-opacity);
    // box-shadow: 0 15px 50px rgba(0, 0, 0, 0.35);
    transition: all 0.4s ease-in-out;
    border-radius: 1rem;

    .UserPicture {
      position: absolute;
      top: -45px;
      left: 50%;
      z-index: 99;
      opacity: 1;
      transform: translate(-50%, 0%);
      background-image: v-bind(refPictureUrl);
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      height: 150px;
      width: 150px;
      border-radius: 90px;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.35);
      transition: all 0.4s ease-in-out;
    }

    h1 {
      color: var(--text-normal);
      font-weight: 800;
    }

    h2 {
      font-weight: 500;
      font-size: 15px;
      color: var(--text-title-h2);
    }

    .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-items: center;
      padding: 125px 0px 10px 0px;
      transition: all 0.4s ease-in-out;
    }

  }
}



.linkCSS {
  opacity: 0;
  .CardAnimation();
}

.detail {
  position: relative;
  display: flex;
  opacity: 0;
  z-index: -10;
  justify-content: space-between;
  padding: 10px 50px;
  .CardAnimation();
}

.CardAnimation {
  transform: translateX(-20px);
  transition-timing-function: linear;
  transition-duration: 0s, 0.2s, 0.2s;
  transition-property: z-index, opacity, transform;
  transition-delay: 0.2s, 0s, 0s;
}

.col {

  h4,
  h3 {
    color: var(--text-normal);
  }

  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  fill: var(--text-normal);
}

@media (min-width: 1024px) {
  .CardContainer {
    display: grid;
    grid-template-columns: 100% minmax(0, 1fr);
  }
}
</style>