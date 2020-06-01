<template>
	<view class="table-item">
		<!-- 自动编号 时间长度 -->	
		<view v-if="dtypeUnEdit && dtypeUnEdit.indexOf(column.cId)>-1  && !fixedHeight"
			class="table-item-content">
			{{tableList[valueName]}}
		</view>
		<view v-if="dtypeUnEdit && dtypeUnEdit.indexOf(column.cId)>-1 && fixedHeight"
			class="table-item-content table-item-content-index">
			{{tableList[valueName] | clipFormat2(column.dd)}}
		</view>
			 
		<view v-if="dtypeInputShow && dtypeInputShow.indexOf(column.cId)>-1 && changeValue && !isActive"
			class="table-item-content change"
			@click="toEdit">
			{{changeValue}}
		</view>
		<view v-if="dtypeInputShow && dtypeInputShow.indexOf(column.cId)>-1 && !changeValue && !isActive && !fixedHeight" 
			class="table-item-content"
			@click="toEdit">
			{{tableList[valueName]}}
		</view>
		<view v-if="dtypeInputShow && dtypeInputShow.indexOf(column.cId)>-1 && !changeValue && !isActive && fixedHeight"
			class="table-item-content table-item-content-index"
			@click="toEdit">
			{{tableList[valueName] | clipFormat2(column.dd)}}
		</view>
		
		<!-- 包括 8 28 29 30 电话 邮箱 网址 公式 -->
		<textarea v-if="dtypeWenBen && dtypeWenBen.indexOf(column.cId)>-1 && isActive"
			class="table-item-content"
			:value="inputVal"
			:auto-height="true"
			:maxlength="-1"
			:focus="focus"
			@blur="onBlur"
			@confirm="onBlur"/>
	<!-- 	<input v-if="dtypeWenBen && dtypeWenBen.indexOf(column.cId)>-1 && isActive"
			class="table-item-content" type="text" 
			:value="inputVal"
			:focus="focus"
			@blur="onBlur"
			@confirm="onBlur"/> -->
			
		<!-- 数字 -->
		<input v-if="column.cId === 1 && isActive"
			class="table-item-content edit" type="number" 
			:value="inputVal"
			:focus="focus"	
			@blur="onBlur"
			@confirm="onBlur"/>		
			
		<!-- 文本 没有clen 默认短文本 有cLen 的为长文本  需要判断 最大字段长度 pc端256-->
		<wen-ben v-if="column.cId === 2"
			:column="column"
			:tableList="tableList"
			:tableId="tableList[tableIdName]"
			:columnId="column.column_id"
			:valueName="valueName"
			:tmpTableId="tmpTableId"
			:tabletype="tabletype"			
			:cellInfo="cellInfo">			
		</wen-ben>	
				
		<!-- 日期时间 -->
		<date-time v-if="column.cId === 4"
			:column="column"
			:tableList="tableList"
			:tableId="tableList[tableIdName]"
			:columnId="column.column_id"
			:valueName="valueName"
			:tmpTableId="tmpTableId"
			:tabletype="tabletype"		
			:cellInfo="cellInfo">
		 </date-time>
		
		<!-- 单选 -->		
		<dan-xuan v-if="column.cId === 5"
			:column="column"
			:tableList="tableList"
			:tableId="tableList[tableIdName]"
			:columnId="column.column_id"
			:valueName="valueName"
			:tmpTableId="tmpTableId"
			:tabletype="tabletype"	
			:cellInfo="cellInfo">
		</dan-xuan>
		
		<!-- 多选 -->
		<duo-xuan v-if="column.cId === 6"
			:column="column"
			:tableList="tableList"
			:tableId="tableList[tableIdName]"
			:columnId="column.column_id"
			:valueName="valueName"
			:tmpTableId="tmpTableId"
			:tabletype="tabletype"			
			:cellInfo="cellInfo">
		</duo-xuan>

		<!-- 引用 -->
		<yin-yong v-if="column.cId === 7"
			:column="column"
			:tableList="tableList"
			:tableId="tableList[tableIdName]"
			:columnId="column.column_id"
			:valueName="valueName"
			:tmpTableId="tmpTableId"
			:tabletype="tabletype"		
			:cellInfo="cellInfo">
		</yin-yong>
			
		<!-- 电话 8  加自动拨号-->
		<view class="mask-call" v-if="showCallMask" @tap='phoneCall'></view>
			
		<!-- 附件 10 -->
		<upload-file v-if="column.cId === 10"
			:column="column"
			:tableList="tableList"
			:tableId="tableList[tableIdName]"
			:columnId="column.column_id"
			:valueName="valueName"
			:tmpTableId="tmpTableId"
			:tabletype="tabletype"			
			:cellInfo="cellInfo">
		</upload-file>
		
		<!-- 定位 11-->
		<input v-if="column.cId === 11 && !isActive"
			class="table-item-content" type="text" :disabled="true"
			:value="changeValue?changeValue:tableList[valueName]"
			@click="toEdit" />
		<view v-if="column.cId === 11 && isActive" 
			class="table-item-content" @click="getLocation">
		</view>
			
		<!-- 自动编号 12-->
	
		<!-- 级联 14 -->
		<Cascade v-if="column.cId === 14"
			:column="column"
			:tableList="tableList"
			:tableId="tableList[tableIdName]"
			:columnId="column.column_id"
			:valueName="valueName"
			:tmpTableId="tmpTableId"
			:tabletype="tabletype"	
			:cellInfo="cellInfo">
		</Cascade>
		
		<!-- 员工单选 21-->
		<yuan-gong v-if="column.cId == 21"
			:column="column"
			:tableList="tableList"
			:tableId="tableList[tableIdName]"
			:columnId="column.column_id"
			:valueName="valueName"
			:tmpTableId="tmpTableId"
			:tabletype="tabletype"
			:cellInfo="cellInfo">
		</yuan-gong>
		
		<!-- 员工多选组件 22-->
		<yuan-gongs v-if="column.cId == 22"
			:column="column"
			:tableList="tableList"
			:tableId="tableList[tableIdName]"
			:columnId="column.column_id"
			:valueName="valueName"
			:tabletype="tabletype"
			:cellInfo="cellInfo">
		</yuan-gongs>	
		<!-- 多选引用 26-->
		
		<!-- 百分数 27 -->
			
		<!-- 邮箱 28-->
			
		<!-- 网址 29-->
		<view class="mask-call" v-if="showWebMask" @tap='openBrowser'></view>
			
		<!-- 公式 30 -->
					
		<!-- 判断 31-->
		<checkbox-group v-if="column.cId === 31"
			class="table-item-content" 
			@change="panduanFun">
			<checkbox class="table-item-margin" value="是" :color="color" style="transform: scale(0.8);" :checked="changeValue?changeValue:tableList[valueName] ==='是'"/>		
		</checkbox-group>
		
		<!-- 时间长度 32-->
		
		<!-- 按钮类型 -->
		<text v-if="column.cId === 33 && tableList[valueName] == ''" class="table-item-content"></text>
		<view class="table-item-content" v-if="column.cId === 33 && tableList[valueName] != ''">
			<view class="btn-item table-item-margin" @tap="onBtnUpdate" v-if="tableList[valueName] || tableList[valueName]===0">
				<view class="btn-item-content">{{tableList[valueName]}}</view>
			</view>
		</view>
				
		<!-- 部门单选 34-->
		<bu-men v-if="column.cId == 34"
			:column="column"
			:tableList="tableList"
			:tmpData="tmpData"
			:tableId="tableList[tableIdName]"
			:columnId="column.column_id"
			:valueName="valueName"
			:tmpTableId="tmpTableId"
			:tmpId="tmpId"
			:pageId="pageId"
			
			:tabletype="tabletype"
			:cellInfo="cellInfo">
		</bu-men>
		
		<!-- 部门多选 35-->
		<bu-mens v-if="column.cId == 35"
			:column="column"
			:tableList="tableList"
			:tmpData="tmpData"
			:tableId="tableList[tableIdName]"
			:columnId="column.column_id"
			:valueName="valueName"
			:tmpTableId="tmpTableId"
			:tmpId="tmpId"
			:pageId="pageId"			
			:cellInfo="cellInfo">
		</bu-mens>
	</view>
