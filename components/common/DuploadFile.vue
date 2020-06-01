<template>
	<view class="full-width position-relative">
		<!-- 展示 -->
		<view class="input-box">
			<view @tap.stop.prevent="showMenuFun" class="table-item-content" v-if="changeValue" >{{changeValue}}</view>
			<view @tap.stop.prevent="showMenuFun" class="table-item-content table-item-content-index" 
				v-if="!changeValue && cellInfo.fixedHeight" >{{tableList[valueName] | fileFormat}}</view>
			<view @tap.stop.prevent="showMenuFun" class="table-item-content" v-if="!changeValue && !cellInfo.fixedHeight">{{tableList[valueName] | fileFormat}}</view>	
			<uni-icons @tap="uploadFun" class="icon-arrow icon-right" type="arrowthinup" color="#ddd" size="14"></uni-icons>
		</view>
		
		<!-- 选择菜单 -->
		<view class="d_select show-list" v-if="isActive && showList">
			<!-- <text class="dropMenu-item" @tap="actFun('preview')">预览</text> -->
			<a :href="url" target="_blank" download="我是图" @click="downLoadFun" class="item-down">下载</a>
		<!-- 	<text class="dropMenu-item" @tap="actFun('download')">下载2</text>
			<text class="dropMenu-item" @tap="actFun('download3')">下载3</text> -->
			<text class="dropMenu-item" @tap="actFun('upload')">上传</text>
		</view>
		<!-- <web-view src=""></web-view> -->
	</view>	
</template>

<script>
	import $http from '@/common/api/request.js'
	import {mapState} from 'vuex'
	import uniIcons from '../unis/uni-icons/uni-icons.vue'
	import uniPopup from '@/components/unis/uni-popup/uni-popup.vue'

	export default{
		components:{
			uniIcons
		},
		props:{
			placeholder:{
				type:String,
				default:'请输入关键字'
			},
			columnId:Number, //columnId
			tableId:[Number,String,Object],//行id
			column:Object,
			tableList:Object,
			valueName:[String,Number],
			tmpTableId:[String,Number],
			cellInfo:[Object],
			tabletype:[Number,String]
		},
		data() {
			return {
				// showMenu:false,
				blobPath:'',
				url:''
			}
		},	
		filters:{
			fileFormat(value){
				if(value){
					let suffix = value.slice(value.lastIndexOf('.'));
					return suffix;
				}		
			}
		},
		computed:{
			value(){
				return this.tableList[this.valueName];
			},
			...mapState({
				recordsAll:state=>state.table.recordsAll,
				editable:state=>state.table.editable,
				activeItem:state=>state.table.activeItem
			}),
			changeValue(){	
				for(let item of this.recordsAll){
					if(	item
						&& item.tmpTableId == this.cellInfo.tmpTableId
						&& item.columnId == this.columnId 
						&& item.tableId == this.tableId 
					){
						// console.log(item.value)
						return decodeURI(item.value);
						// let str = item.value;
						// let suffix = str.slice(str.lastIndexOf('.'));
						// return '**'+suffix;
					}
				}
			},
			isActive(){
				
				if( this.activeItem
					&& this.activeItem.tmpTableId == this.cellInfo.tmpTableId
					&& this.activeItem.columnId == this.columnId 
					&& this.activeItem.tableId == this.tableId 
				){
					return true;
				}						
			},
			showList(){
				if(this.isActive && this.activeItem.showList){
					return this.activeItem.showList;
				}
			},
		},
		methods:{			
			uploadFun(){
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo
				})
				uni.navigateTo({
					url:'/pages/index/upload/upload'
				})		
			},
			showMenuFun(){
				if(this.showList){
					this.$store.commit('initActiveItem')
				}else{
					let fileName = this.changeValue || this.value;
					this.getUrl(fileName)
					this.$store.dispatch("changeActiveItem",{
						cellInfo:this.cellInfo,
						cellparams:{
							showList:true
						}
					})
				}	
			},
			getUrl(fileName){
				if(fileName || fileName === 0){
					return $http.downloadFile2(fileName).then(url=>{
						// console.log(url)
						this.url = url;			
					})
				}		
			},
			async actFun(val){
				let fileName = this.changeValue || this.value;
				if(val === 'upload'){
					this.$store.commit('initActiveItem')
					this.uploadFun()
				}else if(val === 'download'){
					// let fileName = this.changeValue || this.value;
					if(fileName){

						// $http.downloadFile(fileName).then(url=>{
						// 	console.log(url)
						// 	this.url = url;
							
						// })
						
						// let url = 'https://doc.wendoc.com/word/bde80cbcc2948a222a29694e150750c7759e81050-1.doc';
						// $http.downloadFile(fileName)
						// 判断类型
						// // #ifdef APP-PLUS
						// // #endif
						// // #ifdef H5
						// let res = await $http.downloadFile1(fileName).catch(error=>{})
						// // #endif
						// if(res){
						// 	uni.showToast({
						// 		title:"下载完成",
						// 		icon:'none'
						// 	})
						// }
					}	
				}else if(val === 'preview'){
					// uni.downloadFile({
					//   url: 'https://example.com/somefile.pdf',
					//   success: function (res) {
					//     var filePath = res.tempFilePath;
					//     uni.openDocument({
					//       filePath: filePath,
					//       success: function (res) {
					//         console.log('打开文档成功');
					//       }
					//     });
					//   }
					// });
				}else if(val === 'download3'){
					// $http.downloadFile2(fileName).then(url=>{
					// 	console.log(url)
						
					// })
				}
			},
			downLoadFun(){
				this.$store.commit('initActiveItem')
			},
			readFile(){
			},
			chooseFun(){
				
				
			}
		
		}
	}
</script>

<style scoped lang="scss">
	.position-relative{
		position: relative;
	}
	.input-box{
		display: flex;
		align-items: center;
	}
	.icon-right{
		float:right;
	}
	.input-box::after{
		content: '';
		display: block;
		clear: both;
	}
	.d_select{
		
		display: flex;
		flex-direction: column;
		// justify-content: center;
		// text-align: center;
		font-size: $font-13;
		min-width: 60px;
		max-width: 200px;
		max-height: 100px;
		box-sizing: border-box;
		position: absolute;
		top: 32px;
		padding:0 10rpx;
		background-color: #FFFFFF;
		border-radius: 4px;
		box-shadow: #DDDDDD 2px 2px 8px, #DDDDDD -2px -2px 8px;
		z-index: 888;
	}
	.d_select::before {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border-bottom: solid 6px #FFFFFF;
		border-right: solid 6px transparent;
		border-left: solid 6px transparent;
		left: 50%;
		top: -6px;
		margin-left: -6px;
	}
	.dropMenu-item{
		padding:6rpx 12rpx;
		color:#666;
	}
	.item-down{
		text-decoration: none;
		color:#666;
	}
</style>


