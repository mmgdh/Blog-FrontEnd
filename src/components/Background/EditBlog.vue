<template>
    <Md id="MdStyle" v-model="content" @on-upload-img="onUploadImg" @on-html-changed="onHtmlChanged"></Md>

    <div id="BlogButton">
        <a-button shape="round" type="primary" @click="showDrawer">提交</a-button>
        <a-button>草稿</a-button>
    </div>



    <a-drawer v-model:visible="visible" class="custom-class" title="博文信息" placement="right"
        @after-visible-change="afterVisibleChange">
        <a-form :model="SubmitArticle" v-bind="layout" name="nest-messages" :validate-messages="validateMessages"
            @finish="onFinish">
            <a-form-item name="title" label="标题" :rules="[{ required: true }]">
                <a-input v-model:value="SubmitArticle.title" />
            </a-form-item>
            <a-form-item name="classify" label="分类" has-feedback
                :rules="[{ required: true, message: 'Please select your Classify!' }]">
                <a-select v-model:value="SubmitArticle.classify" placeholder="Please select a Classify">
                    <a-select-option v-for="classify in Ref_ArticleCLassify" :value="classify.id" :key="classify.id">
                        {{ classify.classifyName }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item name='tags' label="标签">
                <ArticleTagSelectVue v-model:FSelectArticleTags="SubmitArticle.tags">

                </ArticleTagSelectVue>
            </a-form-item>
            <a-form-item name="DefaultImage" label="分类图片">
                <a-upload v-model:file-list="fileList" list-type="picture" :max-count="1" :before-upload="beforeUpload">
                    <a-button>
                        Upload (Max: 1)
                    </a-button>
                </a-upload>
            </a-form-item>
            <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
                <a-button type="primary" html-type="submit">保存</a-button>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>


<script setup lang='ts'>
import { ref, onBeforeMount, onMounted } from 'vue'
import Md from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { Article, ArticleTag, ArticleClassify } from '../../Entities/E_Article'
import ArticleTagSelectVue from '../common/ArticleTagSelect.vue'
import ArticleService from '../../Services/ArticleService'
import UploadService from '../../Services/UploadService'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue';
import { useArticleStore } from '../../Store/ArticleStore'
import type { UploadProps } from 'ant-design-vue';

const fileList = ref<UploadProps['fileList']>([]);
let router = useRouter();
let ArticleStore = useArticleStore();
let _ArticleCLassify: Array<ArticleClassify> = [];
let Ref_ArticleCLassify = ref(_ArticleCLassify);
let ArticleId: string;
interface InterfaceSubmitArticle {
    title: string,
    classify?: string,
    image: string,
    content: string,
    tags: Array<ArticleTag>
}
let SubmitArticle = ref({} as InterfaceSubmitArticle);
onMounted(() => {
    ArticleId = router.currentRoute.value.query.ArticleId as string;
    Ref_ArticleCLassify.value = ArticleStore.$state.Classifies
    //若ArticleId不为空，则代表编辑状态，查询对应的文章
    if (ArticleId != null) {
        ArticleService.prototype.GetArticleById(ArticleId, true).then(ret => {
            SubmitArticle.value = ret;
            SubmitArticle.value.classify = ret.classify.id;
            content.value = ret.content;
        })
    }
})

//#region  markdown
const content = ref<string>('');
let html = '';

const onHtmlChanged = (_html: string) => {
    html = _html;
}
//MarkDown图片上传功能
const onUploadImg = async (files: any, callback: any) => {
    const res = await Promise.all(
        files.map((file: any) => {
            return new Promise((rev, rej) => {
                const form = new FormData();
                form.append('file', file);
                form.append('UploadType', '文章内容图片');
                UploadService.prototype.UploadImg(form)
                    .then((res: any) => rev(UploadService.prototype.getImageUri() + res))
                    .catch((error: any) => rej(error));
            });
        })
    );
    callback(res.map((item) => item));
};
//#endregion

//#region 右侧抽屉

const visible = ref<boolean>(false);

const afterVisibleChange = (bool: boolean) => {

};

const showDrawer = () => {
    visible.value = true;
};
//#endregion

//#region 抽屉内表单
const beforeUpload: UploadProps['beforeUpload'] = file => {
    fileList.value?.push(file);
    return false;
};

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
const onFinish = (values: Article) => {
    values.content = content.value;
    values.html = html;
    values.id = ArticleId;
    const formdata = new FormData();
    fileList.value?.forEach(file => {
        if (file)
            formdata.append('file', file.originFileObj as any)
    });
    for (var prop in values) {
        const value = (values as any)[prop]
        if (prop == "tags") {
            for (var arrayValue in value) {
                formdata.append(prop, value[arrayValue].id)
            }
        }
        else {
            formdata.append(prop, value)
        }

    }
    if (ArticleId != null) {
        ArticleService.prototype.ModifyArticle(formdata).then((res) => {
            if (res.msg != "") {
                message.success("保存成功!");
                console.log(res);
                router.push("/ArticleManage");
            }
            else {
                message.error("保存失败");
            }

        });
    }
    else {
        ArticleService.prototype.AddArticle(formdata).then((res) => {
            if (res.msg == "") {
                message.success("保存成功!")
                router.push("/ArticleManage");
            }
            else {
            }

        });
    }



};
//#endregion
</script>

<style scoped>
#BlogButton {
    height: 80px;
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 20px;
}

#MdStyle {
    height: 80vh;
}
</style>