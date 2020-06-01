<template>		
	<view class="full-width" :class="classId">
		<!-- 展示 -->
		<view v-if="!isActive" class="full-width">
			<view @tap="toInput" class="table-item-content" v-if="changeValue">{{changeValue}}</view>
			<view @tap="toInput" class="table-item-content table-item-content-index" 
				v-if="!changeValue && cellInfo.fixedHeight">{{tableList[valueName] | clipFormat2(column.dd)}}</view>
			<view @tap="toInput" class="table-item-content" v-if="!changeValue && !cellInfo.fixedHeight">
				{{tableList[valueName]}}
			</view>
		</view>
		<view class="input-box" v-else>
			<input class="table-item-content" type="text" :placeholder="placeholder" :value="inputVal" @input="onInput" @blur="onBlur" @comfirm="onBlur" />
			<uni-icons class="icon-arrow icon-right" type="gear" size="16"></uni-icons>
		</view>
		<!-- 固定定位 -->
		<view class="mask-yinyong" @click.stop.prevent="maskFun" v-if="isActive && showCard"></view>
		
		<view class="d_select show-card" v-if="isActive && showCard">
			<view class="d_select-empty" v-if="!yyTableData" @click="hideShowCard">
				<text>{{emptyTips}}</text>
			</view>	
			<scroll-view scroll-x="true" v-else class="yy-table">
				<div class="table-column">
					<view class="column-item table-item-style"
						v-for="(column,index) in yyTableData.column" :key="index"
						:style="'width:'+column.cc+'rpx;'">
						{{column.columnShowname}}
					</view>
				</div>				
				<scroll-view :scroll-y="true" :show-scrollbar="false"										
					:style="{'width':tableWidths+'rpx','max-height':500+'rpx'}" >								
					<view class="table-row" v-for="(tableList,index) in yyTableData.page.list" :key="index" 
						v-if="yyTableData.page.list" @click="onRowConfirm(tableList,yyTableData.tmpId)">
						<view class="table-list">
							<view v-for="(column,i) in yyTableData.column" :key="i" 
								class="table-item-border table-item-style" hover-class="active-item"										
								:style="'width:'+column.cc+'rpx;'" >
								<view class="table-item">
									<view class="table-item-content table-item-content-index">
										{{tableList | yyItemValue(column)}}
									</view>
								</view>
								<!-- <table-item
									:tabletype="1"
									:column="column"
									:tableList="tableList"
									:tmpData="yyTableData">
								</table-item>	 -->												
							</view>
						</view>	
					</view>	
				</scroll-view>			
			</scroll-view>
			
		
			<!-- <scroll-view scroll-y="true" class="scroll-box">
				<view class="select-flex">
					<view class="d_select-empty" v-if="yinyongLength === 0" @click="hideShowCard">
						<text>{{emptyTips}}</text>
					</view>
					<view v-else class="d_select-item item-yinyong" v-for="(item,index) in yinyongShowArray" :key="index" 
						@click.stop.prevent="onYinyongConfirm(item)">
						<text>{{item.allValue}}</text>
					</view>
				</view>
			</scroll-view>	 -->
		</view>	
	</view>
	
</template>

