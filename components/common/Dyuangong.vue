<template>
	<view class="full-width" :class="classId">
		<!-- 展示部分  必须直接渲染 不能computed -->
		<input  @tap="toShowCard" class="table-item-content" :disabled="true" v-if="changeValue" :value="changeValue" placeholder="请选择">
		<view @tap="toShowCard" class="table-item-content table-item-content-index" 
			v-if="!changeValue && cellInfo.fixedHeight" >{{tableList[valueName] | clipFormat2(column.dd)}}</view>
		<view @tap="toShowCard" class="table-item-content" v-if="!changeValue && !cellInfo.fixedHeight" >{{tableList[valueName]}}</view>
		
		<!-- card部分 -->
		<view class="pop-card show-card" v-if="showCard">
			<view class="handle">
			   <text @click="cancelFun">取消</text><text @click="confirmFun">确定</text>
			</view>		
			<scroll-view scroll-x="true" :show-scrollbar="false" class="scroll-row">
				<view class="column-card" v-if="selectArray.length>0">
					<scroll-view scroll-y="true" class="scroll-column" v-for="(array,level) in selectArray" :key="level">			
						<view class="column-item" v-for="(item,index) in selectArray[level]" :key="index" @tap="showTap(level,index,item)">
							<!-- 点击选择 -->
							<view class="check-tab-box">
								<view class="check-tab check-tab-radio" 
									:class="checkedItem && checkedItem.value === item.value? 'checked-tab':''">
									<uni-icons :hidden="!checkedItem || checkedItem.value !== item.value" type="checkmarkempty" color="#FFF" size="12"></uni-icons>
								</view>								
							</view>													
							<!-- 点击展开显示   当前选中文字 蓝色 有子元素 出现右箭头 右箭头蓝色 -->
							<view class="item-text" 
								:class="{'check-color-active':activeIndex[level] == index && item.children && item.children.length >0}">
								<!-- 父元素 当前选中 文字都要变蓝 -->
								<text :class="{'checked-color':checkedItem && checkedItem.value === item.value}">
									{{item.label}}
								</text>
								<!-- 当前选中 并且有后代 显示箭头   选中项中有此元素 箭头为蓝 -->
								<uni-icons :hidden="activeIndex[level] != index || !item.children || item.children.length <1" 
									class="icon-arrow" type="arrowright" size="12"
									:color="checkedItem && checkedItem.value === item.value? color:'#555'" >
								</uni-icons>
							</view>					
						</view>							
					</scroll-view>	
				</view>	
			</scroll-view>					
		</view>
		<!-- card部分结束 -->
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import { getYuangong } from '@/common/methods/index.js'
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
				activeIndex:[],//当前
			    checkedItem:null, //单元选中元素
				classId:'yg'+this.tableId+this.columnId
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
				color:state=>state.color
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
			//存放选择数据
			selectData(){
				if(this.isActive && this.activeItem.selectData){
					return this.activeItem.selectData;
				}
			},
			cvalue(){
				if(this.checkedItem){
					return this.checkedItem.label;
				}
			}
		},
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
				//获取筛选数据  弹出弹层
				let selectData;
				if(!this.selectData || this.selectData.length<1){
					const data = await getYuangong(this.columnId).catch(err=>{})
					if(data){
						selectData = data.data;
					}		
				}else{
					selectData = this.selectData;
				}							
				//获取数组层数 决定几列
				this.getLength(selectData,length=>{
					//不能修改原数据
					this.selectArray.push(JSON.parse(JSON.stringify(selectData)))
					for(let n=0;n<length-1;n++){
						this.selectArray.push([])
					}
				})
				
				//出现弹出层 保存筛选数据
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{
						showCard:true,
						classId:this.classId,
						selectData:selectData
					}
				})			
			},					
			//点击展开选项
			showTap(level,index,item){
				if(this.activeIndex && this.activeIndex[level] && this.activeIndex[level] === index && this.selectArray[level+1]){
					this.activeIndex.splice(level,this.activeIndex.length-level,index);
					this.selectArray.splice(level+1,this.selectArray.length-level);
					return;//不获取新数据
				}
				this.activeIndex.splice(level,this.activeIndex.length-level,index);
				this.selectArray.splice(level+1,this.selectArray.length-level);		
				// 获取级联数据
				if(item.children && item.children.length>0){					    
					this.selectArray.push([...item.children]);					
				}else{
					if(this.checkedItem && this.checkedItem.user_id === item.user_id){
						this.checkedItem = null;
					}else{
						this.checkedItem = item;
					}
				}			
			},
			//确认选择
			confirmFun(){ 
				if(this.checkedItem){
					this.$store.dispatch("changeActiveItem",{
						cellInfo:this.cellInfo,
						cellparams:{
						value:JSON.stringify({
							user_id:this.checkedItem.user_id,
							dept_id:this.checkedItem.dept_id,
							}),
							isupdate:true,
							showValue:this.cvalue,
							showCard:false
						}
					})		
				}	
				this.hideShowCard()
			},
			//取消选择
			cancelFun(){
				this.hideShowCard()
			},
			hideShowCard(){				
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{
						showCard:false,
						classId:this.classId
					}
				})		
				this.activeIndex.splice(0,this.activeIndex.length);
				this.selectArray.splice(0,this.selectArray.length);
				this.$store.commit('initActiveItem');			
			},
			//获取数组层数
			getLength(arr,callback) {
				let length = 0
				function getCount(arr, count) {
				  if (Array.isArray(arr) && arr.length > 0) {
					let find = false
					for (let i = 0; i < arr.length; i++) {
					  if (arr[i].children && arr[i].children.length > 0) {				 
						find = true
						//后面return的值在这里 所以在下面赋值
						getCount(arr[i].children, count + 1)			
					  }
					}
					if (!find) {
					  length = count + 1
					  return count + 1
					}
				  } else {
					length = count
					return count
				  }
				}
				getCount(arr, 0)
				callback(length);
		}
				
	}//methods end
}
</script>

<style scoped lang="scss">
	@import url("../../static/css/popcard.scss")
</style>
