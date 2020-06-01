<template>
	<view class="full-width" :class="classId">
		<!-- 展示部分  必须直接渲染 不能computed -->
		<view v-if="!isActive">			
			<view @tap="toEdit" class="table-item-content" v-if="changeValue">{{changeValue}}</view>
			<view @tap="toEdit" class="table-item-content table-item-content-index" 
				v-if="!changeValue && cellInfo.fixedHeight" >{{tableList[valueName] | clipFormat2(column.dd)}}</view>
			<view @tap="toEdit" class="table-item-content" v-if="!changeValue && !cellInfo.fixedHeight">{{tableList[valueName]}}</view>
		</view>
		<!-- 编辑部分 -->
		<textarea v-if="isActive && !showCard"
			class="table-item-content"
			v-model="inputVal"
			:auto-height="true"
			:maxlength="-1"
			:focus="focus"
			@blur="onBlur"
			@confirm="onBlur"/>
		<!-- <input v-if="isActive && !showCard"
			class="table-item-content"
			type="text" 
			v-model ="inputVal"
			:focus="focus"
			@blur="onBlur"
			@confirm="onBlur"/> -->
		<!-- card部分 -->
		<view class="pop-card show-card" v-if="showCard && showLongWen">
			<view class="handle">
			   <text @click="cancelFun">取消</text><text @click="confirmFun">确定</text>
			</view>					
			<scroll-view scroll-y="true" class="scroll-column scroll-textarea">	
				<view>
					<textarea v-if="isActive"
						class="item-textarea"
						v-model="inputVal"	
						:maxlength="-1"
						:focus="focus"
						@blur="onBlur"
						@confirm="onBlur"/>
				</view>				
			</scroll-view>							
		</view>
	</view>
</template>

<script>
	import uniIcons from '../unis/uni-icons/uni-icons.vue'
	import {mapState} from 'vuex'
	export default{
		components:{
			uniIcons
		},
		props:{
		    tableList:Object,
			column:Object,
			tableId:[Number,String],
			columnId:[Number,String],
			tmpId:[String,Number],
			valueName:[String,Number],
			cellInfo:[Object],
			tabletype:[Number,String]
		},
		data(){
			return{
				focus:false,
				inputVal:'',
				classId:'wb'+this.tableId+this.columnId
			}
		},
		computed:{
			value(){
				return this.tableList[this.valueName];
			},
			showLongWen(){
				if(this.column.cLen){
					return true;
				}else if(this.value && this.value.length*30 > this.column.dd){
					return true;
				}
			},
			...mapState({
				recordsAll:state=>state.table.recordsAll,
				editable:state=>state.table.editable,
				activeItem:state=>state.table.activeItem,
				selectData:state=>state.table.deptData,
				color:state=>state.color
			}),
			changeValue(){	
				for(let item of this.recordsAll){
					if(	item
						&& item.tmpTableId == this.cellInfo.tmpTableId
						&& item.columnId == this.columnId 
						&& item.tableId == this.tableId 
					){
						// console.log(item.value)
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
			showInput(){
				if(this.isActive && this.activeItem.showInput){
					return this.activeItem.showInput;
				}
			},
			nowValue(){
				let nowValue=''
				if(this.changeValue){
					return this.inputVal;
				}else{
					return this.value;
				}
			}
		},
		methods:{
			toEdit(){
				if(this.showLongWen){
					this.toShowCard()
				}else{
					this.onFocus()
				}
			},
			async toShowCard(){	
				if(this.showCard){
					this.hideShowCard();
					return;
				}
				this.inputVal = this.nowValue;
							
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
			onFocus(){	
				// console.log("focus")
				this.focus = true;
				this.inputVal = this.nowValue;
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo
				})
			},
			// 选择选中部门
			//选中盒子  选中样式 选中数据 不考虑 父级与子级
			onBlur(e){
				this.confirmFun(e.value)
			},
			//确认选择
			confirmFun(value){  
				// console.log("confirm",this.inputVal,value)
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{
						value:this.inputVal,
						isupdate:true,
						showCard:false
					}
				})						
				this.hideShowCard();							
			},
			//取消选择
			cancelFun(){		
				this.hideShowCard()
			},
			hideShowCard(){
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{showCard:false}
				})
				this.focus = false;
				this.$store.commit('initActiveItem');
							// console.log(this.isActive,this.changeValue)
			}
		}
	}
</script>

<style scoped lang="scss">
	.item-textarea{
		border:1rpx solid #eee;
		margin:20rpx auto;
		text-align: left;
		color:#666;
	}
	@import url('../../static/css/popcard.scss')
	
</style>

