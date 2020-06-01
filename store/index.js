import Vue from 'vue';
import Vuex from 'vuex';

//表格操作数据状态
import table from './modules/table.js'
//条件筛选数据状态
import screen from './modules/screen.js'
//登录数据
import login from './modules/login.js'
//index页面数据状态
import page from './modules/page.js'
//详情页数据
import detail from './modules/detail.js'

Vue.use(Vuex)
//创建vuex实例
const store = new Vuex.Store({
	state:{
		color:'#2298ef',
		// tableHeight:
		system:null
	},
	mutations:{
		updateSystem(state,data){
			state.system = data;
		}
	},
	modules:{
		table,
		screen,
		login,
		page,
		detail
	}
})
export default store