<template>
	<view>
		<web-view :src="url" @message="getMessage"></web-view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				url:'/hybrid/html/uploadfile.html'
			}
		},
		computed:{
			params(){
				return this.$store.state.login.token;
			},
			...mapState({
				recordsAll:state=>state.table.recordsAll,
				editable:state=>state.table.editable,
				activeItem:state=>state.table.activeItem
			}),
			//编辑记录的value
			changeValue(){
				for(let item of this.recordsAll){
					if(	item
						&& item.tmpTableId == this.activeItem.tmpTableId
						&& item.columnId == this.activeItem.columnId 
						&& item.tableId == this.activeItem.tableId 
					){
						return item.value
					}
				}
			}
		},
		onLoad(option) {
			//上传成功 直接请求更新 然后跳回主页 然后刷新数据
			this.url=this.url+'?data='+this.params;
			// console.log(option.fileData)
			if(option.fileData){
				let fileName = option.fileData;
				// console.log(this.activeItem);
				if(this.activeItem.oldValue && this.activeItem.oldValue.length>0 || this.changeValue && this.changeValue.length>0){
					uni.showModal({
						content: '此操作将覆盖原有文件，是否继续',
						success:(res)=>{
							if (res.confirm) {	
								console.log(this.activeItem)
								this.$store.dispatch("changeActiveItem",{
									cellInfo:this.activeItem,
									cellparams:{
										value:fileName,
										isupdate:true
									}
								})
								// this.updateActiveItem({value:fileName,ischange:true})
								this.returnFun()
							} else if (res.cancel) {
								// console.log('用户点击取消');
							}
						}
					})
				}else{
					this.$store.dispatch("changeActiveItem",{
						cellInfo:this.activeItem,
						cellparams:{
							value:fileName,
							isupdate:true
						}
					})
					this.returnFun()
				}			
			}		
		},
		methods: {
			returnFun(){
				// #ifdef H5
				history.back(1);
				// #endif
				// #ifndef H5
				uni.navigateBack({
					delta:1
				})
				// #endif
			},
			getMessage(e) {
				this.$store.commit('updateFile',e.detail)
				uni.showModal({
					content: JSON.stringify(e.detail),
					showCancel: false
				})
				
			}
		}
	}
</script>

<style>

</style>
