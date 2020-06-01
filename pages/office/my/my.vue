<template>
	<view class="my" @click.stop.prevent="myClickFun(233,$event)">
		<view class="top">
			<navigator url="../office" class="btn-return">
				<uni-icons color="#fff" size="24" type="arrowleft"/>
			</navigator>
			<!-- 头像 -->
			<view class="avatar-box">
				<view class="avatar-image"></view>
			</view>
			<view class="info-box">
				<!-- 部门信息 -->
				<view class="my-info-box-item info-dept">
					 <text v-if="deptInfo && deptInfo.label">{{deptInfo.label}}</text>
					 <text v-else>无所属部门</text>
				</view>
				<text class="my-info-box-item info-dot">·</text>
				 <!-- 角色信息 -->
				 <view class="my-info-box-item info-role">
					 <text>{{activeRole.role_name}}</text>
				 </view>						 
			</view>
		</view>
		<!-- 切换角色开始 -->
		<view class="list-item list-item-role" ref="changeRole" @tap.stop.prevent="showRoleList">
			 <text>切换角色</text>
			 <uni-icons color="#ccc" size="16" type="arrowright" class="icon-arrow" />
			 <!-- 角色下拉菜单 -->			
			<view class="select-scroll-box" v-if="showSelects">
				<view class="d_select-empty" v-if="selectsLength === 0">
					<text>无角色</text>
				</view>
				<view class="select-scroll" style="overflow:auto">
					<view class="select-item" v-for="(role,index) in roleList"
						:key="index" 
						:class="activeRole.role_id == role.role_id?'checked-color':''"
						@tap.stop.prevent="confirmRole(index,role)">	
						{{role.role_name}}					
					</view>
				</view>		
			</view>
		</view>
		<!-- 切换角色结束 -->
		<div class="divide"></div>
		 <!-- 功能列表 -->
		 <view class="my-list">
			 <view class="list-item"  @click="togglePopup('center', 'popup')">
				 <text>修改密码</text>
				 <uni-icons color="#ccc" size="16" type="arrowright" class="icon-arrow" />
			 </view>
			 <view class="list-item">
				 <text>清除缓存</text>
				 <uni-icons color="#ccc" size="16" type="arrowright" class="icon-arrow" />
			 </view>
			 <view class="list-item">
				 <text>版本更新</text>
				 <uni-icons color="#ccc" size="16" type="arrowright" class="icon-arrow" />
			 </view>
			 <view class="list-item" @tap="loginOut">
				 <text>退出登录</text>
				 <uni-icons color="#ccc" size="16" type="arrowright" class="icon-arrow" />
			 </view>
		 </view>
		 <!-- 功能列表 -->
		 <view class="divide"></view>
		 <!-- 密码修改弹出窗 -->
		 <uni-popup ref="showpopup" :type="type">
			 <view class="pass-box">
				 <text class="pass-title">重置密码：</text>
				 <view class="pass-input">
					 <text class="pass-input-title">新密码：</text>
					 <input class="uni-input pass-input-input" type="text" 
						v-model='newPass' @confirm="testPass" @blur="testPass">
				 </view>
				 <view class="pass-handle">
					 <text class="d-btn d-btn-default" @tap="cancelPassFun('popup')">取消</text>
					 <text class="d-btn d-btn-primary"  @tap="confirmPassFun('popup')">确定</text>
				 </view>
			 </view>
		 </uni-popup>
		 <!-- 密码修改弹出窗 -->
	</view>
</template>

