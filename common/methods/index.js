import $http from '../api/request.js'
import $api from '../api/api.js'
//引入vuex 直接保存数据
import store from '../../store/index.js'

export{
	//获取当前表数据  	
	getData,	
	//请求关联表信息  返回master detail
	getRelation,
	//请求多对多关联表 详情页
	getMixedData,
	//更新数据 简单更新
	updateData,
	//单个删除
	deleteTable,
	//添加单表
	addTable,
	//获取单个角色菜单树
	getOneMenu,
	// //循环获取菜单树 固定Id 2
	getMenuTree,
	//获取引用
	getYinyong,
	//获取引用表所有信息
	getAllInfo,
	//点击登录 发送comid  获取data  登录1
	sendComId,
	//接收data 获取用户信息  登录2
	sendLogin,
	//执行调用  登录3
	loginTo,
	//获取员工单选 多选选项
	getYuangong,
	//获取员工表检查核对
	getSelectAll,
	//获取角色信息
	getAdminRoleList,
	//获取角色信息
	getDeptList,
	//获取部门选项 部门单选
	getDept,
	//重置密码
	resetPass,
	//级联 获取级联子数据
	getDataInfo,
	//更新表格按钮类型
	updateButton,
	//获取表格 单选 多选 级联的选项
	getColumnSelects,
	//角色切换 
	roleChange,
	//添加多对多单条添加
	addMixed,
	//筛选页筛选项 可选择列 传pageId
	getViewColumns,	
	//获取oa信息
	getOaEventList,
	//创建日程任务
	createOaEvent,
	//日程 获取参与人
	getUserSelect,
	//编辑修改日程任务
	updateOaEvent
}

//方法开始
const getData=(params)=>{
			//压入缓存
			// let pageId = Number(params.pageId);
			// let current = Number(params.current);
			// const cache = getData.cache ||(getData.cache = new Map());	
			// let request = params.request || false;
			
			// console.log(request,cache.has(pageId),cache)
			// if(!request && cache.has(pageId)){
			// 	// console.log("有缓存")
			// 	return Promise.resolve(cache.get(pageId));
			// }
			// size:size,
			// current:current,
			// pageId:pageId,
			// order:order,
			// query:query,
			// checkquery:checkquery,
			// children:children
			delete params.request;
			params.size = params.size || 22;
			params.current = params.current || 1;
			params.needTitle = true;	
			// if(!params.phoneOpen)
			params.phoneOpen = true;
			// params.phoneOpen = params.phoneOpen || false;
			// console.log(params.phoneOpen)
			if(params.children && params.children.length <1){
				delete params.children;
			}
			// uni.showLoading({
			// 	title: '数据加载中...',
			// 	mask: true
			// });
			return $http.request({
				url:$api.listPage,
				method:'POST',
				data:params
			}).then(res=>{
				// uni.hideLoading();
				return new Promise((resolve,reject)=>{
					if(res.data.code === 0){
						res.data.tmpTableId = 'page_'+res.data.search.tmpId+'_'+res.data.search.pageId;
						res.data.tmpId = res.data.search.tmpId;
						res.data.pageId = res.data.search.pageId;
						resolve(res.data)							
					}else{
						let msg = res.data.msg || '数据获取失败'
						uni.showToast({
							title:msg,
							icon:"none"
						})
						reject(msg)
					}		
				})			
			}).catch(error=>{
				// uni.hideLoading();
				if(error === '登录会话失效,请重新登录'){
					uni.redirectTo({
						url:'/pages/login/login'
					})
					uni.showToast({
						title:"登录失效,请重新登录",
						icon:"none",
						duration:3000
					})
				}
			})
			// .finally(()=>{
			// 	uni.hideLoading();
			// })			
		} //getData 结束
