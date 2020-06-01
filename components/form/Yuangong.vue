<template>
	<!-- 只能选择最后一级  存在父元素 全选 半选 -->
	<view class="form-item" :class="classId">
		<!-- 有选择时候 -->
		<view class="checked-top" v-if="checkedItem.length>0" >
			<scroll-view scroll-x="true" class="checked-scroll-top">
				<view class="checked-show-box ">
					<view class="remove-item" v-for="(check,index) in checkedItem" :key="index">
						<text @tap="toggleCardFun">{{check.showlabel}}</text>
						<uni-icons class="clear" type="clear" color="#bfbfbf" size="13"
							@tap="removeChecked(index,check)">
						</uni-icons>
					</view>			
				</view>
			</scroll-view>
			<view v-if="checkedItem && checkedItem.length>0" class="total-length" @tap="toggleCardFun" >+{{checkedItemLength}}</view>
		</view>
		<!-- 无选项时候 -->
		<view class="d-input" v-else  @tap="toggleCardFun">
			<text>{{placeholder}}</text>
			<uni-icons type="arrowdown" color="#bfbfbf" size="13" class="icon-down" ></uni-icons>
		</view>
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
							<!-- 复选框样式有子元素的元素 复选框 有选中项 为蓝色边框 蓝色背景  横线 全选为白色 -->
							<view class="check-tab-box"  >
								<view class="check-tab" v-if='item.children && item.children.length>0' 
									@tap="toggleAllchecks(level,index,item)"
									:class="allChecked && allChecked.indexOf(item.value) >-1 
									|| halfchecked && halfchecked.indexOf(item.value)>-1? 'checked-tab':''">
									<uni-icons :hidden="!allChecked || allChecked.indexOf(item.value) < 0" type="checkmarkempty" color="#FFF" size="12"></uni-icons>
									<!-- 半选下 全选上 -->
									<text class="icon-halfcheck" :hidden="!halfchecked || halfchecked.indexOf(item.value) < 0 ">-</text>
								</view>
								<view class="check-tab" v-else @tap="checkFun(level,index,item)"
									:class="checkedValues && checkedValues.indexOf(item.value)>-1? 'checked-tab':''">
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
									:color="checkedValues && checkedValues.indexOf(item.value)>-1? color:'#555'" size="12"></uni-icons>
							</view>								
						</view>						
					</scroll-view>	
				</view>	
			</scroll-view>					
		</view>
	</view>	
</template>

