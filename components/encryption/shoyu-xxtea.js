 //调用Base64
 const Base64 = require('./base64.js').Base64;
 const XXTEA = require('./xxtea.js').XXTEA;
 
 //数字 + 字母
 const random_charset = [
	 	'1', '2', '3', '4', '5', '6', '7', '8', '9',
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
 /**
 * @param _string 字符串，明文
 */
 export function encryptedAuthcode( _string = '' ) {
	 
	//前期生成一个随机数
	let _num = random(0, _string.length).toString(); //随机数10~90;
	
	//内容转换成Base64
	let _soureBase64 = Base64.encode( _string );
	
	//加密核心
	let _insertStr = _soureBase64.slice(0, _num)+random_char(_num)+_soureBase64.slice(_num);

	return random_charset[_num] + _insertStr;

 }
 
 /**
  * 数字随机数
  * @param lower 随机最小值
  * @param upper 随机最大值
  * @return string 返回最小值至最大值内数值
 */
 function random ( lower, upper ) {
 	return Math.floor(Math.random() * (upper - lower)) + lower;
 }
 
  /**
  * 自定义随机数
  * @param n 随机数量
  * @return string 返回 数字 + 字母随机数
 */
 function random_char ( n ){
	let res = "";
	for(let i = 0; i < n; i++) {
		let id = Math.ceil(Math.random() * 60);
		res += random_charset[id];
	}
	return res;
 }