//请求关联表信息  返回master detail
const getRelation = (data)=>{
	// console.log(data)
	// 	data.needTitle = true;
		return $http.request({
			url:$api.relation,
			method:'POST',
			data:data
		}).then(res=>{
			return new Promise((resolve,reject)=>{
				if(res.data.code ===0){
					//获取detail表数据
					let detail = res.data.data.detail;
					let master = res.data.data.master;
					let result = {detail:detail,master:master};
					resolve(result);						
				}else{
					reject()
				}		
			})						
		}).catch(error=>{
			uni.showToast({
				title:"关联表请求有误",
				icon:"none"
			})
		})
	}
//请求多对多关联表 详情页
const getMixedData = (params)=>{
	params.phoneOpen = true;
	return $http.request({
		url:$api.getMixedData,
		method:'POST',
		data:params
	}).then(res=>{
		uni.hideLoading();	
		return new Promise((resolve,reject)=>{
			if(res.data.code ===0){
				resolve(res.data.data);						
			}else{
				reject()
			}		
		})						
	}).catch(error=>{
		uni.hideLoading();
		uni.showToast({
			title:"多对多关联请求失败",
			icon:"none"
		})
	})
}
//更新数据 简单更新
const updateData = (params)=>{
	params = JSON.stringify(params);
	return $http.request({
		url:$api.update,
		method:'POST',
		data:params
	}).then(res=>{
		return new Promise((resolve,reject)=>{
			if(res && res.data && res.data.code === 0 ){
				// if(res.data['无操作权限']){
				// 	uni.showToast({
				// 		title:"无操作权限",
				// 		icon:'none'
				// 	})
				// }
				resolve(true)
			}else{
				let msg = res.data.msg || '更新失败';
				uni.showToast({
					title:msg,
					icon:'none'
				})
				reject();
			}	
		})				
	}).catch(error=>{})		
}
//单个删除
const deleteTable = (params)=>{
		return $http.request({
			url:$api.deltable,
			method:'POST',
			data:params
		}).then(res=>{
			return new Promise((resolve,reject)=>{
				if(res.data.code === 0){
					resolve(true)
				}else{
					let msg = res.data.msg || '删除失败';
					uni.showToast({
						title:msg,
						icon:'none'
					})
					reject()
				}	
			})	
		}).catch(error=>{})
	}
//添加单表
const addTable = (params)=>{
	params = JSON.stringify(params);
	return $http.request({
		url:$api.addtable,
		method:'POST',
		data:params
	}).then(res=>{
		if(res.data.code === 0){
			return Promise.resolve(true)
		}else{
			let msg = res.data.msg || '添加失败';
			uni.showToast({
				title:msg,
				icon:"none"
			})
			return Promise.reject()
		}	
	}).catch(error=>{})
}
//获取单个角色菜单树
const getOneMenu = (roleId)=>{
		return $http.request({
			url:$api.menutree+"/"+roleId,
		 }).then(value=>{  
			 return new Promise((resolve,reject)=>{
				 if(value.data.length>0){
					 resolve(value.data)
				 }else{
					 reject("暂无菜单")
				 }
			 })
		 }).catch(error=>{
			 uni.showToast({
				title:"暂无菜单",
				icon:"none"
			 })
		 })
	}
//循环获取菜单树 固定Id 2
const getMenuTree = ()=>{
		return getOneMenu(2).then(menu=>{
			//数组对象去重 唯一标识 path
			return new Promise((resolve,reject)=>{
				let menuArr;
				if(typeof menu === 'string'){
					menuArr = JSON.parse(menu);
				}else{
					menuArr = menu;
				}
				if(menuArr && menuArr.length>0){
					let menuTree = []; //存放menu
					let zeroTree = []; //存放双零 childen
					let commonTree = []; //存放常用 childen
					menuArr.forEach(v=>{
						if(v.pageId == 0 && v.tmpId == 0){
							zeroTree.push(v)
						}else if(v.pageId && v.pageId != 0){
							commonTree.push(v)
						}else{
							menuTree.push(v)
						}
					})
					commonTree.unshift(...zeroTree)
					menuTree.unshift({pageName:'常用',childen:commonTree,pageId:null,tmpId:null,icon:'common'})
					//双零暂时不展示
					if(menuTree.length>0){
						resolve(menuTree)
					}else{
						reject("暂无菜单")
					}
				}else{
					reject("暂无菜单")
				}
			})
		}).catch(error=>{
			uni.showToast({
				title:"暂无菜单",
				icon:"none"
			})
		})
	}
