const rules = {
				username:{
					rule:/\S/,
					msg:"请输入账号"
				},
				password:[
					{
						rule:/\S/,
						msg:"请输入密码"
					},
					{
						rule:/^[0-9a-zA-Z]{6,16}$/,
						msg:"密码为6-16为字符"
					}
				],
				yuming:{
					rule:/\S/,
					msg:"请输入访问团队"
				},
				//网址
				website:[
					{
						rule:/\S/,
						msg:"请输入网址"
					},
					{
						// (1)、地址必须以http/https/ftp/ftps开头；
						// (2)、地址不能包含双字节符号或非链接特殊字符。
						rule:/^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/,
						msg:"请输入有效网址"
					}
				],
				tel:{
					rule:/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14} $/,
					msg:'请输入有效号码'
				},
				phone:{
					rule:/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
					msg:'请输入有效号码'
				},
				email:{
					rule:/^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/,
					msg:'请输入有效邮箱'	
				},
				//创建日程
				theme:{
					rule:/\S/,
					msg:'请填写日程主题'
				},
				content:{
					rule:/\S/,
					msg:'请填写日程内容'
				},
				start_time:{
					rule:/\S/,
					msg:'请填写开始时间'
				},
				remark:{
					rule:/\S/,
					msg:'请填写备注'
				},
				owner_user_ids:{
					rule:/\S/,
					msg:'请选择参与人员'
				}
			}
const validate = (key,content)=>{
	let bool = true;
	//校验输入的key 是否有
	if(!rules[key]){
		uni.showToast({
			title:"无校验项",
			icon:"none"
		})
		bool = false;
		return false
	}
	//判断校验规则是数组还是对象
	if(rules[key] && Array.isArray(rules[key])){
		for(let i in rules[key]){
			if( !rules[key][i].rule.test(content) ){
				uni.showToast({
					title:rules[key][i].msg,
					icon:"none"
				})
				bool = false;
				return false
			}	
		}
		if(bool){
			return bool;
		}
	}else{
		if( !rules[key].rule.test(content) ){
			uni.showToast({
				title:rules[key].msg,
				icon:"none"
			})
			bool = false;
			return false
		}else{
			return bool;
		}	
	}	
}
const validateLoop = (form)=>{
	let alldone = true;
	for(let key in form){
		if(!validate(key,form[key])){
			alldone = false;
			break;
			return Promise.reject();
		};
	}
	if(alldone){
		return Promise.resolve(true)
	}		
}

export default validateLoop