<template>
	<view class="full-width" :class="classId">
		<input  @tap="toShowCard" class="table-item-content" :disabled="true" v-if="changeValue" :value="changeValue | endFormat" placeholder="请选择">
		<view @tap="toShowCard" class="table-item-content table-item-content-index" 
			v-if="!changeValue && cellInfo.fixedHeight" >{{tableList[valueName] | endFormat | clipFormat2(column.dd)}}</view>
		<view @tap="toShowCard" class="table-item-content" v-if="!changeValue && !cellInfo.fixedHeight" >{{tableList[valueName] | endFormat}}</view>
		<!-- card部分 -->
		<view class="pop-card show-card" v-if="showCard">
			<view class="handle">
			   <text @click="cancelFun">取消</text><text @click="confirmFun">确定</text>
			</view>		
			<scroll-view scroll-x="true" :show-scrollbar="false" class="scroll-row">
				<view class="column-card" v-if="selectArray.length>0">
					<scroll-view scroll-y="true" class="scroll-column" v-for="(array,level) in selectArray" :key="level">
						<view class="column-item" v-for="(item,index) in selectArray[level]" :key="index">
							<!-- 点击选择 -->
								<!-- 复选框样式没有子元素的元素 复选框 有选中项 为蓝色边框 蓝色背景  白色对勾 -->
							<view class="check-tab-box" @tap="checkFun(level,index,item)" >
								<view class="check-tab check-tab-radio" :class="checkedItem && checkedItem.code_no === item.code_no? 'checked-tab':''">
									<uni-icons :hidden="!checkedItem || checkedItem.code_no !== item.code_no" type="checkmarkempty" color="#FFF" size="12"></uni-icons>
								</view>	
							</view>	
							<!-- 点击展开显示   当前选中文字 蓝色 有子元素 出现右箭头 右箭头蓝色 -->
							<view class="item-text" @tap="showTap(level,index,item)"
								:class="{'check-color-active':activeIndex[level] == index && item.noChildren ==='false'}">
								<!-- 父元素 当前选中 文字都要变蓝 -->
								<text :class="{'checked-color':checkedItem && checkedItem.code_no === item.code_no }">
									{{item.titles}}
								</text>
								<!-- 当前选中 并且有后代 显示箭头   选中项中有此元素 箭头为蓝 -->
								<uni-icons :hidden="activeIndex[level] != index || item.noChildren !=='false'"  class="icon-arrow" type="arrowright" 
									:color="checkedItem && checkedItem.code_no === item.code_no? color:'#555'" size="12"></uni-icons>
							</view>	
						</view>					
					</scroll-view>	
				</view>	
			</scroll-view>					
		</view>
		
	</view>
</template>

