<template>
	<view class="tabs">
		<statusBar></statusBar>
		<!-- 返回键 -->
		<!-- 头部导航开始 -->
	   <scroll-view class="scroll-h" :scroll-x="true" :show-scrollbar="false" :style="'top:'+statusBarHeight+'px;'">  
		   <view class="tabs-box" @tap.stop.prevent="blurEdit">
			   <view v-for="(tab,index) in tabBars" :key="index"
					class="uni-tab-item" 
					:data-current="index"
					:id="index"
					@click="ontabchange">
					<text class="uni-tab-item-title" :class="activeIndex == index ? 'uni-tab-item-title-active' : ''">{{tab.tabName}}</text>
				</view>
			</view>
			<image class="btn-return" src="../../../static/images/return.png" @click="returnFun"></image>
	    </scroll-view>
		<!-- 头部导航结束 -->
	    <!-- 滑动页面部分开始 -->
	    <!-- <swiper :current="activeIndex" class="swiper-box" :duration="300" @change="onpagechange" :style="'height:'+windowHeight+'px;'"> -->
			<!-- 循环页面信息 pageLists -->
			 <!-- v-for="(page,index1) in tabBars" :key="index1" -->
	        <!-- <swiper-item class="swiper-item" v-for="(page,index1) in tabBars" :key="index1">		 -->
				<scroll-view scroll-y="true" :style="'height:'+swiperHeight+'px;padding-top:'+statusBarHeight+50+'px;'" 
					class="swiper-content" 
					@scroll="onItemchange"
					:scroll-top="scrollTopNum">
				    <!-- 表格详情部分 -->
					<table-detail />
					<!-- detail表格部分开始 -->				
					<block v-if="detailShow && detailData && detailData.length>0 " v-for="(detailPage,index2) in detailData" :key="detailPage.tmpTableId">
						<view class="table-title" v-if="detailPage.pageName" @click="toBlurEdit">
							{{detailPage.pageName}}
							<text class="table-title-query">({{detailPage.queryFieldName}})</text>
						</view>
						<view class="table-title" v-else @click="toBlurEdit">未命名</view>
						<Table
							:tabletype="2"
							:alwaysEdit="true"
							:footbarShow="true"
							@changeOrder="changeOrder"							
							@addTable="addTable"
							@updateTable="updateTable"
							@changeCurrent="changeCurrent"
							@removePageRow="removePageRow"
							:columns="detailPage.columnsShow"
							:tableLists="detailPage.page.list"
							:tmpData="detailPage"/>
					</block>
					<!-- mixed表格部分开始 -->
					<block v-if="detailShow && mixedData && mixedData.length>0 " v-for="(mixedPage,index3) in mixedData" :key="mixedPage.tmpTableId">
						<view class="table-title" v-if="mixedPage.pageName">{{mixedPage.pageName}}</view>
						<view class="table-title" v-else>未命名</view>
						<Table v-if="mixedPage.columnsShow && mixedPage.columnsShow.length>0"
							:tabletype="3"
							:alwaysEdit="true"
							:footbarShow="true"
							@changeOrder="changeOrder"							
							@addTable="addTable"	
							@updateTable="updateTable"
							@changeCurrent="changeCurrent"
							@removePageRow="removePageRow"
							:columns="mixedPage.columnsShow"
							:tableLists="mixedPage.page.list"
							:tmpData="mixedPage"/>
					</block>
					<view :style="'height:'+bottomHeight+'px;'"></view>
				</scroll-view>		
				<!-- detail部分结束 -->
	        <!-- </swiper-item> -->
	    <!-- </swiper> -->
		 <!-- 滑动页面部分开始 -->	
	</view>
</template>

