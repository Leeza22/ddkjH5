<template>
	<view class="input-box">
		<view class="item-input">
			<view class="d_input" @click="toggleSelect">
				<text>{{value}}</text>
				<uni-icons v-if="order===1" class="icon" type="arrowthinup" size="14" color="#999"></uni-icons>
				<uni-icons v-if="order===0" class="icon" type="arrowthindown" size="14" color="#999"></uni-icons> 
			</view>
			<!-- <uni-icons v-if="order==1||order===0" class="icon" type="close" size="14" color="#999"></uni-icons> -->
			<uni-icons v-if="showSelects === false" class="d_input-arrow" type="arrowdown" size="16" color="#888" @click="onShowSelect"></uni-icons>
			<uni-icons v-else class="d_input-arrow" type="arrowup" size="16" color="#888" @click="onHideSelect"></uni-icons>
		</view>
		<view class="d_select" v-if="showSelects">
			<scroll-view scroll-y="true" class="d_select-scroll">
				<view class="d_select-empty" v-if="selectsLength === 0">
					<text>{{emptyTips}}</text>
				</view>
				<block  v-for="(item,index) in sortItems" :key="index" sortItems>
					<view class="d_select-item" :class="value === item?'checked-item':''" @click="onSelectorClick(index,1)">
						<text>{{item.columnShowname}}</text>
						<uni-icons class="icon" type="arrowthinup" size="14" color="#999"></uni-icons>
					</view>
					<view class="d_select-item" :class="value === item?'checked-item':''" @click="onSelectorClick(index,0)">
						<text>{{item.columnShowname}}</text>
						<uni-icons class="icon" type="arrowthindown" size="14" color="#999"></uni-icons>
					</view>
				</block>
				<view class="d_select-item" @click="emptyFun"><text>清空</text></view>
			</scroll-view>
		</view>
	</view>	
</template>

<script>
	import uniIcons from '../unis/uni-icons/uni-icons.vue'
	export default{
		components:{
			uniIcons
		},
		data(){
			return{
				placeholder:'排序',
				value:'排序',
				showSelects:false,
				selects:["时间","日期"],
				emptyTips:'无排序项',
				order:3,
			}
		},
		props:{
			sortItems:Array
		},
		computed:{
			selectsLength(){
				return this.sortItems.length
			}
		},
		methods:{
			toggleSelect(){
				this.showSelects = !this.showSelects;
			},
			onShowSelect(){
				this.showSelects = true;
			},
			onHideSelect(){
				this.showSelects = false;
			},
			onSelectorClick(index,order){
				this.value = this.sortItems[index].columnShowname;
				this.order = order;
				this.showSelects = false;
			},
			emptyFun(){
				this.value = '';
				this.order=3;
				this.showSelects = false;
			}
		}
	}
</script>

<style scoped lang="scss">
	.input-box{
		width: 100%;
		min-width: 180rpx;
		height:100%;
		position: relative;	
		height:64rpx;
		line-height: 64rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		
	}
	.item-input{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		
	}
	.d_input{
		height: 100%;
		padding:0;
		box-sizing: border-box;
		font-size: 30rpx;
		/* border:1rpx solid #2298EF;
		border-radius: 8rpx;
		padding:0 20rpx; */
	}
	.uni-input-placeholder{
		padding-left: 4px;
		font-size:14px;
		color:#888;
	}
	.d_input-arrow{
		position: absolute;
		right:-60rpx;top:4rpx;
		/* bottom:0; */
		/* margin-top:auto;
		margin-bottom:auto; */
	}
	.d_select-scroll {
		max-height: 400rpx;
		overflow: auto;
		box-sizing: border-box;
	}
	.d_select::before {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border-bottom: solid 6px #FFFFFF;
		border-right: solid 6px transparent;
		border-left: solid 6px transparent;
		left: 50%;
		top: -6px;
		margin-left: -6px;
	}
	.d_select{
		max-width: 300rpx;
		box-sizing: border-box;
		position: absolute;
		top: 32px;
		left: 0;right:0;
		margin-left:auto;
		margin-right:auto;
		width: 100%;
		background-color: #FFFFFF;
		border-radius: 4px;
		box-shadow: #DDDDDD 2px 2px 8px, #DDDDDD -2px -2px 8px;
		z-index: 888;
	}
	.d_select-item,.d_select-empty{
		/* #ifdef APP-NVUE */
		display: flex;
		/* #endif */
		line-height: 32px;
		font-size: 28rpx;
		color:#666;
		text-align: center;
		border-bottom: solid 1px #DDDDDD;
		margin: 0px 4px;
	}
	.checked-item{
		color:#2298ef;
	}
	.icon{
		margin-left:8rpx;
	}
	.mask{
		position: fixed;
		left:0;
		top:0;
		width: 100%;
		height:100%;
		background-color: $mask-color;
		z-index:2;
	}
	
		
</style>
