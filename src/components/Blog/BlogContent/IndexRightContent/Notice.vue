<template>
  <div >
    <Title :id="'Notice'" :title-str="'公告'" :size="1">
        <comment-outlined />
    </Title>

    {{refAppStore.AllBlogParam.value.find(x=>x.paramName=='Blog-Notice')?.paramValue}}
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed, watch } from 'vue';
import { CommentOutlined } from '@ant-design/icons-vue';
import Title from '../../../common/Title.vue'
import { storeToRefs } from 'pinia';
import { useAppStore } from '../../../../Store/AppStore'

const AppStore = useAppStore();
const refAppStore=storeToRefs(AppStore)


// AppStore.GetParameterValue('Blog-Notice').then(ret=>{
//     Ref_Notice.value=ret??''
// })

</script>
<style scoped lang='less'>

</style>