<template>
	<view class="form-item">
		<view class="group">
			<view class="date-print">
				<input class="d-input" type="text" disabled="disabled" :value="checkedItem && checkedItem.length>0?checkedItem[0].label : startDate" @click="onShowDatePicker('rangetime')">
				<text class="d-zhi">至</text>
				<input class="d-input" type="text" disabled="disabled" :value="checkedItem && checkedItem.length>1?checkedItem[1].label : endDate" @click="onShowDatePicker('rangetime')">
			</view>
			<date-picker v-if="showPicker" :show="showPicker" :type="type" :value="value" :show-tips="true" 
			:begin-text="'开始时间'" :end-text="'结束时间'" :show-seconds="true"
			 @confirm="onSelected" @cancel="onCancel" ></date-picker>
			
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import datePicker from './mx-datepicker.vue'
	function getDate(type) {
		const date = new Date();
	
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
	
		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
	
		return `${year}-${month}-${day}`;
	}
	// function format(d, f) {
	// 	var o = {
	// 		"m+": d.getMonth() + 1,
	// 		"d+": d.getDate(),
	// 		"h+": d.getHours(),
	// 		"i+": d.getMinutes(),
	// 		"s+": d.getSeconds(),
	// 		"q+": Math.floor((d.getMonth() + 3) / 3),
	// 	};
	// 	if (/(y+)/.test(f))
	// 		f = f.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
	// 	for (var k in o)
	// 		if (new RegExp("(" + k + ")").test(f))
	// 			f = f.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	// 	return f;
	// }
	export default{
		components:{
			datePicker
		},
		props:{
			data:{
				type:[Array,Object]
			}
		},
		data(){
			return{
				date: getDate({
					format: true
				}),	
				startDate:'开始日期',
				endDate:'结束日期',		
				showPicker: false,
				time: '00:00:00',
				datetime: '',
				range: [],
				rangetime: [],
				type: '', //picker类型
				value: '',//picker中的值
				checkedItem:[{label:'',value:''},{label:'',value:''}],
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
			},
			rule(){
				// return "year,month,day"
				return 'yyyy-MM-dd'
			}
		},
		created() {
			this.checkedItem.splice(0,this.checkedItem.length)
			if(this.checks && this.checks.length>0){
				this.checks.forEach(v=>{
					if(v.operator === 'ge'){
						this.ruleChange(v.value,this.rule,res=>{
							v.label = res;
						})
						this.checkedItem.splice(0,1,v);
					}
					if(v.operator === 'le'){
						this.ruleChange(v.value,this.rule,res=>{
							v.label = res;
						})
						this.checkedItem.splice(1,1,v);
					}
				})
			}
		},
		methods:{
			ruleChange(datetime,format,callback){
				// yyyy-MM-dd hh:mm:ss
				let dates = new Date(datetime.replace(/-/g, '/'))
				let date = {
				            "M+": dates.getMonth() + 1,//月份
				            "d+": dates.getDate(),//日 
				            "h+": dates.getHours(),//小时
				            "m+": dates.getMinutes(),//分
				            "s+": dates.getSeconds(),//秒
				            "q+": Math.floor((dates.getMonth() + 3) / 3),//季度 
				            "S+": dates.getMilliseconds(),//毫秒 
				           }
				        ;
				        if (/(y+)/i.test(format)) {
				            format = format.replace(RegExp.$1, (dates.getFullYear() + '').substr(4 - RegExp.$1.length));
				        }
				        for (let k in date) {
				            if (new RegExp("(" + k + ")").test(format)) {
				                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
				            }
				        };
						callback(format)
			},
			onShowDatePicker(type){
				this.type = type;
				this.showPicker = true;
				// console.log(this.checkedItem)
				if(this.checkedItem && this.checkedItem.length>0){
					this.value = [this.checkedItem[0].value,this.checkedItem[1].value]
				}else{
					//初始化
					this.value = this[type];
				}
			},
			 onSelected(e) {//选择
				this.showPicker = false;
				this.value = this[this.type];
				if(e) {
					this.ruleChange(e.value[0],this.rule,res=>{
						this.checkedItem.splice(0,1,{value:e.value[0],label:res})
					})
					this.ruleChange(e.value[1],this.rule,res=>{
						this.checkedItem.splice(1,1,{value:e.value[1],label:res})
					})
				}
				let query=[];
				if(this.checkedItem && this.checkedItem.length>0){		
					query.splice(0,1,{
						tmpId:this.tmpId,
						columnId:this.data.columnId,
						operator:"ge",
						value:this.checkedItem[0].value
					})
					query.splice(1,1,{
						tmpId:this.tmpId,
						columnId:this.data.columnId,
						operator:"le",
						value:this.checkedItem[1].value
					})	
				}
				this.$store.commit("changeCondition",{
										query:query,
										columnId:this.data.columnId,
									});
			},
			//取消选择
			onCancel(){
				this.showPicker = false;
			}				
		}
	}
</script>

<style scoped lang="scss">
.group{
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	padding:0 20rpx;
}
.date-print{
	display: flex;
	font-size:$font-14;
	align-items: center;
}
.d-input{
	font-size:$font-14;
	color:$text-color-6;	
	/* width: 40%; */
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