<script>
	//isupdate  main表 还没有用
	import {getData,getRelation,saveTableAllData,getMixedData} from '@/common/methods/index.js'
    import tableDetail from '@/components/index/TableDetail.vue'
	import Table from '@/components/common/Table.vue'
	import statusBar from '@/components/unis/uni-status-bar/uni-status-bar.vue'
	import {mapState,mapGetters} from 'vuex'
	
    export default {
        components: {
            tableDetail,
			Table,
			statusBar
        },
        data() {
            return {
				tableLists:[],//主表数据
				tmpData:null,//主表模板数据
				columns:[], //主表表头
				activeGroup:'',
				master:[], //master数据数组集合
				detail:[], //detail数据数组集合
				mixed:[], //多对多数据数组集合
				mixedData:[],
                activeIndex: 0,   //选中master主表索引				
				tabBars:[
					{
						tabName:"全部信息",
						tabPage:{}
					}
				], //master 主表信息集合
				detailArray:[], //detail page信息 集合
				detailData:[],//detail表格所有数据 集合
				detailShow:true ,//控制detail表出现消失
				// rowsArr:[] ,//记录detail表新增时候的行Id,
				scrollTopNum:0, //监听页面滚动位置
				hasScrolled:false, //是否发生滚动
				swiperHeight:150, //swiper页面高度  
				statusBarHeight:0,
				windowHeight:667,
				bottomHeight:0,
				// detailMixedData:[] //所有数据
            }
        },
		computed:{
			...mapState({
				// optionData:state=>state.detail.detailOption,
				recordsAll:state=>state.table.recordsAll, //修改记录
				activeItem:state=>state.table.activeItem,  //是否有选项卡出现 页面需要上移动
				pageRowArr:state=>state.table.pageRowArr,
				addRows:state=>state.table.addRows,
				hasupdate:state=>state.page.hasupdate
			}),
			...mapGetters({
				'optionData':'detailOption'
			}),
			showCard(){
				if(this.activeItem && this.activeItem.showCard){
					return this.activeItem.showCard;
				}						
			},
			classId(){	
				if(this.activeItem && this.activeItem.classId){
					return this.activeItem.classId;
				}								
			}
		},
        onLoad(option) {
			// this.optionData = option;
			//设置默认主表
			this.tabBars[0].tabPage ={
					tabPage:"",
					params:{
						pageId:this.optionData.pageId,
						query:[{
							tmpId:this.optionData.tmpId,
							columnId:0,
							operator:"eq",
							value:this.optionData.tableId
						}]
					}						
			}
			let mainDataParams = JSON.parse(JSON.stringify(this.tabBars[0].tabPage.params));
			this.$store.dispatch('getMainData',mainDataParams).catch(error=>{
				uni.showToast({
					title:"详情加载失败",
					icon:"none"
				})
			})
			//获取tabbar  与 detail 信息
			this.getRelationData(this.optionData);	
			 //option是个对象 {tmpId: "1150", tableId: "4", pageId: "1083",index:"1"}
			this.getMixedDataFun(this.optionData);
			
			
        },
		watch:{
			showCard(newVal){
				if(newVal){	
					uni.createSelectorQuery().select('.'+this.classId).boundingClientRect((e)=>{
						if(e && e.top > 400){
							this.bottomHeight = 250;
							this.$nextTick(()=>{
								this.scrollTopNum = this.scrollTopNum + 250;	
								this.hasScrolled = true;
							})	
						}				
					}).exec()												
				}else{	
					if(this.hasScrolled){
						this.bottomHeight = 0;
						this.$nextTick(()=>{
							this.scrollTopNum = this.scrollTopNum - 250;
							this.hasScrolled = false;
						})	
					}					
				}
				
			}
		},
		onReady(){
			uni.getSystemInfo({
				success:(res)=>{
					this.windowHeight = res.windowHeight;
					this.swiperHeight = res.windowHeight - res.statusBarHeight - 50;
					this.statusBarHeight = res.statusBarHeight;
				}
			})
		},
        methods: {	
			toBlurEdit(){
				this.$store.commit("initActiveItem")
			},
			// 引用表分页切换
			changeCurrent(val){
				this.changeTableData(val)
			},
			//分页 更新
			changeTableData(val){
				if(val.tmpTableId && val.tmpTableId.indexOf('mix') < 0 ){
					let activePage = this.detailData.find((v)=>v.tmpTableId === val.tmpTableId);
					if(activePage){
						let params = JSON.parse(JSON.stringify(activePage.getParams))
						if(val.current) params.current = val.current;
						if(val.size) params.size = val.size;
						if(val.order) params.order = val.order;
						if(val.firstOpen){
							params.firstOpen = val.firstOpen;
						}else{
							params.firstOpen = false;
						}
						this.getOneData(params).then((data)=>{
							// activePage.page.list = data.page.list;
							if(data && data.page) activePage.page = data.page;				
						});	
					}
				}
				if(val.tmpTableId && val.tmpTableId.indexOf('mix') >-1 ){
					let params ={};
					if(val.tmpId) params.tmpId = val.tmpId;
					if(val.current) params.current = val.current;
					if(val.size) params.size = val.size;
					if(val.order) params.order = val.order;
					if(!params.tmpId){
						// let tmpTableId = val.tmpTableId;
						let tmpId = val.tmpTableId.split('_')[1];
						params.tmpId = tmpId;
					} 
					this.changeMixCurrent(params)
				}
			},
			getactivePage(tmpTableId){
				let activePage = {};
				if( tmpTableId.indexOf('mix') < 0){
					activePage = this.detailData.find((v)=>v.tmpTableId === tmpTableId)
				}else{
					// console.log(this.mixedData)
					activePage = this.mixedData.find((v)=>v.tmpTableId === tmpTableId)
				}
				return Promise.resolve(activePage)
			},
			//引用表添加功能
			addTable(val){	
				if(val.tmpTableId){
					this.getactivePage(val.tmpTableId).then(activePage=>{		
						this.getRow(activePage);
					}).catch(error=>{		
						uni.showToast({
							title:"添加失败1",
							icon:'none'
						})
						return;					
					})		
				}				
			},
			getRow(pageData){
				//新加tableId
				let row = -1;
				// console.log(pageData)
				if(this.addRows && this.addRows.length>0){			
					for(let r = row - this.addRows.length;r<this.addRows.length+1;r--){
						if(! this.addRows.includes(r)){
							 row = r;
							 break;
						}
					}
				}
				this.$store.commit("addAddRows",{
					row:row,
					tmpTableId:pageData.tmpTableId
				});	
				// console.log(pageData)
				//添加 tableId
				let tableList = {};
				if(pageData.tmpTableId.indexOf('mix') < 0){
					tableList[pageData.tmpId+'__id'] = row;
				}else{
					tableList['id'] = row;			
				}	
				pageData.page.list.unshift(tableList);
				// return Promise.resolve(true);
			},
			//删除负数的tablelist  清空本条row记录
			removePageRow(val){
				if(val.tmpTableId){
					let activePage = {};
					if( val.tmpTableId.indexOf('mix') < 0){
						activePage = this.detailData.find((v)=>v.tmpTableId === val.tmpTableId)
						if(!activePage) return;
						if(activePage && activePage.page.list){
							activePage.page.list= activePage.page.list.filter(v=>v[activePage.tmpId+'__id'] >= 0)
						}
					}else{
						activePage = this.mixedData.find((v)=>v.tmpTableId === val.tmpTableId)
						if(!activePage) return;
						if(activePage && activePage.page.list){
							activePage.page.list= activePage.page.list.filter(v=>v['id'] >= 0)
						}
					}								
				}
			},	
			//detail表 列排序
			changeOrder(val){
				this.changeTableData(val);
			},
			//更新detail表
			updateTable(val){
				val.firstOpen = true;
				this.changeTableData(val);
			},
			//获取detail单表数据
			getOneData(params){
				params.current = params.current || 1;
				params.size = params.size || 3;
				params.noLog = true;
				params.firstOpen = params.firstOpen || false;
				params.detaileLog = true;
				params.phoneOpen = true;
				return getData(params).then(data=>{	
					return Promise.resolve(data);
				}).catch(error=>{
					uni.showToast({
						title:"部分引用表加载有误",
						icon:"none"
					})
				})
			},
			//循环获取引用表数据
			async loopDetail(detailArray,callback){			
				let detailData=[];
				for(let n=0;n<detailArray.length;n++){
					detailArray[n].params.firstOpen = true;
					let data = await this.getOneData(detailArray[n].params);
					if(data){
						// console.log(data)
						data.parentTable = {
							parentTmpid:this.optionData.tmpId,
							parentTableid: this.optionData.tableId,
							childrenColumnid: detailArray[n].params.query[0].columnId				
						}
						let columnsShow = [];
						if(data.column){
							for(let v in data.column){
								// data.column[v].valueName = tmpId+'__'+column[v].columnName;
								// data.column[v].tableIdName = tmpId+'__id';							
								if(Number(data.column[v].cc) !== 0) columnsShow.push(data.column[v]);
							}
						}
						data.columnsShow = columnsShow;
						data.queryFieldName = detailArray[n].queryFieldName;
						data.getParams = detailArray[n].params;
						detailData.push(data);
					}
				}
				return Promise.resolve(detailData)
			},
			//获取引用数据
			getRelationData(option){
				getRelation(option).then(result=>{
					// console.log(result);
					this.master = result.master;
					this.detail =result.detail;
					//设置tabbar
					if(result.master && result.master.length>0){		
						result.master.forEach(v=>{
							if(v.page && v.page.length>0){
								this.tabBars.push({
									tabName:v.page[0].pageName,
									tabPage:{
										tabPage:v,
										params:{
											pageId:v.page[0].pageId,
											query:[{
												tmpId:v.queryTmpId,
												columnId:v.queryField,
												operator:"eq",
												value:v.queryFieldValue
											}]
										}	
									}							
								})	
							}		
						})		
					}
					//获取detail表数据
					if(result.detail && result.detail.length>0){
						result.detail.forEach((v,i)=>{
							v.page.forEach((val,index)=>{
								this.detailArray.push({
									detailPage:val,
									pageName:val.pageName,
									pageId:val.pageId,
									tmpId:v.queryTmpId,
									queryFieldName:v.queryFieldName,
									params:{
										pageId:val.pageId,
										query:[{
											tmpId:v.queryTmpId,
											columnId:v.queryField,
											operator:"eq",
											value:v.queryFieldValue
										}]
									}			
								});
							})
						})
					}
					this.loopDetail(this.detailArray).then(res=>{		
						this.detailData.splice(0,this.detailData.length,...res);	
					})
				}).catch(error=>{
					uni.showToast({
						title:"关联数据获取有误",
						icon:"none"
					})
				})
			},
			changeMixCurrent(val){
				let params = JSON.parse(JSON.stringify(this.optionData));
				// {"tmp_id":"1151","tableId":20,"pageSize":3,"pageNum":1,"oneTmpid":"","pageId":"1085"}
				params.tmp_id = params.tmpId || params.tmp_id;
				params.pageSize = val.size || 3;
				params.pageNum = val.current ||1;
				params.oneTmpid = val.tmpId;
				if(params.tmpId) delete params.tmpId;
				return getMixedData(params).then(data=>{
	
					let mixPage = this.mixedData.find((v)=>v.tmpId == val.tmpId)

					let newMix = data.find(val=>val.pagename === mixPage.pageName)
					// mixPage.page.list = newMix.mixData;
					let page = {
								totalCount:newMix.total,
								pageSize: newMix.size,
								currPage: newMix.current,
								list:newMix.mixData
							}
					mixPage.page = page;
				})
			},
			getMixedDataFun(data){
				let params = JSON.parse(JSON.stringify(this.optionData));
				// {"tmp_id":"1151","tableId":20,"pageSize":3,"pageNum":1,"oneTmpid":"","pageId":"1085"}
				params.tmp_id = params.tmpId || params.tmp_id;
				params.pageSize = data.size || 3;
				params.pageNum = data.current ||1;
				params.oneTmpid = '';
				if(params.tmpId) delete params.tmpId;
				return getMixedData(params).then(data=>{
					let mixedData = [];
					if(data && data.length>0){
						for(let n in data){
							if(data[n].head && data[n].head.length>0){
								let mixPage = {
									tmpId:data[n].head[0].tmpId,
									pageId:data[n].head[0].page_id,
									reltmpid:params.tmp_id,
									reltableid:params.tableId,
									tmpTableId:'mixed_'+data[n].head[0].tmpId+'_'+data[n].head[0].page_id,
									pageName:data[n].pagename,
									page:{
										totalCount:data[n].total,
										pageSize: data[n].size,
										currPage: data[n].current,
										list:data[n].mixData
									}
								}	
								let columnsAll = [];
								let columnsShow = [];
								for(let j in data[n].head){			
									if( Number(data[n].head[j].cc) !== 0){
										columnsShow.push(data[n].head[j]);	
									}
									columnsAll.push(data[n].head[j]);			
								}
								mixPage.columnsAll = columnsAll;
								mixPage.columnsShow = columnsShow;	
								mixedData.push(mixPage)
							}					
						}
					}
					this.mixedData = mixedData;
				})
			},
			//点击topbar事件 
            ontabchange(e) {
                let index = e.target.dataset.current || e.currentTarget.dataset.current;
				//接收绑定的pageid 获取数据		
                this.switchTab(index);//切换tab
            },
			//页面滑动改变事件
            onpagechange(e) {
				//console.log(e);
                let index = e.target.current || e.detail.current;
                this.switchTab(index);
            },
			
            switchTab(index) {
				// index 为字符串
                if (this.activeIndex == index) {
                    return;
                }
				this.switchTab1(index);
				//已经滑动了额
				if(this.recordsAll.length>0){
					uni.showModal({
					     content:'上页有未保存的修改，是否保存？',
						 cancelText:'不保存',
						 confirmText:'保存',
						 success:(res)=> {
						 	if(res.confirm){
								//保存所有表修改与添加
								this.$store.dispatch('saveTableAllData').catch(error=>{});
								//重新加载index
								this.$store.dispatch("changeData",{pageId:this.optionData.pageId})
								//检测是否有tableId为负数的行 然后移除
								this.$store.commit('initAllRows')	
								this.$store.commit('initTableState')
						 		//保存 修改
						 	}else if(res.cancel){
								// 不保存 直接返回
								this.$store.commit('initAllRows')	
								this.$store.commit('initTableState')
							}
						 }
					})
				}	           
            },
			switchTab1(index){
				//判断detail是否显示 只在主表显示
				index == 0 ? this.detailShow = true : this.detailShow = false;	
				this.activeIndex = index;
				//初始化主表滑动页 包括修改记录 不包括引用
				this.$store.dispatch('getMainData',this.tabBars[index].tabPage.params);
			},
			blurEdit(){
				this.$store.commit("initActiveItem");
				this.$store.commit("changeDeleteStatus",{tmpId:'',pageId:'',status:false});
			},
			//页面滑动改变 监听高度 移动左边选中项
			onItemchange(e){
				this.scrollTopNum = e.detail.scrollTop;
			},
			//返回
			returnFun(){
				if(this.recordsAll.length>0){
					uni.showModal({
					     content:'有未保存的修改，是否保存修改？',
						 cancelText:'不保存',
						 confirmText:'保存',
						 success:(res)=> {
						 	if(res.confirm){
								//保存所有表修改与添加
								this.$store.dispatch('saveTableAllData').catch(error=>{});
								this.$store.dispatch("changeData",{pageId:this.optionData.pageId})
						 		this.return1()
						 	}else if(res.cancel){
								// 不保存 直接返回
								this.return1()
							}
						 }
					})
				}else{
					this.return1()
				}				
			},
			return1(){
				//还原本页数据
				this.$store.commit('initTable')
				// #ifdef H5
				history.back(1);
				// #endif
				// #ifndef H5
				uni.navigateBack({
					delta:1
				})
				// #endif
				// navigateBack  h5时候刷新页面栈 丢失  返回不回去
			}
        },//methods结束
		onShow() {
			if(!this.loginState){
				this.$store.dispatch('changeMenuTree')
			}	
			console.log('onshow')
		},
		onUnload() {
			//还原本页数据
			this.$store.commit('initTable')
		}
   }
