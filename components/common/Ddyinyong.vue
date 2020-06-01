<template>		
	<view class="full-width" :class="classId">
		<!-- 展示 -->
		<view v-if="!isActive" @tap="showLists" class="table-item-content"
			v-text="changeValue?changeValue:tableList[column.reltmpid+'__'+column.column_id+'__'+column.relcolumnname]" >
		</view>
		<view class="input-box" v-else>
			<input class="d_input" type="text" :placeholder="placeholder" v-model="inputVal" @input="onInput" @blur="onBlur" @comfirm="onBlur" />
			<uni-icons class="d_input-arrow" type="gear" size="16"></uni-icons>	
		</view>
		<!-- 固定定位 -->
		<view class="mask-yinyong" @click="maskFun" v-if="isActive"></view>
		<!-- 固定定位 -->
		<view class="d_select show-card" v-if="isActive && showCard">
			<scroll-view scroll-y="true" class="scroll-box">
				<view class="select-flex">
					<view class="d_select-empty" v-if="yinyongLength === 0">
						<text>{{emptyTips}}</text>
					</view>
					<view class="d_select-item" v-for="(item,index) in yinyongShowArray" 
						:key="index" 
						@click="onYinyongConfirm(item)">
						<text>{{item.allValue}}</text>
					</view>
				</view>
			</scroll-view>	
		</view>	
	</view>
	
</template>

<script>
	import uniIcons from '@/components/unis/uni-icons/uni-icons.vue'
	import {mapState} from 'vuex'
	import { getYinyong,getAllInfo,getData } from '@/common/methods/index.js'
	export default{
		components:{
			uniIcons
		},
		props:{
			placeholder:{
				type:String,
				default:'请输入关键字'
			},
			tableList:Object,
			tmpData:Object,
			column:Object,
			tableId:[Number,String],
			columnId:[Number,String],
			valueName:[String,Number],
			tmpTableId:[String,Number],
			tmpId:[String,Number],
			pageId:[String,Number],
			parentTable:[Object],
			reltmpid:[String,Number]	
		},
		computed:{
			value(){
				return this.tableList[this.valueName];
			},
			showValue(){
				return this.tableList[this.column.reltmpid+'__'+this.column.column_id+'__'+this.column.relcolumnname];
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
						&& item.pageId == this.pageId
						&& item.tmpId == this.tmpId
						&& item.columnId == this.columnId 
						&& item.tableId == this.tableId 
					){
						return item.showValue
					}
				}
			},
			isActive(){
				if( this.activeItem
					&& this.activeItem.pageId == this.pageId 
					&& this.activeItem.tmpId == this.tmpId
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
		data(){
			return{
				emptyTips:'无数据',
				inputVal:'',
				cvalue:'', //存放当前选中值
				yinyongShowArray:[],
				classId:'yy'+this.tableId+this.columnId
			}
		},
		methods:{
			//改变value
			updateActiveItem(params){
				if(!this.column.ischange){
					uni.showToast({
						title:'无修改权限',
						icon:"none"
					})
					return;
				}
				let activeItem = Object.assign({
									tmpId:this.tmpId,
									pageId:this.pageId,
									columnId:this.columnId,
									tableId:this.tableId,
									oldValue:this.value,
									parentTable:this.parentTable,
									classId:this.classId
								},params)
				//如果信息中有undefined  不进行编辑
				if( activeItem.tmpId == undefined
					|| activeItem.pageId == undefined
					|| activeItem.columnId == undefined
					|| activeItem.tableId == undefined
				){
					uni.showToast({
						title:"信息有误,无法操作",
						icon:"none"
					})
					return;
				}
				this.$store.commit('updateActiveItem',activeItem);
			},
			//获取引用表信息
			getYinyong(pageId){
				return getYinyong(pageId).then(data=>{
					return new Promise((resolve,reject)=>{						
						resolve(data)						
					})
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
					return new Promise((resolve,reject)=>{						
						resolve(data)						
					})
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
				if(this.yinyongArray){
					yinyongArray.push(...this.yinyongArray);
				}else{
					const yinyongRes =	await this.getYinyong(this.pageId);
					for(let i=0;i<yinyongRes.length;i++){
						let busiTemplate = await this.getAllInfo(yinyongRes[i].reltmpid);	
						yinyongArray.push(busiTemplate);
					}
				}	
				//isActive激活
				this.updateActiveItem({yinyongArray:yinyongArray});
			},
			async showLists(){
				this.cvalue = "";
				this.getListInfo().catch(error=>{});	
			},
			onInput(e){
				
			},
			onBlur(e){
				//展开选项	
				let value = this.inputVal;
				if(value == ""){
					return;
				}else{
					this.getYinyongList(value); //根据value获取选项
					this.updateActiveItem({showCard:true,yinyongArray:this.yinyongArray}) //展示选项
				}			
			},
			async getYinyongList(value){
				this.yinyongShowArray.splice(0,this.yinyongShowArray.length);
				if(this.yinyongArray && this.yinyongArray.length>0){
					for(let i=0;i<this.yinyongArray.length;i++){
					    let list = await this.getOneTable(value,this.yinyongArray[i]).catch(error=>{});
					    this.yinyongShowArray.push(...list);
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
				return getData({pageId:pageId,children:children,current:1,size:1000}).then(data=>{
					return new Promise((resolve,reject)=>{
						if(data.tableLists.length>0){
							let listArr = data.tableLists.reduce((pre,cur,index,arr)=>{
								let obj={};
								obj.tmpId = tmpId;
								obj.list = cur;
								obj.tableId = cur[tmpId+'__id'];
								delete cur[tmpId+'__id'];
								let valArr = Object.values(cur);
								obj.allValue = valArr.join("/");
								pre.push(obj);
								return pre;
							},[])
							resolve(listArr)
						}else{
							reject()
						}
					})
				}).catch(error=>{})				
			},
			//关闭选项卡 失去焦点
			hideShowCard(){
				this.inputVal = '';
				this.cvalue = '';
				this.$store.commit('initActiveItem');
				this.yinyongShowArray.splice(0,this.yinyongShowArray.length);
			},
			onYinyongConfirm(item){
				if(this.cvalue !== item.list[this.relValuename] ){
					this.cvalue = item.list[this.relValuename];
					this.updateActiveItem({value:item.tableId,ischange:true,showValue:item.list[this.relValuename],yinyongArray:this.yinyongArray,showCard:false});
					this.hideShowCard();		
				}else{
					this.hideShowCard();
				}
			},
			maskFun(){
				// console.log(this.showCard)
				if(this.showCard){
					// console.log(1)
					this.onBlur()
				}else{
					// console.log(2)
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
		background-color: $mask-color;
		// background-color: red;
		z-index: 1;
	}
	.input-box{
		display: flex;
		align-items: center;
	}
	.uni-input-placeholder{
		padding-left: 4px;
		font-size:14px;
		color:#8a8a8a;	
	}
	.d_input-arrow{
		padding: 0 4px;
	}
	.d_select{
		overflow: hidden;
		width: 750rpx;
		padding:0 20rpx;
		box-sizing: border-box;
		
		background-color: #FFFFFF;
		border-radius: 4px;
		box-shadow: #DDDDDD 2px 2px 8px, #DDDDDD -2px -2px 8px;
		z-index: 1000;
		
		position: fixed;
		bottom:0;
		left: 0;right:0;
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

</style>


