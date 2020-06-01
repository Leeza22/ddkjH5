<template>
	<view v-if="showCard">
		sddadsa
		<view class="select">
			<scroll-view scroll-y="true" class="select-scroll">
				<view class="select-box">
					<view v-for="(item,index) in selectItems" :key="index" class="select-item-box"  @click="checkFun(item,index)">
						<view class="check-tab" :class="checkedIds && checkedIds.indexOf(item.user_id)>-1?'checked-class':''">
							<uni-icons v-if="checkedIds && checkedIds.indexOf(item.user_id)>-1" type="checkmarkempty" color="#fff" size="16"></uni-icons>
						</view>
						{{item.realname}}
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="mask-all" @click="hideCardFun"></view>
	</view>
</template>

<script>
	import uniIcons from '@/components/unis/uni-icons/uni-icons.vue'
	export default{
		name:'selectPartner',
		components:{
			uniIcons
		},
		props:{
			selectItems:{
				type:[Array,Number,String]
			},
			showCard:{
				type:[Boolean],
				default:true
			},
			hasCheched:{
				type:[Array,String]
			}
		},
		data(){
			return{
				checkedItem:[]
			}
		},
		created(){
			if(this.hasCheched && this.hasCheched.length>0){
				let res = JSON.parse(JSON.stringify(this.hasCheched))
				this.checkedItem.splice(0,this.checkedItem.length,...res)
			}
		},
		computed:{
			checkedIds(){
				if(this.checkedItem && this.checkedItem.length>0){
					let ids = [];
					for(let n in this.checkedItem){
						ids.push(this.checkedItem[n].user_id)
					}
					return ids;
				}
			}
		},
		methods:{
			checkFun(item,index){
				let findRes = false;
				for(let i in this.checkedItem){
					if(this.checkedItem[i].user_id == item.user_id){
						findRes = true;
						this.checkedItem.splice(i,1);
						break;
					}
				}
				if(!findRes) this.checkedItem.push(item)
				this.$emit('changes',{data:this.checkedItem,ids:this.checkedIds})		
			},
			hideCardFun(){
				this.$emit('hideCard')
				this.checkedItem.splice(0,this.checkedItem.length)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mask-all{
		position: fixed;
		width: 100%;
		height:100vh;
		z-index:1001;
		top:0;
		left:0;
	}
	.select{
		padding:20rpx 30rpx;
		position: fixed;
		bottom:0;
		z-index: 1002;
		background-color: #fff;
	}
	.select-scroll{
		max-height: 400rpx;
	}
	.select-box{
		display: flex;
		flex-wrap: wrap;
	}
	.check-tab{
		display: inline-block;
		margin-right:16rpx;
		width: 30rpx;
		height: 30rpx;
		border: 1rpx solid #eee;
		text-align: center;
		line-height: 30rpx;
		border-radius: 4rpx;
	}
	.checked-class{
		background-color: $global-color;
		border: 1rpx solid $global-color;
	}
	.select-item-box{
		height:64rpx;
		flex-basis:33%;
		display: flex;
		align-items: center;
	}
</style>
