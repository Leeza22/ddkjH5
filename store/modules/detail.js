import { getData } from '@/common/methods/index.js'
export default{
	state:{
		// detailOption:{}, //当前列 信息 从主页传来参数
		tableList:{},//主表数据
		tmpData:null,//主表模板数据
		columns:[], //主表表头	
		activeGroup:'',//当前分组
		params:{}, //当前详情列 的获取参数 不带groupName
		groupDataArr:[] //存放分组信息
	},
	getters:{
		detailOption(state,getters,rootState){		
			let option = {
				tmpId:rootState.page.tmpId,
				pageId:rootState.page.pageId,
				tableId:rootState.page.detailTableId
			}
			return option;		
		},
		Group(state){
			if(state.tmpData && state.tmpData.Group && state.tmpData.Group.length>0){
				return state.tmpData.Group;
			}
		},
	},
	mutations:{
		//切换master 前后 清空；
		initDetailData(state){
			state.tableList = {};
			state.tmpData = null;
			state.columns.splice(0,state.columns.length);
			state.activeGroup = '';
		},
		updetailTableList(state,data){
			if(data.page.list && data.page.list.length>0){
				state.tableList = data.page.list[0]
			}else{
				state.tableList = {};
			}	
		},
		updetailColumns(state,data){
			if(data && data.length>0){
				state.columns.splice(0,state.columns.length,...data);	
			}else{
				state.columns.splice(0,state.columns.length);
				state.tableList = {}
			}
			console.log(state.columns)
		},
		upActiveGroup(state,data){
			state.activeGroup = data;
		},
		updetailTmpData(state,data){
			state.tmpData = data;
			if(data.columnsShow && data.columnsShow.length>0){
				 state.columns.splice(0,state.columns.length,...data.columnsShow);
			}else{
				state.columns.splice(0,state.columns.length);
			}
			if(data.page.list && data.page.list.length>0){
				state.tableList = data.page.list[0]
			}else{
				state.tableList = {};
			}
			// console.log("columns")
		},//主表模板数据
		updetailParams(state,data){
			state.params = data;
		}
	},
	actions:{
		//获取主表信息
		getMainData({commit},params){
			params.noLog = true;
			params.openDetail = true;
			commit("updetailParams",params);    
			return getData(params).then(data=>{	
				if(data.column){
					let columnsShow = [];
					for(let v in data.column){
						if(data.Group && data.Group.length>0){
							// console.log(data.column[v].group_name,data.Group[0])
							if(data.column[v].group_name && data.column[v].group_name === data.Group[0]){
								columnsShow.push(data.column[v]);
							} 
							commit("upActiveGroup", data.Group[0]);
						}else{
							// if(Number(data.column[v].cc) !== 0)
							columnsShow.push(data.column[v]);
							commit("upActiveGroup",'');
						}			
					}
					data.columnsShow = columnsShow;
				}
				commit("updetailTmpData",data);
				return Promise.resolve(true);
			}).catch(error=>{
				console.log(error);
				commit("initDetailData")
				uni.showToast({
					title:'详情获取失败',
					icon:'none'
				})
			})		
		},
		//分组切换
		changeMainGroup({state,commit},group){
			if(!group){
				uni.showToast({
					title:'缺少分组信息',
					icon:'none'
				})
				return Promise.reject();
			} 
			commit("upActiveGroup", group);
			let params = Object.assign({},state.params,{groupName:group})
			commit("updetailParams",params);
			return getData(params).then(data=>{
				commit('updetailTableList',data)
				commit("updetailColumns",data.column)
				return Promise.resolve(true)
			}).catch(error=>{
				uni.showToast({
					title:'分组切换失败',
					icon:'none'
				})
			})	
		},
		//更新tableList
		changeMainTableList({state,getters,commit,dispatch}){
			//记录是否发生更新
			if(state.params.pageId == getters.detailOption.pageId){
				// console.log('changeData')
				dispatch("changeData",{pageId:getters.detailOption.pageId})				
				// commit("updetailHasupdate",true);
			}	
			let params = state.params; //默认
			return getData(params).then(data=>{
				commit("updetailTableList",data)
				return Promise.resolve(true);	
			}).catch(error=>{
				uni.showToast({
					title:'刷新失败',
					icon:'none'
				})
			})	
		}
	}
}