<script>
	
	import { getYuangong } from '@/common/methods/index.js'
	import uniIcons from '../unis/uni-icons/uni-icons.vue'
	import {mapState} from 'vuex'
	export default{
		components:{
			uniIcons
		},
		props:{
			data:{
				type:[Object,Array]
			}
		},
		data(){
			return{
				placeholder:'请选择',
				selectLength:0,//选择数据的总列数
				selectArray:[], //存放展示数据[[],[],[]]
				activeIndex:[],//记录当前选择位置[0,1,0]
				checkedItem:[],//记录所有员工单选	 [{},{}]
				classId:'yg'+this.data.columnId,
				selectsLabel:[],
				selectsFlat:[]
			}
		},
		computed:{
			...mapState({
				tmpId:state=>state.screen.tmpId,
				checkquery:state=>state.screen.checkquery,
				roleList:state=>state.screen.roleList,
				color:state=>state.color
			}),
			cId(){
				return this.data.templateColumn.cId
			},
			//checkquery中 相同列集合
			checks(){
				if(this.checkquery && this.checkquery.length>0){
					return this.checkquery.filter(v=>v.columnId == this.data.columnId && v.tmpId == this.tmpId)
				}			
			},
			//控制选项卡出现隐藏
			showCard(){
				if(this.$store.state.screen.showCard.classId && this.$store.state.screen.showCard.classId === this.classId){
					return this.$store.state.screen.showCard.bool;
				}	
			},
	
			//展示value字符串
			cvalue(){
				let cvalue='';
				if(this.checkedItem && this.checkedItem.length>0){
					for(let n in this.checkedItem){
						cvalue += this.checkedItem[n].label+","
					}
				}
				return cvalue.slice(0,-1);
			},
			//选中元素的长度统计
			checkedItemLength(){
				return this.checkedItem.length;
			},
			//选中项的value 用来做选中项
			checkedValues(){
				let codes = [];
				if(this.checkedItem.length>0){	
					for(let n in this.checkedItem){
						codes.push(this.checkedItem[n].value)
					}	
				}
				return codes;
			},
			// 父元素选中
			// checkedPrarent(){
			// 	let parts = [];
			// 	for(let j=0;j<this.selectArray.length-1;j++){
			// 		parts.splice(j,1,[]);
			// 	}
			// 	if(this.checkedItem.length>0){
			// 		for(let n=0;n<this.checkedItem.length;n++){
			// 			for(let k=0;k<this.checkedItem[n].pat_trial.length-1;k++){
			// 				parts[k].push(this.checkedItem[n].pat_trial[k]);
			// 			}
			// 			parts.push(this.checkedItem[n].pat_trial)
			// 		}
			// 	}
			// 	// 去重
			// 	for(let s=0;s<parts.length;s++){
			// 		if(parts[s] && parts[s].length>0){
			// 			parts[s] = [...new Set(parts[s])]
			// 		}
			// 	}
			// 	return parts;
			// },
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
								if(this.checkedItem[j].dept_id === this.allParents[n].value){
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
				let halfChecked = [];
				if(this.allParents && this.allParents.length>0){
					for(let n=0;n<this.allParents.length;n++){
						let childs = [];
						if(this.checkedItem && this.checkedItem.length>0){
							for(let j=0;j<this.checkedItem.length;j++){
								if(this.checkedItem[j].dept_id === this.allParents[n].value){
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
		created(){
			this.checkedItem.splice(0,this.checkedItem.length);
			if(this.checks && this.checks.length>0){
				this.getRoleList().catch(error=>{})	
				this.getInitData()
			}
		},
		methods:{
			getselectsLabel(selectsLabel){
				let _this = this;
				_this.selectsFlat.splice(0,this.selectsFlat.length);
				function loopArray(array){	
					for(let i=0;i<array.length;i++){
						if(array[i].showlabel){
							array[i].showlabel += array[i].label;	
						}else{
							array[i].showlabel = array[i].label	
						}
							//推进平数组
						_this.selectsFlat.push(array[i]);
						if(array[i].children && array[i].children.length>0){
							for(let j=0;j<array[i].children.length;j++){
								array[i].children[j].showlabel = array[i].label+'/';
							}
							loopArray(array[i].children)
						}
					}
				}
				loopArray(selectsLabel);
			},
			//获取roleList
			async getRoleList(){
				if(!this.roleList || this.roleList.length<1){
					await this.$store.dispatch("getRoleList",this.data.columnId)
				}
				if(this.roleList && this.roleList.length>0){
					
					this.selectsLabel.splice(0,this.selectsLabel.length,...JSON.parse(JSON.stringify(this.roleList)))
					await this.getselectsLabel(this.selectsLabel);
				}
			},
			//初始化 赋值 this.checkedItem
			getInitData(){
				this.checkedItem.splice(0,this.checkedItem.length)
				//员工单选
				if(this.cId === 21 && this.selectsFlat.length>0){
					this.checks.forEach(v=>{
						let checkItem = this.selectsFlat.filter(val=>v.value === val.value)
						if(checkItem && checkItem.length>0){
							this.checkedItem.push(checkItem[0])
						}	
					})
				}
				//员工多选
				if(this.cId === 22 && this.selectsFlat.length>0){
					this.checks.forEach(v=>{
						let checkItem = this.selectsFlat.filter(val=>v.value === val.label)
						if(checkItem && checkItem.length>0){
							this.checkedItem.push(checkItem[0])
						}	
					})
				}
				// console.log(this.checkedItem)
			},
			//切换选项卡隐藏消失
			async toggleCardFun(){
				if(this.showCard){
					this.hideShowCard();
					return ;
				}
				this.selectArray.splice(0,this.selectArray.length);
				this.activeIndex.splice(0,this.activeIndex.length);
				//获取
				await this.getRoleList().catch(error=>{})
					
				if(this.selectsLabel){
					this.selectArray.push(JSON.parse(JSON.stringify(this.selectsLabel)))
					this.getLength(this.selectsLabel,length=>{
						for(let n=0;n<length-1.;n++){
							this.selectArray.push([])
						}
						this.$nextTick(()=>{
							this.$store.commit('updateShowCard',{bool:true,classId:this.classId});
						})
					})		
				}			
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
				if(item.children && item.children.length>0){					    
					this.selectArray.push([...item.children]);					
				}
								
			},
			//选中盒子  最后一级子元素身上事件
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
					this.checkedItem.push(item);			
				}
				
			},
			//控制全选与全不选
			toggleAllchecks(level,index,item){
				this.activeIndex.splice(level,this.activeIndex.length-level,index);
				this.selectArray.splice(level+1,this.selectArray.length-level);
				this.selectArray.push([...item.children]);
				//如果不是全选 添加 如果是删除
				if(this.allChecked.indexOf(item.value)<0){
					if(item.children && item.children.length>0){
						this.checkedItem.push(...item.children)
					}
					//去重
					this.uniqueCheckedItem(this.checkedItem,res=>{
						this.checkedItem.splice(0,this.checkedItem.length,...res);
					});
				}else{		
					if(this.checkedItem && this.checkedItem.length>0){
						this.checkedItem = this.checkedItem.filter(v=>v.dept_id !== item.value)
					}
				}
				
			},
			// 去重this.checkeditem
			uniqueCheckedItem(arr,callback){
				let obj={};
				let newArr;
				if(arr && arr.length>0){
					newArr = arr.reduce((pre,cur,next,arr)=>{
						 obj[cur.value] ? "" : obj[cur.value] = true && pre.push(cur);
						return pre;
					},[])
				}
				callback(newArr)
			},
			
			//选项卡中移除
			unchecked(index,check){
				if(this.checkedItem && this.checkedItem.length>0){
				    this.checkedItem.forEach((v,i,arr)=>{
						if(v.value == check.value){
							arr.splice(i,1)
						}
					})
				}	
			},
	        getSubmit(){
				let checkquery = [];
				if(this.checkedItem && this.checkedItem.length>0){		
					if(this.cId === 21){
						this.checkedItem.forEach((val,index)=>{
							checkquery.push({
								tmpId:this.tmpId,
								columnId:this.data.columnId,
								operator:"eq",
								value:val.value
							})
						})
					}
					if(this.cId === 22){
						this.checkedItem.forEach((val,index)=>{
							checkquery.push({
								tmpId:this.tmpId,
								columnId:this.data.columnId,
								operator:"like",
								value:val.label
							})
						})		
					}
				}
				this.$store.commit("changeCondition",{
										checkquery:checkquery,
										columnId:this.data.columnId,
									});
	        },
			//确认选择
			confirmFun(){
				this.getSubmit()
				this.hideShowCard();
			},
			removeChecked(index,check){
				this.unchecked(index,check);
				this.getSubmit()	
			},
			//取消选择
			cancelFun(){
				this.hideShowCard();
			},
			hideShowCard(){
				this.$store.commit('updateShowCard',{bool:false,classId:this.classId})
				this.selectArray.splice(0,this.selectArray.length)
				this.activeIndex.splice(0,this.activeIndex.length)
				this.selectsLabel.splice(0,this.selectsLabel.length)
				this.selectsFlat.splice(0,this.selectsFlat.length)
			},
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

<style scoped>
	@import url("../../static/css/popcard.scss");	
</style>
