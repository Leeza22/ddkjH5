<template>
	<view class="form-item">
		<text class="blank-item" v-if="selectLength<1">无按钮</text>
		<view class="group" v-else>		
			<text class="btn btn-radio" 
				:class="checkedIds && checkedIds.indexOf(item.id)>-1? 'checked-class':''" 
				v-for="(item,index) in data.anniu" :key="index" 
				@tap="checkFun(item)">
				{{item.value}}
			</text>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default{
		props:{
			//筛选项
			data:{
				type:[Array,Object]
			}
		},
		data(){
			return{
				checkedItem:[]
			}
		},
		computed:{
			...mapState({
				tmpId:state=>state.screen.tmpId,
				checkquery:state=>state.screen.checkquery
			}),
			//checkquery中 相同列集合
			checks(){
				if(this.checkquery && this.checkquery.length>0){
					return this.checkquery.filter(v=>v.columnId == this.data.columnId && v.tmpId == this.tmpId)
				}			
			},
			checkedIds(){
				let values = [];
				if(this.checkedItem && this.checkedItem.length>0){
					for(let n=0;n<this.checkedItem.length;n++){
						values.push(this.checkedItem[n].id)
					}
				}
				return values;
			},
			//按钮选项长度
			selectLength(){
				if(this.data.anniu) return this.data.anniu.length;
				
			}
		},
		created(){
			this.checkedItem.splice(0,this.checkedItem.length);
			if(this.checks && this.checks.length>0){
				this.checkedItem.push(...this.checks)
			}
		},
		methods:{
			checkFun(item){	
				if(this.checkedItem.length>0){
					let findIndex = -1;
					for(let i=0;i<this.checkedItem.length;i++){
						if(this.checkedItem[i].id === item.id){
							this.checkedItem.splice(i,1);
							findIndex = i;
							break;
						}
					}		
					if(findIndex<0){
						this.checkedItem.push(item);
					}
				}else{
					this.checkedItem.push(item);
				}
				//提交
				let checkquery=[];
				if(this.checkedItem && this.checkedItem.length>0){	
					this.checkedItem.forEach((val,index)=>{
						checkquery.push({
							tmpId:this.tmpId,
							columnId:this.data.columnId,
							operator:"eq",
							value:val.value,
							id:val.id
						})
					})		
				}	
				this.$store.commit("changeCondition",{
										checkquery:checkquery,
										columnId:this.data.columnId,
									});
			    
			}
		}
	}
</script>

<style scoped>
.btn{
	flex-shrink: 0;
	height:60rpx;
	line-height:60rpx;
	font-size:28rpx;
	color:#666;
	margin:0 20rpx 20rpx 0;
	border: 1rpx solid #e7e7e7;
	border-radius:10rpx;	
	padding:0 16rpx;
}
.blank-item{
	display: inline-block;
	margin:0 20rpx 20rpx 20rpx;
	padding:4rpx 20rpx;
	font-size:26rpx;
	color:#bbb;
	box-sizing: border-box;
	background-color: #f8f8f8;
	border-radius: 8rpx;
}
.group{
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	padding:0 20rpx;
}
.checked-class{
	color:#fff;
	background-color: rgba(34,152,239,1);
}
</style>
