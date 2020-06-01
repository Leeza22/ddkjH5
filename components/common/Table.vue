<template>
	<view class='table-wapper'>
		<!-- topbar操作栏 --> <!-- 删除操作 @click.stop.prevent="topBarClick"-->
		<view class="table-fixed topBar" v-if="fixedColumn " :style="fixedColumn?'top:'+statusBarHeight+'px;':''" @click="toBlurEdit">
				<view class="left">
					<text class="iconfont active-del" v-if="deleteStatus" @click="beforeActFun('del2')">&#xe626;</text>
					<text class="iconfont del-icon" v-if="!deleteStatus" @click="beforeActFun('del1')">&#xe626;</text>				
					<text class="iconfont" @click="beforeActFun('screen')">&#xe75e;</text>
				</view>
				<view class="center">
					<view class="top-title">
						<text v-if="tmpData && tmpData.pageName">{{tmpData.pageName}}</text>
						<text v-else>未命名</text>
					</view>
				</view>
				<view class="right">
					<text class="iconfont edit-btn" @click="beforeActFun('edit')" v-if="!hasRecords && !createState" :class="editable?'active-class':''">&#xe75f;</text>
					<text class="iconfont edit-btn active-class" @click="beforeActFun('save')" v-if="hasRecords || createState">&#xe618;</text>
					<text class="iconfont creat-btn" @click="beforeActFun('create')">&#xe60d;</text>
				</view>				
		</view>
		<!-- topbar操作栏 -->
		<!-- 表体展示开始-->
		<scroll-view scroll-x="true" :show-scrollbar="false" 
			class="table-scroll-body" >			
			<view class="table-height-box" :style="{'height':scrollList?listScrollHeight+40+'px':''}">
				<view v-if="!columns || columns.length<1" class="table-column-blank">暂无数据...</view>
				<view class="table-column" v-else>
					<!-- 全选删除选框 -->
					<checkbox-group class="table-checkbox check-all" v-if="deleteStatus" @change="delAllFun">
						<checkbox class="check-box" value="all" :color="color" :checked="checkAll" />
					</checkbox-group>
					<view class="column-item table-item-style"
						v-for="(column,index) in columns" :key="index"
						:style="'width:'+column.cc+'rpx;'">
						<text>{{column.columnShowname}}</text>
						<!-- 排序部分 -->
						<view class="sort-box" v-if="column.cId ===1 || column.cId === 4" @tap="orderFun(column.columnName,order)">
						</view>
					</view>		
				</view>	
				
				<!-- 表体展示数据部分 主页计算高度 详情页不计算 -->
				<scroll-view :scroll-y="scrollList?true:false" :show-scrollbar="false" 
					@scroll="onlistScroll" 
					:scroll-top="scrollTopNum"
					@scrolltolower="getMoreData"
					:style="[{'width':tableWidths+'rpx'},{'max-height':scrollList? listScrollHeight+'px':''}]" >		
				<!-- <view v-if="!tableLists || tableLists.length<1" class="tablelist-blank">暂无数据...</view> -->
						<view class="table-row" v-for="(tableList,index) in tableLists" :key="index" v-if="tableLists && tableLists.length>0">
							<!-- 删除选框 -->
							<checkbox-group class="table-checkbox check-item" v-if="deleteStatus" :data-value="tableList[tableIdName]" @change="checkItemFun">
								<checkbox class="check-box" value="1" :color="color" :checked="checkedItem.indexOf(tableList[tableIdName])>-1" />
							</checkbox-group>
							<!-- 删除选框 -->
							<view class="table-list">
								<view v-for="(column,i) in columns" :key="i" 
									class="table-item-border table-item-style" hover-class="active-item"										
									:style="'width:'+column.cc+'rpx;'" >
									<!-- 查看 -->
									<view class="mask-unEdit" v-if="!alwaysEdit && !editable" @click="toDetail(tableList[tableIdName])"></view>					
									<!-- 删除 -->
									<view class="mask-unEdit" v-if="deleteStatus || updateLimit && tableList[tableIdName] >=0 "></view>
									<!-- 可编辑表格 -->							
									<table-item
										:tabletype="tabletype"					
										:column="column"
										:tableList="tableList"
										:tmpData="tmpData"
										@buttonChange="updateParent">
									</table-item>													
								</view>
							</view>	
						</view>	
				</scroll-view>
				<view class="mask-tablecontent" @tap="toBlur"></view>
				<!-- 表体结束	 -->
			</view>
		</scroll-view>
		<!-- 表体展示结束 -->
		<!-- 表格下方操作栏 -->
		<view class="table-footBar" v-if="footbarShow">
			<!-- 操作按钮 -->
			<view class="handle-wapper">	
				<text class="handel-btn active-handel-btn" v-if="deleteStatus" @click="beforeActFun('del2')">删除</text>
				<text class="handel-btn" v-if="!deleteStatus" @click="beforeActFun('del1')">删除</text>
				<!-- <text class="iconfont edit-btn" @click="beforeActFun('edit')" v-if="!hasRecords" :class="editable?'active-class':''">修改</text> -->
				<text class="handel-btn edit-btn" @click="beforeActFun('save')" :class="hasRecords?'active-handel-btn':''">保存</text>
				<text class="handel-btn creat-btn" @click="beforeActFun('create')">添加</text>
			<!-- 	<text class="footBar-handle handle-del-active" v-if="deleteStatus" @click="delConfirm">删除</text>
				<text class="footBar-handle" v-else @click="delClickFun">删除</text>
				<view class="mask-handle-del" v-if="deleteStatus"></view> -->	
				<!-- <text class="footBar-handle" @tap="delClickFun">删除</text> -->
				<!-- <text class="footBar-handle" @click="saveFun">保存</text>
				<text class="footBar-handle" @click="addFun">添加</text> -->
			</view>
			<!-- 表格分页 -->
			<view class="pagination">
				<Pagination 
					:tmpTableId="tmpData.tmpTableId"
					:total="tmpData.page.totalCount" 
					:pageSize="tmpData.page.pageSize"
					:current="tmpData.page.currPage"
					:totalPage="tmpData.page.totalPage"
					:show-icon="true" 
					:sizes="[3,5,10]"
					@change="changeCurrent">
				</Pagination>
			</view>
		</view>
		<!-- 表格下方显示栏结束 -->	
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {updateData as updateDataRet,addTable as addTableRet,deleteTable,saveOneTable} from '@/common/methods/index.js'
	import topBar from "@/components/index/TopBar.vue";
	import Pagination from '../common/Pagination.vue'
	import tableItem from './TableItem.vue'
	import uniPopup from '@/components/unis/uni-popup/uni-popup.vue'
	export default{
		name:"Table",
		components:{
			topBar,
			tableItem,
			Pagination,
			uniPopup
		},
		props:{
			//表格数据
			tableLists:Array,
			tmpData:{},
			columns:Array,
			//顶部操作栏
			topbarShow:{
				type:Boolean,
				default:false
			},
			//底部操作栏
			footbarShow:{
				type:Boolean,
				default:false
			},
			//表格内容是否 可以编辑
			alwaysEdit:{
				type:Boolean,
				default:false
			},
			//表头固定
			fixedColumn:{
				type:[Boolean,String],
				default:false
			},
			//表体高度是否计算与滚动
			scrollList:{
				type:[Boolean,String,Number],
				default:false
			},
			//值为1 时 表示主页表格 展示clipValue
			tabletype:[String,Number]
		},
		data(){
			return{
				//popup 警告弹出类型
				type:'',
				//排序 1升 2降
				order:1,
				//删除项 集合
				checkedItem:[],
				//表格外遮罩高度
				maskHeight:10,
				//表头fixed 高度
				statusBarHeight:0,
				// tableScrollLeft:0
				listScrollHeight:400,
				scrollTopNum:0, //监听表格滚动位置
				hasScrolled:false, //是否发生滚动
				createState:false  //是否新增 有新增 编辑按钮要转变保存按钮
			}
		},
		computed:{
			//表格表体部分宽度
			tableWidths(){
				let widths = 0;
				if(this.columns && this.columns.length>0){
					for(let n in this.columns){
						widths +=  Math.floor(this.columns[n].cc);			
					}				
				}
				// 有删除列 宽度增加
				if(this.deleteStatus){
					widths += 80;
				}
				if(widths>= 750){
					return widths;
				}else{
					return 750;
				}
			},
			//是否全选状态 删除
			checkAll(){
				if(this.checkedItem.length === this.tableLists.length){
					return true
				}
			},	
			//删除状态
			deleteStatus(){		
				let deleteData = this.$store.state.table.deleteStatus;
				if(this.tmpData && deleteData.tmpTableId === this.tmpData.tmpTableId){
					return deleteData.status
				}			
			},
			//查看 跳转传值tmpId pageId
			tmpId(){
				if(this.tmpData) return this.tmpData.tmpId;			
			},
			pageId(){
				if(this.tmpData) return this.tmpData.pageId;	
			},
			//获取行ID名称
			tableIdName(){
				if(this.tmpData && this.tmpData.tmpTableId){
					if (this.tmpData.tmpTableId.indexOf('mix') <0){
						return this.tmpId+'__id'
					}else{
						return 'id'
					}
				}
			},
			//页面级权限 表格的column中的limit
			pagelimit(){
				if(this.columns && this.columns.length>0) return this.columns[0].limit;
			},
			updateLimit(){
				if(this.pagelimit.update == '1') return true;
			},		
			hasRecords(){
				if(this.recordsAll.length>0 || this.createState){
					let result = this.recordsAll.find(v=>v.tmpTableId == this.tmpData.tmpTableId);
					if(result) return true;
				}
			},
			showCard(){
				if(this.activeItem && this.activeItem.showCard){
					return this.activeItem.showCard;
				}						
			},
			classId(){	
				if(this.activeItem && this.activeItem.classId){
					return this.activeItem.classId;
				}								
			},
			...mapState({
				editable:state=>state.table.editable,//表格是否可编辑
				activeItem:state=>state.table.activeItem, //当前修改单元格
				recordsAll:state=>state.table.recordsAll, //编辑记录
				color:state=>state.color, //主题颜色
			})
		},
		mounted(){
			let system = uni.getSystemInfoSync();
			this.statusBarHeight = system.statusBarHeight;
			if(this.scrollList){
				// 130 40+40+50 +10空白
				this.listScrollHeight = system.windowHeight - system.statusBarHeight - 140;	
			}
		},
		watch:{
			activeItem(val){
				if(val && val.tmpTableId == this.tmpData.tmpTableId){
					if(val.showCard){
						uni.createSelectorQuery().select('.'+this.classId).boundingClientRect((e)=>{
							if(e && e.top > 400){
				                this.scrollTopNum  +=  250;
								this.hasScrolled = true;
							}						
						}).exec()
					}else{
						if(this.hasScrolled){
							this.scrollTopNum  -=  250;
							this.hasScrolled = false;
						}
					}
				}	
			}
		},
		methods:{
			toBlurEdit(){
				this.$store.commit('initActiveItem')
			},
			getMoreData(){
				this.$store.dispatch('getMoreData')
			},
			onlistScroll(e){
				this.scrollTopNum = e.detail.scrollTop;
			},
			changeCurrent(val){
				// {type: "next", current: 2}
				val.tmpTableId = this.tmpData.tmpTableId;
				val.tmpId = this.tmpData.tmpId;
				this.$emit("changeCurrent",val)
			},
			//删除的全选功能
			delAllFun(e){
				if(e.detail.value.length>0){
					let checkArr = [];
					this.tableLists.forEach(v=>{
						checkArr.push(v[this.tableIdName]);
					})
					this.checkedItem.splice(0,this.checkedItem.length,...checkArr);
				}else{
					this.checkedItem.splice(0,this.checkedItem.length);
				}
			},
			//单个选项改变时候  获取tableid 在选项中 添加获删除
			checkItemFun(e){
				let tableId = Number(e.target.dataset.value);
				if(e.detail.value.length>0){	
					this.checkedItem.push(tableId)
				}else{
					let i= this.checkedItem.indexOf(tableId);
					// console.log(i);
					if( this.checkedItem.length >1){
						this.checkedItem.splice(i,1);
					}else{
						this.checkedItem = []
					}		
				}
			},
			beforeActFun(val){
				if(val !='del2' && this.deleteStatus && this.checkedItem.length>0){
					uni.showModal({
						content:"有未完成删除操作，继续将取消删除操作？",
						confirmText:'继续',
						cancelText:'取消',
						success:(res) =>{
							if(res.confirm){
								this.delCancel()
								this.actFun(val)
							}
						}
					})
				}else if(val != 'save' && val != "create" && this.editable && this.recordsAll.length>0){
					uni.showModal({
						content:"有未保存编辑，继续将取消此前编辑？",
						confirmText:'继续',
						cancelText:'取消',
						success:(res) =>{
							if(res.confirm){
								this.afterSave()
								this.actFun(val)
							}
						}
					})
				}else if(val != 'del1' && val != 'del2' && this.deleteStatus){
					this.delCancel()
					this.actFun(val)
				}else if(val != 'edit' && val != 'save' && val !='create' && this.editable){
					this.afterSave()
					this.actFun(val)
				}else{
					this.actFun(val)
				}
			},
			//topbar 操作 编辑 添加 筛选
			async actFun(val){
				//编辑操作
				if(val ==='edit'){
					if(this.pagelimit.update == '1'){
						uni.showToast({
							title:'无修改权限',
							icon:'none'
						})
						return;
					}
					if(this.editable){
						this.saveFun().catch(error=>{});				
					}else{
						this.$store.commit("changeEditable",true)
					}
				}else if(val==='screen'){
					//筛选操作
					this.$store.commit('initActiveItem');
					this.$store.commit('changeEditable',false);
					this.$store.dispatch('getScreenData').catch(error=>{})	
					uni.navigateTo({
						url:'/pages/index/screen/screen'
					})			
				}else if(val === 'create'){
					if(this.pagelimit.create == '1'){
						uni.showToast({
							title:'无此操作权限',
							icon:'none'
						})
						return;
					};
					if(!this.editable){
						this.createState = true;
						this.$store.commit("changeEditable",true)	
					}					
					
					//新增  添加操作
					this.addFun();
				}else if(val === 'save'){
					this.saveFun().catch(error=>{});		
				}else if(val === 'del1'){
					if(this.pagelimit.delete == '1'){
						uni.showToast({
							title:'无此操作权限',
							icon:'none'
						})
						return;
					};
					this.delClickFun();
				}else if(val === 'del2'){
					if(this.pagelimit.delete == '1') return;
					this.delConfirm()
				}//save结束			
			},
			toBlur(){
				this.$store.commit("initActiveItem");
			},
			//更新数据  upData是 处理好的 需要更新的数据  单表保存
			async saveFun(){
				this.$store.commit('initActiveItem');	
				this.$store.commit('changeEditable',false);
				this.createState = false;
				let res = await this.$store.dispatch('saveOneTable',{
					tmpId:this.tmpData.tmpId,
					pageId:this.tmpData.pageId,
					tmpTableId:this.tmpData.tmpTableId
				}).catch(error=>{})	
				this.afterSave();
				if(res && res.isUpdate){
					this.updateParent();
				}
			},
			//保存时方法	
			afterSave(){
				// this.$store.commit('changeEditable',false);
				this.$store.commit("removeRecords",{tmpTableId:this.tmpData.tmpTableId});
				//检测是否有tableId为负数的行 然后移除
				this.$store.commit('initRows');	
				this.$store.commit("removePageRow",{tmpTableId:this.tmpData.tmpTableId})
				this.$emit('removePageRow',{tmpTableId:this.tmpData.tmpTableId});			
			},
			addFun(){
				this.scrollTopNum = 0;
				//新增  添加操作
				if(this.tabletype && this.fixedColumn){
					this.$store.dispatch('addTableList',{tmpTableId:this.tmpData.tmpTableId})
				}else{
					this.$emit("addTable",{tmpTableId:this.tmpData.tmpTableId});
				}
			},
			//触发父元素更新
			updateParent(){
				this.$emit("updateTable",{tmpTableId:this.tmpData.tmpTableId});
			},
			//排序功能
			orderFun(columnName,order){
				this.$emit("changeOrder",{
					tmpId:this.tmpId,
					pageId:this.pageId,
					order:order+'_'+columnName,
					tmpTableId:this.tmpData.tmpTableId,
				});
				if(order===1){
					this.order = 2;
				}else{
					this.order =1;
				}
			},
			// 跳转去查看页面
			toDetail(tableId){	
				this.$store.commit("updateDetailTableId",tableId);
				uni.navigateTo({
					url: '/pages/index/checkTable/checkTable'
				})			
			},
			//显示删除按钮
			delClickFun(){
				this.$store.commit("changeDeleteStatus",{status:true,tmpTableId:this.tmpData.tmpTableId});
			},
			//删除提示框
			delConfirm(){
				//没有删除项
				if(this.checkedItem && this.checkedItem.length<1){
					this.$store.commit("changeDeleteStatus",{tmpTableId:this.tmpData.tmpTableId,status:false})
				}else{
					uni.showModal({
					     content:'您确定删除已标记内容吗？',
						 cancelText:'取消',
						 confirmText:'删除',
						 success:(res)=> {
						 	if(res.confirm){
								this.delFun()								
						 	}else if(res.cancel){
								this.delCancel()
							}
						 }
					})
					// this.openPopup('center', 'tip');
				}
			},
			//删除数据
			async delFun(open){
				//进行删除
				if(this.checkedItem && this.checkedItem.length>0){
					for(let i in this.checkedItem){
						await deleteTable({
							tmpId:this.tmpId,
							tableId:this.checkedItem[i]
						}).catch(error=>{})
					}
					this.updateParent();
				}				
				// 关掉pop
				// this.$refs['show' + open].close();
				this.delCancel();
			},
			delCancel(){
				this.$store.commit("changeDeleteStatus",{
					tmpTableId:this.tmpData.tmpTableId,
					status:false
				})
				this.checkedItem.splice(0,this.checkedItem.length);
			}	
		},//method结束
		
		
	}
