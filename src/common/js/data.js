export function formatDate(date, fmt) {
	if (/(y+)/.test(fmt)) { // 从fmt中匹配多个y,若匹配成功，则进行下列步骤
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)); // 对y进行替换。date.getFullYear()获取到date中的“年”，转换成字符串，从获取到的年中抽取。抽取的开始位置为4 - RegExp.$1.length，如年是2017，那么匹配的就是7
	}
	var o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};
	for (var k in o) {
		if (new RegExp(`(${k})`).test(fmt)) { // 构造正则表达式如M+ d+ h+ 等等，再进行匹配
			var str = o[k] + '';
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
		}
	}
	return fmt;
};

function padLeftZero(str) {
	return ('00' + str).substr(str.length);
};
