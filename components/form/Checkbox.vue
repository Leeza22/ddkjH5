<template>
	<view class="form">
		<text class="blank-item" v-if="selectLength<1">无选项</text>
		<view class="group" v-else>
			<text class="btn"
				:class="checkedValues && checkedValues.indexOf(item.columnValue)>-1? 'checked-class':''" 
				v-for="(item,index) in data.columnSelects" :key="index" 
				@tap="checkFun(item)">
				{{item.columnValue}}
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
			cId(){
				return this.data.templateColumn.cId
			},
			//checkquery中 相同列集合
			checks(){
				if(this.checkquery && this.checkquery.length>0){
					return this.checkquery.filter(v=>v.columnId == this.data.columnId)
				}			
			},
			selectLength(){
				if(this.data && this.data.columnSelects){
					return this.data.columnSelects.length;
				}
			},
			checkedValues(){
				let values='';
				for(let item of this.checkedItem){
					values += item.columnValue+',';
				}
				return values.slice(0,-1)
			}
		},
		created(){
			this.checkedItem.splice(0,this.checkedItem.length);
			if(this.checks && this.checks.length>0){
				this.getInitData()
			}
		},
		methods:{
			getInitData(){
				this.checkedItem.splice(0,this.checkedItem.length)
				//单选 //多选
				this.checks.forEach(v=>{
					let checkItem = this.data.columnSelects.filter(val=>v.id == val.id)
					if(checkItem && checkItem.length>0){
						this.checkedItem.push(checkItem[0])
					}	
				})
				
			},		
			//选中项多于1个时排序
			SortChecked(checkedItem,callback){	
				let newcheckedItem = [];
				this.data.columnSelects.forEach(v=>{
					checkedItem.forEach(val=>{
						if(v.columnValue === val.columnValue){
							newcheckedItem.push(v)
						}
					})
				});
				callback(newcheckedItem);		
			},//排序结束
			checkFun(item){	
				if(this.checkedItem && this.checkedItem.length>0){
					let findIndex = false;
					this.checkedItem.forEach((v,i)=>{
						if( v.columnValue === item.columnValue){
							this.checkedItem.splice(i,1);
							findIndex = true;
						}
					})
					if(!findIndex){
						this.checkedItem.push(item)
					}
				}else{
					this.checkedItem.push(item)
				}			
				//排序
				if(this.checkedItem.length>1){
					this.SortChecked(this.checkedItem,res=>{
						this.checkedItem.splice(0,this.checkedItem.length,...res)
					})
				}	
				//提交
				let checkquery=[];
				if(this.checkedItem && this.checkedItem.length>0){	
					if(this.cId === 5){
						this.checkedItem.forEach((val,index)=>{
							checkquery.push({
								tmpId:this.tmpId,
								columnId:this.data.columnId,
								operator:"eq",
								value:val.columnValue,
								id:val.id
							})
						})
					}
					if(this.cId === 6){
						this.checkedItem.forEach((val,index)=>{
							checkquery.push({
								tmpId:this.tmpId,
								columnId:this.data.columnId,
								operator:"like",
								value:val.columnValue,
								id:val.id
							})
						})
					}				
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