<script>
	import tableItem from '@/components/common/TableItem.vue'
	import uniIcons from '@/components/unis/uni-icons/uni-icons.vue'
	import {mapState} from 'vuex'
	import { getYinyong,getAllInfo,getData } from '@/common/methods/index.js'
	export default{
		components:{
			tableItem,
			uniIcons
		},
		props:{
			placeholder:{
				type:String,
				default:'请输入关键字'
			},
			tableList:Object,
			column:Object,
			columnId:[Number,String],
			valueName:[String,Number],
			tableId:[Number,String],
			tmpTableId:[String,Number],
			cellInfo:[Object],
			tabletype:[Number,String]
		},
		data(){
			return{
				emptyTips:'无数据',
				inputVal:'',
				cvalue:'', //存放当前选中值
				yinyongShowArray:[],
				yyTableData:null,
				classId:'yy'+this.tableId+this.columnId
			}
		},
		filters:{
			yyItemValue(value,column){
				let valueName = '';
				valueName = column.tmpId+'__'+column.columnName;
				switch(Number(column.cId)){
					case 7 : valueName = column.reltmpid+'__'+column.column_id+'__'+column.relcolumnname;break;
					case 21 : valueName = valueName+'_name';break;
					case 34 : valueName = valueName+'_dept';break;
					default : '';
				}
				let itemValue = value[valueName];
				if(column.cId === 10 && itemValue) return itemValue.slice(itemValue.lastIndexOf('.'));
				return value[valueName];
			}
		},
		computed:{
			tableWidths(){
				let widths = 0;
				if(this.yyTableData && this.yyTableData.column && this.yyTableData.column.length>0){
					for(let n in this.yyTableData.column){
						widths +=  Math.floor(this.yyTableData.column[n].cc);			
					}				
				}
				if(widths>= 750){
					return widths;
				}else{
					return 750;
				}
			},
			value(){
				return this.tableList[this.column.valueName];
			},
			//引用表中展示数据的 键名
			relValuename(){
				return this.column.reltmpid+'__'+this.column.relcolumnname;
			},
			...mapState({
				recordsAll:state=>state.table.recordsAll,
				editable:state=>state.table.editable,
				activeItem:state=>state.table.activeItem
			}),
			changeValue(){
				for(let item of this.recordsAll){
					if(	item
						&& item.tmpTableId == this.cellInfo.tmpTableId
						&& item.columnId == this.columnId 
						&& item.tableId == this.tableId 
					){
						return item.showValue
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
			showCard(){
				if(this.isActive && this.activeItem.showCard){
					return this.activeItem.showCard;
				}
			},
			yinyongArray(){
				if(this.isActive && this.activeItem.yinyongArray){
					return this.activeItem.yinyongArray;
				}
			},
			//选项长度
			yinyongLength(){
				return this.yinyongShowArray.length
			}				
		},
		methods:{
			//获取引用表信息
			getYinyong(pageId){
				return getYinyong(pageId).then(data=>{
					return Promise.resolve(data)
				}).catch(error=>{
					uni.showToast({
						title:"获取引用表失败",
						icon:"none"
					})
				})
			},
			//获取单个引用表详细信息
			getAllInfo(reltmpid){
				return getAllInfo(reltmpid).then(data=>{
					return Promise.resolve(data)
				}).catch(error=>{
					uni.showToast({
						title:"获取信息失败",
						icon:"none"
					})
				})
			},
			//目前两种情况保存数据  1 点上箭头 2点击选项
			async getListInfo(){
				let yinyongArray = [];
				if(this.yinyongArray && this.yinyongArray.length>0){
					yinyongArray = this.yinyongArray;
				}else{
					const yinyongRes =	await this.getYinyong(this.cellInfo.cell.pageId);
					if(yinyongRes){
						for(let i=0;i<yinyongRes.length;i++){
							if(yinyongRes[i].column_id == this.columnId){
								let busiTemplate = await this.getAllInfo(yinyongRes[i].reltmpid);
								if(busiTemplate) yinyongArray.push(busiTemplate); 
							}											
						}	
					}						
				}	
				
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{
						yinyongArray:yinyongArray,
						showCard:false,
					}
				})
				
			},
			//获取引用信息
			async toInput(){
				this.cvalue = "";	
				this.getListInfo().catch(error=>{});	
			},
			//展开弹出窗 选项卡
			onInput(e){
				//展开选项
				let value = e.detail.value;
				if(value == ""){
					return;
				}else{
					// 获取引用表
					this.getYinyongList(value); //根据value获取选项
					this.$store.dispatch("changeActiveItem",{
						cellInfo:this.cellInfo,
						cellparams:{
							yinyongArray:this.yinyongArray,
							showCard:true,
						}
					})					
				}	
			},
			onBlur(){			
			},
			async getYinyongList(value){
				// console.log(value,this.yinyongArray)
				this.yinyongShowArray.splice(0,this.yinyongShowArray.length);
				if(this.yinyongArray && this.yinyongArray.length>0){
					for(let i=0;i<this.yinyongArray.length;i++){
					    let list = await this.getOneTable(value,this.yinyongArray[i]).catch(error=>{});
						if(list){
							 this.yinyongShowArray.push(...list);
						}	   
					}
				}
				// this.yinyongShowArray.push(...yinyongShowArray);
			},
			//获取单个表查询信息
			getOneTable(value,yinyong){	
				let pageId = yinyong.pageId;
				let tmpId = yinyong.tmpId;
				let columns = yinyong.columns;
				let children = columns.reduce((pre,cur,index,arr)=>{
					pre.push({tmpId: tmpId, operator: "like", columnId: cur.columnId, value:value });
					return pre;
				},[])			
				return getData({pageId:pageId,children:children,current:1,size:1000,phoneOpen:true,detaileLog: true}).then(data=>{
					return new Promise((resolve,reject)=>{
						this.yyTableData = data;
						// if(data.page.list.length>0){
						// 	let listArr = data.page.list.reduce((pre,cur,index,arr)=>{
						// 		let obj={};
						// 		obj.tmpId = tmpId;
						// 		obj.list = cur;
						// 		obj.tableId = cur[tmpId+'__id'];
						// 		delete cur[tmpId+'__id'];
						// 		delete cur['id'];
						// 		let valArr = Object.values(cur);
						// 		obj.allValue = valArr.join(" ");
						// 		pre.push(obj);
						// 		return pre;
						// 	},[])
							// console.log(listArr)
						// 	resolve(listArr)
						// }else{
						// 	reject()
						// }
					})
				}).catch(error=>{})				
			},
			//关闭选项卡 失去焦点
			hideShowCard(){
				this.inputVal = '';
				// this.cvalue = '';
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{
						yinyongArray:this.yinyongArray,
						showCard:false,
					}
				})
				this.$store.commit('initActiveItem');
				this.yinyongShowArray.splice(0,this.yinyongShowArray.length);
				
			},
			// onYinyongConfirm(item){
			// 	if(this.cvalue !== item.list[this.relValuename] ){
			// 		this.cvalue = item.list[this.relValuename];
			// 		this.$store.dispatch("changeActiveItem",{
			// 			cellInfo:this.cellInfo,
			// 			cellparams:{
			// 				value:item.tableId,
			// 				isupdate:true,
			// 				showValue:item.list[this.relValuename],
			// 				showCard:false,
			// 				yinyongArray:this.yinyongArray
			// 			}
			// 		})
			// 		this.hideShowCard();		
			// 	}else{
			// 		this.hideShowCard();
			// 	}
			// },
			onRowConfirm(list,tmpId){
				// console.log(this.relValuename,tmpId)
				// console.log(list)
				if(this.cvalue !== list[this.relValuename] ){
					this.cvalue = list[this.relValuename];
					this.$store.dispatch("changeActiveItem",{
						cellInfo:this.cellInfo,
						cellparams:{
							value:list[tmpId+'__id'],
							isupdate:true,
							showValue:list[this.relValuename],
							showCard:false,
							yinyongArray:this.yinyongArray
						}
					})
					this.hideShowCard();		
				}else{
					this.hideShowCard();
				}
			},
			maskFun(){
				if(this.showCard){					
					this.hideShowCard()
				}		
			}
		},//methods结束
	}
