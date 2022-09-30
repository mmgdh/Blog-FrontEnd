<template>
  <div>
    <a-button type="primary" @click="AddClick">
      新增
    </a-button>
    <a-button type="primary" @click="RefreshFunc" danger>
      重置缓存
    </a-button>
  </div>

  <a-table :dataSource="Ref_BlogParamList" :columns="columns" :pagination="pagination" @change="Func_RefreshBlogParam">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <a @click="ModifyClick(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="DeleteClick(record)">删除</a>
        </span>
      </template>
      <template v-else-if="column.key=='paramValue'">
        <span>{{record.paramValue}}</span>
      </template>
    </template>

  </a-table>
  <a-modal v-model:visible="ModifyMsgVisible" title="参数修改" @ok="ModifyFunc()">
    <a-form :model="submitBlogParam" v-bind="layout" name="EditArticleBlogParam" :validate-messages="validateMessages">
      <a-form-item name="paramName" label="参数名" :rules="[{ required: true }]">
        <a-input v-model:value="submitBlogParam.paramName"></a-input>
      </a-form-item>
      <a-form-item name="paramValue" label="参数值">
        <a-input v-model:value="submitBlogParam.paramValue"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="DeletMsgVisible" title="参数删除" @ok="DeleteFunc(curRecord.id)">
    确定删除参数[{{ curRecord.paramName }}]吗
  </a-modal>

</template>
<script setup lang="ts">
import { BlogParam } from "../../Entities/E_BlogParam";
import { ref, computed } from 'vue'
import BlogInfoService from "../../Services/BlogInfoService"
import { useAppStore } from '../../Store/AppStore'
import { storeToRefs } from 'pinia';

const ParamStore = useAppStore();
const refStore = storeToRefs(ParamStore);
let Ref_BlogParamList = refStore.AllBlogParam;
let Ref_Current = ref(1);
let curRecord = ref({} as BlogParam);
let submitBlogParam = ref({} as BlogParam);
//控制modal的弹出
let DeletMsgVisible = ref(false);
let ModifyMsgVisible = ref(false);
let IsAdd = false;

const Func_RefreshBlogParam = () => {
  ParamStore.GetAllParameter();
};

const pagination = computed(() => ({
  total: Ref_BlogParamList.value.length,
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
  submitBlogParam.value = {
    id: record.id,
    paramName: record.paramName,
    paramValue: record.paramValue
  } as BlogParam;
  ModifyMsgVisible.value = true;
}
const AddClick = async () => {
  IsAdd = true;
  submitBlogParam.value = {

  } as BlogParam;
  ModifyMsgVisible.value = true;

}
const DeleteFunc = async (id: string) => {
  var ret = await BlogInfoService.prototype.DelBlogParameter(id);
  if (ret) {
    Func_RefreshBlogParam();
  }
  DeletMsgVisible.value = false;
}
const ModifyFunc = async () => {
  if (IsAdd) {
    var ret = await BlogInfoService.prototype.AddBlogParameter(submitBlogParam.value);
  }
  else {
    var ret = await BlogInfoService.prototype.ModifyBlogParameter(submitBlogParam.value);
  }
  if (ret) {
    Func_RefreshBlogParam();
  }
  ModifyMsgVisible.value = false;
}

const RefreshFunc = async () => {
  var ret = await BlogInfoService.prototype.RefreshBlogParameter();
  if (ret == true) {
    await ParamStore.GetAllParameter();
    console.log("刷新成功");
  }

}

const columns = [
  {
    title: '参数名',
    dataIndex: 'paramName',
    key: 'paramName',
  },
  {
    title: "参数值",
    dataindex: 'paramValue',
    key: 'paramValue',
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
<style scoped lang="less">
div {
  button {
    margin: 1rem;

  }

}

img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100px;
}
</style>
  