export default{
	//登录请求 header tid =1 at=1  返回一个data  
	comId:'/user/comId',
	//header tid =1 at= data  返回一个token 
	login:'/user/login',
	//后面请求中 tid=1  at=token
	// 获取角色信息
	getAdminRoleList:'/getAdminRoleList',
	//获取部门信息
	getDeptList:'/getDeptList',
	//重置密码
	resetPass:'/sys/users/resetPass',
	//请求页面
	listPage:'/sys/busiTable/listPage',
	//请求相关页面detail master
	relation:'/sys/busiTable/relationTemplate',
	//请求多对多关联表 详情页
	getMixedData:'/sys/templateMixedData/getMixedData',
	//编辑数据更新
	update:'/sys/busiTable/updateMulti',
	//菜单树 请求 /1  根据role id拼的
	menutree:'/sys/rolemenu/tree',
	//单个表删除
	deltable:'/sys/busiTable/delete',
	//添加单表
	addtable:'/sys/busiTable/add',
	//获取引用数据
    yinyong:'/getPageYinYong',
	//获取引用表所有信息 拼上 /reltmpid
	allInfo:'/sys/busiTemplate/allInfo',
	//选择后引用存储  拼上所选columnId tableid /5915/49
	saveYinyong:'/sys/busiTable/createManyFieldmapping',
	//员工单选 多选 选项获取 /5970  拼上列id
	yuangong:'/sys/users/getUserAndDept',
	//员工检查核对表
	selectAll:'/sys/users/selectAll',
	//获取部门选项 部门单选
	getDept:'/getDept',
	//级联 获取级联子数据
	getDateInfo:'/getDateInfo',
	//表格 更新按钮类型
	updateButton:'/sys/busiTable/updateButton',
	//获取表格 单选 多选 级联的选项
	getColumnSelects:'/sys/customerPageColumns/columnSelects',
	//文件上传
	upload:'/upload/oss',
	//下载文件 ?fileName=1588742075805_45153829215742-a6.jpg
	download:'/download/oss',
	//角色切换 /user/roleChange/48 后面拼角色Id
	roleChange:'/user/roleChange',
	//添加多对多单条添加 
	addMixed:'/sys/busiTable/addMixed',
	//筛选页筛选项 可选择列 传pageId
	getViewColumns:'/sys/busiTable/getViewColumns',
	//获取oa信息
	getOaEventList:'/getOaEventList',
	//添加日程任务
	createOaEvent:'/createOaEvent',
	//日程 获取参与人
	getUserSelect:'/sys/users/selectAll',
	//编辑修改日程任务
	updateOaEvent:'/updateOaEvent'
}