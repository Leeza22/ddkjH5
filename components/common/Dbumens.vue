<template>
	<view class="full-width" :class="classId">	
	
		<input  @tap="toShowCard" class="table-item-content" :disabled="true" v-if="changeValue" :value="changeValue" placeholder="请选择">
		<view @tap="toShowCard" class="table-item-content table-item-content-index" 
			v-if="!changeValue && cellInfo.fixedHeight" >{{ tableList[valueName] | clipFormat2(column.dd)}}</view>
		<view @tap="toShowCard" class="table-item-content" v-if="!changeValue && !cellInfo.fixedHeight" >{{tableList[valueName]}}</view>
		
		<!-- card部分 -->
        <view class="pop-card show-card" v-if="showCard">
        	<view class="handle">
        	   <text @click="cancelFun">取消</text><text @click="confirmFun">确定</text>
        	</view>
        	<scroll-view scroll-x="true" class="checked-scroll">
        		<view class="checked-show-box">
        			<view class="checked-item" v-for="(check,index) in checkedItem" :key="index"  @tap="unchecked(index,check)">
        				<text>{{check.showlabel}}</text>
        				<uni-icons class="clear" type="clear" color="#bfbfbf" size="13"></uni-icons>			
        			</view>
        		</view>	
        	</scroll-view>
        	
        	<scroll-view scroll-x="true" :show-scrollbar="false" class="scroll-row">
        		<view class="column-card" v-if="selectArray.length>0">
        			<scroll-view scroll-y="true" class="scroll-column" v-for="(array,level) in selectArray" :key="level">			
        				<view class="column-item" v-for="(item,index) in selectArray[level]" :key="index">
        					<!-- 点击选择 -->
        						<!-- 复选框样式没有子元素的元素 复选框 有选中项 为蓝色边框 蓝色背景  白色对勾 -->
							<view class="check-tab-box" @tap="checkFun(level,index,item)" >
								<view class="check-tab" :class="checkedValues && checkedValues.indexOf(item.value)>-1? 'checked-tab':''">
									<uni-icons :hidden="!checkedValues || checkedValues.indexOf(item.value) < 0" type="checkmarkempty" color="#FFF" size="12"></uni-icons>
								</view>	
							</view>												
        					<!-- 点击展开显示   当前选中文字 蓝色 有子元素 出现右箭头 右箭头蓝色 -->
        					<view class="item-text" @tap="showTap(level,index,item)"
								:class="{'check-color-active':activeIndex[level] == index && item.children && item.children.length >0}">
        						<!-- 父元素 当前选中 文字都要变蓝 -->
        						<text :class="{'checked-color':checkedValues && checkedValues.indexOf(item.value)>-1 
        							|| allChecked && allChecked.indexOf(item.value)>-1 
        							|| halfchecked && halfchecked.indexOf(item.value)>-1}">
        							{{item.label}}
        						</text>
        						<!-- 当前选中 并且有后代 显示箭头   选中项中有此元素 箭头为蓝 -->
        						<uni-icons :hidden="activeIndex[level] != index || !item.children || item.children.length < 1"  class="icon-arrow" type="arrowright" 
        							:color="checkedValues && checkedValues.indexOf(item.value)>-1
									|| allChecked && allChecked.indexOf(item.value)>-1
									|| halfchecked && halfchecked.indexOf(item.value)>-1? color:'#555'" size="12"></uni-icons>
        					</view>					
        				</view>							
        			</scroll-view>	
        		</view>	
        	</scroll-view>					
        </view>
	
	</view>
</template>

