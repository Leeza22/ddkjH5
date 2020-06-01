<template>
	<view class="schedule">
		<!-- 顶部 -->
		<view class="topbar" :style="{'top':top+'px'}">
			<picker-view indicator-class="indicator-center" indicator-style="height:50px" mask-class="picker-mask" 
				:value="daysCheck" 
				@change="pickerChange"
				@pickend="pickerEnd"
				 class="picker-date">
				<picker-view-column>			
					<view class="pick-item" v-for="(item,i) in days" :key="i">
						<view v-if="item == day" class="topbar-title">{{todaytip}}</view>
						<view v-else>{{item}}</view>
					</view>
				</picker-view-column>
			</picker-view>
			<uni-icons class="topbar-icon" type="arrowdown" size="16" color="#666"></uni-icons>
			<uni-icons type="plusempty" size="30" :color="color" class="icon-add-top" @click="addTaskFun"></uni-icons>
		</view>
		
		<!-- 顶部 -->
		<!-- 任务列表 -->
		<view class="task-list" v-for="(task,index) in scheduleData" :key="task.id">
			<view class="list-top">
				<view class="list-top-left">
					<view class="check-tab" :class="checkedIds && checkedIds.indexOf(task.id)>-1?'checked-class':''" @click="checkFun(task,index)">
						<uni-icons v-if="checkedIds && checkedIds.indexOf(task.id)>-1" type="checkmarkempty" color="#fff" size="16"></uni-icons>
					</view>
					<input type="text" class="list-title" :value="task.title" 
						@blur="updateTask($event,task,'theme')" 
						@confirm="updateTask($event,task,'theme')" >
				</view>			
				<view class="list-top-right">			
					<text class="list-time" @click="updateTaskFun">{{task.start_time | startFormat}}</text>
					<view class="icon-toup">顶</view>
					<!-- <view class="icon-todown">撤</view> -->
				</view>
			</view>
			<view class="list-content">
				<view class="iconfont icon-del" v-if="checkedIds && checkedIds.indexOf(task.id)>-1">&#xe626;</view>
				<textarea class="list-remark" :value="task.remark" :style="contentfocus?'':'max-height: 80rpx;'" 
					:auto-height="contentfocus"
					 @blur="updateTask($event,task,'content')"
					 @confirm="updateTask($event,task,'content')" />
				<!-- <textarea class="list-remark" :value="task.remark" :style="contentfocus?'':'max-height: 90rpx;'" :auto-height="contentfocus" /> -->
			</view>
		</view>
		<!-- 任务列表 -->
		<!-- 底部tabbar -->
		<tabBar :menu="{path:'office'}"></tabBar>
		
		<!-- 添加日程 -->
		<!-- <view class="task-add" @click="addTaskFun">
			<uni-icons type="plusempty" size="20" color="#fff"></uni-icons>
		</view> -->
		<!-- 添加日程弹窗 -->
		<uni-popup ref="showpopup" :type="type" @change="change">
			<view class="popup-content">
				<view class="pop-top">
					{{poptitle}}
					<uni-icons type="closeempty" size="28" color="#999" @click="addCancel('popup')"></uni-icons>
				</view>
				<form @submit="addFormSubmit">
					<view class="add-theme">
						<view class="add-theme-label">主题</view>
						<input type="text" :value="add.title" name="title" placeholder="请输入日程主题" @blur="addInputBlur($event,'title')" @confirm="addInputBlur($event,'title')" />
					</view>
					<view class="add-content">
						<view class="add-theme-label">内容</view>
						<textarea :value="add.content" name="content" placeholder="请输入日程内容" 
							placeholder-class="textarea-placeholder"
							 class="add-content-content"
							 @blur="addInputBlur($event,'content')"
							 @confirm="addInputBlur($event,'content')"/>
					</view>
					<view class="add-time">
						<view class="add-time-item add-time-start">
							<text class="add-theme-label">开始时间</text>
							<text v-text="add.start_time?add.start_time:'选择日期时间'" 
								:class="add.start_time?'add-time-start-title':'textarea-placeholder'" @click="showStartFun" />	
							<input hidden type="text" :value="add.start_time" name="start_time" />
						</view>						
					</view>
					<view class="add-time-item ">
						<view class="add-time-last">
							<view class="add-theme-label">持续时间</view>
							<view class="add-time-last-box">		
								<view class="add-time-last-item">
									<view class="check-tab-last" :class="add.day || add.hour?'checked-class':''" @click="checkFun">
										<uni-icons v-if="add.day || add.hour" type="checkmarkempty" color="#fff" size="16"></uni-icons>
									</view>
									<input class="time-last-title" :cursor="-1" type="number" :value="add.day" name="day"
										@blur="lastTimeComfirm($event,'d')"
										@confirm="lastTimeComfirm($event,'d')"/>
									<text>天</text>
									<input class="time-last-title" type="number" :value="add.hour" name="hour"
										@blur="lastTimeComfirm($event,'h')"
										@confirm="lastTimeComfirm($event,'h')"/>
									<text>小时</text>
								</view>
								<view class="add-time-last-item" @click="unLastTime">
									<view class="check-tab-last" :class="!add.day && !add.hour?'checked-class':''" >
										<uni-icons v-if="!add.day && !add.hour" type="checkmarkempty" color="#fff" size="16"></uni-icons>
									</view>
									<text>不持续</text>
								</view>
							</view>
						</view>
					</view>	
				
					<view class="add-partner">
						<view class="add-theme-label">参与人</view>
						<view class="add-partner-item">
							<!-- <text v-text="add.owner_user_ids"></text>-->
							<view v-for="(partner,index) in checkedUsers" :key="partner.user_id" class="add-partner-checked">
								<text>{{partner.realname}}</text>
								<uni-icons class="icon-clear" type="clear" size="18" color="#eee" @click="removePartnerFun(partner)"></uni-icons>
							</view>
							
							<uni-icons type="plusempty" size="24" :color="color" @click="addPartnerFun"></uni-icons>
						</view>
						
					</view>
					<view class="add-handel">
						<!-- <button type="default" form-type="submit">保存</button> -->
						<view class="d-btn btn-save" @click="addConfirmFun">保存</view>
						<view class="d-btn btn-cancel" @click="addCancel('popup')">取消</view>
					</view>
				</form>
			</view>
		</uni-popup>
		
		<date-picker v-if="showPicker" :show="showPicker" :type="dateType" :value="mxValue" :show-tips="true"
		:begin-text="'开始时间'" :end-text="'结束时间'" :show-seconds="true"
		 @confirm="onDateSelected" @cancel="onDateCancel" ></date-picker>
		
		<!-- v-if 控制按需加载 不然初次渲染页面就会加载加载组件 -->
		<select-partner v-if="showUserSelect"
			:showCard="showUserSelect" 
			:selectItems="selectUsers" 
			:hasCheched="checkedUsers"
			@changes="selectPartnerChange" 
			@hideCard="hideSelectPartner"></select-partner>		
	</view>
