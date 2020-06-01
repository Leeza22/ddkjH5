<template>
	<view class="uni-pagination">
		<view class="chooseSize">
			<view class="size-show" @click="showSelectFun"><text class="size-text">{{size}} 条/页</text></view>

			<view class="size_select" v-if="showSizes" ref="sizeshow">
				<scroll-view scroll-y="true" class="select-scroll">
					<view class="d_select-item" v-for="(item,index) in sizes" 
						:key="index"
						:style="{'color':item === currentIndex? color:'#666'}"
						@click="onSelectorClick(index)">
						<text class="size-text">{{item}}条/页</text>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="current-box">
			<view class="uni-pagination__btn" :class="currentIndex === 1 ? 'uni-pagination--disabled' : 'uni-pagination--enabled'" :hover-class="currentIndex === 1 ? '' : 'uni-pagination--hover'" :hover-start-time="20" :hover-stay-time="70" @click="clickLeft">
				<template v-if="showIcon===true || showIcon === 'true'">
					<uni-icons class="icon-arrow" color="#000" size="14" type="arrowleft" />
				</template>
				<template v-else><text class="uni-pagination__child-btn">{{ prevText }}</text></template>
			</view>
			<view class="uni-pagination__num">
				<view class="uni-pagination__num-current" ref="showsizes" @click="showCurrentFun">
					<text class="uni-pagination__num-current-text" :style="{color:color}">{{ currentIndex }}</text><text class="uni-pagination__num-current-text">/{{ totalPage || 0 }}</text>
				</view>
				<view class="size_select" v-if="showCurrent">
					<scroll-view scroll-y="true" class="select-scroll">
						<view class="d_select-item" v-for="(item,index) in maxPageArr" 
							:key="index"
							:style="{'color':item === currentIndex? color:'#666'}"
							@click="onCurrentConfirm(item)">
							<text class="size-text">{{item}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="uni-pagination__btn" :class="currentIndex === totalPage ? 'uni-pagination--disabled' : 'uni-pagination--enabled'" :hover-class="currentIndex === totalPage ? '' : 'uni-pagination--hover'" :hover-start-time="20" :hover-stay-time="70" @click="clickRight">
				<template v-if="showIcon===true || showIcon === 'true'">
					<uni-icons class="icon-arrow" color="#000" size="14" type="arrowright" />
				</template>
				<template v-else><text class="uni-pagination__child-btn">{{ nextText }}</text></template>
			</view>
			
		</view>	
	</view>
</template>

<script>
	import uniIcons from '../unis/uni-icons/uni-icons.vue'
	// import selectMenu from './selectMenu.vue'
	/**
	 * Pagination 分页器
	 * @description 分页器组件，用于展示页码、请求数据等
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=32
	 * @property {String} prevText 左侧按钮文字
	 * @property {String} nextText 右侧按钮文字
	 * @property {Number} current 当前页
	 * @property {Number} total 数据总量
	 * @property {Number} size 每页数据量
	 * @property {Number} showIcon = [true|false] 是否以 icon 形式展示按钮
	 * @event {Function} change 点击页码按钮时触发 ,e={type,current} current为当前页，type值为：next/prev，表示点击的是上一页还是下一个
	 */

	export default {
		name: 'UniPagination',
		components: {
			uniIcons,
			// selectMenu
		},
		props: {
			prevText: {
				type: String,
				default: '上一页'
			},
			nextText: {
				type: String,
				default: '下一页'
			},
			current: {
				type: [Number, String],
				default: 1
			},
			total: { // 数据总量
				type: [Number, String],
				default: 0
			},
			pageSize: { // 每页数据量 默认初始
				type: [Number, String],
				default: 3
			},
			showIcon: { // 是否以 icon 形式展示按钮
				type: [Boolean, String],
				default: false
			},
			sizes:{  //每页数据量 可选数组
				type:[Array]
			},
			tmpTableId:[Number,String],
			totalPage:{
				type:[Number,String],
				default:1
			}
		},
		data() {
			return {
				currentIndex: 1,
				// showSizes:false,
				// showCurrent:false,
				dsize:'' //记录当前设置的每页数据量
			}
		},
		computed: {
			popshow(){
				let pop = this.$store.state.table.popshow;
				if(pop && pop.tmpTableId == this.tmpTableId){
					return pop
				}
			},
			showSizes(){
				if(this.popshow && this.popshow.popname == 'sizes'){
					return true
				}
			},
			showCurrent(){
				if(this.popshow && this.popshow.popname == 'current'){
					return true
				}
			},
			color(){
				return this.$store.state.color;
			},			
			maxPageArr(){
				if(this.totalPage){
					let arr=[];
					for(let n=1;n<this.totalPage+1;n++){
						arr.push(n);
					}
					return arr;
				}
			},
			//最终展示每页数据量
			size:{
				get(){
					return this.dsize || Number(this.pageSize);
				},
				set(val){}
			}
		},
		watch: {
			current(val) {
				this.currentIndex = +val
			},
			popshow(val){
				if(val && val.tmpTableId == this.tmpTableId){
					let fun1 = (e)=>{
						if(!this.$el.contains(e.target)){
							this.$store.commit('changePopshow',{
								tmpTableId:this.tmpTableId,
								popname:''
							})
						}
					}
					if(val.popname != ''){	
						document.addEventListener('click',fun1,true)
					}else{
						document.removeEventListener('click',fun1,true)
					}
				}
			}
		},
		created() {
			this.currentIndex = +this.current
		},
		methods: {
			clickLeft() {
				if (Number(this.currentIndex) === 1) {
					return
				}
				this.currentIndex -= 1
				this.change('prev')
			},
			clickRight() {
				if (Number(this.currentIndex) === this.maxPage) {
					return
				}
				this.currentIndex += 1
				this.change('next')
			},
			change(e) {
				this.$emit('change', {
					type: e,
					current: this.currentIndex,
					size:this.size
				})
			},
			onSelectorClick(index){
				if(this.size === this.sizes[index]){
					
				}else{
					this.dsize = this.sizes[index]
					this.change('size');
				}
				// this.showSizes =  false;
				this.closeSelect()
			},
			closeSelect(){
				this.$store.commit('changePopshow',{
					tmpTableId:this.tmpTableId,
					popname:''
				})
			},
			showSelectFun(){
				if(this.showSizes){
					this.closeSelect()
				}else{
					this.$store.commit('changePopshow',{
						tmpTableId:this.tmpTableId,
						popname:'sizes'
					})
					
				}
				// this.showSizes = !this.showSizes;
			},
			showCurrentFun(){
				if(this.showCurrent){
					this.closeSelect()
				}else{
					this.$store.commit('changePopshow',{
						tmpTableId:this.tmpTableId,
						popname:'current'
					})
				}
				// this.showCurrent = !this.showCurrent;
			},
			onCurrentConfirm(current){
				if(this.currentIndex === current){
					
				}else{
					this.currentIndex = current	
					this.change('current');		
				}
				this.closeSelect()
			}
		}
	}
</script>

<style scoped>
	.chooseSize{
		position: relative;
		/* background-color: #F0AD4E; */
		padding:0 6rpx;
		width: 120rpx;
		text-align: center;
	}
	.select-scroll{
		box-shadow: 0 0 2px 2px #eee;
		padding:4rpx;
		border-radius: 6rpx;
		text-align: center;
		max-height: 300rpx;
		overflow: auto;
		background-color: #fff;
	}
	.size_select{
		position: absolute;
		bottom:60rpx;left:0;
		width: 100%;
		
		z-index:100;		
	}
	.size-show{
		display: flex;
		align-items: center;
	}
	.size-text{
		font-size:26rpx;
	}
	.d_select-item{
		
	}
	.uni-pagination {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		position: relative;
		/* overflow-x: hidden; */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height:100%;
	}

	.uni-pagination__btn {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 60rpx;
		font-size: 28rpx;
		position: relative;
		/* background-color: #f8f8f8; */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
		/* border-width: 1px;
		border-style: solid;
		border-color: #e5e5e5; */
	}
	.icon-arrow{
		line-height:28rpx;
	}
	.uni-pagination__child-btn {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		font-size: 28rpx;
		position: relative;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	.current-box{
		/* position: relative; */
		display: flex;
	}
	.uni-pagination__num {
		position: relative;
		width: 60rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #333;
	}

	.uni-pagination__num-current {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-pagination__num-current-text {
		font-size: 15px;
	}

	.uni-pagination--enabled {
		color: #333333;
		opacity: 1;
	}

	.uni-pagination--disabled {
		opacity: 0.3;
	}

	.uni-pagination--hover {
		color: rgba(0, 0, 0, .6);
		background-color: #f1f1f1;
	}
</style>