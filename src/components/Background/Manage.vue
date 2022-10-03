<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>文章</span>
            </span>
          </template>
          <a-menu-item key="1" @click="topage('/EditBlog')">新增文章</a-menu-item>
          <a-menu-item key="2" @click="topage('/ArticleManage')">文章管理</a-menu-item>
          <a-menu-item key="3" @click="topage('/TagManage')">标签管理</a-menu-item>
          <a-menu-item key="4" @click="topage('/ClassifyManage')">分类管理</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <team-outlined />
              <span>User</span>
            </span>
          </template>
          <a-menu-item key="7" @click="topage('/Login')">登录</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <template #title>
            <span>
              <team-outlined />
              <span>博客信息</span>
            </span>
          </template>
          <a-menu-item key="8" @click="topage('/BlogParameter')">参数管理</a-menu-item>
          <a-menu-item key="9" @click="topage('/BlogMain')">回到主页</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- <a-layout-header style="background: #fff; padding: 0" /> -->
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb>

        <router-view>
        </router-view>


      </a-layout-content>
      <a-layout-footer style="text-align: center">
        MMGDH-Blog@2022
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
import {
  UserOutlined,
  TeamOutlined,
  FileOutlined,
} from '@ant-design/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router'

let router = useRouter()
let collapsed = ref<boolean>(false)
let selectedKeys = ref<string[]>(['1'])

let topage = (url: string) => {
  router.push(url)
}

</script>
<style>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

#md-editor-v3 {
  height: 600px;
}
</style>
