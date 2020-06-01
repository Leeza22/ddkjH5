<template>
	<view class="full-width">
		<view  @click="onShowDatePicker('datetime')" class="table-item-content" v-if="changeValue ">{{changeValue}}</view>
		<view @click="onShowDatePicker('datetime')" class="table-item-content table-item-content-index" 
			v-if="cellInfo.fixedHeight && !changeValue">{{ tableList[valueName] | dateFormat(rule) | clipFormat1(column.dd)}}</view>	
		<view  @click="onShowDatePicker('datetime')" class="table-item-content" 
			v-if="!changeValue && !cellInfo.fixedHeight">{{value | dateFormat(rule)}}</view>
			
		<date-picker v-if="showPicker" :show="showPicker" :type="type" :value="mxValue" :show-tips="true"
		:begin-text="'开始时间'" :end-text="'结束时间'" :show-seconds="true"
		 @confirm="onSelected" @cancel="onCancel" ></date-picker>
	</view>
</template>

<script>
	import datePicker from '../form/mx-datepicker.vue'
	import {mapState} from 'vuex'
	// yyyy-mm-dd  'hh:ii' + (this.showSeconds ? ':ss' d日期对象 f格式
	const format=(d, f)=> {
			var o = {
				"m+": d.getMonth() + 1,
				"d+": d.getDate(),
				"h+": d.getHours(),
				"i+": d.getMinutes(),
				"s+": d.getSeconds(),
				"q+": Math.floor((d.getMonth() + 3) / 3),
			};
			if (/(y+)/.test(f))
				f = f.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(f))
					f = f.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return f;
		}
	export default{
		name:"Dwenben",
		components:{
			datePicker
		},
		props:{
			tableList:Object,
			column:Object,
			tableId:[Number,String],
			columnId:[Number,String],
			valueName:[String,Number],
			tmpTableId:[String,Number],
			cellInfo:[Object],
			tabletype:[Number,String]
		},
		data(){
			return{
				type:'' ,//日期picker 类型
				mxValue:'',
				orders:['year','month','day','hour','minute','second'],
				times:[
					{dt:'year',fm:'yyyy'},		
					{dt:'month',fm:'mm'},
					{dt:'day',fm:'dd'},
					{dt:'hour',fm:'hh'},
					{dt:'minute',fm:'ii'},
					{dt:'second',fm:'ss'},
				]
			
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
						// return true;
						let showValue = format(new Date(item.value.replace(/-/g, '/')),this.rule);
						if(showValue){	
							return showValue;
						}
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
			//控制弹出卡片
			showPicker(){
				if(this.isActive && this.activeItem.showPicker){
					return this.activeItem.showPicker;
				}
			},
			rule(){
				let checks = [];
				if(this.column && this.column.rule){
					let rule = JSON.parse(this.column.rule);
					if(rule && rule.checkList){
						rule.checkList = rule.checkList.split(',');
						if(rule.checkList.length>0){
							// 根据times数组排序
							rule.checkList.sort((a,b)=>{
								return this.orders.indexOf(a) - this.orders.indexOf(b)
							})
							if(rule.checkList && rule.checkList.length == 1){
								checks = this.times.slice(0,this.orders.indexOf(rule.checkList[0])+1)
							}else if(rule.checkList && rule.checkList.length > 1){
								checks = this.times.slice(this.orders.indexOf(rule.checkList[0]),this.orders.indexOf(rule.checkList[rule.checkList.length-1])+1)
							}
						}
					}
				}
				if(checks.length<1){
					checks = this.times;
				}
				let str = '';
				for(let k in checks){
					str += checks[k].fm
				}				
				// rule.checkList.indexOf('year')>-1? str += 'yyyy':'';
				// rule.checkList.indexOf('month')>-1? str += 'mm':'';
				// rule.checkList.indexOf('day')>-1? str += 'dd':'';
				// rule.checkList.indexOf('hour')>-1? str += 'hh':'';
				// rule.checkList.indexOf('minute')>-1? str += 'ii':'';
				// rule.checkList.indexOf('second')>-1? str += 'ss':'';
				str = str.replace(/yyyymm/, "yyyy-mm");
				str = str.replace(/mmdd/, "mm-dd");
				str = str.replace(/ddhh/, "dd hh");
				str = str.replace(/hhii/, "hh:ii");
				str = str.replace(/iiss/, "ii:ss");	
				return str;
			}
		},
		methods:{
			onShowDatePicker(type){
				this.$store.dispatch("changeActiveItem",{
					cellInfo:this.cellInfo,
					cellparams:{showPicker:true}
				})	
				this.type = type;
			},
			 onSelected(e) {//选择	
				//e.value 是固定的
				// this.mxValue = this[this.type];
				// console.log(this.rule)
				if(e) {	
					this.$store.dispatch("changeActiveItem",{
						cellInfo:this.cellInfo,
						cellparams:{
							value:e.value,
							// showValue:showValue,
							isupdate:true,
							showPicker:false,
						}
					})	
					// this.nvalue = format(new Date(e.value.replace(/-/g, '/')),this.rule);
		
				};		
				this.onCancel();				
			},
			//取消选择
			onCancel(){
				this.mxValue = this[this.type];
				this.type = '';
				this.$store.commit("initActiveItem");
			}
		}
	}
</script>

<style scoped lang='scss'>
	.full-width{}
</style>