<script>
	import { roleChange,resetPass } from '@/common/methods/index.js'
	import validate from '@/common/methods/validate.js'
	import { mapState,mapGetters } from 'vuex'
	import uniIcons from '@/components/unis/uni-icons/uni-icons.vue'
	import uniPopup from '@/components/unis/uni-popup/uni-popup.vue'
	export default {
		components:{
			uniIcons,
			uniPopup
		},
		data() {
			return {
				dept:'' , //部门名称
				showSelects:false, //展示角色菜单
				type:'', //popup类型
				newPass:'', //修改密码 值
			}
		},
		computed:{
			...mapState({
				adminRoleList:state=>state.login.adminRoleList,
				deptList:state=>state.login.deptList,
				userInfo:state=>state.login.userInfo,
				loginInfo:state=>state.login.loginInfo,
				pageTitle:state=>state.login.mytitle
			}),
			...mapGetters([
				'roleList', //角色列表
				'deptInfo' //用户部门信息
			]),
			activeRole(){
				return this.$store.getters.activeRole || {role_id:'',role_name:''}
			},
			selectsLength(){
				return this.roleList.length;
			}
		},
		onReady(){
			this.getAllData().catch(error=>{})
		},
		methods: {
			myClickFun(e,arg){
				// console.log(e,arg)
				let el= this.$refs.changeRole.$el;
				// 	console.log(this.$el)
					// console.log(arg.target)
				if(!el.contains(event.target)) this.showSelects = false;
			},
			//获取页面展示数据
			async getAllData(){
				if(!this.userInfo){
				   uni.showToast({
				   	  title:"无用户信息",
					  icon:"none"
				   })
				}
				if(!this.roleList) this.$store.dispatch("changeAdminRoleList");
				if(this.deptList.length<1)  this.$store.dispatch("changeDeptList");
			},
			//展示角色列表
			showRoleList(){
				this.showSelects = !this.showSelects;
			},
			//确认角色选择
			confirmRole(index,role){
				if(role.role_id == this.activeRole.role_id){
				//
				}else{
					//获取角色菜单
					this.changeRole(role.role_id).catch(error=>{
						uni.showToast({
							title:"切换角色失败",
							icon:'none'
						})
					})
					this.showSelects = false;
					uni.showToast({
						title:"已切换角色"
					})
				}
				this.showSelects = false;
			},
			//切换角色
			async changeRole(roleId){
				await roleChange(roleId);
				this.$store.commit('changeActiveRoleId',roleId)
				await this.$store.dispatch('changeMenuTree')
			},		
			//退出登录
			loginOut(){
				uni.showModal({
					content:'是否退出登录？',
					confirmText:"退出登录",
					cancelText:'取消',
					success:(res)=> {
						if(res.confirm){
							//弹出提示框 是否退出
							this.$store.commit("initLogin",);
							this.$store.commit("initPage",);
							
								
							uni.redirectTo({
								url:'/pages/login/login'
							});
							uni.showToast({
								title:"退出成功"
							})
						}
					}
				})
				
			},
			//展示密码输入
			togglePopup(type, open) {
				this.content = '居中弹出 popup'
				this.type = type
				this.$nextTick(() => {
					this.$refs['show' + open].open()
				})
			},
			//失去焦点校验密码
			testPass(){
				validate({password:this.newPass})
			},
			//取消修改 关闭pop
			cancelPassFun(open){
				this.$refs['show' + open].close();
			},
			//确定修改密码
			async confirmPassFun(open){
				//校验
				let result = await validate({password:this.newPass}).catch(error=>{})
				if(!result){
					return;
				}
				//修改
				await resetPass({
					password:this.loginInfo.password,
					userId:this.userInfo.userId,
					upwd:this.newPass
				}).then(value=>{
					uni.showToast({
						title:'修改成功',
			            icon:"none"
					})
				}).catch(error=>{
					uni.showToast({
						title:'修改失败',
						icon:'none'
					})
				})
				//关闭弹窗
				this.newPass = '';
				this.$refs['show' + open].close();
			}
		},
		onShow() {
			if(!this.loginState){
				this.$store.dispatch('changeMenuTree')
			}	
		}
	}
</script>