</script>

<style scoped lang="scss">  
	// 顶部操作栏
	.topBar{
		display: flex;
		flex-wrap: nowrap;
		justify-content:space-around;
		align-items: center;
		padding:0 20rpx;
		width: 100%;
		height:40px;
		box-sizing: border-box;
		background-color: #fff;
		position: relative;
	}
	.right,.left{
		width: 180rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.center{
		width: 220rpx;
		text-align: center;
	}
	.top-title{
		font-size: $font-16;
		color:$text-color-3;
		white-space: nowrap;
		overflow-x: auto;
	}
	.iconfont{
		height:100%;
		text-align: center;
		font-size:50rpx;
		line-height:40px;
		/* color:#666666; */
		color:$global-color;
		background-color: #fff;
	}
	 /* 暂时不做 */
	.active-class{
		color:#ff8d01;
		font-size:50rpx;
	}
	.mask{
		width: 100%;
		height: 40px;
		position: absolute;
		bottom:0;
		left:0;
		z-index:0;
		opacity: 1;
		background-color: $mask-color;
	}
	.table-height-box{
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.mask-tablecontent{
		flex-grow:1;
	}
	.sort-box{
		width:100%;
		height:100%;
		background-color: $mask-color;
		position: absolute;
		left:0;top:0;
		// border-top:1rpx solid #ccc;
		// border-bottom:1rpx solid #ccc;
		box-sizing: border-box;
	}
	.table-fixed{
		width: 100%;
		position: fixed;
		z-index: 88;
	}
	.table-scroll-body{
		// border-bottom:1rpx solid #eee;
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
		height:40px;
		line-height: 40px;
		// min-height: 40px;
		/* flex-grow,flex-shrink,flex-basis */
		flex-shrink: 0;
		// flex:3 1 auto;
		// padding:0 10rpx;
		font-size:32rpx;
		// font-size:30rpx;
		font-weight: 500;
		color:#fff;
		text-align:center;
		
		// box-sizing: border-box;
		overflow: hidden;
		white-space: nowrap;
		word-break: break-all;
		
		
		border-width: 1rpx;
		border-style:solid;
		border-color: $border-color;
		border-left:none;
	
		background-color: $global-color;
	}
	.column-item:last-child{
		border-right: none;
	}
	
	/* 删除时候 复选框等样式 */
	.table-checkbox{
		
	}
	.table-checkbox{
		width: 80rpx;
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.check-all{
		height:40px;
		background-color: $global-color;
		border-width: 1rpx;
		border-style:solid;
		border-color: $border-color;
		border-left:none;
		box-sizing: border-box;
	},
	.check-item{
		// height:64rpx;
		background-color: #fff;
		border-bottom:1rpx solid $border-color;
		border-right:1rpx solid $border-color;
		box-sizing: border-box;
	}
	.uni-checkbox-input{
		margin-right:0 !important;
	}
	.check-box{
		transform: scale(0.8);
		margin-left:8rpx;
	}
	/*单条数据样式*//*行 包括删除*/
	// .scoll-list{
	// 	display: inline-block;
	// 	width: auto;
	// }
	.table-row{
		display: flex;
	}
	.mask-unEdit{
		width: 100%;
		height: 100%;
		position: absolute;
		top:0;left:0;
		z-index:1;
		background-color: $mask-color;
	}
	/*行 不包含删除*/
	.tablelist-blank{
		height: $height-64;
		border-bottom: 1rpx solid $border-color;
		text-align: center;
		line-height: $height-64;
		box-sizing: border-box;
	}
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
	.table-list-del{
		width: 100%;
		display: flex;
		flex:1 1 auto;
		flex-wrap: nowrap;
		background-color: #fff;
		overflow-x: hidden;
	}
	/* 底部操作栏样式 */
	.table-footBar{
		height:64rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:0 20rpx 4rpx 20rpx
	}
	// .footBar-handle{
	// 	padding:0 10rpx;
	// }
	.handel-btn{
		padding:0 10rpx;
	}
	.active-handel-btn{
		color: $global-color;
	}
	.handle-del-active{
		color:#2298EF;
		position: relative;
		z-index: 10;
	}
	.handle-wapper{
		position: relative;
		// background-color: #F0AD4E;
	}
	.mask-handle-del{
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: $mask-color;
		top:0;left:0;
		z-index: 1;
	}
	
	
	.active-topbar{
		color:#ff7505;
		font-size:54rpx;
	}
	
	.del-icon{
		text-align: center;
		font-size:50rpx;
		line-height:40px;
		/* color:#666666; */
		color:$global-color;
	}
	 /* 暂时不做 */
	.active-del{
		color:#ff7505;
		font-size:54rpx;
		position:relative;
		z-index: 10;
	},
	.mask-del{
		width: 100%;
		height:40px;
		background-color: $mask-color;
		position:absolute;
		top:0;
		z-index:2;
	}
</style>
