import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

//下面挂载 目前是需要写上
import store from 'store/index.js'
Vue.prototype.$store = store
//加密
import "@/components/encryption/shoyu-xxtea"

//全局过滤器 注册
import * as filters from '@/common/methods/filters.js' 
Object.keys(filters).forEach(key => {
	Vue.filter(key,filters[key])
})

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})

app.$mount()