//获取引用
const getYinyong = (pageId)=>{
		pageId = String(pageId);
		return $http.request({
				url:$api.yinyong,
				method:'POST',
				data:{"pageId":pageId}
			 }).then(value=>{  
				 return new Promise((resolve,reject)=>{
					 if(value.data.code === 0){
						 resolve(value.data.data)
					 }else{
						reject(value.data.msg)
					 }
				 })
			 }).catch(error=>{
				 uni.showToast({
				 	title:"引用表请求失败",
					icon:"none"
				 })
			 })
	}
//获取引用表所有信息
const getAllInfo = (tmpId)=>{
		return $http.request({
				url:$api.allInfo+'/'+tmpId,
				method:'POST'
			 }).then(value=>{  
				 return new Promise((resolve,reject)=>{
					 if(value.data.code === 0){
						 resolve(value.data.busiTemplate)
					 }else{
						 reject(value.data.msg)
					 }
				 })
			 }).catch(error=>{
				 uni.showToast({
				 	title:"引用信息请求失败",
					icon:"none"
				 })
			 })
	}
//点击登录 发送comid  获取data  登录1
const sendComId = (tid,at,form)=>{
		return $http.request({
			url:$api.comId,
			method:'POST',
			header:{
				at:at,
				tid:tid
			},
			data:form
		}).then(value=>{		
			return new Promise((resolve,reject)=>{
				if(value.data.code===0){
					resolve(value.data.data)
				}else{
					reject(value.data.msg)
				}
			}) 	
		}).catch(error=>{
			uni.showToast({
				title:"登录请求有误",
				icon:'none'
			})
		})
	}
//接收data 获取用户信息  登录2
const sendLogin = (tid,at,form)=>{
		return $http.request({
			url:$api.login,
			method:'POST',
			header:{
				at:at,
				tid:tid
			},
			data:form
		}).then(value=>{
			return new Promise((resolve,reject)=>{
				if(value.data.code===0){
					resolve(value.data.data)
				}else{
					reject(value.data.msg)
				}
			}) 	
		}).catch(error=>{
			uni.showToast({
				title:"登录失败",
				icon:'none'
			})
		})
	}
//执行调用  登录3
const loginTo = async (form)=>{
		const tid=1;
		const at=1;
		try{
			uni.showLoading({
				title:'登录中...'
			})
			const atData = await sendComId(tid,at,form);
			return  await sendLogin(tid,atData,form).catch(error=>{});
		}catch(error){
			uni.hideLoading()
			uni.showToast({
				title:"登录失败",
				icon:"none"
			})
		}
	}
//获取员工单选 多选选项
const getYuangong = (columnId)=>{
		return $http.request({
			url:$api.yuangong,
			method:'POST',
			data:{
				columnId:columnId,
				name:""
			}
		}).then(value=>{
			return new Promise((resolve,reject)=>{
				if(value.data.code===0){		
					resolve(value.data.data)
				}else{
					reject(value.data.msg)
				}
			}) 	
		}).catch(error=>{
			uni.showToast({
				title:"选项请求错误",
				icon:"none"
			})
		})
	}
//获取员工表检查核对
const getSelectAll = ()=>{
		return $http.request({
			url:$api.selectAll,
			method:'POST'
		}).then(value=>{
			return new Promise((resolve,reject)=>{
				if(value.data){
					resolve(value.data);
				}else{
					reject("无数据")
				}	
			}) 	
		}).catch(error=>{
			uni.showToast({
				title:"请求错误",
				icon:"none"
			})
		})
	}