</template>

<script>
	/**
	 * 工具函数库
	 */
	const DateTools = {
		/**
		 * 解析标准日期格式
		 * @param s 日期字符串
		 * @return 返回Date对象
		 */
		parse: s => new Date(s.replace(/(年|月|-)/g, '/').replace(/(日)/g, '')),
		/**
		 * 比较日期是否为同一天
		 * @param a Date对象
		 * @param b Date对象
		 * @return Boolean
		 */
		isSameDay: (a, b) => a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear() && a.getDate() == b.getDate(),
		/**
		 * 格式化Date对象
		 * @param d 日期对象
		 * @param f 格式字符串
		 * @return 返回格式化后的字符串
		 */
		format(d, f) {
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
		},
		/**
		 * 用于format格式化后的反解析
		 * @param s 日期字符串
		 * @param f 格式字符串
		 * @return 返回Date对象
		 */
		inverse(s, f) {
			var o = {
				"y": '',
				"m": '',
				"d": '',
				"h": '',
				"i": '',
				"s": '',
			};
			let d = new Date();
			if (s.length != f.length) return d;
			for (let i in f)
				if (o[f[i]] != undefined) o[f[i]] += s[i];
			if (o.y) d.setFullYear(o.y.length < 4 ? (d.getFullYear() + '').substr(0, 4 - o.y.length) + o.y : o.y);
			o.m && d.setMonth(o.m - 1, 1);
			o.d && d.setDate(o.d - 0);
			o.h && d.setHours(o.h - 0);
			o.i && d.setMinutes(o.i - 0);
			o.s && d.setSeconds(o.s - 0);
			return d;
		},
		/**
		 * 获取日历数组（42天）
		 * @param date 日期对象或日期字符串
		 * @param proc 处理日历(和forEach类似)，传递一个数组中的item
		 * @return Array
		 */
		getCalendar(date, proc) {
			let it = new Date(date),
				calendars = [];
			it.setDate(1);
			it.setDate(it.getDate() - ((it.getDay() == 0 ? 7 : it.getDay()) - 1)); //偏移量
			for (let i = 0; i < 42; i++) {
				let tmp = {
					dateObj: new Date(it),
					title: it.getDate(),
					isOtherMonth: it.getMonth() < date.getMonth() || it.getMonth() > date.getMonth()
				};
				calendars.push(Object.assign(tmp, proc ? proc(tmp) : {}));
				it.setDate(it.getDate() + 1);
			}
			return calendars;
		},
		/**
		 * 获取日期到指定的月份1号(不改变原来的date对象)
		 * @param d Date对象
		 * @param v 指定的月份
		 * @return Date对象
		 */
		getDateToMonth(d, v) {
			let n = new Date(d);
			n.setMonth(v, 1);
			return n;
		},
		/**
		 * 把时间数组转为时间字符串
		 * @param t Array[时,分,秒]
		 * @param showSecinds 是否显示秒
		 * @return 字符串 时:分[:秒]
		 */
		formatTimeArray(t, s) {
			let r = [...t];
			if (!s) r.length = 2;
			r.forEach((v, k) => r[k] = ('0' + v).slice(-2));
			return r.join(':');
		},
		//最近几天
		getDays(day){        
		　　let today = new Date();
		　　let targetday_milliseconds=today.getTime() + 1000*60*60*24*day;	
		　　today.setTime(targetday_milliseconds); //注意，这行是关键代码	
		　　let tYear = today.getFullYear();	
		　　let tMonth = today.getMonth();
		　　let tDate = today.getDate();
		　　tMonth = DateTools.doHandleMonth(tMonth + 1);
		
		　　tDate = DateTools.doHandleMonth(tDate);
		
		　　return tYear+"-"+tMonth+"-"+tDate;	
		},
		doHandleMonth(month){	
		　　let m = month;	
		　　if(month.toString().length == 1){	
		　　　　m = "0" + month;
		　　}
		　　return m;
		}
	};
	
	import tabBar from '@/components/index/TabBar.vue'
	import { getOaEventList,createOaEvent,getUserSelect,updateOaEvent } from '@/common/methods/index.js'
	import uniIcons from '@/components/unis/uni-icons/uni-icons.vue'
	import uniPopup from '@/components/unis/uni-popup/uni-popup.vue'
	import datePicker from '@/components/form/mx-datepicker.vue'
	import selectPartner from '@/components/types/SelectPartner.vue'
	import validate from '@/common/methods/validate.js'
	export default{
		components:{
			tabBar,
			uniIcons,
			uniPopup,
			datePicker,
			selectPartner
		},
		data() {
			let day =  DateTools.format(new Date(),'yyyy-mm-dd')
			return {
				scheduleData:[], //获取的任务数据
				checkedItem:[], // 任务选中 标记
				daysCheck:[], //头部 日期picker中的选中值
				days:[],//顶部日期筛选范围数据
				years:[],
				months:[],
				day:day,
				todaytip:'今日任务',
				pickcheckIndex:'',
				type:'',
				contentfocus:false,
				poptitle:'创建日程',
				//添加日程
				add:{
					title:'',
					content:'',
					start_time:'',
					remark:'',
					owner_user_ids:'',
					day:0,
					hour:0
				},
				tips:{
					theme:'请填写日程主题',
					content:'请填写日程内容',
					start_time:'请选择开始时间',
					remark:'请填写备注',
					owner_user_ids:'请选择参与人员',
					day:'请填写持续时间',
					hour:'请填写持续时间'
				},
				showPicker:false,
				dateType:'datetime',
				mxValue:'',
				showUserSelect:false,
				selectUsers:[],
				checkedUsers:[]
			}
		},
		filters:{
			startFormat(value){
				return DateTools.format(new Date(value),'hh:ii')
			}
		},
		computed:{
			checkedIds(){
				if(this.checkedItem && this.checkedItem.length>0){
					let ids = [];
					for(let n in this.checkedItem){
						ids.push(this.checkedItem[n].id)
					}
					return ids;
				}
			},
			top(){
				return this.$store.state.system.statusBarHeight;
			},
			color(){
				return this.$store.state.color
			},
			//日程属于者信息  user_id
			ownerInfo(){
				if(this.scheduleData && this.scheduleData.length>0){
					return this.scheduleData[0]
				}
			}
		},
		onLoad() {
			this.getScheduleData(this.day)
			this.getPickerData().then(data=>{
				if(data && data.length>0){
					this.days = data;
					this.daysCheck = [data.indexOf(this.day)];
				}			
			})
		},
		methods: {
			//获取任务数据
			async getScheduleData(day){
				let range = await this.getTimerange(day)
				let objParams = {
					"start_time":'',
					"end_time":'',
					"event_type":"-1",
					"event_degree":"-1",
					"is_complate":"-1",
					"user_id":"",
					"owner_user_ids":[],
					"key":"",
				}
				
				let params = Object.assign({},objParams,range)
				getOaEventList(params).then(data=>{
					if(data) this.scheduleData.splice(0,this.scheduleData.length,...data)
				})
			},
			//传入一个yyyy-mm-dd 等日期 获取这天的开始与结束时间
			getTimerange(value){
				let ds1 = new Date(value).setHours(0,0,0,0);
				let de1 = new Date(value).setHours(23,59,59,1000);			
				let ds = DateTools.format(new Date(ds1),'yyyy-mm-dd hh:ii:ss');
				let de = DateTools.format(new Date(de1),'yyyy-mm-dd hh:ii:ss')
				return Promise.resolve({start_time:ds,end_time:de})
			},
			//任务列表 标记
			checkFun(task,index){
				let findRes = false;
				for(let i in this.checkedItem){
					if(this.checkedItem[i].id == task.id){
						findRes = true;
						this.checkedItem.splice(i,1);
						break;
					}
				}
				if(!findRes) this.checkedItem.push(task)				
			},
			//日期选择改变
			pickerChange(e){
				this.pickcheckIndex = e.detail.value[0];
				// console.log(e.detail.value)		
				this.getScheduleData(this.days[e.detail.value[0]])
			},
			//添加任务
			addTaskFun(){
				this.togglePopup('top', 'popup')
			},
			togglePopup(type, open) {
				switch (type) {
					case 'top':
						this.content = '顶部弹出 popup'
						break		
					case 'bottom':
						this.content = '底部弹出 popup'
						break
					case 'center':
						this.content = '居中弹出 popup'
						break
				}
				this.type = type
				this.$nextTick(() => {
					this.$refs['show' + open].open()
				})
			},
			//关闭 创建日程弹窗
			addCancel(type) {
				// 初始化数据
				for(let i in this.add){
					this.add[i] = '';
				}
				this.add.day = 0;this.add.hour = 0;
				this.checkedUsers.splice(0,this.checkedUsers.length)
				this.$refs['show' + type].close()
			},
			change(e) {
				console.log('是否打开:' + e.show)
			},
			addConfirmFun(){
				//校验是否为空	
				for(let i in this.add){
					if(!this.add[i] && this.add[i] !== 0 ){
						uni.showToast({
							title:this.tips[i],
							icon:"none"
						})
						return;
					};
				}
				
				let obj = {
					owner_user_ids: "",//参与人
					color: "#F3C23B",	
					user_id: this.ownerInfo.user_id,			
					content: "",
					remark: "",
					title: "",
					start_time: "",
					address: "",
					day: 0,
					hour: 0
				}		
				// obj.user_id = this.ownerInfo.user_id
				let params = Object.assign({},obj,this.add)
				createOaEvent(params).catch(err=>{})
				this.addCancel('popup')
			},
			addFormSubmit(e){
				// console.log(e)
			},
			//添加主题与内容
			addInputBlur(e,type){
				let val = e.detail.value;
				if(type === 'title'){
					this.add.title = val;
				}
				if(type === 'content'){
					this.add.content = val;
					this.add.remark = val;
				}
			},		
			showStartFun(){
				this.showPicker = true;
				this.mxValue = this.add.start_time;
			},
			//确定选择日期
			onDateSelected(e){			
				if(e) {	
					this.add.start_time = e.value;				
				};		
				this.onDateCancel();
			},
			//取消日期选择
			onDateCancel(){
				// console.log(this)
				this.mxValue = this[this.dateType];
				this.showPicker = false;
			},
			unLastTime(){
				this.add.day = 0;
				this.add.hour = 0;
			},
			lastTimeComfirm(e,type){
				let val = e.detail.value;
				if(type === 'd'){
					this.add.day = val;
				}
				if(type === 'h'){
					this.add.hour = val;
				}
			},
			async addPartnerFun(){
				let res =await getUserSelect();
				if(res) this.selectUsers.splice(0,this.selectUsers.length,...res)	
				this.showUserSelect = true;
			},
			selectPartnerChange(data){
				if(data && data.data){
					this.checkedUsers.splice(0,this.checkedUsers.length,...data.data);
					this.add.owner_user_ids = data.ids.join(',')
				} 		
			},
			hideSelectPartner(){
				this.showUserSelect = false;
			},
			removePartnerFun(item){
				for(let i in this.checkedUsers){
					if(this.checkedUsers[i].user_id === item.user_id){
						this.checkedUsers.splice(i,1)
						break;
					}
				}			
			},
			getUserSelectFun(){
				
			},
			//编辑修改日程任务 弹窗
			updateTaskFun(){
				this.poptitle = "修改日程"
			},
			//编辑修改任务 日程主题与内容
			updateTask(e,task,type){			
				if(type === 'theme'){
					if(task.title === e.detail.value) return;
					task.title = e.detail.value;
				}
				if(type === 'content'){
					if(task.content === e.detail.value) return;
					task.content = e.detail.value;
					task.remark = e.detail.value;
				}
				updateOaEvent(task).catch(error=>{})
			},
			//获取顶部日期 选择范围
			getPickerData(date){
				if(!date) date = new Date();				
				let today = DateTools.format(date,'yyyy-mm-dd')
				let days = [];
				for(let i=-5;i<=5;i++){
					days.push(DateTools.format(new Date(date.getTime() + 1000*60*60*24*i),'yyyy-mm-dd'))
				}
				return Promise.resolve(days)			
			}
		}
	}
