<template>
	<view class="screen">
		<statusBar></statusBar>
		<!-- 顶部搜索 文字筛选项-->
		<Search :data="searchArray"></Search>
		<!-- <view class="d-title">条件筛选</view> -->
		<view class="content">
			<!-- 左边筛选侧导航 -->
			<scroll-view scroll-y="true" class="c-side" show-scrollbar="false" :style="'height:'+scrollHeight+'px;'">
				<!-- <view> -->
					<view class="side-item" 
					v-for="(item,index) in filterArray" 
					:key="index"
					:data-id="index"
					:id="'p'+item.columnId"
					:class="activeIndex===index?'side-item-active':''"
					@tap="changeSide(index)">{{item.columnShowname}}</view>
				<!-- </view> -->
			</scroll-view>
			
			<!-- 锚链接 -->
			<scroll-view scroll-y="true" class="c-content" :show-scrollbar="false" :style="'height:'+scrollHeight+'px;'"
				:scroll-top="scrollTopNum"
				:scroll-into-view="toView" 
				:scroll-with-animation='true' 
				@scroll="onItemchange">
				<view class="c-select" v-for="(item,index) in filterArray" :key="index" :id="'p'+index" :data-id="item.columnId">
					<form-item :data="item"></form-item>
				</view>
				<!-- 当底部弹出pop时候添加高度 -->
				<view :style="'height:'+bottomHeight+'px'"></view>
			</scroll-view> 
		</view>

		<!-- 底部固定按钮 -->
		<view class="foot-btn" v-if="showTabbar">
			<button class="btn" type="default" @tap="returnFun">返回</button>
			<button class="btn" type="primary" @tap="conformFun">确认</button>
			<button class="btn" type="default" @tap="emptyFun">清空</button>
		</view>
	</view>
</template>

<script>
	import {getData,getScreenCondition,getColumnSelects} from '@/common/methods/index.js'
	import uniIcons from '@/components/unis/uni-icons/uni-icons.vue'
	import formItem from '@/components/form/formItem.vue'
	import statusBar from '@/components/unis/uni-status-bar/uni-status-bar.vue'
	import Search from '@/components/form/Wenben.vue'
	import {mapState} from 'vuex'
	
	export default {
		components:{
			formItem,
			uniIcons,
			statusBar,
			Search
		},
		data() {
			return {
				activeIndex:0,//当前index
				toList:'',
				toView:'',//跳转至页面
				itemsHeight:[],//滑动元素top 值数组集合
				hasToview:false, //记录是否发生了视图跳转 如果是 就不触发滚动事件
				// tmpId:null,
				// pageId:null,
				showTabbar:true,
				windowHeight:0,
				scrollHeight:630, //筛选区scrollview 高度
				bottomHeight:0,
				scrollTopNum:0,
				hasScrolled:false
			}
		},
		computed:{
			...mapState({
				pageId:state=>state.screen.pageId,
				tmpId:state=>state.screen.tmpId,
				
				filterArray:state=>state.screen.filterArray,
				searchArray:state=>state.screen.searchArray,
				
				query:state=>state.screen.query,
				checkquery:state=>state.screen.checkquery,
				children:state=>state.screen.children,
				// searchCondition:state=>state.screen.searchCondition
				showCard:state=>state.screen.showCard.bool,
				classId:state=>state.screen.showCard.classId
			})
		},
		onReady(){
			//H5刷新本业时候 重新获取数据
			if(!this.pageId || this.pageId == ''){
				this.$store.dispatch('getScreenData').catch(error=>{})	
			}
		},
		mounted(){
			uni.getSystemInfo({
		        success: (res)=> {
		            this.windowHeight = res.windowHeight;
					let _this = this;
					setTimeout(()=>{
						_this.scrollHeight = res.windowHeight - res.statusBarHeight - 95;
						// console.log(_this.scrollHeight)
					},500)		
		        }
		    });    
		    uni.onWindowResize((res) => {
		        if(res.size.windowHeight+40 < this.windowHeight){
		            this.showTabbar = false
		        }else{
		            this.showTabbar = true
		        }
		    })
			//获取所有选项元素的高度信息
			let view = uni.createSelectorQuery().in(this).selectAll(".c-select");
			view.boundingClientRect((data)=>{
				if(data){
					this.itemsHeight = data;					
				}		
			}).exec();
		},
		methods: {
			//侧边菜单选项改变
			changeSide(index){
				this.activeIndex = index;
				var id = event.currentTarget.dataset.id;
				// //不能数字开头
				this.toView = 'p'+id;
				this.hasToview = true;
			},
			//页面滑动改变 监听高度 移动左边选中项
			onItemchange(e){
				if(this.hasToview){
					this.hasToview = false;
					return;
				}
				this.scrollTopNum = e.detail.scrollTop;
				// this.toList = 'p'
				this.itemsHeight.forEach((v,i)=>{
					if(v.top-v.height < e.detail.scrollTop){				
						this.activeIndex = i;			
						return
					}
				})
			},
			// 清空选项
			emptyFun(){
				this.$store.commit("emptyCondition");
				this.$store.dispatch('changeData',{pageId:this.pageId,firstOpen:false,query:[],checkquery:[],children:[]});
				this.returnFun()
			},
			//筛选确认
			conformFun(){	
				if(this.query.length<1 && this.checkquery.length<1 && this.children.length<1){
					uni.showModal({
						content:"无筛选项，确认跳转吗？",
						success:(res)=>{
							if(res.confirm){
								//返回方式
								this.$store.dispatch('changeData',{pageId:this.pageId,firstOpen:false,query:[],checkquery:[],children:[]});
								this.returnFun()	
							}else if(res.cancel){}
						}
					})
				}else{
					this.$store.dispatch('changeData',{
						query:this.query,
						checkquery:this.checkquery,
						children:this.children,
						// hasfilter:true
					});
					this.returnFun()
				}								
			},//筛选确认结束
			//返回
			returnFun(){
				// this.$store.commit('initScreen')
				// #ifdef H5
				history.back(1);
				// #endif
				// #ifndef H5
				uni.navigateBack({
					delta:1
				})
				// #endif
			}
		},//methods 结束
		watch:{
			showCard(newVal){
				if(newVal){	
					//菜单跟随
					let str = this.classId.replace(/[a-z]*/,'');	
					 this.itemsHeight.forEach((v,i)=>{
					 	if(v.dataset.id == str){				
					 		this.activeIndex = i;			
					 	}
					 })
					uni.createSelectorQuery().select('.'+this.classId).boundingClientRect((e)=>{
						if(e.top > 400){
							this.bottomHeight = 250;
							this.$nextTick(()=>{
								this.scrollTopNum = this.scrollTopNum + 200;	
								this.hasScrolled = true;
								
								this.hasToview = true;
							})	
						}				
					}).exec()												
				}else{	
					if(this.hasScrolled){
						this.bottomHeight = 0;
						this.$nextTick(()=>{
							this.scrollTopNum = this.scrollTopNum - 200;
							this.hasScrolled = false;
							
							this.hasToview = true;
						})	
					}					
				}
				
			}
		},
		onShow() {
			if(!this.loginState){
				this.$store.dispatch('changeMenuTree')
			}	
			console.log('onshow')
		},
		onUnload(){
			this.$store.commit('updateShowCard',{bool:false,classId:''})
		}
	}
