//接收参数
function getQuery(name) {
    // 正则：[找寻'&' + 'url参数名字' = '值' + '&']（'&'可以不存在）
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r != null) {
        // 对参数值进行解码
        return unescape(r[2]);
    }
    return null;
	
}
let at = getQuery('data');
// 接收参数结束
// 当前环境
uni.getEnv(function(res) {
	// console.log('当前环境：' + JSON.stringify(res));
});

// 发送文件数据
// function sendMessage(data) {
// 	// console.log()
// 	if(data.fileName){
// 		let file = encodeUnicode(data.fileName);
// 		uni.postMessage({
// 			data: {
// 				action: file
// 			}
// 		});
		
// 		uni.redirectTo({
// 			url:'/pages/upload/upload?fileData='+file
// 		})
// 	}
// }
// 点击事件 
$(".file").on("change", "input[type='file']", function() {
	filePath = $(this).val();
	$(".showFileName").html(filePath);			
});

$('.btn').click(function(evt) {
	var formdata = new FormData(); // 创建一个form类型的数据
	formdata.append("file",$("#uploadFile")[0].files[0]); // 获取上传文件的数据
	// formdata.append("operate","UpLoadFile"); // 获取上传文件的数据
	// formdata.append("name","name"); // 获取上传文件的数据	
	$.ajax({
		url: 'http://101.200.86.127:8080/upload/oss',
		type: "POST",
		processData: false,
		contentType: false,
		data:formdata,
		headers:{
			tid:1,
			at:at
		},		
		success: function(data) {
			// debugger
			if(data.code ===0){
				let file = encodeURI(data.data.fileName);
				uni.redirectTo({
					url:'/pages/index/upload/upload?fileData='+file
				})
			}
			
		},
		error: function(err) {
		}
	});

	// var target = evt.target;
	// if (target.tagName === 'BUTTON') {
	// 	var action = target.getAttribute('data-action');
	// 	if (action == 'redirectTo') {
	// 		uni.redirectTo({
	// 			/* url: '/pages/component/index', */
	// 			url: '/pages/index/index',
	// 			success:function (d) {
	// 				console.log("跳转成功");
	// 			},
	// 			fail:function(e){
	// 				console.log(e);
	// 			},
	// 		});
	// 	}
	// }
});

//取消文件上传
$('.btn1').click(function(evt) {
	var target = evt.target;
	if (target.tagName === 'BUTTON') {
		var action = target.getAttribute('data-action');
		if (action == 'navigateBack') {
			uni.navigateBack({
				delta: 1
			});
		}
	}
});	