<template>
	<view class="full-width position-relative">	
		<!-- 编辑 -->
		<view class="input-box">
			<input  @tap="onShowList" class="table-item-content" :disabled="true" v-if="changeValue" :value="changeValue" placeholder="请选择">
			<view  @tap="onShowList" class="table-item-content table-item-content-index" 
				v-if="!changeValue && cellInfo.fixedHeight">{{tableList[valueName] | clipFormat2(column.dd)}}</view>
			<view  @tap="onShowList" class="table-item-content" v-if="!changeValue && !cellInfo.fixedHeight">{{tableList[valueName]}}</view>
			<uni-icons v-if="!showList && isActive" class="icon-arrow" type="arrowdown" size="16" @click="onShowList"></uni-icons>
			<uni-icons v-if="showList && isActive" class="icon-arrow" type="arrowup" size="16" @click="confirmFun"></uni-icons>
		</view>	
	
		<!-- :style="{'top':top+'px',left:left+'px',bottom:bottom+'px'}" -->
		<view class="d_select show-list" v-if="showList">
			<scroll-view scroll-y="true" class="d_select-scroll">
				<view class="d_select-empty" v-if="selectsLength === 0">
					{{emptyTips}}
				</view>				
				<view class="d_select-item" v-for="(item,index) in selects"
					:key="index" 
					:class="cvalue && cvalue.indexOf(item.columnValue)>-1?'checked-color':''"
					@click="checkFun(item,index)">
					{{item.columnValue}}
				</view>					
			</scroll-view>
			<!-- <div class="d_arrow" :style="bottom && bottom!=''?bottomClass:topClass"></div> -->
		</view>
	</view>
</template>

<script>
	//问题 目前不支持清空选项
	import {mapState} from 'vuex'
	import uniIcons from '../unis/uni-icons/uni-icons.vue'
	export default{
		name:"Dduoxuan",
		components:{
			uniIcons
		},
		props:{
			placeholder:{
				type:String,
				default:'请选择'
			},
			tableList:Object,
			column:Object,
			tableId:[Number,String],
			columnId:[Number,String],
			valueName:[String,Number],
			tmpTableId:[String,Number],
			cellInfo:[Object],
			tabletype:[Number,String],
			clipValue:[String,Number]
		},
		computed:{
			//计算选项长度
			selectsLength(){
				if(this.selects){
					return this.selects.length
				}	
			},							
			value(){
				return this.tableList[this.valueName];
			},
			...mapState({
				recordsAll:state=>state.table.recordsAll,
				editable:state=>state.table.editable,
				activeItem:state=>state.table.activeItem,
				columnSelectsArr:state=>state.table.columnSelectsArr,
				system:state=>state.system
			}),
			changeValue(){
				for(let item of this.recordsAll){
					if(	item
						&& item.tmpTableId == this.cellInfo.tmpTableId
						&& item.columnId == this.columnId 
						&& item.tableId == this.tableId 
					){
						return item.value
					}
				}
			},
			isActive(){
				if( this.activeItem
					&& this.activeItem.tmpTableId == this.cellInfo.tmpTableId
					&& this.activeItem.columnId == this.columnId 
					&& this.activeItem.tableId == this.tableId 
				){
					return true;
				}						
			},
			//控制弹出卡片
			showList(){
				if(this.isActive && this.activeItem.showList){
					return this.activeItem.showList;
				}
			},
			columnSelects(){
				if(this.columnSelectsArr && this.columnSelectsArr.length>0){
				    for(let n in this.columnSelectsArr){
						if(this.columnSelectsArr[n].pageId === this.cellInfo.cell.pageId){
							return this.columnSelectsArr[n].data
						}
					}
				}
			},
			cvalue(){
				let cvalue = '';
				if(this.checkedItem && this.checkedItem.length>0){
					for(let n of this.checkedItem){
						cvalue += n.columnValue+','
					}
					return cvalue.slice(0,-1);
				}
			}, //存放当前选中值,
		},
		data(){
			return{
				emptyTips:'无数据',							
				checkedItem:[],//被选中元素集合
				selects:[],
				top:'',
				left:'',
				bottom:'',
				bottomClass:{
					borderTop: 'solid 6px #FFFFFF',
					bottom: '-5px'
				},
				topClass:{
					borderBottom: 'solid 6px #FFFFFF',
					top: '-5px'
				}
			}
		},
		methods:{	
			//input框的点击
			async onShowList(){			
				if(this.showList){
					this.confirmFun();
					return;
				}
				this.checkedItem.splice(0,this.checkedItem.length);
				this.selects.splice(0,this.selects.length);
				
				if(!this.columnSelects || this.columnSelects.length<1){	
					const result = await this.$store.dispatch('getColumnSelects',{
						pageId:this.cellInfo.cell.pageId,
						tmpTableId:this.cellInfo.tmpTableId
					}).catch(error=>{})		
				}
				if(this.columnSelects && this.columnSelects.length>0){
					for(let i in this.columnSelects){
						if(this.columnSelects[i].columnId === this.columnId){
							this.selects.splice(0,this.selects.length,...this.columnSelects[i].columnSelects);
							break;
						}
					}
				}
						
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{showList:true}
				})
				
				
				uni.createSelectorQuery().in(this).select(".input-box").boundingClientRect(res=>{
					
					if(this.system.windowHeight - res.bottom < 100){
						this.bottom =this.system.windowHeight - res.top;
						this.left = (res.left + res.right) /2;
					}else if(res && res.top){
						this.top = res.top + 32;
						this.left = (res.left + res.right) /2;
					}
					
				}).exec()
			
				
			},
			checkFun(item,index){
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
											
			},
			confirmFun(){
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{
						value:this.cvalue,
						isupdate:true,
						showList:false
					}
				})
				this.hideShowList()
			},
			hideShowList(){	
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{showList:false}
				})
				this.selects.splice(0,this.selects.length);
				this.$store.commit('initActiveItem');				
			},
			//排序
			SortChecked(checks,callback){	
				let newchecks = [];
				this.selects.forEach(v=>{
					checks.forEach(val=>{
						if(v.columnValue === val.columnValue){
							newchecks.push(v)
						}
					})
				});
				callback(newchecks);		
			}//排序结束
			
		}
	}
