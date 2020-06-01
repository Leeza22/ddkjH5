
<script>
	import { loginTo,getMenuTree } from '@/common/methods/index.js'
	// import Listen from '@/components/index/Listen.vue'
	export default {
		onLaunch: function() {
			//重新启用时候 进行重新登录	  
			console.log('App Launch')
			let login = uni.getStorageSync('login')
			if(login){
				Object.assign(this.$store.state.login,JSON.parse(login));	
			}	
			//app注销时存一下page 的state  启动时候 赋值
			let page = uni.getStorageSync("page");
			if(page){
				Object.assign(this.$store.state.page,JSON.parse(page));	
			}	
			// #ifndef APP-PLUS
			uni.removeStorage({
					key: 'login',
					success: function (res) {}				
			})
			uni.removeStorage({
					key: 'page',
					success: function (res) {}				
			})
			// #endif				
		},
		onShow: function() {
			console.log('App Show')
			//在刷新前给vuex 的，menuTree赋值；
			//隔一段时间刷新一次菜单
			let _this = this;
	        this.$store.dispatch('timingMenuTree',true)
			uni.getSystemInfo({
				success(res) {
					_this.$store.commit("updateSystem",res)
				}
			})
		},
		onHide: function() {
			//app刷新消失前存储当前页的数据 在index ready时调用 移除	
			uni.setStorageSync('page',JSON.stringify(this.$store.state.page))
			uni.setStorageSync('login',JSON.stringify(this.$store.state.login))
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("./common/uni.css");
	@import url("./static/iconfont/iconfont.css");
</style>
