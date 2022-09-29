<template>
  <div >
    <Title :id="'Notice'" :title-str="'公告'" :size="1">
        <comment-outlined />
    </Title>

    {{Ref_Notice}}
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from 'vue';
import { CommentOutlined } from '@ant-design/icons-vue';
import Title from '../../../common/Title.vue'
import { useAppStore } from '../../../../Store/AppStore'

const ArticleStore = useAppStore();
const Ref_Notice = ref('')
ArticleStore.GetParameterValue('Blog-Notice').then(ret=>{
    Ref_Notice.value=ret??''
})
</script>
<style scoped lang='less'>

</style>