</script>

<style scoped lang="scss">
.schedule{
	padding-bottom:55px;
	padding-top:50px;
}
.topbar{
	width: 100%;
	background-color: #fff;
	position: fixed;
	z-index: 1;
	
	height: 50px;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
}
.icon-add-top{
	position: absolute;
	right:30rpx;
	
}
.topbar-icon{
	position: absolute;
	top:50%;
	transform: translateY(-50%);
	left:61%;
}
.topbar-title{
	display: inline-block;
	text-align: center;
	font-size: 32rpx;
	color:$text-color-3;
}
/*pick view 样式*/
.picker-date{
	width: 100%;
	height:100%;
}
.pick-item{
	display: flex;
	align-items: center;
	justify-content: center;
}
.indicator-center{
	// height:50px
}
.uni-picker-view-indicator:after, .uni-picker-view-indicator:before{
	height:0;
}
.picker-mask{
	
}

.task-list{
	width: 100%;
	padding:10rpx 30rpx;
	box-sizing: border-box;
	border-bottom: 1rpx solid #eee;
	.list-top{
		display: flex;
		justify-content: space-between;
		.list-top-left{
			display: flex;
			align-items: center;
			.list-title{
				margin-left:20rpx;
				font-size: $font-16;
				color: $text-color-3;
			}
		}
		.list-top-right{
			display: flex;
			align-items: center;
			.list-time{
				margin-right:20rpx;
				font-size: $font-13;
				color: $text-color-9;
			}
		}
	}
	.list-content{
		position: relative;
		margin-top:20rpx;
		.list-remark{		
			width: 100%;
			padding:0 10rpx;
			text-indent: 1.5em;
			font-size: $font-14;
			color: $text-color-6;
		}
	}
}
.check-tab{
	width: 36rpx;
	height: 36rpx;
	border: 1rpx solid #eee;
	text-align: center;
	line-height: 36rpx;
	border-radius: 4rpx;
}
.checked-class{
	background-color: $global-color;
	border: 1rpx solid $global-color;
}
.icon-toup{
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	background-color: $global-color;
	font-size: 26rpx;
	line-height: 44rpx;
	text-align: center;
	color: #fff;
	// font-weight: 700;
}
.icon-todown{
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	font-size: 26rpx;
	line-height: 44rpx;
	text-align: center;
	color: #bbb;
	background-color: #eee;
}
.icon-del{
	width: 36rpx;
	height:36rpx;
	text-align: center;
	font-size: 36rpx;
	color: #999;
	position: absolute;
	top:-16rpx;
	background: #fff;
	z-index: 1;
}

