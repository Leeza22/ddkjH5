import { getAdminRoleList,getDeptList,getMenuTree } from '@/common/methods/index.js'
export default{
	state:{
		loginState:false,
		token:'',
		userInfo:null,
		loginInfo:null,
		activeRoleId:'', //没有roleList时候 没有角色信息		
		menuTree:[],
		adminRoleList:[],//角色信息
		deptList:[],//部门信息
		path:'',
		timing:'',//计时器
		mytitle:'个人中心'  //个人中心页title
	},
	getters:{
		//拉平的菜单
		menuFlat(state){
			if(state.menuTree && state.menuTree.length>0){
				let menu = [];
				state.menuTree.forEach(v=>{
					menu.push(...v.childen)
				})
				return menu;
			}	
		},
		//office做好分类的
		menuTree1(state){	
			if(state.menuTree && state.menuTree.length>0){
				let menuTree1 = JSON.parse(JSON.stringify(state.menuTree));
				if(menuTree1 && menuTree1.length>0){
					if(menuTree1[0].childen && Array.isArray(menuTree1[0].childen)){
						menuTree1[0].childen.push({
							pageName: state.mytitle
						})
					}else{
						menuTree1[0].childen = [{pageName: state.mytitle}]
					}
				}				
				return menuTree1;
			}
		},
		//角色列表 个人中心页使用
		roleList(state){	
			if(state.adminRoleList && state.adminRoleList.length>0 && state.userInfo && state.userInfo.roleIds){
				let rolelist=[];
				if(state.userInfo.roleIds.length>0){		
					state.userInfo.roleIds.forEach(v=>{
						state.adminRoleList.forEach(val=>{
							if(val.role_id == v){
								rolelist.push(val)
							}
						})
					})			
				}
				return rolelist;
			}			
		},
		//当前角色
		activeRole(state,getters){
			if(typeof state.activeRoleId === 'string' && state.activeRoleId.length>1 || typeof state.activeRoleId === 'number'){
				if(getters.roleList && getters.roleList.length>0){
					for(let i=0;i<getters.roleList.length;i++){
						if(getters.roleList[i].role_id == state.activeRoleId){
							return getters.roleList[i];
							break;
						}
					}
				}
			}
		},
		//部门信息
		deptInfo(state){
			if(state.userInfo && state.userInfo.deptId && state.deptList){
				// 函数
				var findDept = (deptArray,deptId)=>{
					let dept = deptArray.find(v=>v.value == deptId || v.id == deptId );
					if(dept){
						return dept;
					}else{
						for(let n in deptArray){
							if(deptArray[n].children && deptArray[n].children.length>0){
								return findDept(deptArray[n].children,deptId);			
							}
						}
					}	
				}
				return findDept(state.deptList,state.userInfo.deptId);
			}
		}
	},
	mutations:{
		initLogin(state){
			state.loginState = false;
			state.token = '';
			state.userInfo = null;
			state.loginInfo = null;
			state.menuTree.splice(0,state.menuTree.length);
			state.adminRoleList.splice(0,state.adminRoleList.length);
			state.deptList.splice(0,state.deptList.length);
			state.path = '';
			clearInterval(state.timing);
			state.timing = '';
		},
		updateLoginState(state,status){
			state.loginState = status;
		},
		updateToken(state,token){
			state.token = token;
		},
		updateLogin(state,data){
			if(data && data.userInfo){
				state.loginState = true;
				state.token = data.userInfo.token;
				state.userInfo = data.userInfo;
				state.activeRoleId = data.userInfo.roleIds[0]
			}
			if(data && data.loginInfo){
				state.loginInfo = data.loginInfo;
			}
		},
		changeActiveRoleId(state,data){
			state.activeRoleId = data;	
		},
		updateUserInfo(state,userInfo){
			state.userInfo = userInfo;
		},
		updateMenuTree(state,data){
			state.menuTree.splice(0,state.menuTree.length,...data);
		},
		updateAdminRoleList(state,data){
			state.adminRoleList = data;
		},
		updateDeptList(state,data){
			state.deptList = data;
		},
		//主页主表
		updatePath(state,data){
			state.path = data;
		}
	},
	actions:{
		changeAdminRoleList({commit}){
			return getAdminRoleList().then(data=>{		
				commit("updateAdminRoleList",data);	
				return Promise.resolve(true)	
			}).catch(error=>{})
		},
		changeDeptList({commit}){
			return getDeptList().then(data=>{
				commit("updateDeptList",data);
				return Promise.resolve(true)		
			}).catch(error=>{})
		},
		changeMenuTree({commit}){		
			return getMenuTree().then(menus=>{	
				// console.log('tree')
				commit("updateMenuTree",menus);
				return Promise.resolve(true)				
			}).catch(error=>{})
		},
		timingMenuTree({state,dispatch},status){
			if(status){
				state.timing = setInterval(function(){
					dispatch("changeMenuTree")
				},60000)	
			}else{
				clearInterval(state.timing)
			}
			
		}
	}
}