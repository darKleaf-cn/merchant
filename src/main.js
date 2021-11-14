import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { userInfo } from "./api/user";
import { getStore } from "./util/storage";

Vue.config.productionTip = false

Vue.use(ElementUI);

router.beforeEach(function (to, from, next) {
  let params = {
    token: getStore('userInfo') ? JSON.parse(getStore('userInfo')).token : null
  }
  userInfo(params).then(res => {
    if (res.rtnCode !== "200") { // 没登录
      if(to.path === '/login' || to.path === '/register'){
        next()
      }else{
        next('/login')
      }
    } else {
      store.commit('SET_USERINFO', res.result)
      if (to.path === '/login') { //  跳转到
        next({ path: '/' })
      }
      next()
    }
  })
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
