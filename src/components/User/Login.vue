<template>
  <div class="login-container">
    <a-form :model="form" class="login-form" @finish="onSubmit">
      <home-outlined title="回到主页" class="Home" @click="router.push('/')" />
      <h1 class="title">LOGIN</h1>
      <a-form-item name="userName">
        <a-input v-model:value="form.userName">
        </a-input>
      </a-form-item>
      <a-form-item name="passWord">
        <a-input-password v-model:value="form.passWord">
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button shape="round" class="submit" html-type="submit">登录</a-button>     
      </a-form-item>
    </a-form>
    <ul class="bg-bubbles">
      <li v-for="i in 20" :key="i"></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserLogin } from '../../Entities/E_Users.js';
import UserLoginService from '../../Services/UserLoginService.js';
import { useRouter } from 'vue-router';
import { HomeOutlined } from '@ant-design/icons-vue';

let router = useRouter()
var _form: UserLogin = {
  userName: "",
  passWord: "",
}
var form = ref(_form);

const onSubmit = (value: UserLogin) => {
  UserLoginService.prototype.Login(value).then(token => {
    if (token != "") {
      localStorage.setItem('JWT', token);
      console.log("登陆成功！");
      router.push('/BlogManage')
    }

  });

}

</script>
<style scoped lang="less">
.Home{
  position:absolute;
  top: 10px;
  right: 10px;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
}
  /* 背景 */
.login-container {
  /* background: url("../../assets/BackGroud.jpg") no-repeat; */
  background-size: 100% 100%;
  background: linear-gradient(to bottom right, #50A3A2, #53E3A6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.login-form {

  /* 超出部分隐藏 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 500px;
  height: 450px;
  background: linear-gradient(
    to top right,
    rgba(90, 149, 207, 0.5),
    rgba(58, 76, 99, 0.8)
    );
    box-shadow: 10px -10px 20px rgba(0, 0, 0, 0.2),
    -10px 10px 20px rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(6px); /*  元素后面区域添加模糊效果 */
    border-radius: 20px;
    z-index: 10;
    // transform: rotate(-15deg);
  border-radius: 10px;
  box-shadow: 10px 10px 20px rgba(33, 44, 55, .3);
  margin: 0 auto;
  /* background: url("../../assets/houTaiKuang.png"); */
  padding: 40px 110px;

}
@media (max-width: 500px){
  .login-form{
    width: 90%;
    padding: 20px 40px
  }
} ;
/* 登陆按钮 */
.submit {
  width: 100%;
  height: 45px;
  font-size: 16px;
}

/* 用户登陆标题 */
.title {
  margin-bottom: 50px;
  color: #fff;
  font-weight: 700;
  font-size: 24px;
  font-family: Microsoft Yahei;
  -ms-flex-align: center;
}
.bg-bubbles {
    position: absolute;
    // 使气泡背景充满整个屏幕；
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // 如果元素内容超出给定的宽度和高度，overflow 属性可以确定是否显示滚动条等行为；
    overflow: hidden;
    li {
      position: absolute;
      // bottom 的设置是为了营造出气泡从页面底部冒出的效果；
      bottom: -10%;
      // 默认的气泡大小；
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.15);
      list-style: none;
      // 使用自定义动画使气泡渐现、上升和翻滚；
      animation: square 15s infinite;
      transition-timing-function: linear;
      // 分别设置每个气泡不同的位置、大小、透明度和速度，以显得有层次感；
      &:nth-child(1) {
        left: 10%;
      }
      &:nth-child(2) {
        left: 20%;
        width: 90px;
        height: 90px;
        animation-delay: 2s;
        animation-duration: 7s;
      }
      &:nth-child(3) {
        left: 25%;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-duration: 8s;
        background-color: rgba(255, 255, 255, 0.3);
      }
      &:nth-child(5) {
        left: 70%;
      }
      &:nth-child(6) {
        left: 80%;
        width: 120px;
        height: 120px;
        animation-delay: 3s;
        background-color: rgba(255, 255, 255, 0.2);
      }
      &:nth-child(7) {
        left: 32%;
        width: 160px;
        height: 160px;
        animation-delay: 2s;
      }
      &:nth-child(8) {
        left: 55%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
        animation-duration: 15s;
      }
      &:nth-child(9) {
        left: 25%;
        width: 10px;
        height: 10px;
        animation-delay: 2s;
        animation-duration: 12s;
        background-color: rgba(255, 255, 255, 0.3);
      }
      &:nth-child(10) {
        left: 85%;
        width: 160px;
        height: 160px;
        animation-delay: 5s;
      }
    }
    // 自定义 square 动画；
    @keyframes square {
      0% {
        opacity: 0.5;
        transform: translateY(0px) rotate(45deg);
      }
      25% {
        opacity: 0.75;
        transform: translateY(-400px) rotate(90deg)
      }
      50% {
        opacity: 1;
        transform: translateY(-600px) rotate(135deg);
      }
      100% {
        opacity: 0;
        transform: translateY(-1500px) rotate(180deg);
      }
    }
  }
</style>