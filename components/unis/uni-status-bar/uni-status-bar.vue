<template>
	<view :style="{ height: statusBarHeight }" class="uni-status-bar">
		<view class="top_view" :style="{ height: statusBarHeight }"></view>
		<slot />
	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
	export default {
		name: 'UniStatusBar',
		data() {
			return {
				statusBarHeight: statusBarHeight
			}
		}
	}
</script>

<style scoped>
	.uni-status-bar {
		width: 750rpx;
		height: 20px;
		background-color: #fff;
		/* height: var(--status-bar-height);
 */
	}
	.top_view{
		width:100%;
		background-color: #fff;
		top:0;
		position: fixed;
		z-index: 999;
	}
</style>