</script>

<style scoped lang="scss">
.screen{
	width: 100%;
}
.d-title{
	font-size:32rpx;
	color:#333;
	height:64rpx;
	line-height:64rpx;
	padding-left:20rpx;
	
}
	
/* 内容样式 */
.content{
	width: 100%;
	display: flex;
	/* height:1220rpx; */
}

.c-side{
	min-width: 100rpx;
	max-width: 200rpx;
	// width: 100rpx;
	/* height: 1236rpx; */
	/* height:1220rpx; */
	background-color: #f7f7f7;
	
}
.side-item{
	width: 100%;
	box-sizing: border-box;
	min-height:$height-80;
	line-height:1.5em;
	display: flex;
	align-items: center;
	justify-content: center;
	// line-height:$height-80;
	color:$text-color-5;
	font-size: $font-15;
    padding:8rpx 20rpx;
	
	border-bottom:1rpx solid #eee;
	text-align: center;
	word-break: break-all;
}
.side-item-active{
	position: relative;
	background-color: #fff;
	/* border-bottom:none; */
}
.side-item-active::before{
	content:'';
	display: block;
	background-color: $global-color;
	position: absolute;
	left:0;top:0;
	width:10rpx;
	height:100%;
}
.c-content{
	flex:1;
	position: relative;
}
.c-content-item{
	background-color: #fff;
	position: absolute;
	left:0;top:0;
}
.c-content-item-active{
	z-index:10;
}
.c-select{
	padding-bottom:10rpx;
}
/* 底部样式 */
.foot-btn{
	width: 100%;
	height:$height-80;
	background-color: #f7f7f7;
	position: fixed;
	bottom:0;left: 0;
	display: flex;
	justify-content: space-around;
	padding:5px 0;
	align-items: center;
}
.btn{
	display: flex;
	align-items: center;
	font-size:$font-15;	
	height:64rpx;
}
</style>
