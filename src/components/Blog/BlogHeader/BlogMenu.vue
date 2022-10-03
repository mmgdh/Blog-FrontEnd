<template>
    <div class="menuBody">
        <div class="menuLeft">
            <div class="logo" @click="topage('/BlogIndex')">
                <span>{{AuthorName}}</span>
                <span class="logoBottom" @click="topage('/BlogIndex')">{{AuthorPinYin}}</span>
            </div>
            <nav class="nav">
                <div class="container">
                    <!-- <ul>
                        <li><a href="#" class="current">Home</a> </li>
                        <li><a @click="topage('/BlogManage')">管理</a> </li>
                    </ul> -->
                </div>
            </nav>
        </div>

        <OperationBar>

        </OperationBar>
    </div>



</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import OperationBar from './OperationBar.vue'
import { useAppStore } from '../../../Store/AppStore';
import { storeToRefs } from 'pinia';
const ParamStore = useAppStore();
const refParamStore = storeToRefs(ParamStore)
let AuthorName = refParamStore.AuthorName;
let AuthorPinYin = refParamStore.AuthorPinYin;
let router = useRouter()
let topage = (url: string) => {
    router.push(url)
}

</script>
<style scoped lang="less">
.menuBody {
    display: flex;
    flex-grow: 1;
    font-family: 'Open Sans', sans-serif;
    color: #FFF;
    height: 100px;
    width: 100%;
    position: relative;
    justify-content: space-between;
    align-items: center;
}

.menuLeft {
    display: flex;
    align-items: center;
}

.logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 30px;
    padding-right: 3rem;
    cursor: pointer;

    .logoBottom {
        font-size: .75rem;
        line-height: 1rem;
        text-transform: uppercase;
        font-weight: 800;
    }
}

.nav {
    transition: all 0.3s ease-in-out;

    ul {

        display: flex;
        justify-items: center;
        align-items: center;
    }

    a {
        color: #fff;
        text-decoration: none;
        padding: 7px 15px;
    }
}
</style>