<style scoped lang="scss">
page{
	font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
	
}
.my{
	height: 100vh;
}
.btn-return{
	position: absolute;
	top:10rpx;
	left:20rpx;
	
}
.icon-return{
	color:#eee;
}
 .top{
	 width: 100%;
	 height: 450rpx;
	 background-color: #1565AA;
	
	 padding-top:20rpx;
	 display: flex;
	 flex-direction: column;
	 position: relative;
 }
 .avatar-box{
	 height: 76%;
	 width: 70%;
	 margin:0 auto;
	 // background-color: #fff;
	  background-image: url(../../../static/images/login_logo.png);
	  background-repeat: no-repeat;
	  background-position: center;	
	  // background-size: contain;
 }

 .avatar-image{
	 width: 300rpx;
	 height: 300rpx;
	 border-radius: 50%;
	 // background-color: lime;
 }
 .info-box{
	flex: 1;
 	display: flex;
 	align-items: center;
	justify-content: center;
	
 }
 .my-info-box-item{
	 // font-family: sans-serif;
	 font-family:"Times New Roman",Georgia,Serif;
	 font-size:40rpx;
	 color:#fff;
 }
 .info-dot{
	 margin:0 30rpx;
	 font-weight: 700;
 }
.divide{
	width: 100%;
	height:16rpx;
	background-color: #eee;
	border-top: 2rpx solid #e7e7e7;
	border-bottom: 2rpx solid #e7e7e7;
}
 .my-list{	 
	 // padding:10rpx 0;
	 // background-color: #eee;
	 border-top:1rpx solid #eee;
	 border-bottom:1rpx solid #eee;
 }
 .list-item{
	 display: flex;
	 align-items: center;
	 height: 90rpx;
	 padding:0 20rpx;
	 box-sizing: border-box;
	 background-color: #fff;
	 border-bottom:1rpx solid #eee;
	 position: relative;
	 font-size: 30rpx;
	 color:#666;
 }
 .icon-arrow{
	 position: absolute;
	 right:20rpx;
 }

.select-scroll-box{
	position: absolute;
	left:50%;
	top:90rpx;
	border-radius: 8rpx;
	box-sizing: border-box;
	background-color: #FFFFFF;
	box-shadow: #DDDDDD 2px 2px 4px, #DDDDDD -2px -2px 4px;
	z-index: 1;
}
.select-scroll{
	 // width: 100%;
	 max-height:200rpx;
	 max-width: 220rpx;
	 // max-width: 400rpx;
	 // width: 100%;
	 // position: absolute;
	 // left:50%;
	 // top:90rpx;
	 // padding:0 20rpx;
	 // box-sizing: border-box;
	 // background-color: #FFFFFF;
	 // // border-radius: 4px;
	 // // border: 1rpx solid #eee;
	 // box-shadow: #DDDDDD 2px 2px 4px, #DDDDDD -2px -2px 4px;
	 // z-index: 1;
 }
.select-scroll-box::before {
	content: '';
	position: absolute;
	width: 0;
	height: 0;
	border-bottom: solid 6px #FFFFFF;
	border-right: solid 6px transparent;
	border-left: solid 6px transparent;
	
	left: 50%;
	top: -6px;
	z-index: 11;
	margin-left: -6px;
}
 .select-item,.d_select-empty{
	 font-size: 30rpx;
	 text-align: center;
	 margin:8rpx 18rpx;
	 word-break: break-all;
	 border-bottom: 1rpx solid #eee;
 }
 .pass-box{
	 width: 480rpx;
	 height:340rpx;
	 background-color: #fff;
	 border-radius:8rpx;
	 padding:14rpx 24rpx;
	 display: flex;
	 flex-direction: column;
	 justify-content: space-between;
 }
 .pass-input-title{
	 font-size: $font-13;
	 color: $text-color-9;
 }
 .pass-input-input{
	 padding:6rpx 24rpx;
	 border: 1rpx solid #ccc;
	 border-radius: 8rpx;
 }
 .pass-handle{
	display: flex;
	justify-content: flex-end;
 }
 .d-btn:first-child{
	margin-right: 30rpx;
 }
 
</style>
