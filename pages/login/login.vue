<template>
	<view class="login">
		<view class="logo-box">
			<image src="../../static/images/login_logo.png" mode="aspectFit" class="image-login" :style="{'height':imageHeight+'px'}"></image>
			<view class="title">{{title}}</view>
		</view>
		<view class="form-box">		
			<view class="input-wrapper">
				<text class="input-title">{{input1}}</text>
				<input class="input-input" placeholder="" v-model="form.username" />
				<text class="uni-icon" v-if="form && form.username && form.username.length>0" @click="clearUser">&#xe434;</text>
			</view>
			<view class="input-wrapper">
				<text class="input-title">{{input2}}</text>
				<input class="input-input" placeholder="" :password="showPassword" v-model="form.password" />
				<text class="uni-icon" v-if="form && form.password && form.password.length>0" 
					:class="[!showPassword ? 'uni-eye-active' : '']" 
					@click="changePassword">
					&#xe568;
				</text>
			</view>
			<view class="input-wrapper">
				<text class="input-title">{{input3}}</text>
				<input class="input-input" v-model="form.yuming" />
				<text class="uni-icon" v-if="form && form.yuming && form.yuming.length>0" @click="clearTeam">&#xe434;</text>
			</view>	
			<button class="btn-login" color="#2298EF" 
				:style="{'opacity':form.username && form.password && form.yuming? 1:0.5}" @click="loginFun">
				登 录
			</button>
			<view class="loginTip">
				<text>{{loginTip[0]}}</text>
				<view class="keep-pass">
					<view class="check-tab" @tap="keepPassFun" :class="{'checked-tab':keepPass}">
						<uni-icons :hidden="!keepPass" type="checkmarkempty" color="#FFF" size="12"></uni-icons>
					</view>	
					<text>{{loginTip[1]}}</text>
				</view>			
			</view>
		</view>	
	</view>
</template>

<script>
	import validate from '@/common/methods/validate.js'
	import {loginTo,getMenuTree} from '@/common/methods/index.js'
	import uniIcons from '@/components/unis/uni-icons/uni-icons.vue'
	import {mapState} from 'vuex'
	export default {
		components:{
			uniIcons
		},
		data() {
			return {
				title:'超级丁·超级助手',
				showPassword:true, //展示加密
				form:{
					yuming:'',  //团队输入
					password:'', //密码
					username:''	,//账户输入
				},
				input1:'用户名：',
				input2:'密码：',
				input3:'企业代码：',
				loginTip:['忘记密码','记住用户密码'],
				keepPass:false,
				imageHeight:'80' //图片高度 可以更改图片大小
			}
		},
		computed:{
			...mapState({
				loginInfo:state=>state.login.loginInfo,
				loginState:state=>state.login.loginState
			})
		},
		//本地有缓存  直接显示账号
		onReady(){
			this.$store.dispatch('timingMenuTree')
			if(this.loginState && this.loginInfo){
				this.form.username = this.loginInfo.username;
			}
			let res = uni.getStorageSync('keepPass');
			if(res && Number(res) === 1){
				this.keepPass = true;
				if(this.loginInfo && this.loginInfo.password){
					this.form.password = this.loginInfo.password;
				}		
			}
		},
		methods: {
			//登录结束
			async loginFun(){
				//验证输入内容
				let result = await validate(this.form).catch(error=>{})
				if(!result){
					return;
				}	
				//本地存储有东西 直接进  验证与缓存中的信息是否一致就可以
				if(this.loginState){
					if(this.form.username == this.loginInfo.username
					&& this.form.password == this.loginInfo.password
					&& this.form.yuming == this.loginInfo.yuming){
						uni.reLaunch({
							url:'/pages/office/office'
						})
					}else{
						uni.showToast({
							title:"登录信息有误",
							icon:'none'
						})
						this.$store.commit('initLogin')
					}
				}else{
					//登录
					loginTo(this.form).then(userInfo=>{
						uni.hideLoading();
						//获取回来数据  存储在vuex 与本地		
						//加密账号密码 存储	
						// let string = JSON.stringify(this.form);					
						// let info = XXTEA.encryptToBase64(string, 'ddkj');
						this.$store.commit("updateLogin",{userInfo:userInfo,loginInfo:this.form});
						//调用获取菜单树方法
						this.$store.dispatch('changeMenuTree').catch(error=>{})
						this.$store.dispatch('timingMenuTree',true)
					
						uni.setStorageSync('login',JSON.stringify(this.$store.state.login))
						//跳转主页
						uni.reLaunch({
							url:'/pages/office/office'
						})
					}).catch(error=>{
						uni.showToast({
							title:"登录失败",
							icon:"none"
						})
					})
				}   
			},
			clearUser(){
				this.form.username = "";
				this.showClearUser = false;
			},
			clearTeam(){
				this.form.yuming = "";
				this.showClearTeam = false;
			},
			changePassword() {
			    this.showPassword = !this.showPassword;
			},
			keepPassFun(){
				this.keepPass = !this.keepPass;
				if(this.keepPass){
					uni.setStorage({
						key:'keepPass',
						data:1
					})		
				}else{
					uni.removeStorage({
						key:'keepPass'
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
@font-face {font-family: "adobeHei";
	src:url('~@/static/AdobeHeitiStd-Regular.otf') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
}
.login{
 
}
.logo-box{
	overflow: hidden;
	margin: 0 auto;
	width: 60%;
	padding-top:180rpx;
}
.image-login{
	width: 100%;
	// height: 200rpx;
}
.title{
	text-align: center;
	font-size: 32rpx;
	color:$global-color;
	margin-top:30rpx;
	// font-weight: 500;
	font-family: 'adobeHei';
}
.form-box{
	margin: 0 auto;
	width: 80%;
	margin-top:200rpx;
	padding:0 60rpx;
	box-sizing: border-box;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-content: center;
	border-left:1rpx solid #e6e6e6;
}
.input-wrapper {
	flex-basis: 100%;	
	display: flex;
	align-items: center;
	flex-direction: row;
	flex-wrap: nowrap;
	padding:20rpx;
	background-color: #FFFFFF;
	box-sizing: border-box;
	border-bottom: 1rpx solid #e6e6e6;
	color:$text-color-3;	
}
.input-title{
	font-weight: 700;
}
.input-input {
	padding: 0px;
	flex: 1;
	margin:0 10rpx;
}
.uni-icon {
	font-family: uniicons;
	font-size: 36rpx;
	font-weight: normal;
	font-style: normal;
	color: #bbb;
}

.uni-eye-active {
	color: $global-color;
 }
 .btn-login{
	 flex-basis: 100%;
	 width: 100%;
	 font-size:30rpx;
	 color: #fff;
	 margin-top:30rpx;
	 margin-bottom:10rpx;
	 background-color: $global-color;
 }
 .loginTip{
	 font-size: $font-13;
	 color: #999;
	 flex-basis: 100%;
	 width: 100%;
	 display: flex;
	 justify-content: space-between;
 }
.keep-pass{
	display: flex;
	align-items: center;
} 
.check-tab{
	width: 24rpx;
	height: 24rpx;
	border:1rpx solid #ccc;
	border-radius: 4rpx;
	margin-right:10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}
.checked-tab{
	border-color: #2298EF;
	background-color: #2298EF;
}
</style>
