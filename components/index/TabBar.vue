<template>
	<view class="tabbar-box" @click.stop.prevent="blurEdit" v-if="showTabbar">
		<view class="tabbar-item" 
		    :class="menu.path === item.path? 'tabbar-item-active':''"
			v-for="(item,index) in tabbarList" 
			:key="index"
			@click="changeTab(item,'index')">
			<text class="iconfont tabbar-icon">&#xe62a;</text>
			<view class="tabbar-title">
				<text v-if="item.pageName">{{item.pageName}}</text>
				<text v-else>未命名</text>
			</view>
		</view>
		<view class="tabbar-item" :class="officeActive? 'tabbar-item-active':''" @click="toOfficePage">
			<text class="iconfont tabbar-icon">&#xe62a;</text>
			<text class="tabbar-title">办公</text>
		</view>
	</view>
</template>

<script>
	export default{
		computed:{
			tabbarList(){
				if(this.$store.getters.menuFlat){
					return this.$store.getters.menuFlat.slice(0,4);
				}	
			},
			officeActive(){
				for(let n in this.tabbarList){
					if(this.menu.path == this.tabbarList[n].path){
						return false
					}
				}
				return true
			},
			recordsAll(){
				return this.$store.state.table.recordsAll;
			}
		},
		props:{
			menu:{
				type:[Object,String]
			}
		},
		data(){
			return {
				windowHeight:'',
				showTabbar:true,
				toMenu:null //目标菜单
			}
		},
		methods:{
			//点击tanbar 跳转
			changeTab(menu){
				if(this.menu && this.menu.path === menu.path) return;
				this.toMenu = menu;
				this.saveRecords()		
			},
			async changeMenuFun(){
				//切换菜单
				if(this.toMenu){
					if(this.toMenu && this.toMenu.path == 'schedule'){
						uni.reLaunch({
							url:'/pages/office/schedule/schedule'
						})
					}else{
						this.$store.commit('updatePath',this.toMenu.path);
						let res = await this.$store.dispatch('getPath').catch(errpr=>{});
						if(res){
							uni.reLaunch({
								url:'/pages/index/index'
							})
						}else{
							uni.showToast({
								title:'页面请求失败',
								icon:'none'
							})
						}		
					}					
				}
			},
			saveRecords(){
				//跳转之前 是都有需要保存的数据
				// console.log(this.recordsAll ,this.recordsAll.length,this.recordsAll[0])
				if(this.recordsAll && this.recordsAll.length>0){
					uni.showModal({
					     content:'有未保存的修改，是否保存？',
						 cancelText:'不保存',
						 confirmText:'保存',
						 success:(res)=> {
						 	if(res.confirm){
								//保存所有表修改与添加		
								this.$store.dispatch('saveOneTable',{
									tmpId:this.menu.tmpId,
									pageId:this.menu.pageId,
									tmpTableId:'page_'+this.menu.tmpId+'_'+this.menu.pageId
								}).catch(error=>{});
								this.$store.commit('initRows')
								this.$store.commit('initTableState')
								this.changeMenuFun()
						 		//保存 修改
						 	}else if(res.cancel){
								// 不保存 直接返回
								this.$store.commit('initRows')	
								this.$store.commit('initTableState')
								this.changeMenuFun()
							}
						 }
					})
				}else{
					this.changeMenuFun()
				}	
			},
			toOfficePage(){			
				if(this.menu && this.menu.path === 'office') return;		
				uni.navigateTo({
					url:'/pages/office/office'
				})
			},
			blurEdit(){
				this.$store.commit("initActiveItem");
				this.$store.commit("changeEditable",false);
				this.$store.commit("changeDeleteStatus",{tmpId:'',pageId:'',status:false});
			}
		},
		mounted() {
		    uni.getSystemInfo({
		        success: (res)=> {
		            this.windowHeight = res.windowHeight;
		        }
		    });    
		    uni.onWindowResize((res) => {
		        if(res.size.windowHeight+40 < this.windowHeight){
		            this.showTabbar = false
		        }else{
		            this.showTabbar = true
		        }
		    })
		}
	}
</script>

<style scoped lang="scss">
	/* tabbar样式*/
	.tabbar-box{
		height: 50px;
		width: 100%;
		box-sizing: border-box;
		border-top:1rpx solid #eee;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		bottom:0;
		z-index: 888;
		color:#999;
		background-color: #fff;
	}
	.tabbar-icon{
		font-size:40rpx;
		line-height:60rpx;
	}
	.tabbar-title{
		flex-basis: 100%;
		text-align: center;
		font-size:12px;
		line-height:12px;
		// padding-bottom:5px;
		height:12px;
		width: 100%;
		overflow: hidden;
		margin-bottom:5px;
	}
	.tabbar-item{
		flex:1; //等比分配
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.tabbar-item-active{
		color:$global-color
	}
</style>
