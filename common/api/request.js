//引入vuex 直接保存数据
import store from '@/store/index.js'
export default{
	common:{
		// baseUrl:'http://192.168.1.203:8080', //数据
		baseUrl:'http://101.200.86.127:8080',	
		method:"GET",
		data:{},
		header:{
			"Content-Type":"application/json", //默认
			// "Content-Type":"application/x-www-form-urlencoded"
		},
		dataType:'json'
	},
	getHeader(header){  
		let status = store.state.login.loginState;
		let token = store.state.login.token; 
		if(!status){
			if(header && header.tid && header.at){
				let nHeader= Object.assign({},this.common.header,header,);
				return nHeader;	
			}
		}else{
			if(token){
				let nHeader= Object.assign({},this.common.header,{"tid":1,"at":token});	
				return nHeader;
			}
		} 
	},
	request(option={}){
		//请求前获取header 验证请求头信息
		let header = this.getHeader(option.header);
		if(!header){
			uni.showToast({
				title:"请登录",
				icon:"none",
				duration:3000
			})
			uni.redirectTo({
				url:'/pages/login/login'
			})	
			return Promise.reject();
		}
		option.url = this.common.baseUrl + option.url;
		option.method = option.method || this.common.method;
		option.data = option.data || this.common.data;
		option.header = header;
		option.dataType = option.dataType || this.common.dataType;
		return new Promise((resolve,reject)=>{	
			uni.request({
				...option,
				success:(res)=>{
					if(res.statusCode === 200){
						resolve(res)
					}else{
						reject(res.data.msg)
					}
				},
				fail: (error) => {
					reject()				
				}
			})
		}).catch(error=>{
			uni.showToast({
				title:"登录失败",
				icon:"none",
				duration:3000
			})
		})		
	},
    // 文件上传
	uploadFile(option={},callback){
		let header = this.getHeader(option.header);
		delete header["Content-Type"];
		// uni.showLoading({
		// 	title:"上传中..."
		// })
		uni.chooseImage({
			success: (chooseImageRes) => {
			        const tempFilePaths = chooseImageRes.tempFilePaths;
			        const uploadTask = uni.uploadFile({
						header:header,
			            url: this.common.baseUrl+'/upload/oss', //上传接口
			            filePath: tempFilePaths[0],
			            name:'file',
			            success: (uploadFileRes) => {
							callback(uploadFileRes)
			            }
			        });		
			}
		});
	},//文件上传结束
	//文件下载 只能支持chorme浏览器  
	downloadFile1(fileName){
		return new Promise((resolve,reject)=>{
			let header = this.getHeader();
			uni.request({
				// url:'http://192.168.1.6:99/upload/notice/201402/%E5%91%80%E8%AF%BA%E8%BE%BE%E6%B8%85%E6%96%B0%E4%B9%8B%E6%97%85%E4%BA%94%E5%A4%A9.doc',
				url: this.common.baseUrl+'/download/ossfile?fileName='+fileName,
				header:header,
				responseType: 'arraybuffer', //响应类型
				success:(res)=>{
					// console.log("res"+JSON.stringify(res))
					if(res.statusCode === 200){
						// console.log(res)
						let data = res.data;
						// console.log("data.length=" + data.length)
						const blobContent = new Blob([data]); //不转字符串
						//console.log(blobContent)
						// console.log("blobContent.length=" + blobContent.length)
						const blobUrl = window.URL.createObjectURL(blobContent)
								   
						// function downloadFileByBlob(blobUrl, filename) {
						const eleLink = document.createElement('a')
						// eleLink.download = filename
						eleLink.setAttribute('download',fileName)
						eleLink.style.display = 'none'
						eleLink.href = blobUrl
						// 触发点击
						document.body.appendChild(eleLink)
						eleLink.click()
						// 然后移除
						document.body.removeChild(eleLink)
						window.URL.revokeObjectURL(blobUrl);
						resolve(true)
					}else{
						reject(false)
					}
				},
				fail: (error) => {
					uni.showToast({
						title:"下载失败",
						icon:'none'
					})
					reject(false);				
				}
			})
		})		
	},
	downloadFile2(fileName){
		return new Promise((resolve,reject)=>{
			let header = this.getHeader();
			uni.request({
				// url:'http://192.168.1.6:99/upload/notice/201402/%E5%91%80%E8%AF%BA%E8%BE%BE%E6%B8%85%E6%96%B0%E4%B9%8B%E6%97%85%E4%BA%94%E5%A4%A9.doc',
				url: this.common.baseUrl+'/download/ossfile?fileName='+fileName,
				header:header,
				// responseType: 'arraybuffer', //响应类型
				success:(res)=>{
					// console.log(res)
					if(res.statusCode === 200){
						resolve(res.data)
						// console.log(res)
						// let data = res.data;
						// console.log("data.length=" + data.length)
						// const blobContent = new Blob([data]); //不转字符串
						// //console.log(blobContent)
						// console.log("blobContent.length=" + blobContent.length)
						// const blobUrl = window.URL.createObjectURL(blobContent)
								   
						// // function downloadFileByBlob(blobUrl, filename) {
						// const eleLink = document.createElement('a')
						// // eleLink.download = filename
						// eleLink.setAttribute('download',fileName)
						// eleLink.style.display = 'none'
						// eleLink.href = blobUrl
						// // 触发点击
						// document.body.appendChild(eleLink)
						// eleLink.click()
						// // 然后移除
						// document.body.removeChild(eleLink)
						// window.URL.revokeObjectURL(blobUrl);
						
					}else{
						reject(false)
					}
				},
				fail: (error) => {
					uni.showToast({
						title:"下载失败",
						icon:'none'
					})
					reject(false);				
				}
			})
		})		
	},
    downloadFile(fileName){
		let header = this.getHeader();
		// header['Content-Type'] ='image/jpeg',
		// delete header["Content-Type"];
		// console.log(header);
		return new Promise((resolve,reject)=>{
			uni.downloadFile({
				url: this.common.baseUrl+'/download/oss?fileName='+fileName,
			    // url:'http://192.168.1.6:99/upload/notice/201402/%E5%91%80%E8%AF%BA%E8%BE%BE%E6%B8%85%E6%96%B0%E4%B9%8B%E6%97%85%E4%BA%94%E5%A4%A9.doc',
				header:header,
			    success: (res) => {
			        if (res.statusCode === 200) {
			            console.log('下载成功');		
						let filePath = res.tempFilePath;
						resolve(filePath)
						// window.open(filePath);
						// uni.navigateTo({
						// 	url:'/pages/index/webSite/webSite.vue?url='+filePath
						// })
						// uni.openDocument({
						//   filePath: filePath,
						//   success: function (res) {
						// 	console.log('打开文档成功');
						//   }
						// });
						// uni.saveImageToPhotosAlbum({
						//             filePath: filePath,
						//             success: function () {
						// 				// console.log(res.tempFilePath)
						//                 console.log('save success');
						//             }
						//         });
						// uni.saveFile({
						// 	tempFilePath: res.tempFilePath,
						// 	success: function(red) {
						// 		that.luj = red.savedFilePath
						// 		console.log(red)
						// 		console.log(red.savedFilePath)
						// 		// uni.openDocument({
						// 		//   filePath: red.savedFilePath,
						// 		//   success: function (res) {
						// 		// 	console.log('打开文档成功');
						// 		//   }
						// 		// });
						// 	}
						// });
						// uni.openDocument({
						// 	  filePath: 'E:/file/template/2020-02-06/55/a.jpg',
						// 	  success: function (res) {
						// 		console.log('打开文档成功');
						// 	  }
						// });
			        }			
			    }
			});
		})
		
	}
	
	
}