</template>

<script>
	import validate from '@/common/methods/validate.js'
	import { updateButton } from '@/common/methods/index.js'
	import {mapState} from 'vuex'
	import danXuan from './Ddanxuan.vue'
	import duoXuan from './Dduoxuan.vue'
	import dateTime from './Ddatetime.vue'
	import yinYong from './Dyinyong.vue'
	import yuanGongs from './Dyuangongs.vue'
	import yuanGong from './Dyuangong.vue'
	import buMen from './Dbumen.vue'
	import buMens from './Dbumens.vue'
	import Cascade from './Dcascade.vue'
	import uploadFile from './DuploadFile.vue'
	import wenBen from './Dwenben.vue'
	export default{
		name:'tableItem',
		components:{
			danXuan,duoXuan,
			dateTime,
			yinYong,
			yuanGongs,yuanGong,
			buMen,buMens,
			Cascade,
			uploadFile,
			wenBen
		},
		props:{
			tmpData:Object,
			column:Object, //单条数据头信息
			tableList:[Object], //单条数据
			tabletype:[Number]
		},
		data(){
			return {
				dtypeInputShow:[1,8,27,28,29,30],
				dtypeWenBen:[8,27,28,29,30],
				dtypeUnEdit:[12,26,32],
				focus:false,
				inputVal:'',
				overWidth:false
			}
		},
		computed:{
			fixedHeight(){
				if(this.tabletype == 1 || this.tabletype ==2 || this.tabletype == 3){
					return true;
				}
			},
			valueName(){
				let valueName = '';
				if(this.tmpData.tmpTableId){
					if (this.tmpData.tmpTableId.indexOf('mix') > -1){
						valueName = this.column.columnName;		
					}else{
						valueName = this.tmpId+'__'+this.column.columnName;
					}
				}
				switch(Number(this.column.cId)){
					case 7 : return this.column.reltmpid+'__'+this.column.column_id+'__'+this.column.relcolumnname;
					case 21 : return valueName+'_name';
					case 34 : return valueName+'_dept';
					default : return valueName;
				}
			},
			//获取行ID名称
			tableIdName(){
				if(this.tmpData.tmpTableId){
					if (this.tmpData.tmpTableId.indexOf('mix') <0){
						return this.tmpId+'__id'
					}else{
						return 'id'
					}
				}
			},
			//列id
			columnId(){
				return this.column.column_id
			},
			//行id
			tableId(){
				if(this.tableList) return this.tableList[this.tableIdName];
			},
			tmpId(){
				if(this.tmpData) return this.tmpData.tmpId;			
			},
			pageId(){
				if(this.tmpData) return this.tmpData.pageId;	
			},
			tmpTableId(){
				if(this.tmpData) return this.tmpData.tmpTableId;
			},
			parentTable(){
				if(this.tmpData && this.tmpData.parentTable){
					return this.tmpData.parentTable
				}	
			},
			reltmpid(){
				if( this.tmpData.tmpTableId && this.tmpData.tmpTableId.indexOf('mix') >-1){
					return this.tmpData.reltmpid
				}
			},
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
						&& item.tmpTableId == this.tmpTableId
						&& item.columnId == this.columnId 
						&& item.tableId == this.tableId 
					){
						console.log(item.value)
						return item.value
					}
				}
			},
			isActive(){
				if( this.activeItem
					&& this.activeItem.tmpTableId == this.tmpTableId 
					&& this.activeItem.columnId == this.columnId 
					&& this.activeItem.tableId == this.tableId 
				){
					return true;
				}						
			},
			cellInfo(){
				return {
					fixedHeight:this.fixedHeight,
					tabletype:this.tabletype, //表格类型 主页表格
					tmpTableId:this.tmpTableId,
					cell:{
						tmpId:this.tmpId,
						pageId:this.pageId,
						parentTable:this.tmpData.parentTable,
						reltmpid:this.tmpData.reltmpid,
						reltableid:this.tmpData.reltableid
					},
					columnId:this.columnId,
					tableId:this.tableId,
					oldValue:this.value,
					column:this.column,
					ischange:this.column.bb,//是否可编辑 权限  bb为true  不可编辑
				}
			},
			showCallMask(){
				if(this.tabletype ==1 && !this.editable && this.column.cId ===8){
					return true;
				}
			},
			showWebMask(){
				if(this.tabletype ==1  && !this.editable && this.column.cId ===29){
					return true;
				}
			},
		},
		methods:{
			//判断选择
			panduanFun(e){
				let choose ='';
				if(e.detail.value[0]){
					choose = '是';
				}else{
					choose = '否';
				};
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{value:choose,isupdate:true},
				})
				// this.updateActiveItem({value:choose,isupdate:true});
				this.onInit()
			},
			toEdit(){
				this.focus = true;
				this.inputVal = this.value;
				this.$store.dispatch("changeActiveItem",{cellInfo:this.cellInfo})	
			},
			//附件 去上传页
			toUpload(){
				this.$store.dispatch("changeActiveItem",{cellInfo:this.cellInfo})	
				uni.navigateTo({
					url:'/pages/index/upload/upload'
				})
			},
			//input确认
			async onBlur(e){
				let newValue = e.detail.value;
				let result;
				if(this.column.cId === 8 && e.detail.value.length>0){
					if(e.detail.value.length == 11){
						result = await validate({phone:e.detail.value})
					}else{
						result = await validate({tel:e.detail.value})
					}
				}else if(this.column.cId === 29 && e.detail.value.length>0){
					result = await validate({website:e.detail.value})
					// if(!result) return;	
				}else if(this.column.cId === 28 && e.detail.value.length>0){
					result = await validate({email:e.detail.value})
					// if(!result) return;	
				}else{
					result = true;
				}
				if(!result){
					this.inputVal = e.detail.value;
					this.$nextTick(()=>{
						this.inputVal = '';
					})						
					return;
				} 
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{value:newValue,isupdate:true},
				})
				this.onInit()
			},
			onInit(){
				this.$nextTick(()=>{
					this.$store.commit("initActiveItem");	
				})				
			},	
			//点击按钮
			onBtnUpdate(){
				let params = {
						tmpId: this.tmpId,
						pageId: this.pageId,
						records: [{tableId: this.tableId, updateColumnIds: [this.columnId], updateValues: [this.value]}],
						columnid: this.columnId
				}
				updateButton(params).then(value=>{
					//重新获取maindat
					this.$emit('buttonChange')
				}).catch(error=>{})
			},
			//拨打电话
			phoneCall(){
				let phoneNumber = this.changeValue?this.changeValue:this.value;
				if(phoneNumber){
					uni.makePhoneCall({
					    phoneNumber: phoneNumber 
					});
				}
				
			},
			//打开网址
			async openBrowser(){
				let url = this.changeValue?this.changeValue:this.value;
				if(url){
					await validate({website:url}).catch(error=>{})
					//app中 就是打开外部浏览器
					// #ifdef APP-PLUS
					 plus.runtime.openURL(url);
					// #endif
					// 直接跳转
					// #ifndef APP-PLUS
					uni.navigateTo({
						url:'/pages/index/webSite/webSite?url='+url
					})
					// #endif	
				}		
			},
			getLocation(){
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.table-item{
		width: 100%;
		// flex:5 1 auto;	
		// color:$text-color-6;
		// font-size:$font-15;	
		// border-right:1rpx solid #ccc;
		// border-bottom:1rpx solid #ccc;
		position: relative;
	}
	// .table-item:last-child{
	// 	border-right: none;
	// },
	.mask-call{
		width: 100%;
		height:100%;
		position: absolute;
		z-index: 60;
		top:0;left:0;
		background-color: $mask-color-1;
	}	
	.btn-item{
		padding:0 10rpx;
		// font-size: $font-14;
		// color: $text-color-6;		
		border:1rpx solid #e7e7e7;
	
		border-radius: 8rpx;
		height: 48rpx;
		
		// margin-left:10rpx;
		// box-sizing: border-box;
		// background-color: transparent;
		white-space: nowrap;
		overflow: hidden;
	}
	.btn-item-content{
		line-height: 48rpx;
		// width: 2em;
	}

</style>
