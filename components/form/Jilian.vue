<template>
	<!-- 父元素也可以被选中 不存在半选 全选 -->
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
							<view class="check-tab-box"  >
								<view class="check-tab"  @tap="checkFun(level,index,item)"
									:class="checkedCodes && checkedCodes.indexOf(item.code_no)>-1? 'checked-tab':''">
									<uni-icons :hidden="!checkedCodes || checkedCodes.indexOf(item.code_no) < 0" type="checkmarkempty" color="#FFF" size="12"></uni-icons>
								</view>	
							</view>	
							<!-- 点击展开显示   当前选中文字 蓝色 有子元素 出现右箭头 右箭头蓝色 -->
							<view class="item-text" @tap="showTap(level,index,item)"
								:class="{'check-color-active':activeIndex[level] == index && item.noChildren ==='false'}">
								<!-- 父元素 当前选中 文字都要变蓝 -->
								<text :class="{'checked-color':checkedCodes && checkedCodes.indexOf(item.code_no)>-1}">
									{{item.titles}}
								</text>
								<!-- 当前选中 并且有后代 显示箭头   选中项中有此元素 箭头为蓝 -->
								<uni-icons :hidden="activeIndex[level] != index || item.noChildren !=='false'"  class="icon-arrow" type="arrowright" 
									:color="checkedCodes && checkedCodes.indexOf(item.code_no)>-1?color:'#555'" size="12"></uni-icons>
							</view>	
											
						</view>						
					</scroll-view>	
				</view>	
			</scroll-view>					
		</view>
	</view>	
</template>

<script>
	
	import { getDataInfo } from '@/common/methods/index.js'
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
				selectArray:[], //存放展示数据
				activeIndex:[],//所有筛选列  选择当前记录
				checkedItem:[],//记录所有所选	
				classId:'jl'+this.data.columnId
			}
		},
		computed:{		
			showCard(){
				if(this.$store.state.screen.showCard.classId && this.$store.state.screen.showCard.classId === this.classId){
					return this.$store.state.screen.showCard.bool;
				}
			},
			cvalue(){
				let cvalue='';
				if(this.checkedItem && this.checkedItem.length>0){
					for(let n in this.checkedItem){
						cvalue += this.checkedItem[n].titles+","
					}
				}
				return cvalue.slice(0,-1);
			},
			//选中项的code_no 用来做选中项 只能用showlabel的最后一级titles  目前用code_no  有的市辖市 相同titles
			checkedCodes(){
				let codes = [];
				if(this.checkedItem.length>0){	
					for(let n in this.checkedItem){
						codes.push(this.checkedItem[n].code_no)
					}	
				}
				return codes;
			},
			//选中元素的长度统计
			checkedItemLength(){
				return this.checkedItem.length;
			},
			...mapState({
				tmpId:state=>state.screen.tmpId,
				checkquery:state=>state.screen.checkquery,
				columnSelects:state=>state.screen.columnSelects,
				color:state=>state.color
			}),
			//checkquery中 相同列集合
			checks(){
				if(this.checkquery && this.checkquery.length>0){
					return this.checkquery.filter(v=>v.columnId == this.data.columnId && v.tmpId == this.tmpId)
				}			
			},
			//所有父元素分类
			// allParents(){
			// 	let parentClass = [];
			// 	if(this.selectArray && this.selectArray.length>0){
			// 		// console.log(this.selectArray)
			// 		for(let n=0;n<this.selectArray.length;n++){
			// 			if(this.selectArray[n] && this.selectArray[n].length>0){
			// 				for(let j=0;j<this.selectArray[n].length;j++){
			// 					if(this.selectArray[n][j].noChildren === 'false'){
			// 						parentClass.push(this.selectArray[n][j])
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// 	return parentClass;
			// },
			//父元素 字体变蓝
			// textChecked(){
			// 	let textChecked = [];
			// 	if(this.allParents && this.allParents.length>0){
			// 		for(let n=0;n<this.allParents.length;n++){
			// 			let childs = [];
			// 			if(this.checkedItem && this.checkedItem.length>0){
			// 				for(let j=0;j<this.checkedItem.length;j++){
			// 					if(this.checkedItem[j].showlabel && this.checkedItem[j].showlabel.indexOf(this.allParents[n].titles)>-1){
			// 						childs.push(this.checkedItem[j]);
			// 					}
			// 				}
			// 			}
			// 			if(childs.length>0){
			// 				textChecked.push(this.allParents[n].code_no);
			// 			}
			// 		}
			// 	}
			// 	return textChecked;	
			// }
		},
		created(){
			this.checkedItem.splice(0,this.checkedItem.length);
			if(this.checks && this.checks.length>0){
				this.getInitData()
			}
		},
		methods:{
			getInitData(){		
				this.checkedItem.splice(0,this.checkedItem.length);			
				this.checks.forEach(v=>{
					v.showlabel = v.value;
					v.titles = v.value.slice(v.value.lastIndexOf('/')+1);
					this.checkedItem.push(v)	
				})
				
			},
			toggleCardFun(){
				if(this.showCard){
					this.hideShowCard();
					return ;
				}
				this.selectArray.splice(0,this.selectArray.length);
				this.activeIndex.splice(0,this.activeIndex.length);
				this.selectArray.push(JSON.parse(JSON.stringify(this.data.cascade)));
				this.$store.commit("updateShowCard",{bool:true,classId:this.classId});	
			},
			showTap(level,index,item){
				// console.log(arguments);	
				if(this.activeIndex && this.activeIndex[level] && this.activeIndex[level] === index && this.selectArray[level+1]){
					this.activeIndex.splice(level,this.activeIndex.length-level,index);
					this.selectArray.splice(level+1,this.selectArray.length-level);
					return;//不获取新数据
				}
				//清空后面项
				this.activeIndex.splice(level,this.activeIndex.length-level,index);
				this.selectArray.splice(level+1,this.selectArray.length-level);
				// 获取级联数据
				if(item.noChildren === 'false'){
					getDataInfo({
						type_id:item.type_id,
						parent_id:item.code_no,
					}).then(data=>{
						if(data && data.length>0){	
							// 清空后代项
							this.selectArray.push([...data]);
							// this.selectArray.splice(level+1,1,[...data]);
						}
					})
				}
								
			},
			//选中盒子  选中样式 选中数据 不考虑 父级与子级
			checkFun(level,index,item){		
				//记录当前item code_no
				this.activeIndex.splice(level,this.activeIndex.length-level,index);
				let findIndex = false;
				this.checkedItem.forEach((v,i,arr)=>{
					if(item.titles === v.titles){
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
					showlabel += this.selectArray[i][this.activeIndex[i]].titles+'/'
				}
				item.showlabel = showlabel.slice(0,-1);
				callback(item);
			},
			//选项卡中移除
			unchecked(index,check){
				if(this.checkedItem && this.checkedItem.length>0){
				    this.checkedItem.forEach((v,i,arr)=>{
						if(v.titles == check.titles){
							arr.splice(i,1)
						}
					})
				}	
			},
			getSubmit(){
				let checkquery = [];
				if(this.checkedItem && this.checkedItem.length>0){	
					this.checkedItem.forEach((val,index)=>{
						checkquery.push({
							tmpId:this.tmpId,
							columnId:this.data.columnId,
							operator:"like",
							value:val.showlabel
						})
					})
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
			},
		}
	}
	
</script>

<style scoped lang="scss">
	@import url("../../static/css/popcard.scss");	
</style>
