<template>
    <div>
        <a-button type="primary" @click="AddClick">
            新增
        </a-button>
    </div>
    <a-table :dataSource="Ref_TagList" :columns="columns" :pagination="pagination" @change="Func_RefreshTag">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <span>
                    <a @click="ModifyClick(record)">编辑</a>
                    <a-divider type="vertical" />
                    <a @click="DeleteClick(record)">删除</a>
                    <a-divider type="vertical" />
                    <a class="ant-dropdown-link">
                        More actions
                    </a>
                </span>
            </template>
        </template>

    </a-table>
    <a-modal v-model:visible="ModifyMsgVisible" title="标签修改" @ok="ModifyFunc()">
        <a-input v-model:value="curRecord.tagName"></a-input>
    </a-modal>
    <a-modal v-model:visible="DeletMsgVisible" title="标签删除" @ok="DeleteFunc(curRecord.id)">
        确定删除标签[{{ curRecord.tagName }}]吗
    </a-modal>
    <a-modal v-model:visible="AddMsgVisible" title="新增标签" @ok="AddFunc()">
        <a-input v-model:value="curRecord.tagName"></a-input>
    </a-modal>

</template>
<script setup lang="ts">
import { ArticleTag } from "../../Entities/E_Article";
import { ref, computed } from 'vue'
import TagService from "../../Services/ArticleService"
import { PageRequest } from "../../Entities/CommomEntity"
import { useRouter } from 'vue-router'
import { useArticleStore } from '../../Store/ArticleStore'
import { storeToRefs } from 'pinia';

const ArticleStore = useArticleStore();
const refStore = storeToRefs(ArticleStore);
const router = useRouter();
let Ref_TagList = refStore.Tags;
let Ref_Current = ref(1);
let curRecord = ref({} as ArticleTag);
let DeletMsgVisible = ref(false);
let ModifyMsgVisible = ref(false);
let AddMsgVisible = ref(false);
const Func_RefreshTag = () => {
    ArticleStore.GetTags();
};
Func_RefreshTag();
const pagination = computed(() => ({
    total: Ref_TagList.value.length,
    current: Ref_Current.value,
    pageSize: 10,
}));
const DeleteClick = (record: any) => {
    curRecord.value = record;
    DeletMsgVisible.value = true;
}
const ModifyClick = (record: any) => {
    curRecord.value = record;
    ModifyMsgVisible.value = true;
}
const AddClick = async () => {
    curRecord.value = {

    } as ArticleTag;
    AddMsgVisible.value = true;
}
const DeleteFunc = async (id: string) => {
    var ret = await TagService.prototype.DeleteArticleTag(id);
    if (ret == true) {
        Func_RefreshTag();
    }
    DeletMsgVisible.value = false;
}
const ModifyFunc = async () => {
    var ret = await TagService.prototype.ModifyrticleTag(curRecord.value);
    if (ret == true) {
        Func_RefreshTag();
    }
    ModifyMsgVisible.value = false;
}
const AddFunc = async () => {
    var ret = await TagService.prototype.AddArticleTag(curRecord.value.tagName);
    Func_RefreshTag();
    AddMsgVisible.value = false;
}


const columns = [
    {
        title: '标签名',
        dataIndex: 'tagName',
        key: 'tagName',
    },
    {
        title: 'Action',
        key: 'action',
    },
]
</script>
