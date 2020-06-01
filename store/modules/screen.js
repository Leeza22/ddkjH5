//条件筛选状态管理
import {getColumnSelects,getDept,getYuangong,getData,getViewColumns} from '@/common/methods/index.js'
export default{
	state:{	
		showCard:{
			bool:false,
			classId:''
		}, //选项卡 隐藏与消失
		//跳转筛选页时候 发送来单表search
		search:null, //此表的search 需要用筛选项 
		filterArray:[], //单选 多选 级联一层 按钮数据
		searchArray:[], //搜索项列集合
		deptList:[], //部门信息
		roleList:[],  //员工信息	
		// cearchlist:[],//获取筛选项时候附带的信息
		tmpId:'', //tmpId 使用 筛选模板判断
		pageId:'',
		//单表的筛选 筛选条件集合
		checkquery:[],
		query:[],
		children:[],
		columnsAll:[]
	},
	mutations:{
		initScreen(state){
			state.showCard.bool = false;
			state.search = null;
			state.filterArray.splice(0,state.filterArray.length);
			state.searchArray.splice(0,state.searchArray.length);
			state.deptList.splice(0,state.deptList.length);
			state.roleList.splice(0,state.roleList.length);
			state.tmpId='';
			state.pageId = '';
			state.checkquery.splice(0,state.checkquery.length);
			state.query.splice(0,state.query.length);
			state.children.splice(0,state.children.length)
		},
		updateEmptyConditions(state){
			state.emptyConditions = false
		},
		changeCondition(state,data){
			if(data && data.checkquery){
				state.checkquery = state.checkquery.filter(v=>v.columnId !== data.columnId);
				if(data.checkquery.length>0){
					state.checkquery.push(...data.checkquery);	
				}					
			}
			if(data && data.query){
				if(data.operator){
					state.query.forEach((v,i)=>{
						if(v.columnId == data.columnId && v.operator.charCodeAt() === data.operator.charCodeAt() ){
							state.query.splice(i,1)
						}		
					})
				}else if(!data.operator){
					state.query = state.query.filter(v=>v.columnId !== data.columnId);
				}
				if(data.query.length>0){
					state.query.push(...data.query);
				}				
			}
			if(data && data.children && data.children.length>0){
				//判断字符串为空 
				if(data.value.length<1){
					state.children.splice(0,state.children.length);
				}else{
					state.children.splice(0,state.children.length,...data.children);
				}
			}
			// console.log(state.query)
		},		
		//清空筛选条件
		emptyCondition(state){
			//清除 
			state.checkquery.splice(0,state.checkquery.length)
			state.children.splice(0,state.children.length)
			state.query.splice(0,state.query.length)
			state.emptyConditions = true;
		},
		updateShowCard(state,data){
			state.showCard.bool = data.bool;
			state.showCard.classId = data.classId;
		},
		//筛选列
		updateFilterArray(state,data){
			if(data && data.length>0){
				state.filterArray.splice(0,state.filterArray.length,...data)
			}	
		},
		//搜索列
		updateSearchArray(state,data){
			if(data && data.length>0){
				state.searchArray.splice(0,state.searchArray.length,...data)
			}		
		},
		updateSearch(state,data){
			state.search = data;
			if(data && data.checkquery && data.checkquery.length>0){
				state.checkquery = data.checkquery
			}else{
				state.checkquery.splice(0,state.checkquery.length)
			}
			if(data && data.query && data.query.length>0){
				state.query = data.query
			}else{
				state.query.splice(0,state.query.length)
			}
			if(data && data.children && data.children.length>0){
				state.children = data.children
			}else{
				state.children.splice(0,state.children.length)
			}
			if(data && data.tmpId){
				state.tmpId = data.tmpId;
			}
			if(data && data.pageId){
				state.pageId = data.pageId;
			}
			// console.log("search",state.children)
		},
		updateColumnsAll(state,data){
			if(data) state.columnsAll.splice(0,state.columnsAll.length,...data);
			// console.log(data)
		},
		// updateCheckquery(state,data){
		// 	if(data && data.checkquery && data.checkquery.length>0){
		// 		state.checkquery = data.checkquery
		// 	}		
		// },
		// updateQuery(state,data){
		// 	if(data && data.query && data.query.length>0){
		// 		state.query = data.query
		// 	}	
		// },
		// updateChildren(state,data){
		// 	if(data && data.children && data.children.length>0){
		// 		state.children = data.children
		// 	}
		// },
		// updateTmpId(state,data){
		// 	if(data && data.tmpId){
		// 		state.tmpId = data.tmpId;
		// 	}
		// },
		// updatePageId(state,data){
		// 	state.pageId = data;
		// },
		updateDeptList(state,data){
			if(data && data.length>0){
				state.deptList.splice(0,state.deptList.length,...data)
			}	
		},
		updateRoleList(state,data){
			if(data && data.length>0){
				state.roleList.splice(0,state.roleList.length,...data)
			}	
		}
		
	},
	actions:{
		async getScreenData({ state,rootState,commit,dispatch }){
				// console.log(rootState.page.pageId,rootState.page.tmpId,rootState.page.tmpData.search)
			commit('updateSearch',rootState.page.tmpData.search)
			let search = [2,7,26]; //文本 引用 多选引用
			let screen = [1,4,5,6,14,21,22,31,33,34,35];//可作为筛选项的类型集合
			let filterArray = [];
			let searchArray = [];
						
			let filterColumnId=[];
			//获取选项
			if(rootState.page.tmpData.search){
				const selectsData = await getColumnSelects(rootState.page.tmpData.search).catch(error=>{
					uni.showToast({
						title:"选项获取失败",
						icon:"none"
					})
				})
				// console.log(selectsData)
				if(selectsData && selectsData.length>0){
					selectsData.forEach(v=>{
						if(v.isfilter && v.templateColumn && v.templateColumn.cId && screen.indexOf(v.templateColumn.cId)>-1){
							filterArray.push(v)
							filterColumnId.push(v.columnId)
						}
						// else{
						// 	//包含非筛选项 与文本 引用等								
						// 	searchArray.push(v);
						// }
					})
				}
				//赋值 筛选项赋值
				commit('updateFilterArray',filterArray);
				//获取 搜索项 
				const viewColumns = await getViewColumns({pageId:rootState.page.tmpData.search.pageId}).catch(error=>{})
				if(viewColumns){
					searchArray = viewColumns.filter(v=>!filterColumnId.includes(v.column_id))
				}
				commit('updateSearchArray',searchArray)	
			}
			return Promise.resolve(true)
		},
		getDeptData({commit}){
			return getDept().then(data=>{
				commit('updateDeptList',data)
				return new Promise(resolve=>resolve())
			}).catch(err=>{
				//获取失败暂不处理
				uni.showToast({
					title:"获取部门选项失败",
					icon:"none"
				})
			})
		},
		getRoleList({commit},columnId){
			return getYuangong(columnId).then(data=>{
				commit('updateRoleList',data.data)
				return new Promise(resolve=>resolve())
			}).catch(err=>{
				//获取失败暂不处理
				uni.showToast({
					title:"获取员工选项失败",
					icon:"none"
				})
			})
		}		
	}
}