</script>

<style scoped lang="scss">
    /* #ifndef APP-PLUS */
    page {
        width: 100%;
        min-height: 100%;
        display: flex;
    }
    /* #endif */
    .tabs {
        flex: 1;
        flex-direction: column;
        overflow: hidden;
        background-color: #fff;
        /* #ifdef MP-ALIPAY || MP-BAIDU */
        height: 100vh;
        /* #endif */
    }
	.btn-return{
		width: 60rpx;
		height:60rpx;
		position:absolute;
		right:10rpx;
		top:0;bottom:0;
		margin-top:auto;
		margin-bottom:auto;
	}
    .scroll-h {
        width: 750rpx;
        height: 40px;
		display: flex;
        flex-direction: row;
        /* #ifndef APP-PLUS */
        white-space: nowrap;
        /* #endif */
        flex-wrap: nowrap;   	
		position: fixed;
		left:0;
		z-index:3;
		border-bottom:1rpx solid #eee;
		background-color: #fff;
    }
	.tabs-box{
		display: flex;
		flex-wrap: nowrap;
		padding-right:80rpx;
		padding-left:30rpx;
		box-sizing: border-box;
	}
	
    .uni-tab-item {
		height: 40px;
        /* #ifndef APP-PLUS */
        display: inline-block;
        /* #endif */
        flex-wrap: nowrap;  
    }
    .uni-tab-item-title {
        color: $text-color-5;
		display:inline-block;
		width:100%;
		height:100%;
        font-size: 32rpx;
		line-height:40px;
        flex-wrap: nowrap;
        /* #ifndef APP-PLUS */
        white-space: nowrap;
        /* #endif */
		padding-right: 30rpx;
		box-sizing:border-box;
    }
     /* 上面tabbar选中状态 */
    .uni-tab-item-title-active {
        color: $global-color;		
		box-sizing: border-box;
		// border-bottom:1rpx solid #ccc;
		border-radius:4rpx 4rpx 0 0;
		position: relative;
    }

    .swiper-box {
        flex: 1;
    }
    .swiper-item {
        flex: 1;
        flex-direction: row;
		padding-top: 20rpx;
    }
	.swiper-content{
		// box-sizing: border-box;
	}
	.table-title{
		text-align:center;
		margin:4rpx 0;
		font-size:$font-15;
		color:$uni-font-size-title;
		white-space:nowrap;
		overflow-x: auto;
		/* font-weight: bold; */
	}
	.table-title-query{
		font-size: $font-14;
		margin-left:6rpx;
	}
	
</style>