<script>
	// import { getDept } from '@/common/methods/index.js'
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
			tabletype:[Number,String],
			clipValue:[String,Number]
		},
		data(){
			return{
				selectArray:[], //存放展示数据
				activeIndex:[],//当前
			    checkedItem:[], //选中部门集合
				classId:'bms'+this.tableId+this.columnId
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
				selectData:state=>state.table.deptData
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
			showCard(){
				if(this.isActive && this.activeItem.showCard){
					return this.activeItem.showCard;
				}
			},
			cvalue(){
				let cvalue='';
				if(this.checkedItem && this.checkedItem.length>0){
					for(let n in this.checkedItem){
						cvalue += this.checkedItem[n].label+","
					}
				}
				return cvalue.slice(0,-1);
			},
			//选中项的code_no 用来做选中项
			checkedValues(){
				let values = [];
				if(this.checkedItem.length>0){	
					for(let n in this.checkedItem){
						values.push(this.checkedItem[n].value)
					}	
				}
				return values;
			},
			//所有父元素分类
			allParents(){
				let parentClass = [];
				if(this.selectArray && this.selectArray.length>0){
					for(let n=0;n<this.selectArray.length;n++){
						if(this.selectArray[n] && this.selectArray[n].length>0){
							for(let j=0;j<this.selectArray[n].length;j++){
								if(this.selectArray[n][j].children){
									parentClass.push(this.selectArray[n][j])
								}
							}
						}
					}
				}
				return parentClass;
			},
			//父元素全选项数组
			allChecked(){
				let allChecked = [];
				if(this.allParents && this.allParents.length>0){
					for(let n=0;n<this.allParents.length;n++){
						let childs = [];
						if(this.checkedItem && this.checkedItem.length>0){
							for(let j=0;j<this.checkedItem.length;j++){
								if(this.checkedItem[j].pid == this.allParents[n].value){
									childs.push(this.checkedItem[j]);
								}
							}
						}
						if(childs.length>0 && childs.length >= this.allParents[n].children.length){
							allChecked.push(this.allParents[n].value);
						}
					}
				}
				return allChecked;
				// this.selectArray.	
			},
			//父元素半选数组
			halfchecked(){
				// console.log(this.checkedItem,this.allParents)
				let halfChecked = [];
				if(this.allParents && this.allParents.length>0){
					for(let n=0;n<this.allParents.length;n++){
						let childs = [];
						if(this.checkedItem && this.checkedItem.length>0){
							for(let j=0;j<this.checkedItem.length;j++){
								if(this.checkedItem[j].pid == this.allParents[n].value){
									childs.push(this.checkedItem[j]);
								}
							}
						}
						if(childs.length>0 && childs.length < this.allParents[n].children.length){
							halfChecked.push(this.allParents[n].value);
						}
					}
				}
				return halfChecked;
			}
		},
		methods:{
			async toShowCard(){
		
				if(this.showCard){
					// 关闭选项卡
					 this.hideShowCard();
					 return;
				}
				this.checkedItem.splice(0,this.checkedItem.length);		
				this.activeIndex.splice(0,this.activeIndex.length);
				this.selectArray.splice(0,this.selectArray.length);
				
				//获取筛选数据  弹出弹层
				if(!this.selectData || this.selectData.length<1){
					let res = await this.$store.dispatch("getDeptData").catch(error=>{})
					if(!res){
						uni.showToast({
							title:"选项获取失败",
							icon:'none'
						})
						return;
					}
				}							
				//获取数组层数 决定几列
				this.getLength(this.selectData,length=>{
					//不能修改原数据
					this.selectArray.push(JSON.parse(JSON.stringify(this.selectData)))
					for(let n=0;n<length-1;n++){
						this.selectArray.push([])
					}
				})
								
			    //出现弹出层 保存筛选数据
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{
						showCard:true,
						classId:this.classId
					}
				})
			},		
			//点击展开选项
			showTap(level,index,item){
				if(this.activeIndex && this.activeIndex[level] && this.activeIndex[level] === index && this.selectArray[level+1]){
					//孙级展出的收回
					this.activeIndex.splice(level,this.activeIndex.length-level,index);
					this.selectArray.splice(level+1,this.selectArray.length-level);
					return;//不获取新数据
				}
				this.activeIndex.splice(level,this.activeIndex.length-level,index);
				this.selectArray.splice(level+1,this.selectArray.length-level);		
				// 获取级联数据
				if(item.children && item.children.length>0){					    
					this.selectArray.push([...item.children]);					
				}					
			},
			// 选择选中部门
			//选中盒子  选中样式 选中数据 不考虑 父级与子级
			checkFun(level,index,item){
				//记录当前item
				this.activeIndex.splice(level,this.activeIndex.length-level,index);
				let findIndex = false;
				this.checkedItem.forEach((v,i,arr)=>{
					if(item.value == v.value){
						arr.splice(i,1);
						findIndex = true;
						return;
					}
				})
				if(!findIndex){
					//找到item的父级
					this.getParentLabel(item,level,res=>{
						this.checkedItem.push(res);
					})
				}
			},
			//获取祖先级的label
			getParentLabel(item,level,callback){
				let showlabel='';
				for(let i=0;i<level+1;i++){
					showlabel += this.selectArray[i][this.activeIndex[i]].label+'/'
				}
				item.showlabel = showlabel.slice(0,-1);
				callback(item);
			},
			unchecked(index,check){
				if(this.checkedItem && this.checkedItem.length>0){
					this.checkedItem.forEach((v,i,arr)=>{
						if(v.value == check.value){
							arr.splice(i,1)
						}
					})
				}				
			},
			//确认选择
			confirmFun(){
				let users = [];
				this.checkedItem.forEach(v=>{
					users.push({deptId:v.value})
				});
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{
						value:this.cvalue,
						isupdate:true,
						userRel:{
							cid:this.columnId,
							tableId:this.tableId,
							users:users
						},
						showCard:false
					}
				})
				this.hideShowCard()
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
				this.$store.commit('initActiveItem')		
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
		}
	}
</script>

<style scoped lang="scss">
	@import url("../../static/css/popcard.scss")
</style>

