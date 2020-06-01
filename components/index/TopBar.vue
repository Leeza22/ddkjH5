<template>
	<view class="topBar" @click.stop.prevent="topBarClick">
		<view class="left">
			<slot name="delBtn"></slot>
			<text class="iconfont" @click="getActions('screen')">&#xe75e;</text>
		</view>
		<view class="center">
			<view class="title">
				<text v-if="tmpData && tmpData.pageName">{{tmpData.pageName}}</text>
				<text v-else>未命名</text>
			</view>
		</view>
		<view class="right">
			<text class="iconfont edit-btn" @click="getActions('edit')" v-if="!hasRecords" :class="editable?'active-class':''">&#xe75f;</text>
			<text class="iconfont edit-btn active-class" @click="getActions('save')" v-if="hasRecords">&#xe618;</text>
			<text class="iconfont creat-btn" @click="getActions('create')">&#xe60d;</text>
		</view>
		
		<!-- <view class="mask" v-if='editable' @click="tipFun"></view> -->
	</view>
</template>

<script>
	export default{
		name:"TabBar",
		props:{
			tmpData:{
				type:[Object,String]
			}
		},
		data(){
			return{
				top:24
			}
		},
		computed:{
			editable(){
				return this.$store.state.table.editable
			},
			hasRecords(){	
				if(this.$store.state.table.recordsAll && this.$store.state.table.recordsAll.length>0){
					return true;
				}		
			}
		},
		methods: {
			getActions(action){
				if(action === 'edit'){			
					// this.$store.commit('changeEditable',true)	
					// console.log(this.editable)
				}else if(action === 'create'){
					// this.$store.commit('changeEditable',true)	
					// this.editable = true;	
				}else if(action === 'save'){
					// this.$store.commit('changeEditable',false)	
					// this.editable = false;
				}else if(action === 'screen'){
					// this.editable = false;
					this.$store.commit("changeEditable",false)
				}
			   this.$emit('actFun',action)
			},
			tipFun(){
				uni.showToast({
					title:'请完成当前操作',
					icon:'none'
				})
			},
			topBarClick(){
				this.$store.commit("initActiveItem");
			}
		},
		mounted() {
			let system = uni.getSystemInfoSync();
			this.top = system.statusBarHeight;
		}
	}
</script>

<style scoped lang="scss">
	.topBar{
		display: flex;
		flex-wrap: nowrap;
		justify-content:space-around;
		align-items: center;
		padding:0 20rpx;
		width: 100%;
		height:40px;
		box-sizing: border-box;
		background-color: #fff;
		position: relative;
	}
	.right,.left{
		width: 180rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.center{
		width: 220rpx;
		text-align: center;
	}
	.title{
		font-size: $font-16;
		color:$text-color-3;
		white-space: nowrap;
		overflow-x: auto;
	}
	.iconfont{
		height:100%;
		text-align: center;
		font-size:50rpx;
		line-height:40px;
		/* color:#666666; */
		color:$global-color;
		background-color: #fff;
	}
     /* 暂时不做 */
	.active-class{
		color:#ff8d01;
		font-size:50rpx;
	}
	.mask{
		width: 100%;
		height: 40px;
		position: absolute;
		bottom:0;
		left:0;
		z-index:0;
		opacity: 1;
		background-color: $mask-color;
	}
</style>