.task-add{
	position: fixed;
	right:30rpx;
	bottom:80px;
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: $global-color;
	line-height: 80rpx;
	text-align: center;
}

.popup-content{
	// height: 100vh;
	background-color: #fff;
	width: 100%;
	margin:0 auto;
	padding:30rpx;
	box-sizing: border-box;
}
.pop-top{	
	height:100rpx;
	font-size: 32rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom:20rpx;
}
.add-theme-label{
	margin-right:16rpx;
}
.add-content{
	margin-top:20rpx;	
}
.add-content-content{
	// border: 1rpx solid #eee;
}
.textarea-placeholder{
	font-size: $font-14;
	color:#ccc;
}
.add-time{
	display: flex;
}
.add-time-item{
	// flex-basis: 50%;
}
.add-time-start{
	display: flex;
	align-items: center;
}

.add-time-last-box{
	display: flex;
}
.add-time-last-item{
	flex: 1;
	display: flex;
	align-items: center;
}

.check-tab-last{
	margin-right:16rpx;
	width: 30rpx;
	height: 30rpx;
	border: 1rpx solid #eee;
	text-align: center;
	line-height: 30rpx;
	border-radius: 4rpx;
}
.time-last-title{
	width: 60rpx;
	text-align: right;
	margin-right:4rpx;
	border-bottom: 1rpx solid #eee;
}

.add-partner-item{
	display: flex;
	flex-wrap: wrap;
}
.add-partner-checked{
	display: flex;
	align-items: center;
}
.icon-clear{
	margin:0 20rpx 0 8rpx;
}


.add-handel{
	display: flex;
	justify-content: flex-end;
}
.btn-save{
	background-color: $global-color;
	color:#fff;
}
.btn-cancel{
	border: 1rpx solid #ddd;
	color:#666;
	margin-left:20rpx;
}
</style>
