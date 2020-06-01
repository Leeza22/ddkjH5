<template>
	<view class="table-detail">
		<view class="table">		
			<view class="table-list" v-for="(column,index) in columns"
				:key="index">
				<view class="list-cell column-left" @click="toBlueEdit">{{column.columnShowname}}</view>
				<view class="content-right table-item-style">
					<table-item
					    @buttonChange="updateParent"
						:column="column" 
						:tableList="tableList"
						:tmpData="tmpData">
					</table-item>
				</view>
			</view>
			<view class="mask-detail" v-if="updateLimit"></view>
		</view>
		<view class="table-handle" @tap="toBlueEdit">
			<scroll-view scroll-x="true"  class="scroll-group" >
				<view class="group-box">
					<view v-for="(groupItem,i) in Group" :key="i" class="group-item" v-if="Group && grouplength>0">
						<text :class="groupItem === activeGroup?'checked-color':''" @tap="changeGroupFun(groupItem)">{{groupItem}}</text>
						<text :hidden="i === grouplength-1" class="division">--</text>
					</view>
				</view>
			</scroll-view>
			<text class="btn-save" @click="saveFun">保存</text>
		</view>
		
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex'
	import { getData,saveOneTable } from '@/common/methods/index.js'
	import uniCalendar from '@/components/unis/uni-calendar/uni-calendar.vue'
	import tableItem from '@/components/common/TableItem.vue'
	
	export default{
		components:{
			uniCalendar,
			tableItem
		},
		computed:{
			...mapState({
				tmpData:state=>state.detail.tmpData,
				tableList:state=>state.detail.tableList,//主表数据
				columns:state=>state.detail.columns, //主表表头	
				activeGroup:state=>state.detail.activeGroup
			}),
			...mapGetters([
				'Group'
			]),
			grouplength(){
				if(this.Group && Array.isArray(this.Group)){
					return this.Group.length;
				}
			},
			//页面级权限中limit 中增删改查
			updateLimit(){
				if(this.columns && this.columns.length>0){
					if(this.columns[0].limit.update == '1') return true;
				}
			},
		},
		methods:{		
			//获取分组信息
			changeGroupFun(group){		
				this.$store.dispatch('changeMainGroup',group)							
			},		
			//保存时方法
			async saveFun(){
				if(this.updateLimit){
					return;
				}
				this.$store.commit('initActiveItem');
				this.$store.commit('changeEditable',false);
				let res = await this.$store.dispatch('saveOneTable',{
					tmpId:this.tmpData.tmpId,
					pageId:this.tmpData.pageId,
					tmpTableId:this.tmpData.tmpTableId
				}).catch(error=>{})	
				
				this.$store.commit("removeRecords",{tmpTableId:this.tmpData.tmpTableId});	
				//更新
				this.updateParent()
			},
			updateParent(){
				this.$store.dispatch('changeMainTableList');
				//更新主表
			},
			toBlueEdit(){
				this.$store.commit("initActiveItem")
			}
		}
		
	}
</script>

<style scoped lang="scss">
	.table-detail{
		width: 100%;		
	}
	.table{
		position: relative;
	}
	.mask-detail{
		width: 100%;
		height: 100%;
		position: absolute;
		top:0;left:0;
		background-color: $mask-color;
	}
	/* 表格部分样式 */
	.table-list{
		width: 100%;
		display: flex;
	}
	.table-list:first-child{
		border-top-width: 1rpx;
		border-top-style: solid;
		border-top-color:$border-color;
	}
	.column-left{
		max-width: 300rpx;
		width: 280rpx;
		font-size:$font-15;
		color:$text-color-6;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.content-right{
		width: calc(100% - 280rpx);
	    border-bottom: 1rpx solid $border-color;		
		// display: flex;
		// align-items: center;
		flex: 1;
		/* border-bottom:1rpx solid #ccc; */
		box-sizing: border-box;
	}
	.list-cell{
		line-height:$height-64;
		text-align: center;
		border-right:1rpx solid $border-color;
		border-bottom:1rpx solid $border-color;
		box-sizing: border-box;
	}
/* 	.list-cell:first-child{
		border-left:none;
		border-right:none;
	}
	.list-cell:last-child{
		border-right:none;
	} */
	.list-input{
		height:100%;
		font-size:30rpx;
		color:#666666;
		line-height:30rpx;
		padding:0 10rpx;
		box-sizing: border-box;
	}
	.table-handle{
		color:#555;
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding:10rpx 20rpx;
		box-sizing: border-box;
	}
	.btn-save{
		width: 80rpx;
		text-align: center;
	}
	.group-box{
		flex:1;
		display: flex;
		align-items: center;
	}
	.division{
		padding:0 4rpx;
	}
	

</style>
