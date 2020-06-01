import { getData } from '@/common/methods/index.js'

export default{
	state:{
		// listPageData:null,
		tableLists:[],
		tmpData:{},
		columns:[],
		columnsAll:[],
		menu:{}, //记录当前菜单信息
		rows:[], //记录新增的row 行id
		// current:1,
		size:22,
		// maxIndex:1, //当前最大current
		currentArr:[], //所有current集合
		pageId:'', //当前表pageId
		tmpId:'',
		//search记录 包含多个表
		searchCache:[],
		//详情表 table 
		detailTableId:'',
		//记录详情页是否发生修改 更新主页数据
		// hasupdate:false
	},
	getters:{
		totalPage(state){
			if(state.tmpData && state.tmpData.page && state.tmpData.page.totalPage){
				return state.tmpData.page.totalPage;
			}
		}		
	},
	mutations:{
		initPage(state){
		    state.tableLists.splice(0,state.tableLists.length)
		    state.tmpData = null;
		    state.columns.splice(0,state.columns.length);
		    state.columnsAll.splice(0,state.columnsAll.length);
		    state.menu = null; //记录当前菜单信息
		    state.rows.splice(0,state.rows.length);//记录新增的row 行id
		    // state.current = 1;
		    state.size = 22;
		    // state.maxIndex = 1; //当前current
		    state.currentArr.splice(0,state.currentArr.length), //所有current集合
		    state.pageId = ''; //当前表pageId
		    state.tmpId = '';
		    //search记录 包含多个表
		    state.searchCache.splice(0,state.searchCache.length)
		},
		initPageState(state){
			state.tableLists.splice(0,state.tableLists.length)
			state.columns.splice(0,state.columns.length);
			state.columnsAll.splice(0,state.columnsAll.length);
			state.rows.splice(0,state.rows.length);//记录新增的row 行id
			// state.current = 1;
			state.size = 22;
			// state.maxIndex = 1; //当前current
			state.currentArr.splice(0,state.currentArr.length), //所有current集合
			//search记录 包含多个表
			state.searchCache.splice(0,state.searchCache.length)
		},
		updateSearchCache(state,data){
			let findPage = false;
			for(let i=0;i<state.searchCache.length;i++){
				if(state.searchCache[i].tmpId === data.tmpId && state.searchCache[i].pageId === data.pageId){
					state.searchCache.splice(i,1,data);
					findPage = true;
					break;
				}
			}
			if(!findPage){
				state.searchCache.push(data);
			}
		},
		updateTableLists(state,data){
			state.tableLists.splice(0,state.tableLists.length,...data)
		},
		//添加空表
		unshiftTableLists(state,tableList){
			state.tableLists.unshift(tableList);
		},
		//分页加载
		getMoreTableLists(state,data){			
			state.tableLists.push(...data)
		},
		updateTmpData(state,data){
			state.tmpData = data;
		},
		updateColumns(state,data){
			if(data && data.columnsShow){
				state.columns.splice(0,state.columns.length,...data.columnsShow)
			}
			if(data && data.columnsAll){
				state.columnsAll.splice(0,state.columnsAll.length,...data.columnsAll)
			}	
		},
		updateMenu(state,data){
			state.menu = data;
			state.tmpId = data.tmpId;
			state.pageId = data.pageId;
		},
		pushRows(state,row){
			state.rows.push(row)
		},
		initRows(state){
			if(state.rows.length>0){
				state.rows.splice(0,state.rows.length)
			}
			if(state.tableLists && state.tableLists.length>0){
			   state.tableLists = state.tableLists.filter(v=>{
				   return v[state.tmpId+'__id'] >= 0;
			   });
			}
		},
		updateSize(state,data){
			state.size = data
		},
		//分页数据
		updateCurrentArr(state,data){
			if(data.current && data.current == 1){
				state.currentArr.splice(0,state.currentArr.length,data)
				state.tableLists.splice(0,state.tableLists.length,...data.tableLists)
			}else if(data.current && data.current > 1){
				let findIndex = false;
				for(let i=0;i<state.currentArr.length;i++){
					if(state.currentArr[i].current === data.current){
						state.currentArr.splice(i,1,data);
						findIndex = true;
						break;
					}
				}
				if(!findIndex){
					state.currentArr.push(data)
					state.currentArr.sort((a,b)=>{
						a=a.current;
						b=b.current;
						return a-b;
					})
				}
				//添加tableList
				if(state.currentArr && state.currentArr.length>0){
					state.tableLists.splice(0,state.tableLists.length);
					state.currentArr.forEach(v=>{
						state.tableLists.push(...v.tableLists)
					})
				}
			}
			// console.log(state.currentArr)							
		},
		// updatePageId(state,data){
		// 	state.pageId = data;
		// },
		// updateTmpId(state,data){
		// 	state.tmpId = data;
		// },
		updateDetailTableId(state,id){
			state.detailTableId = id;
		}
	},
	actions:{
		//获取数据
		changeData({state,commit},params){
			params.pageId = params.pageId || state.pageId;
			params.current = params.current;
			params.size = params.size || state.size;
			params.firstOpen = params.firstOpen || false;
			// params.phoneOpen = true;
			if(params.firstOpen){
				uni.showLoading({
					title: '数据加载中...',
					mask: true
				});
			}   
			return getData(params).then(data=>{
				uni.hideLoading();
				let tmpId = data.search.tmpId;
				let column = data.column;
				let columnsShow = [];
				if(data.column){
					columnsShow = data.column.filter(v=>Number(v.cc!== 0) );
				}		
				commit('updateColumns',{columnsShow:columnsShow,columnsAll:data.column});
				commit('updateCurrentArr',{
					current:data.page.currPage,
					tableLists:data.page.list
				})	
				commit('updateTmpData',data)
				return Promise.resolve(true);
			}).catch(error=>{ uni.hideLoading() })	
		},
		//获取更多分页数据
		getMoreData({state,getters,commit}){	
			//如果存在这页数据 如果筛选改变 清空数据记录
			let nextCurrent = state.currentArr[state.currentArr.length-1].current+1;
			if(nextCurrent && nextCurrent > getters.totalPage){
				uni.showToast({
					title:"没有更多数据",
					position:"bottom",
					icon:"none"
				})
				return;
			}
			let params = {
				pageId:state.pageId,
				current:nextCurrent,
				size:state.size,
				firstOpen:false,
				phoneOpen:true
			}		    
			if(state.tmpData && state.tmpData.search){
				if(state.tmpData.search.query){
					params.query = state.tmpData.search.query
				}
				if(state.tmpData.search.checkquery){
					params.checkquery = state.tmpData.search.checkquery
				}
				if(state.tmpData.search.children){
					params.children = state.tmpData.search.children
				}
			}	
			getData(params).then(data=>{
				if(data && data.page.list){
					commit('updateCurrentArr',{
						current:data.page.currPage,
						tableLists:data.page.list
					})	
				}
			}).catch(error=>{
				uni.showToast({
					title:"数据加载错误",
					icon:"none"
				})
			})	
		},
		//获取path的pageId
		async getPath({state,rootState,commit,dispatch,rootGetters}){
			// 菜单切换 清空数据
			commit('initPage');
			commit('initTable');
			let menu = rootGetters.menuFlat.filter(v=>v.path == rootState.login.path)[0];	
			if(menu){
				commit("updateMenu",menu); //pageId tmpId  menu
				let res = await dispatch('changeData',{pageId:menu.pageId,firstOpen:true});
				// console.log(res)
				if(res) return Promise.resolve(true);		
			}else{
				uni.showToast({
					title:'暂无法加载此页面',
					icon:'none'
				})		
			}
		},
		//添加
		addTableList({state,getters,commit}){
			let tableList = {};
			//新加tableId
			let row = -1;
			for(let i=-1;i<state.rows.length+1;i--){
				if(state.rows.indexOf(i)<0){
					row = i;
					break;
				}
			}
			tableList[state.tmpId+'__id'] = row;
	
			commit('pushRows',row)
			commit('unshiftTableLists',tableList)
		},
		//重置state
		resetState(state){
		
		}
	}
}