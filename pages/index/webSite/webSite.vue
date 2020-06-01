<template>
	<view>
		<web-view :src="url"  @message="getMessage"></web-view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				url:''
			}
		},
		onLoad(option) {
			this.url= option.url;		
		},
		methods: {
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

