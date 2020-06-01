<template>
	<view class="content" :style="'padding-top:'+paddingTop+'px;'">
		<!-- position:relative;top:'+top+' -->
		<statusBar></statusBar>
		<!-- 表格组件 -->
		<!-- <view></view> -->
		<Table
			scrollList="true"
			:columns="columns"
			:tableLists="tableLists"
			:tmpData="tmpData"
			:topbarShow="true"
			:fixedColumn="true"
			:tabletype="1"
			@addTable="addTable"
			@updateTable="updateData"
			@changeOrder="changeOrder"/>
		
			<!-- <view class="mask-table" :style="'height:'+maskHeight+'px;'" @click="blurEdit"></view> -->
			<!-- 底部tabbar -->
			<tab-bar :menu="menu"></tab-bar>
	</view>
</template>

<script>
	import { getScreenCondition } from '@/common/methods/index.js'
	import Table from "@/components/common/Table.vue"	
	import statusBar from '@/components/unis/uni-status-bar/uni-status-bar.vue'
	import tabBar from '@/components/index/TabBar.vue'
	import {mapState,mapGetters} from 'vuex'
	export default {
		components:{
			Table,
			statusBar,
			tabBar
		},
		data() {
			return {
				//表格 数据		
				maskHeight:0, //表格外遮罩高度
				paddingTop:0,//表格上边距
				system:'', //设备信息
				top:0
				// scrollTopNum:0, //监听页面滚动位置
				// hasScrolled:false //是否发生滚动
			}
		},
		computed:{
			...mapState({
				tableLists:state=>state.page.tableLists,
				tmpData:state=>state.page.tmpData,
				columns:state=>state.page.columns,
				menu:state=>state.page.menu, //记录当前菜单信息
				rows:state=>state.page.rows, //记录新增的row 行id			
				size:state=>state.page.size, //page的 一个current的数量
				currentIndex:state=>state.page.currentIndex, //触底 当前加载几个页面
				currentArr:state=>state.page.currentArr, //存放页面的所有current
				pageId:state=>state.page.pageId, //记录当前pageId
				tmpId:state=>state.page.tmpId,
				path:state=>state.login.path, //记录当前page 的 path
				
				// activeItem:state=>state.table.activeItem,
				loginState:state=>state.login.loginState
			}),	
			menuFlat(){
				return this.$store.getters.menuFlat
			}
		},
		methods:{
			//失焦
			blurEdit(){
				this.$store.commit("initActiveItem");
				this.$store.commit("changeEditable",false);
			},
			//更新数据
			updateData(val){
				if(val.tmpTableId === this.tmpData.tmpTableId){
					this.$store.dispatch("changeData",{
						pageId:this.pageId,
						current:this.current,
						size:this.size,
						firstOpen:false,
					})	
				}
			},
			//修改排序 获取数据
			changeOrder(val){
				if(val.tmpTableId == this.tmpData.tmpTableId && val.order){
					this.$store.dispatch("changeData",{pageId:this.pageId,order:val.order})
				}				
			},
			addTable(val){
				//写在page.js中
			},
			getHeight(){
				let system = this.system;
				let _this = this;
				setTimeout(()=>{
					let view = uni.createSelectorQuery().select('.content');
					view.boundingClientRect((data)=>{
						if(data){
							let height = system.windowHeight - system.statusBarHeight - data.height  +20
							if(height>0){
								_this.maskHeight = height;
							}else{
								_this.maskHeight = 0;
							}	
						}else{
							//高度获取失败
						}		
					}).exec();
				},500)
			}	
		},
		onReady(){
			console.log("ready")			
			//页面初始数据
			if(!this.path || this.path == ""){
				if(this.menuFlat && this.menuFlat.length>0){
					this.$store.commit("updatePath",this.menuFlat[0].path);		
					this.$store.dispatch('getPath')
				}
			}		
			this.system = uni.getSystemInfoSync();
			//40 的操作 +40 的表头
			this.paddingTop = this.system.statusBarHeight + 40;  
		
		},
		//页面下拉刷新
		onPullDownRefresh() {
			this.$store.commit('initPageState');
			//还原本页数据
			this.$store.commit('initTable')
			this.$store.dispatch('changeData',{pageId:this.pageId});				
			uni.stopPullDownRefresh();
		},
		//触底加载更多
		onReachBottom(){
			console.log("触底")
			// this.$store.dispatch('getMoreData')
		},
		onShow() {
			if(!this.loginState){
				this.$store.dispatch('changeMenuTree')
			}	
			console.log('onshow')
		},
		onHide() {
			console.log("onhide")
		},
		//页面销毁
		onUnload(){	
			console.log('unload')
		}
	}
</script>

<style scoped>
	.content{
		/* margin-top:80rpx; */
		/* padding-bottom:140rpx; */
	}
	/* 编辑时候点击mask部分也可以确认 */
	.mask-table{
		width: 100%;
		z-index: 0;
		position: fixed;
		bottom:100rpx;
		left:0;
		background-color: $mask-color;
	}
	
</style>
