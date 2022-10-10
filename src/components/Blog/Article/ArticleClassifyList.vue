<template>
  <div class="ClassifyTabContainer">
    <ul :class="ExpandedCSS">
      <li id="All" class="active">
        <span :style="activeTabStyle('All')" @click="clickFunc('All')">全部</span>
        <b>{{AllArticleCount}}</b>
      </li>
      <li v-for="classify in ArticleClassifies" :key="classify.id">
        <span :style="activeTabStyle(classify.id)" @click="clickFunc(classify.id)">
          {{classify.classifyName}}
        </span>
        <b>{{classify.articleCount}}</b>
      </li>
    </ul>
    <span>
      <menu-outlined class="TabExpandCSS" @click="ExpandedFunc" />
    </span>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { ArticleClassify } from '../../../Entities/E_Article';
import { useArticleStore } from '../../../Store/ArticleStore';
import { useAppStore } from '../../../Store/AppStore';
import { storeToRefs } from 'pinia';
import { MenuOutlined } from '@ant-design/icons-vue';
const ArticleStore = useArticleStore();
const AppStore = useAppStore();

let ArticleClassifies = ref(new Array<ArticleClassify>);
let refArticleStore = storeToRefs(ArticleStore)
ArticleClassifies = refArticleStore.Classifies;
let AllArticleCount = refArticleStore.AllArticleCount;

let activeTabId = ref('All')

let Expanded = ref(true)
let ExpandedCSS = reactive({
  ClassifyTab: true,
  ExpandedTab: false
})
const ExpandedFunc = () => {
  ExpandedCSS.ExpandedTab = !ExpandedCSS.ExpandedTab
}

const clickFunc = (Id: string) => {
  activeTabId.value = Id
  var ClassifyIds: string[] = []
  if (Id != 'All') {
    ClassifyIds.push(activeTabId.value)
  }
  ArticleStore.$patch((state) => {
    state.PageRequestParm.page = 1;
    state.PageRequestParm.ClassifyIds = ClassifyIds;
  });
}

const activeTabStyle = (ClassifyId: any) => {
  if (ClassifyId === activeTabId.value) return { background: AppStore.themeConfig.header_gradient_css, color: 'white' }
  return {}
}
</script>
<style lang="less">
.ClassifyTabContainer {
  position: relative;
}

.TabExpandCSS {
  cursor: pointer;
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  stroke: currentColor;
  color: var(--text-bright);
  opacity: .8;
}



.ClassifyTab {
  background-color: var(--background-secondary);
  border-radius: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  overflow-y: hidden;
  padding-left: 1.5rem;
  padding-right: 3rem;
  --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .06);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  height: 3.5rem;
  transition: height .4s ease;

  &.ExpandedTab {
    overflow-y: initial;
    height: auto;
  }

  li {
    cursor: pointer;
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-right: 0.75rem;

    span {
      background-color: var(--background-primary);
      border-top-left-radius: 0.375rem;
      border-bottom-left-radius: 0.375rem;
      font-size: .875rem;
      line-height: 1.25rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      text-align: center;
      white-space: nowrap;
    }

    b {
      background-color: var(--background-primary);
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
      font-size: .875rem;
      line-height: 1.25rem;
      opacity: .7;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      text-align: center;
      color: var(--text-accent);
      white-space: nowrap;
    }

    :hover {
      --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05);
      box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
      --tw-text-opacity: 1;
      color: rgba(255, 255, 255, var(--tw-text-opacity));
      text-shadow: 0 2px 2px rgb(0 0 0 / 50%);
    }
  }
}
</style>