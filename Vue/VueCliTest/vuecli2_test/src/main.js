// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

//建立一个组件对象
const cpn = {
  template: `
  <div>
    <h2>通过render传入组件</h2>
    <h2>{{ message }}</h2>
  </div>
  `,
  data(){
    return {
      message: '我是组件的message'
    }
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // components: { App },
  // template: '<App/>'

  render: function(createElement){
    //1、普通用法。createElement('标签',{标签的属性},[内容])
    // return createElement('h2',{class:'box'},['hello dvbb hahaha'])

    //2、传入组件
    return createElement(cpn)

  }

})

//编译template -> ast -> render -> vdom -> UI
