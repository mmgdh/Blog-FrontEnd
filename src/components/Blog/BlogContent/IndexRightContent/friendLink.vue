<template>
  <div>
    <Title :id="'Notice'" :title-str="'友链'" :size="1">
      <comment-outlined />
    </Title>

    <div class="friendLinkList">
      <div v-for="item in Ref_FriendLinkList" :key="item.id" @click="ClickFunc(item)" class="FriendLinkDiv">
        <div class="FriendHeadshot">
          <span>
            <img :src="item.headshot" alt="" />
          </span>
        </div>
        <div class="FriendInfo">
          <p class="linkName">{{ item.friendName }}</p>
          <p class="LinkDescription">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import {
  ref,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watchEffect,
  computed,
  watch,
} from "vue";
import { CommentOutlined } from "@ant-design/icons-vue";
import Title from "../../../common/Title.vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "../../../../Store/AppStore";
import { FriendLink } from "../../../../Entities/E_FriendLink";
import FriendLinkService from "../../../../Services/FriendLinkService";
import { Item } from "ant-design-vue/lib/menu";

const AppStore = useAppStore();
const refAppStore = storeToRefs(AppStore);

const FriendLinkList: Array<FriendLink> = [];
const Ref_FriendLinkList = ref(FriendLinkList);

onBeforeMount(async () => {
  Ref_FriendLinkList.value = await FriendLinkService.prototype.GetFriendLinkList();
  console.log(Ref_FriendLinkList.value)
});

const ClickFunc = (record: FriendLink) => {
  if (record.friendUrl.includes("http")) {
    window.open(record.friendUrl, '_blank');
  }
  else
    window.open('http://' + record.friendUrl, '_blank');
};
</script>
<style scoped lang='less'>
.friendLinkList {
  display: flex;
  flex-direction: column;

  .FriendLinkDiv {
    display: flex;
    flex-direction: row;
    background-color: var(--background-primary);
    border-radius: 15px;
    font-size: 1rem;
    height: 80px;
    justify-content: center;
    align-items: center;
    text-align: left;

    .FriendHeadshot {
      padding: 10px;
      width: 30%;
      cursor: pointer;

      img {
        background-color: #fff;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;

        height: 60px;
        width: 60px;
        border-radius: 50%;
        overflow: hidden;
      }

    }

    .FriendInfo {
      width: 70%;
      padding: 10px;

      .linkName {
        padding-top: 10px;
        padding-bottom: 1px;
        margin-bottom: 1px;
        color: var(--text-normal);
        font-size: 20px;
        font-weight: 600;
        cursor: pointer;

        &:hover {
          color: var(--text-dim);
        }
      }

      .LinkDescription{
        overflow: hidden;
      }
    }
  }


}
</style>