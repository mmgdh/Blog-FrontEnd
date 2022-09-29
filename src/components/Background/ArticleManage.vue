<template>
  <a-table :dataSource="Ref_ArticleList" :columns="columns" :pagination="pagination" @change="Func_RefreshArtifcle">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'imageId'">
        <span>
          <img :src="ImgUrl + record.imageId" />
        </span>
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag v-for="tag in record.tags" :key="tag.id" :color="tag.tagName.length > 5 ? 'geekblue' : 'green'">
            {{ tag.tagName.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'createDateTime'">
        {{ record.createDateTime }}
      </template>
      <template v-else-if="column.key === 'classify'">
        <span>
          {{ record.classify.classifyName }}
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a @click="router.push({ path: 'EditBlog', query: {'ArticleId': record.id } })">编辑</a>
          <a-divider type="vertical" />
          <a @click="DeleteClick(record)">删除</a>
          <a-divider type="vertical" />
        </span>
      </template>
    </template>

  </a-table>
  <a-modal v-model:visible="DeletMsgVisible" title="Basic Modal" @ok="DeleteFunc(curRecord.id)">
    确定删除该文章[{{ curRecord.title }}]吗
  </a-modal>
</template>
<script setup lang="ts">
import { Article, ArticlePageRequest } from "../../Entities/E_Article";
import { ref, computed } from 'vue'
import ArticleService from "../../Services/ArticleService"
import UploadService from "../../Services/UploadService"
import { PageRequest } from "../../Entities/CommomEntity"
import { useRouter } from 'vue-router'

const router = useRouter();
const ImgUrl = UploadService.prototype.getImageUri()
let Articles: Article[] = [];
let pageRequestData: PageRequest = {
  page: 1,
  pageSize: 10,
  ClassifyIds: [],
  TagIds: [],
  CreateTime: {} as Date
} as ArticlePageRequest
let refPageData = ref(pageRequestData);
let Ref_ArticleList = ref(Articles);
let Ref_pageArticleCount = ref(1);
const Func_RefreshArtifcle = (pag: { pageSize: number; current: number }) => {
  refPageData.value.page = pag.current;
  ArticleService.prototype.GetArticleByPage(refPageData.value)
    .then(ret => {
      Ref_ArticleList.value = ret.articles;
      Ref_pageArticleCount.value = ret.pageArticleCount;
    }
    );
};
Func_RefreshArtifcle({ pageSize: refPageData.value.pageSize, current: refPageData.value.page });

const pagination = computed(() => ({
  total: Ref_pageArticleCount.value,
  current: refPageData.value.page,
  pageSize: refPageData.value.pageSize,
}));

let curRecord: any = ref();
let DeletMsgVisible = ref(false);
const DeleteClick = (record: any) => {
  curRecord.value = record;
  DeletMsgVisible.value = true;
}
const DeleteFunc = async (id: string) => {
  var ret = await ArticleService.prototype.DeleteArticle(id);
  if (ret == true) {
    Func_RefreshArtifcle({ pageSize: refPageData.value.pageSize, current: refPageData.value.page });
  }
  DeletMsgVisible.value = false;
}

const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '分类',
    dataIndex: 'classify',
    key: 'classify',
  },
  {
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
  },
  {
    title:'封面图',
    dataIndex:'imageId',
    key:'imageId'
  },
  {
    title: '创建日期',
    dataIndex: 'createDateTime',
    key: 'createDateTime',
  },
  {
    title: 'Action',
    key: 'action',
  },
]
</script>
<style scoped>
  img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100px;
}
</style>