//获取角色信息
const getAdminRoleList = ()=>{
		const cache = getAdminRoleList.cache ||(getAdminRoleList.cache = new Map());
		let rolelist = "rolelist";
		if(cache.has(rolelist)){
			return Promise.resolve(cache.get(rolelist));
		}
		return $http.request({
			url:$api.getAdminRoleList,
			method:'POST'
		}).then(value=>{
			return new Promise((resolve,reject)=>{
				if(value.data.code == 0){
					cache.set(rolelist,value.data.data)
					resolve(value.data.data);
				}else{
					reject("无数据")
				}	
			}) 	
		}).catch(error=>{
			uni.showToast({
				title:"请求错误",
				icon:"none"
			})
		})
	}
//获取角色信息
const getDeptList = ()=>{
		const cache = getDeptList.cache ||(getDeptList.cache = new Map());
		let deptlist = "deptlist";
		if(cache.has(deptlist)){
			return Promise.resolve(cache.get(deptlist));
		}
		return $http.request({
			url:$api.getDeptList,
			method:'POST'
		}).then(value=>{
			return new Promise((resolve,reject)=>{
				if(value.data.data){
					cache.set(deptlist,value.data.data)
					resolve(value.data.data);
				}else{
					reject("无数据")
				}	
			}) 	
		}).catch(error=>{
			uni.showToast({
				title:"请求错误",
				icon:"none"
			})
		})
}
const getDept = ()=>{
	return $http.request({
		url:$api.getDept,
		method:'POST'
	}).then(value=>{
		return new Promise((resolve,reject)=>{
			if(value.data.data){
				resolve(value.data.data);
			}else{
				reject("无数据")
			}	
		}) 	
	}).catch(error=>{
		uni.showToast({
			title:"请求错误",
			icon:"none"
		})
	})
}
//重置密码 params {password: "666666", userId: 143, upwd: "666666"}
const resetPass = (params)=>{
	return $http.request({
		url:$api.resetPass,
		method:'POST',
		data:params
	}).then(value=>{
		return new Promise((resolve,reject)=>{
			if(value.data.code === 0){
				resolve();
			}else{
				reject("修改失败")
			}	
		}) 	
	}).catch(error=>{
		uni.showToast({
			title:"请求错误",
			icon:"none"
		})
	})
}
//级联 获取级联子数据
const getDataInfo = (params)=>{
	return $http.request({
		url:$api.getDateInfo,
		method:'POST',
		data:params
	}).then(value=>{
		return new Promise((resolve,reject)=>{
			if(value.data.code === 0){
				resolve(value.data.data);
			}else{
				reject("获取失败")
			}	
		}) 	
	}).catch(error=>{
		uni.showToast({
			title:"请求错误",
			icon:"none"
		})
	})
}
//表格 更新按钮
const updateButton = (params)=>{
	return $http.request({
		url:$api.updateButton,
		method:"POST",
		data:params
	}).then(value=>{
		return new Promise((resolve,reject)=>{
			if(value.data.code === 0){
				resolve();
			}else{
				uni.showToast({
					title:'更新失败',
					icon:"none"
				})
			}	
		}) 	
	}).catch(error=>{
		uni.showToast({
			title:"请求错误",
			icon:"none"
		})
	})
}

//获取表格 单选 多选 级联的选项 params为search 
const getColumnSelects = (params)=>{
	return $http.request({
		url:$api.getColumnSelects,
		method:'POST',
		data:params
	}).then(value=>{
		return new Promise((resolve,reject)=>{
			if(value.data.code===0){		
				resolve(value.data.data)
			}else{
				reject(value.data.msg)
			}
		}) 	
	}).catch(error=>{
		uni.showToast({
			title:"选项请求错误",
			icon:"none"
		})
	})
}
//角色切换 /user/roleChange/48 后面拼角色Id
const roleChange = (roleId)=>{
	return $http.request({
		url:$api.roleChange+'/'+roleId,
		method:'POST'
	}).then(value=>{
		return new Promise((resolve,reject)=>{
			if(value.data.code===0){		
				resolve()
			}else{
				reject()
			}
		}) 	
	}).catch(error=>{
		uni.showToast({
			title:"切换请求错误",
			icon:"none"
		})
	})
}
//添加多对多单条添加
 // [{"tmpId":1174,"reltmpid":"1150","tableId":146,"row":-1,"params":[{"columnId":6031,"value":"体积/立方英寸"}]}]
