<template>
  <div>
    <a-button type="primary" @click="AddClick">
      新增
    </a-button>

  </div>

  <a-table :dataSource="Ref_ClassifyList" :columns="columns" :pagination="pagination" @change="Func_RefreshClassify">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'imgId'">
        <span>
          <img :src="ImgUrl + record.imgId" />
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a @click="ModifyClick(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="DeleteClick(record)">删除</a>
        </span>
      </template>
    </template>

  </a-table>
  <a-modal v-model:visible="ModifyMsgVisible" title="标签修改" @ok="ModifyFunc()">
    <a-form :model="submitClassify" v-bind="layout" name="EditArticleClassify" :validate-messages="validateMessages">
      <a-form-item name="classifyName" label="分类标题" :rules="[{ required: true }]">
        <a-input v-model:value="submitClassify.classifyName"></a-input>
      </a-form-item>
      <a-form-item name="DefaultImage" label="分类图片">
        <a-upload v-model:file-list="fileList" list-type="picture" :max-count="1" :before-upload="beforeUpload">
          <a-button>
            Upload (Max: 1)
          </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="DeletMsgVisible" title="标签删除" @ok="DeleteFunc(curRecord.id)">
    确定删除标签[{{  curRecord.classifyName  }}]吗
  </a-modal>

</template>
<script setup lang="ts">
import { ArticleClassify } from "../../Entities/E_Article";
import { ref, computed } from 'vue'
import ClassifyService from "../../Services/ArticleService"
import UploadService from "../../Services/UploadService"
import { useArticleStore } from '../../Store/ArticleStore'
import { storeToRefs } from 'pinia';
import type { UploadProps } from 'ant-design-vue';


const fileList = ref<UploadProps['fileList']>([]);
const ArticleStore = useArticleStore();
const refStore = storeToRefs(ArticleStore);
const ImgUrl = UploadService.prototype.getImageUri()
let Ref_ClassifyList = refStore.Classifies;
let Ref_Current = ref(1);
let curRecord = ref({} as ArticleClassify);
let submitClassify = ref({} as ArticleClassify);
//控制modal的弹出
let DeletMsgVisible = ref(false);
let ModifyMsgVisible = ref(false);
let IsAdd = false;

const Func_RefreshClassify = () => {
  ArticleStore.GetClassifies();
};

const pagination = computed(() => ({
  total: Ref_ClassifyList.value.length,
  current: Ref_Current.value,
  pageSize: 10,
}));
const DeleteClick = (record: any) => {
  curRecord.value = record;
  DeletMsgVisible.value = true;
}
const ModifyClick = (record: any) => {
  IsAdd = false;
  curRecord.value = record;
  submitClassify.value = {
    id:curRecord.value.id,
    classifyName: curRecord.value.classifyName
  } as ArticleClassify;
  ModifyMsgVisible.value = true;
}
const AddClick = async () => {
  IsAdd = true;
  submitClassify.value = {
    classifyName: curRecord.value.classifyName
  } as ArticleClassify;
  ModifyMsgVisible.value = true;

}
const DeleteFunc = async (id: string) => {
  var ret = await ClassifyService.prototype.DeleteArticleClassify(id);
  if (ret == true) {
    Func_RefreshClassify();
  }
  DeletMsgVisible.value = false;
}
const ModifyFunc = async () => {
  const formdata = new FormData();
  fileList.value?.forEach(file => {
    if (file)
      formdata.append('file', file.originFileObj as any)
  });
  formdata.append('ClassifyName', submitClassify.value.classifyName)
  if (IsAdd) {
    var ret = await ClassifyService.prototype.AddArticleClassify(formdata);
  }
  else {
    formdata.append('id', submitClassify.value.id);

    var ret = await ClassifyService.prototype.ModifyArticlCLassify(formdata);
  }
  if (ret == true) {
    Func_RefreshClassify();
  }
  ModifyMsgVisible.value = false;
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  fileList.value?.push(file);
  return false;
};

const columns = [
  {
    title: '分类名',
    dataIndex: 'classifyName',
    key: 'classifyName',
  },
  {
    title: "图片",
    dataindex: 'imgId',
    key: 'imgId',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
</script>
<style scoped>
img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100px;
}
</style>
