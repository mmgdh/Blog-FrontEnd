<template>
  <div>
    <a-button type="primary" @click="AddClick"> 新增 </a-button>
    <a-button type="primary" @click="RefreshFunc" danger> 重置缓存 </a-button>
  </div>

  <a-table
    :dataSource="Ref_FriendLinkList"
    :columns="columns"
    :pagination="pagination"
    @change="Func_RefreshFriendLink"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <a @click="ModifyClick(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="DeleteClick(record)">删除</a>
        </span>
      </template>
      <template v-else-if="column.key === 'headshot'">
        {{ record.headshot }}
      </template>
      <template v-else-if="column.key === 'friendUrl'">
        {{ record.friendUrl }}
      </template>
      <template v-else-if="column.key === 'description'">
        {{ record.description }}
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:visible="ModifyMsgVisible"
    title="友链修改"
    @ok="ModifyFunc()"
  >
    <a-form
      :model="submitFriendLink"
      v-bind="layout"
      name="EditArticleFriendLink"
      :validate-messages="validateMessages"
    >
      <a-form-item name="friendName" label="名称" :rules="[{ required: true }]">
        <a-input v-model:value="submitFriendLink.friendName"></a-input>
      </a-form-item>
      <a-form-item name="friendUrl" label="友链地址">
        <a-input v-model:value="submitFriendLink.friendUrl"></a-input>
      </a-form-item>
      <a-form-item name="headshot" label="友链头像地址">
        <a-input v-model:value="submitFriendLink.headshot"></a-input>
      </a-form-item>
      <a-form-item name="description" label="友链自我描述">
        <a-input v-model:value="submitFriendLink.description"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:visible="DeletMsgVisible"
    title="友链删除"
    @ok="DeleteFunc(curRecord.id)"
  >
    确定删除友链[{{ curRecord.friendName }}]吗
  </a-modal>
</template>
<script setup lang="ts">
import { FriendLink } from "../../Entities/E_FriendLink";
import { ref, computed, reactive } from "vue";
import FriendLinkService from "../../Services/FriendLinkService";
import { useAppStore } from "../../Store/AppStore";
import { storeToRefs } from "pinia";

const ParamStore = useAppStore();
const refStore = storeToRefs(ParamStore);
let FriendLinkList: Array<FriendLink> = [];
let Ref_FriendLinkList = ref(FriendLinkList);

let Ref_Current = ref(1);
let curRecord = ref({} as FriendLink);
let submitFriendLink = ref({} as FriendLink);
//控制modal的弹出
let DeletMsgVisible = ref(false);
let ModifyMsgVisible = ref(false);
let IsAdd = false;

const Func_RefreshFriendLink = () => {
  FriendLinkService.prototype.GetFriendLinkList().then((x) => {
    if (x != undefined) {
      Ref_FriendLinkList.value = x;
      console.log(Ref_FriendLinkList.value);
    }
  });
};
Func_RefreshFriendLink();
const pagination = computed(() => ({
  total: Ref_FriendLinkList.value.length,
  current: Ref_Current.value,
  pageSize: 10,
}));
const DeleteClick = (record: any) => {
  curRecord.value = record;
  DeletMsgVisible.value = true;
};
const ModifyClick = (record: FriendLink) => {
  IsAdd = false;
  curRecord.value = record;
  submitFriendLink.value = {
    id: record.id,
    friendName: record.friendName,
    friendUrl: record.friendUrl,
    headshot: record.headshot,
    description: record.description,
  } as FriendLink;
  ModifyMsgVisible.value = true;
};
const AddClick = async () => {
  IsAdd = true;
  submitFriendLink.value = {} as FriendLink;
  ModifyMsgVisible.value = true;
};
const DeleteFunc = async (id: string) => {
  var ret = await FriendLinkService.prototype.DeleteFriendLink(id);
  if (ret) {
    Func_RefreshFriendLink();
  }
  DeletMsgVisible.value = false;
};
const ModifyFunc = async () => {
  if (IsAdd) {
    var ret = await FriendLinkService.prototype.AddFriendLink(
      submitFriendLink.value
    );
  } else {
    var ret = await FriendLinkService.prototype.ModifyFriendLink(
      submitFriendLink.value
    );
  }
  if (ret) {
    Func_RefreshFriendLink();
  }
  ModifyMsgVisible.value = false;
};

const RefreshFunc = async () => {
  Ref_FriendLinkList.value =
    await FriendLinkService.prototype.GetFriendLinkList();
  console.log(Ref_FriendLinkList.value[0].friendUrl);
};

const columns = [
  {
    title: "名称",
    dataIndex: "friendName",
    key: "friendName",
  },
  {
    title: "友链地址",
    dataindex: "friendUrl",
    key: "friendUrl",
  },
  {
    title: "头像地址",
    dataindex: "headshot",
    key: "headshot",
  },
  {
    title: "描述",
    dataindex: "description",
    key: "description",
  },
  {
    title: "Action",
    key: "action",
  },
];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
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
  