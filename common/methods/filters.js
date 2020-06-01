export{
	clipFormat1,
	clipFormat2,
	dateFormat
}
//格式表格数据展示
const clipFormat1 = (value,width)=>{	
	if(value && value.length*30 > width){
		let valueArr = value.split('');
		let newValue = [];
		let nwidth = 0;
		for(let i in valueArr){
			if(valueArr[i].charCodeAt()>255){
				nwidth += 30;		
			}else if(/[0-9]/.test(valueArr[i])){			
				nwidth += 17.6;
			}else if(/[a-z]/.test(valueArr[i])){			
				nwidth += 19;
			}else if(/[A-Z]/.test(valueArr[i])){			
				nwidth += 21;
			}else if(/:/.test(valueArr[i])){			
				nwidth += 6;
			}else if(/-/.test(valueArr[i])){
				nwidth += 8;
			}else{
				nwidth += 20;
			}
			if(nwidth> width){
				break;
			}else{
				newValue.push(valueArr[i])
			}
		}
		// let maxLength = Math.floor(this.column.dd/30);
		// console.log(this.column.dd,value)
		value = newValue.join('')	
	}
	return value;
}
const clipFormat2 = (value,width)=>{	
	if(value && value.length*30 > width){
		let valueArr = value.split('').reverse();
		let newValue = [];
		let nwidth = 0;
		for(let i in valueArr){
			if(valueArr[i].charCodeAt()>255){
				nwidth += 30;		
			}else if(/[0-9]/.test(valueArr[i])){			
				nwidth += 17.6;
			}else if(/[a-z]/.test(valueArr[i])){			
				nwidth += 19;
			}else if(/[A-Z]/.test(valueArr[i])){			
				nwidth += 21;
			}else if(/:/.test(valueArr[i])){			
				nwidth += 6;
			}else if(/-/.test(valueArr[i])){
				nwidth += 8;
			}else{
				nwidth += 20;
			}
			if(nwidth> width){
				break;
			}else{
				newValue.push(valueArr[i])
			}
		}
		value = newValue.reverse().join('')		
	}
	return value;
}
//格式化时间
const dateFormat = (value,rule)=>{
	if(value){
		let showValue = format(new Date(value.replace(/-/g, '/')),rule);
		if(showValue) return showValue;
	}		
}
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