</script>

<style scoped lang="scss">
	.position-relative{
		position: relative;
	}
	.input-box{
		line-height: $height-64;
		height: $height-64;
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.icon-arrow{
		padding: 0 4px;
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
	// .d_arrow{
	// 	position: absolute;
	// 	width: 0;
	// 	height: 0;
	// 	// border-top: solid 6px #FFFFFF;
	// 	border-right: solid 6px transparent;
	// 	border-left: solid 6px transparent;
	// 	left: 50%;
	// 	// bottom: -5px;
	// 	margin-left: -6px;
	// 	z-index: 1;
	// }
	// .d_select::before {
	// 	content: '';
	// 	position: absolute;
	// 	width: 0;
	// 	height: 0;
	// 	border-top: solid 6px #FFFFFF;
	// 	border-right: solid 6px transparent;
	// 	border-left: solid 6px transparent;
	// 	left: 50%;
	// 	bottom: -5px;
	// 	margin-left: -6px;
	// 	z-index: 1;
	// }
	.d_select{
		box-sizing: border-box;
		// position: fixed;
		position: absolute;
		top: 32px;
		padding:0 10rpx;
		background-color: #FFFFFF;
		border-radius: 4px;
		box-shadow: #DDDDDD 2px 2px 8px,#DDDDDD -2px -2px 8px;
		z-index: 1000;
	}
	.d_select-scroll {
		max-width: 200px;
		max-height: 100px;
		overflow: auto;
		white-space: nowrap;
		color:#666;
		box-sizing: border-box;
	}
	.d_select-item,.d_select-empty{
		display: flex;
		line-height: 32px;
		font-size: 30rpx;
		text-align: center;
		border-bottom: solid 1px #DDDDDD;
		padding: 0px 4px;
	}		
</style>

