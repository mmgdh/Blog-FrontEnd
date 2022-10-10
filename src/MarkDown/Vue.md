>本文章讲解本人目前所了解的Vue3知识，**统一使用SetUp语法糖**，构建工具为Vite，使用TypeScript，开发工具为VS Code，由于本人不是专业前端，所以就以案例来讲解Vue知识。

# 如何创建Vue项目
使用Vite，官方文档（https://vitejs.cn/vite3-cn/guide/） 确保你的NodeJs版本，官方说明14.8+，我本地使用16.15
```
1. npm create vite@latest
2. 回车后显示输入项目名
3. 回车后选择Vue
4. 回车后选择TypeScript
5. 一个全新的Vue+Vite+TypeScript项目诞生啦
```


# 如何实现响应式
在Vue3中，定义的变量直接绑定到元素上是不会有响应效果的，需要通过ref或reactive包裹。（说来惭愧，图方便一直用的ref，没用过reactive）
ref:用于定义基本类型，在script里赋值取值时需要使用.Value，若是遇到绑定复杂类型，还是会调用reactive。
reactive:定义复杂的结构类型,不需要使用.value。
这两个方法都需要从vue里导出
```
<template>
  <div>{{A}}</div> /**只会显示1**/
  <div>{{ref_A}}</div>/**会响应成2**/
</template>
<script setup lang='ts'>
    import {ref,reactive} from 'vue'
    const A =1;
    const ref_A=ref(A)
    ref_A.value=2
</script>
```

# 如何实现监听
在项目中，我们经常需要在某些变量变更后触发一些事件，这时候就需要添加监听事件，Vue3提供了两个监听方法，Watch和WatchEffect。
## Watch
最为普遍的监听方法，有三种监听模式，只能监听响应式，具备一定的惰性 lazy ，数据第一次渲染时，监听函数不会执行，只有当值进行再次改变才会执行watch函数，watch函数的第二个参数可传递一个匿名方法获取旧值和新值。
1. 监听响应式对象
2. 监听响应式对象内的属性，
3. 监听多个属性，需将监听对象都包括在一个数组里

```
import {ref,reactive watch } from 'vue';

const refstr=ref('test')
const refObject=reactive({a:'1',b:'2'})

/**不会触发监听**/
refstr.value='TT'

/**自行在页面实现下click**/
const func=()=>{
  refstr.value='TTT';
  refObject.a='3';
}

/**1.监听响应式对象**/
watch(refstr,(oldValue,newValue)=>{
    /**触发console事件，发现输出TT TTT**/
    console.log(oldValue,newValue)
})
/**2.监听响应式对象的属性**/
watch(()=>refObject.a,(oldValue,newValue)=>{
    /**触发console事件，发现输出3 1**/
    console.log(oldValue,newValue)
})
/**2.监听多个属性**/
watch([()=>refObject.a,()=>refObject.b],([oldValue,oldV],[newValue,newV])=>{
    /**触发console事件，发现输出3 1**/
    console.log(oldValue,newValue)
})
```
## WatchEffect
无需指明内容，自动监听在其包含的响应式数据，若变更则触发监听。且立即监听，没有惰性，加载即执行
```
/**页面加载就会输出test，点击按钮后再次输出TTT**/
watchEffect(() => {
          console.log(refstr.value);
          console.log(refObject);
        });
```

# 计算属性Computed
计算属性可以监听到方法内部的值变更，用途很广，特别适合编写一些CSS类结构。
```
import { ref,computed } from 'vue'
const refint=ref(1)
const computedA=computed(()=>{
  return refint.value +10;
})
const BackGroundImg = computed(() => {
    if (AppStore.BackGroudImgUrl == '') {
        return { opacity: 1 };
    }
    else {
        return {
            backgroundImage: `url( ${AppStore.BackGroudImgUrl})`,
            opacity: 1
        }
    }
})
```

# 插槽slot的用途
组件化是非常重要的，我们可以自由的将页面拆分成多个组件，然后拼接，将每一块代码隔绝，方便修改。然而有些内容需要针对不同的父组件有着不同的效果，需要父组件传递内容进去，那么slot的用途就来了
## 示例 Diaglog组件
```
diaglog:
<template>
    <div class="dialog" :class="{ 'is-show': props.modelValue }" :style="display ? 'display: none' : ''">
        <!-- 不透明遮罩 -->
        <div class="dialog-modal" @click.self="closeDialog"></div>
        <!-- 主体 -->
        <div class="dialog-main">
            <!-- 内容区 -->
            <div class="dialog-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

父组件1：
<template>
  <diaglog>
      <input/>
  </diaglog>
</template>
<script>
import diaglog from './diaglog'
</script>

父组件2：
<template>
  <diaglog>
      <button/>
  </diaglog>
</template>
<script>
import diaglog from './diaglog'
</script>
```
父组件在引入的子组件内部填写的代码，将会替换子组件里的slot，
在上面的例子里，父组件1调用diaglog，显示的内容是输入框，父组件2调用diaglog，显示的内容是一个按钮

# Vue3的生命周期
1. onBeforeMount，在挂载前被调用
2. onMounted，挂载完成后调用
3. onBeforeUpdate，数据更新时调用，发生在虚拟 DOM 打补丁之前。此时内存中的数据已经被修改，但还没有更新到页面上
4. onUpdated，数据更新后调用，此时内存数据已经修改，页面数据也已经更新
5. onBeforeUnmount，组件卸载前调用
6. onUnmounted，卸载组件实例后调用。
7. onErrorCaptured，每当事件处理程序或生命周期钩子抛出错误时调用
8. onRenderTracked，状态跟踪，vue3新引入的钩子函数，只有在开发环境有用，用于跟踪所有响应式变量和方法，一旦页面有update，就会跟踪他们并返回一个event对象
9.  onRenderTriggered，状态触发，同样是vue3新引入的钩子函数，只有在开发环境有效，与onRenderTracked的效果类似，但不会跟踪所有的响应式变量方法，只会定点追踪发生改变的数据，同样返回一个event对象
10. onActivated，与keep-alive一起使用，当keep-alive包裹的组件激活时调用
11. onDeactivated，与keep-alive一起使用，当keep-alive包裹的组件停用时调用
----
目前只用到过1，2，6，用于加载组件前的数据获取和释放组件后的插件释放。

调用方式基本都是传入一个匿名方法
```
onMounted(() => {
  挂载完成后执行的操作
}
```