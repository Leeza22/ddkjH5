<template>
	<view class="full-width position-relative">	
		<view class="input-box">
			<input  @tap="onShowList" class="table-item-content" :disabled="true" v-if="changeValue" :value="changeValue" placeholder="请选择">
			<view  @tap="onShowList" class="table-item-content table-item-content-index" 
				v-if="!changeValue && cellInfo.fixedHeight">{{tableList[valueName] | clipFormat2(column.dd)}}</view>
			<view  @tap="onShowList" class="table-item-content" v-if="!changeValue && !cellInfo.fixedHeight">{{tableList[valueName]}}</view>
			<uni-icons v-if="!showList && isActive" class="icon-arrow" type="arrowdown" size="16" @click="onShowList"></uni-icons>
			<uni-icons v-if="showList && isActive" class="icon-arrow" type="arrowup" size="16" @click="hideShowList"></uni-icons>
		</view>
		<!-- 下拉选项 -->
		<!-- <uni-transition :duration="500" :mode-class="modeClass" :styles="transfromClass" :show="transShow" @click="onTap" @change="change"> -->
			<div class="d_select show-list" v-if="showList" :style="{'top':top+'px',left:left+'px',bottom:bottom+'px'}">
				<scroll-view scroll-y="true" class="d_select-scroll">
					<view class="d_select-empty" v-if="selectsLength === 0">
						{{emptyTips}}
					</view>
					<view class="d_select-item" v-for="(item,index) in selects" 
						:key="index" 
						:class="{'checked-color':cvalue == item.columnValue}"
						@click="checkFun(item,index)">
						{{item.columnValue}}
					</view>		
				</scroll-view>
				<div class="d_arrow" :style="bottom && bottom!=''?bottomClass:topClass"></div>
			</div>
		<!-- </uni-transition>		 -->
	</view>
	
</template>

<script>
	import uniIcons from '../unis/uni-icons/uni-icons.vue'
	import {mapState,mapGetters} from 'vuex'
	export default{
		name:"Ddanxuan",
		components:{
			uniIcons
		},
		props:{
			placeholder:{
				type:String,
				default:'请选择'
			},
			tableList:Object,
			tmpData:Object,
			column:Object,
			pageId:[Number,String],
			tableId:[Number,String],
			columnId:[Number,String],
			valueName:[String,Number],
			tmpTableId:[String,Number],
			clipValue:[String,Number],
			cellInfo:[Object],	
			tabletype:[Number,String]
		},
		computed:{
			//计算选项长度
			selectsLength(){
				return this.selects.length
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
			columnSelects(){
				if(this.columnSelectsArr && this.columnSelectsArr.length>0){
				    for(let n in this.columnSelectsArr){
						if(this.columnSelectsArr[n].pageId === this.cellInfo.cell.pageId){
							return this.columnSelectsArr[n].data
						}
					}
				}
			},
			//控制弹出卡片
			showList(){
				if(this.isActive && this.activeItem.showList){
					return this.activeItem.showList;
				}
			},
			cvalue(){
				if(this.checkedItem){
					return this.checkedItem.columnValue;
				}		
			}
		},
		data(){
			return{
				emptyTips:'无数据',
				checkedItem:null, //存放当前选中值
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
			//目前两种情况保存数据  1 点上箭头 2点击选项
			//input框的点击
			async onShowList(){		
				if(this.showList){
					this.hideShowList();
					return;
				}
				this.checkedItem = null;
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
				// 必须3个等
				if(item.columnValue === this.value){
					this.hideShowList()
					return;
				}else{
					this.checkedItem = item;
					this.$store.dispatch("changeActiveItem",{
						cellInfo:this.cellInfo,
						cellparams:{
							value:item.columnValue,
							isupdate:true,
							showList:false,
							selects:this.selects
						}
					})	
					this.hideShowList();
				}		
			},
			hideShowList(){
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{showList:false}
				})
				this.selects.splice(0,this.selects.length);
				this.$store.commit('initActiveItem');		
			}
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
	// .d_select::before {
	// 	content: '';
	// 	position: absolute;
	// 	width: 0;
	// 	height: 0;
	// 	border-bottom: solid 6px #FFFFFF;
	// 	border-right: solid 6px transparent;
	// 	border-left: solid 6px transparent;
	// 	left: 50%;
	// 	top: -6px;
	// 	margin-left: -6px;
	// }
	.d_arrow{
		position: absolute;
		width: 0;
		height: 0;
		// border-top: solid 6px #FFFFFF;
		border-right: solid 6px transparent;
		border-left: solid 6px transparent;
		left: 50%;
		// bottom: -5px;
		margin-left: -6px;
		z-index: 1;
	}
	.d_select{
		// box-sizing: border-box;
		// max-height: 200rpx;
		position: fixed;
		// position: absolute;
		// top: 32px;
		padding:0 10rpx;
		background-color: #FFFFFF;
		border-radius: 4px;
		box-shadow: #DDDDDD 2px 2px 8px, #DDDDDD -2px -2px 8px;
		z-index: 1000;
	}
	.d_select-scroll {
		max-width: 200px;
		max-height: 100px;
		// overflow: auto;
		color:#666;
		white-space: nowrap;
		// box-sizing: border-box;
	}
	.d_select-item,.d_select-empty{
		// display: flex;
		line-height: 30px;
		font-size: 30rpx;
		
		text-align: center;
		border-bottom: solid 1px #DDDDDD;
		padding: 0px 4px;
	}
		
</style>
