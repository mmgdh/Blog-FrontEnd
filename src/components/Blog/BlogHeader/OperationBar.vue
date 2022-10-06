<template>
    <div class="BarStyle">
        <search-outlined class="icon"  @click="OpenSearch" />
        <span class="text" @click="topage('/Login')">登录</span>
        <span><ThemeToggle></ThemeToggle></span>
    </div>
    <ArticleSearch></ArticleSearch>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from './ToggleSwitch/ThemeToggle.vue'
import { SearchOutlined } from '@ant-design/icons-vue';
import ArticleSearch from '../../common/ArticleSearch.vue'
import { useSearchStore } from '../../../Store/SearchStore'

const SearchStore = useSearchStore();

let router = useRouter()
let visible = ref(false)
let topage = (url: string) => {
    router.push(url)
}
const OpenSearch = () => {
    SearchStore.ChangeOpenSearch(true)
}

</script>

<style scoped lang="less">
// * {
//     Padding-right: 10px;
// }

.BarStyle {
    position: relative;
    display: flex;
    flex-direction: row;
    text-align: center;
    height: 100%;
    font-size: 20px;

    span {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        cursor: pointer;
        transition: opacity .25s ease;
        padding-right: 0.5rem;
    }
    .text{
        margin-right: 0.75rem;
        margin-left: 0.75rem;
    }
    .icon{
        font-size: 1.5rem;
    }
}

</style>