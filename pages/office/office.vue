<template>
	<view class="office">
		<!-- 导航栏 -->
		<view class="navbar">
			<text class="navbar-title">{{pageTitle}}</text>
		</view>
		<view class="content">
			<view class="Menu-class" v-for="(menuClass,i) in menuTree1" :key="i"
			      :style="'background:linear-gradient(to right,'+colorList[i % colorLength]+')'" >
				<view class='menu-item menu-item-title'>{{menuClass.pageName}}</view>
				<view class='menu-item menu-item-box'>
					<view class="menu-item-item" v-for="(menu,index) in menuTree1[i].childen" :key="index">
						<text class="menu-item-item-text" @tap="toTable(menu)">{{menu.pageName}}</text>
					</view>
					<view class="menu-item-item" v-if="menuTree1[i].childen.length % 2 == 1"></view>
				</view>
			</view>	
		</view>
	
		<!-- 底部tabbar -->
	    <tabBar :menu="{path:'office'}"></tabBar>
	</view>
</template>

<script>
	import tabBar from '@/components/index/TabBar.vue'
	import uniSection from '@/components/unis/uni-section/uni-section.vue'
	export default {
		components:{
			tabBar,
			uniSection
		},
		data(){
			return {
				pageTitle:'工作台',
				contentHeight:'',
				colorList:[
					'#FF5345,#FF867D',
					'#2298ef,#64B5F6',
					'#00BCD5,#4DD0E2',
					'#8BC24A,#AED582',						
				]
			}
		},
		computed:{
			colorLength(){
				return this.colorList.length;
			},
			menuTree1(){
				return this.$store.getters.menuTree1;
			}
		},
		methods: {
			async toTable(menu){
				if(menu && menu.pageName == '个人中心'){
					this.toMypage()
				}else if(menu && menu.path == 'schedule'){
					uni.reLaunch({
						url:'/pages/office/schedule/schedule'
					})
				}else if(menu){
					this.$store.commit('updatePath',menu.path);
					let res = await this.$store.dispatch('getPath').catch(errpr=>{});
					if(res){
						uni.reLaunch({
							url:'/pages/index/index'
						})
					}else{
						uni.showToast({
							title:'页面请求失败',
							icon:'none'
						})
					}						
				}else{
					uni.showToast({
						title:'无菜单',
						icon:'none'
					})
				}	
			},
			toMypage(){
				uni.navigateTo({
					url:"/pages/office/my/my"
				})
			}		
		},
		onShow() {
			if(!this.loginState){
				this.$store.dispatch('changeMenuTree')
			}	
			console.log('onshow')
		}
	}
</script>

<style scoped lang="scss">
.office{
	margin-bottom:100rpx;
}
.navbar{
	height:50px;
	// height: 40px;
	border-bottom: 1rpx solid #eee;
	padding:5rpx 20rpx;
	display: flex;
	align-items: center;
	font-weight: 700;
	font-size: 50rpx;
	// font-size: $font-16;
	color:$text-color-3;
}
.navbar-title{
	width: 28.5%;
	// text-indent: .6em;
	text-align: center;
	margin-top:20rpx;
}
.content{
	padding:20rpx;
	box-sizing: border-box;
	color:#fff;
}
.Menu-class{	
	text-align: center;
	display: flex;
	border-bottom:4rpx solid #fff;
	// background:linear-gradient(to right,#ee9ca7,#ffdde1);	
}
.menu-item-item,.menu-item-title{
	border: 2rpx solid #fff;
	box-sizing: border-box;
}

.menu-item-title{
	flex-basis: 28.5%;
	display: flex;
	align-items: center;
	justify-content: center;
	// writing-mode:vertical-rl;
	// -webkit-writing-mode:vertical-rl;
}
.menu-item-box{
	flex:1;
	display: flex;
	flex-wrap: wrap;
}
.menu-item-item{
	flex-basis: 50%;
	padding:30rpx 0;
}

	
</style>
