<template>
	<view class="form-item">
		<view class="group">	
			<view class="d-input-box" :class="showToast1?'d-input-error':''">
				<input class="d-input" type="number" :value="checkedItem.ge" placeholder="请输入" @blur="changeStart" @confirm="changeStart">
			</view>
			<text class="d-zhi">至</text>
			<view class="d-input-box" :class="showToast2?'d-input-error':''">
				<input class="d-input" type="number" :value="checkedItem.le" placeholder="请输入" @blur="changeEnd" @confirm="changeEnd">	
			</view>		
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default{
		props:{
			data:{
				type:[Array,Object]
			}
		},
		data(){
			return{
				showToast1:false,
				showToast2:false,
				checkedItem:{
					ge:'',
					le:''
				}
			}
		},
		computed:{
			//获取清空状态
			...mapState({
				tmpId:state=>state.screen.tmpId,
				query:state=>state.screen.query
			}),
			//checkquery中 相同列集合
			checks(){
				if(this.query && this.query.length>0){
					return this.query.filter(v=>v.columnId == this.data.columnId && v.tmpId == this.tmpId)
				}			
			}
		},
		created() {
			this.checkedItem.ge = '';
			this.checkedItem.le = '';
			if(this.checks && this.checks.length>0){
				this.checks.forEach(v=>{
					if(v.operator === 'ge'){
						if(typeof v.value === 'string' &&  v.value.length>0){
							this.checkedItem.ge = Number(v.value);
						}else if(typeof v.value === 'number'){
							this.checkedItem.ge = Number(v.value);
						}		
					}
					if(v.operator === 'le'){
						if(typeof v.value === 'string' &&  v.value.length>0){
							this.checkedItem.le = Number(v.value);
						}else if(typeof v.value === 'number'){
							this.checkedItem.le = Number(v.value);
						}	
					}
				})
			}
		},
		methods:{
			changeStart(e){
				// console.log(this.checkedItem.le,Number(e.detail.value))
				if(e.detail.value.length>0){
					if(typeof this.checkedItem.le == 'number' && Number(e.detail.value) >= this.checkedItem.le){
						this.showToast1 = true
						let _this = this
					    setTimeout(function(){
							_this.showToast1 = false;
						},2000);
						this.checkedItem.ge = '';
					}else{
						this.checkedItem.ge = Number(e.detail.value);							
					}
				}else{
					this.checkedItem.ge = '';
				}		
				let query=[];
				if(typeof this.checkedItem.ge == 'string' && this.checkedItem.ge.length<1){
					//
				}else{
					query.push({
						tmpId:this.tmpId,
						columnId:this.data.columnId,
						operator:"ge",
						value:this.checkedItem.ge
					})
				}
				this.$store.commit("changeCondition",{
										operator:'ge',
										query:query,
										columnId:this.data.columnId,
									});	
			},
			changeEnd(e){
				// console.log(this.checkedItem.ge,Number(e.detail.value))
				if(e.detail.value.length>0){
					if(typeof this.checkedItem.ge == 'number'  && Number(e.detail.value) <= this.checkedItem.ge){
						this.showToast2 = true
						let _this = this
					    setTimeout(function(){
							_this.showToast2 = false;
						},2000);
						this.checkedItem.le = '';
					}else{			
						this.checkedItem.le = Number(e.detail.value);
					}
				}else{
					this.checkedItem.le = '';
				}			
				let query=[];
				if(typeof this.checkedItem.le == 'string' && this.checkedItem.le.length<1){
					//
				}else{
					query.push({
						tmpId:this.tmpId,
						columnId:this.data.columnId,
						operator:"le",
						value:this.checkedItem.le
					})
				}
				this.$store.commit("changeCondition",{
										operator:'le',
										query:query,
										columnId:this.data.columnId,
									});	
			}
		}
	}
</script>

<style scoped lang="scss">
.group{
	display: flex;
	padding:0 20rpx;
	align-items: center;
}
.uni-input-placeholder{
	font-size: 26rpx !important;
	color:#ccc;
}
.d-input-box{	
	position:relative;
}
/* 错误提示 */
.d-input-error::after{
	content:'请输入合理范围';
	display: inline-block;
	font-size:24rpx;
	padding:4rpx;
	width: 100%;
	position: absolute;
	background-color: rgba(0,0,0,.7);
	z-index:100;
	left:0;
	top:-60rpx;
	color:#fff;	
	text-align: center;
	border-radius: 8rpx;
	box-sizing: border-box;
}
.d-input{
	font-size: $font-14;
	text-align: center;
	border:1rpx solid rgba(0,0,0,.1);
	border-radius: 8rpx;
	height:$height-60;
	margin-bottom: 20rpx;
}

.d-zhi{
	display: inline-block;
	margin:0 20rpx 20rpx 20rpx;
	color:#ccc;
}
</style>

