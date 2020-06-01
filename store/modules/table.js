// 数据编辑状态管理  不能依赖单个value变化 展示数据有问题
import { getDept,getColumnSelects,updateData,addTable,addMixed } from '@/common/methods/index.js'
export default{
	state:{
		editable:false,//记录表格topbar中是否可编辑
		deleteStatus:{tmpId:'',pageId:'',status:false,tmpTableId:''}, //记录表格topbar中是否可删除
		//修改数据数据集合 不同表
		// updateDataArray:[],
		// {"tmpId":"352","records":[{"tableId":48,"updateColumnIds":[1000,2129,1047],"updateValues":["1","111","女"]}],"pageId":"75"}
		activeItem:null, //单前单元格信息记录 **	 {tmpId:tmpId,pageId:pageId,cId:this.cId,tableId:this.tableId,value:value,ischange:ischange};
		detailArray:[],  //查看页的detail数据 分页切换再次请求时候使用
		recordsAll:[], // 所有更改记录
		addRows:[], //所有行id集合
		pageRowArr:[],//新增 行id 与表对应关系记录
		deptData:[], //这不区分页面
		columnSelectsArr:[],//这区分页面
		popshow:null //控制分页显示隐藏
	},
	mutations:{	
		initTable(state){
			state.editable = false;
			state.deleteStatus = false;
			state.activeItem = null;
			state.detailArray.splice(0,state.detailArray.length);
			state.recordsAll.splice(0,state.recordsAll.length);
			state.deptData.splice(0,state.deptData.length);
			state.columnSelectsArr.splice(0,state.columnSelectsArr.length)
			state.popshow = null;
		},
		initTableState(state){
			state.editable = false;
			state.deleteStatus = false;
			state.activeItem = null;
			state.recordsAll.splice(0,state.recordsAll.length);
			state.deptData.splice(0,state.deptData.length);
			state.columnSelectsArr.splice(0,state.columnSelectsArr.length)
			state.popshow = null;
		},
		changePopshow(state,data){	
			state.popshow = data;
		},
		changeEditable(state,status){
			state.editable = status;
			if(!state.editable){
				state.recordsAll.splice(0,state.recordsAll)
			}
		},
		changeDeleteStatus(state,data){
			state.deleteStatus = data;
		},
		removeRecords(state,data){
			state.recordsAll = state.recordsAll.filter(v=>v.tmpTableId !== data.tmpTableId)
		},
		//初始化单元格记录
		initActiveItem(state){
			state.activeItem = null;
		},
		updateActiveItem1(state,data){
			state.activeItem = data;
		},
		updateRecordsAll(state,data){
			if(!data) return;
			let findItem = false;
			for(let i in state.recordsAll){
				if(state.recordsAll[i].tmpTableId == data.tmpTableId 
					&& state.recordsAll[i].tableId == data.tableId
					&& state.recordsAll[i].columnId == data.columnId){
						state.recordsAll[i] = data;
						findItem = true;
						break;
					}
			}
			if(!findItem) state.recordsAll.push(data);		
			// console.log(state.recordsAll)
			//检查value 是否存在  或者等于原先oldvalue  移除  value 为数组或者字符串
			// state.recordsAll = state.recordsAll.filter(v=> v.value!='' || v.value.length<1 || v.value !== v.oldValue);
			// this.commit('changeTableLists',state.recordsAll)		
		},
		//单元格点击时 赋值
		updateActiveItem(state,data){
			state.activeItem = data;
			//如果是改变数据，添加记录
			// if(!data.value && data.value!== 0){
			// 	return;				
			// }
			// console.log(data)
			if(data.isupdate){
				let findItem = false;
				for(let i in state.recordsAll){
					if(state.recordsAll[i].tmpTableId == data.tmpTableId 
						&& state.recordsAll[i].tableId == data.tableId
						&& state.recordsAll[i].columnId == data.columnId){
							state.recordsAll.splice(i,1,data)
							// state.recordsAll[i] = data;
							findItem = true;
							break;
						}
				}
				if(!findItem) state.recordsAll.push(data);											
				//检查value 是否存在  或者等于原先oldvalue  移除  value 为数组或者字符串
				// state.recordsAll = state.recordsAll.filter(v=> v.value!='' || v.value.length<1 || v.value !== v.oldValue);
				// this.commit('changeTableLists',state.recordsAll)
			}
			// console.log(state.recordsAll)
		},
		addAddRows(state,data){
			if(data){
				if(!state.addRows.includes(data.row)) state.addRows.push(data.row);
				if(state.pageRowArr && state.pageRowArr.length>0){
					let pageRow = state.pageRowArr.find(v=>v.tmpTableId === data.tmpTableId);
					if(pageRow){
						if(pageRow.rows){
							if(pageRow.rows.includes(data.row)){
								console.log("报错")
							}
							pageRow.rows.push(data.row);				
						}else{
							pageRow.rows = [data.row];
						}
					}else{
						state.pageRowArr.push({
							tmpTableId:data.tmpTableId,
							rows:[data.row]
						})
					}
				}
			}
		},
		//移除单个表 rows
		removePageRow(state,data){
			// if(data &&  state.pageRowArr){
				for(let n in state.pageRowArr){
					if(state.pageRowArr[n].tmpTableId == data.tmpTableId){
						let rows = state.pageRowArr[n].rows;
						state.addRows = state.addRows.filter(v=>rows.indexOf(v) < 0)
						console.log(state.addRows)
						state.pageRowArr.splice(n,1);
						break;
					}
				}
			// }
		},
		//清空所有rows
		initAllRows(state){
			state.addRows.splice(0,state.addRows.length);
			state.pageRowArr.splice(0,state.pageRowArr.length);		
		},
		updateYinyongData(state,data){
			state.yinyongData = data;
		},
		updateDetailArray(state,data){
			state.detailArray = data;
		},
		updateDeptData(state,data){
			if(data && data.length>0){
				state.deptData.splice(0,state.deptData.length,...data)
			}
		},
		updateColumnSelectsArr(state,data){
			if(data.data && data.data.length>0){
				let findIndex = false;
				for(let n in state.columnSelectsArr){
					if(state.columnSelectsArr[n].tmpTableId == data.tmpTableId){
						state.columnSelectsArr.splice(n,1,data);
						findIndex = true;
						break;
					}
				}
				if(!findIndex){
					state.columnSelectsArr.push(data);
				}		
			}
		}
		
	},
	actions:{
		getDeptData({commit}){
			return getDept().then(data=>{	
				commit('updateDeptData',data)
				return Promise.resolve(true);			
			}).catch(err=>{})
		},
		getColumnSelects({commit},params){
			return getColumnSelects({pageId:params.pageId}).then(data=>{
				commit('updateColumnSelectsArr',{pageId:params.pageId,data:data,tmpTableId:params.tmpTableId})
				// console.log(data)
				return Promise.resolve(data);			
			}).catch(err=>{})
		},
		changeActiveItem({state,commit},params){	
			if( params.cellInfo && params.cellInfo.ischange){
				uni.showToast({
					title:'无修改权限',
					icon:"none"
				})
				return;
			}
			let activeItem = params.cellInfo;
			if(params.cellparams){
				activeItem = Object.assign({},params.cellInfo,params.cellparams)
			}
			//如果信息中有undefined  不进行编辑
			if( activeItem.tmpTableId == undefined
				|| activeItem.columnId == undefined
				|| activeItem.tableId == undefined
			){
				uni.showToast({
					title:"信息有误,无法操作",
					icon:"none"
				})
				return;
			}
			//修改当前单元格
			// commit('updateActiveItem1',activeItem)
			//如果是改变数据，添加记录
			// if(!data.value && data.value!== 0){
			// 	return;				
			// }
			// console.log(data)
			//添加修改记录
			// if(activeItem.isupdate){
			// 	commit('updateRecordsAll',activeItem)
			// 	commit('changeTableLists',activeItem)
			// }
			commit('updateActiveItem',activeItem)
		},
		//保存编辑修改新增 {recordsAll:recordsAll,tmpId:tmpId,pageId:pageId,tmpTableId:''}
		async saveOneTable({state,dispatch},params){
			if(!params.recordsAll) params.recordsAll = state.recordsAll;
			let result = await dispatch('getOneSaveRecords',params).catch(error=>{
				uni.showToast({
					title:'无更新数据',
					icon:"none"
				})		
			});
			//result没有结果不执行
			let isUpdate = false; //记录是否发生更新		
			//更新数据
			if(result.upData && result.upData.records && result.upData.records.length>0){
				let res = await updateData(result.upData).catch(error=>{});	
				if(res){
					isUpdate = true;
					uni.showToast({
						title:"修改成功",
						icon:"none"
					})
				}
			}
			//新增数据整理
			if(result.addData && result.addData.length>0){
				let res = await addTable(result.addData).catch(error=>{});
				if(res){
					isUpdate = true;
					uni.showToast({
						title:"新增成功",
						icon:"none"
					})
				}							
			}
			//新增数据整理
			if(result.addMixedData && result.addMixedData.length>0){
				let res = await addMixed(result.addMixedData).catch(error=>{});
				if(res){
					isUpdate = true;
					uni.showToast({
						title:"新增成功",
						icon:"none"
					})
				}							
			}
			return Promise.resolve({isUpdate:isUpdate})
		},
		// 所有 编辑保存数据
		async saveTableAllData({state,dispatch}){		
			let tableArr = [];
			for(let i in state.recordsAll){
				let findTable = false;
				for(let j in tableArr){
					if(tableArr[j].tmpTableId == state.recordsAll[i].tmpTableId){
						tableArr[j].records.push(state.recordsAll[i]);
						findTable = true;
						break;
					}
				}
				if(!findTable){	
					tableArr.push({
						tmpTableId:state.recordsAll[i].tmpTableId,
						tmpId:state.recordsAll[i].cell.tmpId,
						pageId:state.recordsAll[i].cell.pageId,
						recordsAll:[state.recordsAll[i]]
					})
				}
			}
			if(tableArr && tableArr.length>0){
				for(let k in tableArr){
					let data = await dispatch('saveOneTable',tableArr[k])			
				}
				commit('initRows')
				commit('initAllRows')	
				commit('initTableState')
				return Promise.resolve({isUpdate:true});
			}		
		},
		//整理获取 单表编辑保存数据
		getOneSaveRecords({state,commit},params){		
			let upData = {tmpId:params.tmpId,pageId:params.pageId,records:[]};
			let addData = [];
			params.recordsAll.forEach(v=>{
				//修改的数据 一个表
				if(v.tmpTableId === params.tmpTableId &&  v.tableId >= 0){	
					if(typeof v.value === 'string' && v.value.length == 0) v.value = null;
					let findTableId = false;
					for(let j=0;j<upData.records.length;j++){ 
						if(upData.records[j].tableId === v.tableId){ //如果records中有tableId 行
							let findColumnId = false;
							for(let k=0;k<upData.records[j].updateColumnIds.length;k++){ 
								if( upData.records[j].updateColumnIds[k] === v.columnId){ //如果records中有columnId 列 修改	
									upData.records[j].updateValues[k] = v.value;
									if(v.userRel){
										let findUsersRel = false;
										for(let s=0;s<upData.records[j].multiUserRel.length;s++){
											if(upData.records[j].multiUserRel[s].cid === v.columnId 
											&& upData.records[j].multiUserRel[s].tableId === v.tableId){
												upData.records[j].multiUserRel.splice(s,1,v.userRel);
												findUsersRel = true;
												break;
											}
										}
										if(!findUsersRel){
											if(upData.records[j].multiUserRel && Array.isArray(upData.records[j].multiUserRel)){
												upData.records[j].multiUserRel.push(v.userRel);
											}else{
												upData.records[j].multiUserRel = [v.userRel];
											}	
										}
										//第三层
									}	
									findColumnId = true;
									break;
								}
							}
							if(!findColumnId){
								upData.records[j].updateColumnIds.push(v.columnId);
								upData.records[j].updateValues.push(v.value);
								if(v.userRel){
									if(upData.records[j].multiUserRel && Array.isArray(upData.records[j].multiUserRel)){
										upData.records[j].multiUserRel.push(v.userRel);
									}else{
										upData.records[j].multiUserRel = [v.userRel];
									}					
								}	
							}
							//第二层		
							findTableId = true;
							break;
						}
					}
					if(!findTableId){
						if(v.userRel){
							upData.records.push({
								tableId:v.tableId,
								updateColumnIds:[v.columnId],
								updateValues:[v.value],
								multiUserRel:[v.userRel]
							})
						}else{
							upData.records.push({
								tableId:v.tableId,
								updateColumnIds:[v.columnId],
								updateValues:[v.value]
							})
						}		
					}
					//第一层 
				}
				//新增数据
				if(v.tmpTableId === params.tmpTableId && v.tableId <0 && v.value != ''){
					let findTableId = false;
					for(let j=0;j<addData.length;j++){ 
						if(addData[j].tableId === v.tableId){ //如果records中有tableId row行
							let findColumnId = false;
							for(let k=0;k<addData[j].params.length;k++){ 
								if( addData[j].params[k].columnId === v.columnId){ //如果records中有columnId 列 修改	
									addData[j].params[k].value = v.value;
									if(v.userRel){
										let findUsersRel = false;
										for(let s=0;s<addData[j].multiUserRel.length;s++){
											if(addData[j].multiUserRel[s].cid === v.columnId 
											&& addData[j].multiUserRel[s].tableId === v.tableId){
												addData[j].multiUserRel.splice(s,1,v.userRel);
												findUsersRel = true;
												break;
											}
										}
										if(!findUsersRel){
											 addData[j].multiUserRel.push(v.userRel)
										}
										//第三层
									}	
									findColumnId = true;
									break;
								}
							}
							if(!findColumnId){
								addData[j].params.push({
									columnId:v.columnId,
									value:v.value
								})
								if(v.userRel){
									if(addData[j].multiUserRel){
										addData[j].multiUserRel.push(v.userRel)
									}else{
										addData[j].multiUserRel = [];
										addData[j].multiUserRel.push(v.userRel)
									}
								}
							}
							//第二层		
							findTableId = true;
							break;
						}
					}
					if(!findTableId){
						let obj={
							tmpId:v.cell.tmpId,
							pageId:v.cell.pageId,
							tableId:v.tableId,
							params:[{columnId:v.columnId,value:v.value}]
						}
						if(v.userRel){
							obj.multiUserRel = [v.userRel];
						}
						if(v.cell.parentTable){
							// console.log(v.parentTable);
							obj.childrenColumnid = v.cell.parentTable.childrenColumnid;
							obj.parentTmpid = v.cell.parentTable.parentTmpid;
							obj.parentTableid = Number(v.cell.parentTable.parentTableid);
						}
						if(v.cell.reltmpid){		
							obj.tableId = v.cell.reltableid;
							obj.reltmpid = v.cell.reltmpid;
							delete obj.pageId;
						}
						addData.push(obj)
					}
					//第一层	
				}//新增一条结束
			})
			//循环结束
			if(params.tmpTableId && params.tmpTableId.indexOf('mix')>-1){
				return Promise.resolve({upData:upData,addMixedData:addData})	
			}else{
				return Promise.resolve({upData:upData,addData:addData})	
			}		
		}//整理方法结束
	}
}