</script>

<style scoped lang="scss">
	.mask-yinyong{
		position: fixed;
		bottom:0;left:0;
		width: 100%;
		height:100vh;
		background-color: $mask-color-1;
		// background-color: red;
		z-index: 1;
	}

	.input-box{
		display: flex;
		align-items: center;
		position: relative;
		z-index: 2;
		width: 100%;
		// background: #fff;
	}
	.item-yinyong{
		white-space: nowrap;
	}
	.uni-input-placeholder{
		font-size:14px;
		color:#8a8a8a;	
	}
	// 箭头在右
	.icon-arrow{
		float: right;
		padding-right:4rpx;
	}
	.d_select{
		max-height: 500rpx;
		overflow: hidden;
		width: 750rpx;
		padding:0 20rpx 20rpx 20rpx;
		box-sizing: border-box;
		position: fixed;
		
		background-color: #FFFFFF;
		border-radius: 4px;
		box-shadow: #DDDDDD 2px 2px 8px, #DDDDDD -2px -2px 8px;
		z-index: 1000;
		bottom:0;
		left:0;right:0;
		margin-left:auto;
		margin-right:auto;
	}
	.scroll-box{
		max-height:500rpx;
	}
	.select-flex{
		display: flex;
		flex-wrap: wrap;
		overflow-x: auto;
	}
	.d_select-item,.d_select-empty{
		flex:0 0 1;
		line-height: 32px;
		font-size: 28rpx;
		color:#666;
		text-align: center;
		border-bottom: solid 1px #DDDDDD;
		margin: 0px 4px;
	}
	
	.yy-table{
		max-height:500rpx;
	}
	/* 表头数据样式 */
	.table-column{
		display: flex;
	}
	.table-column-blank{
		width: 100%;
		height:40px;
		line-height:40px;
		color:#fff;
		box-sizing: border-box;
		background-color: $global-color;
	}
	.column-item{
		position: relative;
		height:30px;
		line-height: 30px;
	
		flex-shrink: 0;
		
		font-size:30rpx;
		
		font-weight: 500;
		color:#555;
		text-align:center;

		overflow: hidden;
		white-space: nowrap;
		word-break: break-all;
		
		
		border-width: 1rpx;
		border-style:solid;
		border-color: $border-color;
		border-left:none;
	
		background-color: f7f7f7;
	}
	.column-item:last-child{
		border-right: none;
	}
	
	.table-row{
		display: flex;
	}
	/*行 不包含删除*/

	.table-list{
		display: flex;
		// flex:1 1 auto;
		position: relative;
		/* overflow-x: hidden; */
	}
	.table-item-border{
		flex-shrink: 0;
		// padding:0 6rpx;
		// box-sizing: border-box;
		border-bottom: 1rpx solid $border-color;
		border-right:1rpx solid $border-color;
		
		display: flex;
		align-items: center;
	}
	.table-item-border:last-child{
		border-right: none;
	}
	.table-item{
		width: 100%;
		position: relative;
	}

</style>

