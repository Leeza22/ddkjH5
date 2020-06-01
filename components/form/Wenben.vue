<template>		
	<view class="nav-search">
		<uni-icons class="input-uni-icon" type="search" size="22" color="#666"></uni-icons>
		<input class="search-input" type="text" placeholder="输入筛选关键词" :value="value" @blur="changeSearch" @confirm="changeSearch">
	</view>	
</template>

<script>
	import {mapState} from 'vuex'
	import uniIcons from '../unis/uni-icons/uni-icons.vue'
	export default{
		components:{
			uniIcons
		},
		props:{
			//是一个列数组
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
            	children:state=>state.screen.children
            }),
			//checkquery中 相同列集合
			checks(){
				if(this.children && this.children.length>0){			
					return this.children.filter(v=>v.tmpId == this.tmpId)
				}			
			},
		},
		created() {
			this.value = '';
			if(this.checks && this.checks.length>0){
				this.value = this.checks[0].value;
			}
		},
		methods:{
			changeSearch(e){
				this.value = e.detail.value;	
				if(this.data && this.data.length>0){
					let children=[];
					this.data.forEach(v=>{
						children.push({
							tmpId:this.tmpId,
							columnId:v.column_id,
							operator:"like",
							value:this.value
						})
					})
					this.$store.commit("changeCondition",{
											children:children,
											value:this.value
										});	
				}else{
					uni.showToast({
						title:'无可搜索列',
						icon:'none'
					})
				}						
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.nav-search{
		width: 100%;
		margin:0 auto;
		height:40px;
		border-bottom:1rpx solid #eee;
		display: flex;
		align-items: center;
		padding:0 20rpx 10rpx 20rpx;
		// box-sizing: border-box;
		font-size:30rpx;	
		color:#666;
		/* text-align: center; */
	}
	.search-input{
		width: 100%;
		border-bottom:1rpx solid #eee;
		padding:10rpx;
	}
	.input-uni-icon{
		margin-right:10rpx;
		font-size:28rpx;
		color:#999;
	}
	.uni-input-placeholder{
		font-size:30rpx !important;
		color: #999 !important;
	}
</style>

