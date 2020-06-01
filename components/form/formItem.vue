<template>
	
	<view class="form">
		<view class="c-label">{{data.columnShowname}}</view>
			
		<Number :data='data' v-if="data.templateColumn.cId===1"></Number>
		<Wenben :data='data' v-if="data.templateColumn.cId===2"></Wenben>
		<Riqishijian :data='data' v-if="data.templateColumn.cId===4"></Riqishijian>
		<Duoxuan :data='data' v-if="data.templateColumn.cId===5"></Duoxuan>
		<Duoxuan :data='data' v-if="data.templateColumn.cId===6"></Duoxuan>
		<Jilian :data='data' v-if="data.templateColumn.cId===14"></Jilian>
		<Yuangong :data='data' v-if="data.templateColumn.cId===21"></Yuangong>
		<Yuangong :data='data' v-if="data.templateColumn.cId===22"></Yuangong>
		<Panduan :data='data' v-if="data.templateColumn.cId===31"></Panduan>
		<Button :data='data' v-if="data.templateColumn.cId===33"></Button>
		<Bumen :data='data' v-if="data.templateColumn.cId===34"></Bumen>
		<Bumen :data='data' v-if="data.templateColumn.cId===35"></Bumen>
	</view>
</template>

<script>
	import Duoxuan from './Checkbox.vue'
	import Riqishijian from './Datetime.vue'
	import Jilian from './Jilian.vue'
	import Wenben from './Wenben.vue'
	import Number from './Number.vue'
	import Panduan from './Panduan.vue'
	import Yuangong from './Yuangong.vue'
	import Bumen from './Bumen.vue'
	import Button from './Buttons.vue'
	export default{
		components:{
			Duoxuan,
			Riqishijian,
			Jilian,
			Wenben,
			Number,
			Panduan,
			Yuangong,
			Bumen,
			Button
		},
		props:{
			data:{
				type:[Object,Array]
			}
		}
	}
</script>

<style scoped lang="scss">
	.form{
		// height:80px;
		font-size:$font-14;
		color:$text-color-6;	
		// margin-bottom:20rpx;
	}
	.c-label{
		height:$height-80;
		background-color: $bg-color-grey;
		font-weight: bold;
		color:$global-color;
		padding:18rpx 0;
		box-sizing: border-box;
		font-size:$font-15;
		display: flex;
		align-items: center;
		margin-bottom:30rpx;
	}
	.c-label::before{
		content:'';
		display: inline-block;
		height:100%;
		width: 10px;
		border-right:8rpx solid $global-color;
		margin-right:20rpx;
	}
	
</style>