const addMixed = (params)=>{
	params = JSON.stringify(params)
	// console.log(params)
	return $http.request({
		url:$api.addMixed,
		method:'POST',
		data:params
	}).then(value=>{
		return new Promise((resolve,reject)=>{
			if(value.data.code===0){
				resolve(true)
			}else{
				let msg = res.data.msg || '添加多对多关联表失败';
				uni.showToast({
					title:msg,
					icon:"none"
				})
				reject()
			}
		}) 	
	}).catch(error=>{})
}
//筛选页筛选项 搜索项 传pageId
const getViewColumns = (params)=>{
	return $http.request({
		url:$api.getViewColumns,
		method:'POST',
		data:params
	}).then(value=>{
		return new Promise((resolve,reject)=>{
			if(value.data.code===0){
				resolve(value.data.data)
			}else{
				let msg = res.data.msg || '获取数据失败';
				uni.showToast({
					title:msg,
					icon:"none"
				})
				reject()
			}
		}) 	
	}).catch(error=>{})
}
//获取oa信息 {"start_time":"2020-04-27 08:00:00","end_time":"2020-06-08 08:00:00","event_type":"-1","event_degree":"-1","is_complate":"-1","user_id":"","owner_user_ids":[],"key":""}
const getOaEventList = (params)=>{
	return $http.request({
		url:$api.getOaEventList,
		method:'POST',
		data:params
	}).then(value=>{
		return new Promise((resolve,reject)=>{
			if(value.data.code===0){
				resolve(value.data.data)
			}else{
				let msg = res.data.msg || '获取数据失败';
				uni.showToast({
					title:msg,
					icon:"none"
				})
				reject()
			}
		}) 	
	}).catch(error=>{})
}
//创建日程任务
// title: "rr"
// start_time: "2020-05-30 10:50:22"
// owner_user_ids: "107"
// remark: "热热热热热"
// color: "#F3C23B"
// content: "热热热热热"
// user_id: 1
// address: ""
// day: 0
// hour: 0
const createOaEvent = (params) => {
	return $http.request({
		url:$api.createOaEvent,
		method:'POST',
		data:params
	}).then(value=>{
		return new Promise((resolve,reject)=>{
			if(value.data.code === 0){
				uni.showToast({
					title:"创建成功",
					icon:'none'
				})
				resolve(true)
			}else{
				let msg = res.data.msg || '创建失败';
				uni.showToast({
					title:msg,
					icon:"none"
				})
				reject()
			}
		}) 	
	}).catch(error=>{})
}
//获取 日程参与人选项
const getUserSelect = ()=>{
	return $http.request({
		url:$api.getUserSelect,
		method:'POST'		
	}).then(value=>{
		return new Promise((resolve,reject)=>{
			if(value.data){
				resolve(value.data)
			}else{
				let msg = '获取数据失败';
				uni.showToast({
					title:msg,
					icon:"none"
				})
				reject()
			}
		}) 	
	}).catch(error=>{})
}
//编辑修改日程任务
const updateOaEvent = (params)=>{
	return $http.request({
		url:$api.updateOaEvent,
		method:'POST',
		data:params
	}).then(value=>{
		return new Promise((resolve,reject)=>{
			if(value.data.code === 0){
				uni.showToast({
					title:'更改成功',
					icon:"none"
				})
				resolve(true)
			}else{
				let msg = res.data.msg ||'修改失败';
				uni.showToast({
					title:msg,
					icon:"none"
				})
				reject()
			}
		}) 	
	}).catch(error=>{})
}
//结束