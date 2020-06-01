<template>
	<view class="form-item">
		<view class="item-panduan"
			:class="value && value === '是'?'checked-class':''"
			@tap="checkFun('是')">
			<view class="check-tab"></view>	
			<text>是</text>
		</view>
		<view class="item-panduan"
			:class="value && value === '否'?'checked-class':''"
			@tap="checkFun('否')">
			<view class="check-tab"></view>	
			<text>否</text>
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
				value:''
			}
		},
		computed:{
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
		created(){
			this.value = '';
			if(this.checks && this.checks.length>0){
				this.value = this.checks[0].value;
			}
		},
		methods:{
			checkFun(val){
				if(val === this.value){
					this.value = '';
				}else{
					this.value = val;
				}
				let query = [];
                if(this.value.length>0){
					query.push({
						tmpId:this.tmpId,
						columnId:this.data.columnId,
						operator:"like",
						value:this.value
					})    
				}
				this.$store.commit("changeCondition",{
									query:query,
									columnId:this.data.columnId,
								});
			}
		}
	}
</script>

<style scoped lang="scss">
.form-item{
	display: flex;
	padding: 0 20rpx;
	margin-bottom:20rpx;
}
.item-panduan{
	font-size: $font-14;
	display: flex;
	align-items: center;
	margin-right: 40rpx;
}
.check-tab{
	width: 28rpx;
	height: 28rpx;
	border: 1rpx solid #ccc;
	border-radius: 50%;
	margin-right:8rpx;
}
.checked-class{
	color: $global-color;
}
.checked-class .check-tab{
	border-color: $global-color;
	background-color: $global-color;
	position: relative;	
}
.checked-class .check-tab::after{
	content: '';
	display: inline-block;
	width: 8rpx;
	height: 8rpx;
	border-radius: 50%;
	background-color: #fff;
	/* box-shadow: 0 0 1rpx 1rpx #2298EF inset; */
	position: absolute;
	left: 0;right: 0;bottom: 0;top:0;
	margin:auto;
}
</style>