<script>
	import { getColumnSelects,getDataInfo } from '@/common/methods/index.js'
	import {mapState} from 'vuex'
	import uniIcons from '../unis/uni-icons/uni-icons.vue'
	export default{
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
			tabletype:[Number,String]
		},
		data(){
			return{
				selectArray:[], //存放展示数据
				activeIndex:[],//当前selectArray索引下index值记录
				checkedItem:null, //选中集合	
				classId:'jl'+this.tableId+this.columnId
			}
		},
		filters:{
			endFormat(value){
				if(value){
					let index = value.lastIndexOf('/');
					return value.slice(index+1);
				}
			}
		},
		computed:{
			value(){	
				return this.tableList[this.valueName];						
			},
			...mapState({
				recordsAll:state=>state.table.recordsAll,
				editable:state=>state.table.editable,
				activeItem:state=>state.table.activeItem,
				color:state=>state.color,
				columnSelectsArr:state=>state.table.columnSelectsArr
			}),
			changeValue(){
				for(let item of this.recordsAll){
					if(	item
						&& item.tmpTableId == this.cellInfo.tmpTableId
						&& item.columnId == this.columnId 
						&& item.tableId == this.tableId 
					){
						// return item.value
						let index = item.value.lastIndexOf('/');
						return item.value.slice(index+1);
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
			columnSelects(){
				// console.log(this.columnSelectsArr)
				if(this.columnSelectsArr && this.columnSelectsArr.length>0){
				    for(let n in this.columnSelectsArr){
						if(this.columnSelectsArr[n].pageId == this.cellInfo.cell.pageId){
							return this.columnSelectsArr[n].data
						}
					}
				}
			},
			cvalue(){
				if(this.checkedItem){
					return this.checkedItem.titles;
				}
			}
		},
		// watch:{
		// 	activeItem(val){
		// 		if(val && val.tmpTableId == this.cellInfo.tmpTableId){
		// 			let fun1 = (e)=>{
		// 				if(!this.$el.contains(e.target)){
		// 					this.$store.commit('initActiveItem')
		// 				}
		// 			}
		// 			if(val.showCard){
		// 				// document.addEventListener('click',(e)=>{
		// 				// 	console.log(this.$el)
		// 				// },true)
		// 			}else{
		// 				// document.removeEventListener('click',fun1,true)
		// 			}
		// 		}	
		// 	}
		// },
		methods:{
			async toShowCard(){
				if(this.showCard){
					// 关闭选项卡
					this.hideShowCard();
					 return;
				}
				this.checkedItem = null;
				this.activeIndex.splice(0,this.activeIndex.length);
				this.selectArray.splice(0,this.selectArray.length);
				
				if(!this.columnSelects || this.columnSelects.length<1){
					const result = await this.$store.dispatch('getColumnSelects',{
						pageId:this.cellInfo.cell.pageId,
						tmpTableId:this.cellInfo.tmpTableId,
					}).catch(error=>{})		
				}
				if(this.columnSelects && this.columnSelects.length>0){
					for(let i in this.columnSelects){
						if(this.columnSelects[i].columnId == this.columnId){
							let cascade = JSON.parse(JSON.stringify(this.columnSelects[i].cascade))
							this.selectArray.splice(0,this.selectArray.length,cascade);
							break;
						}
					}
				}
			    //出现弹出层 保存筛选数据
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{
						showCard:true,
						classId:this.classId
					}
				})
			},		
			showTap(level,index,item){	
				if(this.activeIndex && this.activeIndex[level] && this.activeIndex[level] === index && this.selectArray[level+1]){
					this.activeIndex.splice(level,this.activeIndex.length-level,index);
					this.selectArray.splice(level+1,this.selectArray.length-level);
					return;//不获取新数据
				}
				this.activeIndex.splice(level,this.activeIndex.length-level,index);
				this.selectArray.splice(level+1,this.selectArray.length-level);
				// 获取级联数据
			    if(item.noChildren === 'false'){
					getDataInfo({
						type_id:item.type_id,
						parent_id:item.code_no,
					}).then(data=>{
						if(data && data.length>0){	
							this.selectArray.push([...data])	
						}
					})
				}								
			},
			checkFun(level,index,item){
				this.activeIndex.splice(level,this.activeIndex.length-level,index);
				//点击变选中
				if(this.checkedItem && this.checkedItem.code_no === item.code_no){
					this.checkedItem = null;
				}else{
					this.getParentLabel(item,level,res=>{
						this.checkedItem = res;
					})	
				}		
			},
			//获取祖先级的label
			getParentLabel(item,level,callback){
				let showlabel='';
				for(let i=0;i<level+1;i++){
					showlabel += this.selectArray[i][this.activeIndex[i]].titles+'/'
				}
				item.showlabel = showlabel.slice(0,-1);
				callback(item);
			},	
			//确认选择
			confirmFun(){				
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{
						value:this.cvalue,
						isupdate:true,
						showCard:false
					}
				})
				this.hideShowCard();		
			},
			//取消选择
			cancelFun(){
				this.hideShowCard();
			},
			hideShowCard(){
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{showCard:false}
				})
				this.activeIndex.splice(0,this.activeIndex.length);
				this.selectArray.splice(0,this.selectArray.length);
				this.$store.commit('initActiveItem');		
			}
		}
	}
</script>

<style scoped lang="scss">
	@import url("../../static/css/popcard.scss")
		
</style>