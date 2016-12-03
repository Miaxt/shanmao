
/*===================================$函数的封装===============================*/

//可以根据id、class、element查找元素
//param（字符串）： #id   .class   tag 
//obj:父元素
function $(param,obj){

	obj = obj || document;//没有传递obj参数，则默认使用document

	if(param.charAt(0) === "#")//id

		return document.getElementById(param.slice(1));

	if(param.indexOf(".") === 0)//class

		return getByClass(param.slice(1),obj);

	return obj.getElementsByTagName(param) ;//tag
}

/*=============================如何解决 getElementsByClassName 兼容问题===========================*/
function getByClass(className,obj){
	obj = obj || document;
	if(obj.getElementsByClassName){//支持getElementClassName方法的使用
		return obj.getElementsByClassName(className);
	}
	/* 不支持getElementClassName方法的使用*/
	//保存查找到的元素的数组结构
	var result = [];
	//查找出obj对象后代所有元素
	var tags =  obj.getElementsByTagName("*");
	//遍历每个元素
	for(var i = 0,len = tags.length; i < len;i++){
		//获取到当前遍历元素所使用的所有类名
		var classNames = tags[i].className.split(" ");
		//遍历当前元素的每个类名
		for(var j = 0,l = classNames.length; j<l;j++){
			if(classNames[j] === className){//说明当前遍历到的元素使用过要查找的类名
				result.push(tags[i]);
				break;
			}
		}
	}
	//返回查找的结果集
	return result;

}


/*========================获取指定元素的某一个css的样式属性值===========================*/
//attr:指定的css属性名称（字符串）
function css(obj,attr){

	/*if(obj.currentStyle)
		return obj.currentStyle[attr];
	retun getComputedStyle(obj)[attr];*/

	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj,null)[attr];

}


/*=========================为指定元素添加指定的事件绑定================================*/
//element：待绑定事件的DOM元素
//type：事件类型
//fn：事件处理函数
function  bind(element ,type,fn){
	if(element.addEventListener)//支持使用addEventListener 方法添加事件监听
	{
		if(type.indexOf("on") === 0){//以“on”开头，则去掉前缀“on”
			type = type.slice(2);//截取on 后面的字符串
		}
		element.addEventListener(type,fn,false);
	}else{	//attachEvent()
		if(type.indexOf("on") !== 0){//不以“on”开头，则添加上“on”的前缀
			type = "on" + type;
		}
		element.attachEvent(type,fn);
	}
}


/*=======================获取、设置指定元素在文档中的定位坐标===========================*/
//返回元素在文档中定位的坐标对象，该对象有两个属性：{top，left}
function offset(element,coordinates){//coordinates 需要设置的坐标参数

	    /* var   offsetTop = element.offsetTop,
		  offsetLeft = element.offsetLeft,
		  current = element.offsetParent;

		while(current !== null){
			offsetTop += current.offsetTop;
			offsetLeft += current.offsetLeft;
			offsetParent += current.offsetParent;
		}*/

		var offsetTop = 0,//累加的top值
		      offsetLeft = 0,//累加的left值
		      isGet = (typeof coordinates === "undefined");//标记是否获取到了元素坐标，true：获取   false：设置
		      current = isGet ? element : element.offsetParent;
			// current = element;
			
		//将current元素在文档中的定位坐标累加计算出来
		do{
			offsetTop += current.offsetTop;
			offsetLeft += current.offsetLeft;
			current = current.offsetParent;
		}while(current !== null);

		if(isGet){// 为true,获取坐标，返回表示坐标的对象{top，left}

		return {//直接量的方式创建对象{top，left}
				top : offsetTop,//相当于 var top = offsetTop；返回的是一个对象
				left : offsetLeft
			};

		}else{//为false，设置元素的坐标
			element.style.top = (coordinates.top - offsetTop) + "px";
			element.style.left = (coordinates.left - offsetLeft) + "px";

			}

		}


/*======================获取元素的height和width=========================*/

 	/*domElementObject.offsetWidth ：border宽度 + padding宽度 + content宽度
	domElementObject.offsetHeight 
	domElementObject.clientWidth :   padding宽度 + content宽度 - 滚动条宽度
	domElementObject.clientHeight */
	
function width(element){
	return parseFloat(css(element,"width"));
}
function height (element){
	return parseFloat(css(element,"height"));
}

function innerWidth(element){
	return element.clientWidth;
}
function innerHeight(element){
	return element.clientHeight;
}

function outerWidth(element,bool){
	bool = typeof bool === "undefined" ? false : bool;//取false不包含margin的距离，取true要包含margin的距离
	return bool ? element.offsetWidth 
	+ parseFloat(css(element,"marginLeft"))
	+parseFloat(css(element,"marginRight"))
	 : 
	 element.offsetWidth;
}
function outerHeight(element,bool){
	bool = typeof bool === "undefined" ? false : bool;//取false不包含margin的距离，取true要包含margin的距离
	return bool ? element.offsetHeight 
	+ parseFloat(css(element,"marginTop"))
	+parseFloat(css(element,"marginBottom"))
	 : 
	 element.offsetHeight;
}



/*==============================封装保存cookie的函数=============================*/
//key : cookie的名字
//value : cookie的值
//options : 可选配置参数
//	options = {
//		expires：7/newDate()， //失效时间(过期时间)
//		path："/",	//路径
//		domain:" ",	//域名
//		secure: true // 安全连接
//	}

//保存cookie
function cookie(key,value,options){

	/*-------------------------读取(获取)cookie相应值的操作--------------------------*/

	//如果没有传递value，则表示根据key读取cookie的值
	if(typeof value === "undefined"){//表示读取操作
		//获取当前域名下所有的cookie，保存到cookies数组中
		//document.cookie  -- 返回所有的 cookie，将每个 cookie 以"分号+空格"(; )的结构连接成一个字符串后返回
		var cookies =  document.cookie.split("; ");
		//遍历cookies数组中的每个元素
		for(var i = 0, len = cookies.length; i<len;  i++){
			//cookies[i]：当前遍历到的元素，代表的是"key = value" 意思的字符串
			//将字符串以 = 号分割返回的数组中第一个元素表示key,第二个元素表示value
			var cookie = cookies[i].split("=");
			//判断是否是要查找的key
			if(decodeURIComponent(cookie[0]) === key){
				return  decodeURIComponent(cookie[1]);
			}
		}
		//没有查找到指定的key对应的value值，此时返回null；
		return null;
	}


	/*-----------------------设置(写入)cookie相应值的操作-------------------------*/

	//设置options默认为空对象
	options = options || {};
	//key = value
	var cookie = encodeURIComponent(key)  + "=" + encodeURIComponent(value);//编码key和value操作
	//判断是否配置了options参数
	/*if(typeof options !== "undefined"){

	}*/
	//失效时间
	if(typeof options.expires !== "undefined"){
		//有配置失效时间的参数，判断输入时间参数的形式
		/*if(typeof options.expires === "number"){//数字
			var d = new Date();
			d.setDate(d.getDate() + options.expires);
			cookie += ";expires=" + d.toUTCString();
		}else{
				cookie += ";expires=" + options.expires.toUTCString();

		}*/
		if((typeof options.expires) === "number"){//数字
			var days = options.expires,
				t = options.expires = new Date();
				t.setDate(t.getDate() + days);	
		}
		cookie += ";expires=" + options.expires.toUTCString();
	}
	//路径
	if(typeof options.path !== "undefined"){
		cookie += ";path=" + options.path;
	}
	//域名
	if(typeof options.domain !== "undefined"){
		cookie += ";domain=" + options.domain;
	}
	//安全连接
	if(options.secure){
		cookie += ";secure";
	}
	//保存
	document.cookie = cookie;
}



/*===========================删除cookie函数===============================*/
// 从所有的cookie中删除指定的cookie
function removeCookie(key,options){
	options = options || {};
	options.expires =  -1;//设置有效时间，设置的时候cookie就已经超时了，即将失效时间设置为1天前
	cookie(key,"",options);
}


/*================封装运动函数：元素element多属性变化(移动)时的时间控制==============*/
// element:待实现运动动画的元素
// options：运动元素相应属性的配置对象
// totalTime: 运动的时间
// fn：函数，运动动画执行结束后，还需要再执行的函数
//  采用创建对象的方式
// 例如：options = {width:300,height:300,left:100,top:200};
// 		 speed = {speed[width]:5,speed[height]:-5,speed[left]:5,speed[top]:-5};
		function animate(element,options,totalTime,fn){

			if(typeof totalTime === "function" || typeof totalTime === "undefined"){//判断是否传入totalTime参数
					fn = totalTime;
					totalTime = 400;
				}

			//先取消在element元素上的运动计时器
			clearInterval(element.timer);

			//存放各属性起始位置值的对象
			var  startPosition = {};
			for(var attr in options){
				startPosition[attr] = parseFloat(css(element,attr));
			}

			var startTime = +new Date();//记录开始运动的时间
			//启动计时器，实现运动效果
			element.timer = setInterval(function(){//设置计时器
			var elapse= Math.min(+new Date() - startTime,totalTime);//运动时间差的计算，判断
				//定位
				//循环为每个属性值赋新计算值
				//线性运动公式：(终值 - 初值) / 总时间 * 运动耗时 + 初值
				for(var attr in options){
					var distance =  (options[attr] - startPosition[attr])/totalTime *elapse + startPosition[attr] ;
					element.style[attr] = distance + (attr === "opacity" ? "" : "px");
				if(attr === "opacity"){//ie浏览器中的opacity兼容性判断
					element.style.filter = "alpha(opacity="+ (distance * 100) +")";
				}
				}
				if(elapse === totalTime){//判断时间差与输入的总变化时间参数，如到达运动总时间，则停止计时器
					clearInterval(element.timer);
					//元素变化完成之后所需要执行的函数(如果有相应函数的话)
					fn && fn();
				}
			},30);
		}


/*===================淡入===================*/
function fadeIn(element,totalTime,fn){
element.style.display = "block";
element.style.opacity = "0";
animate(element,{opacity:1},totalTime,fn);
}
/*=====================淡出=====================*/
function fadeOut(element,totalTime,fn){
	animate(element,{opacity:0},totalTime,function(){
		element.style.display = "none";
		fn && fn();
	});
}

 /*===============查找指定的值 value 在数组 arrray 中的索引=============*/
// -1 表示未找到
function inArray(value, array) {
	for (var i = 0, len = array.length; i < len; i++) {
		if (value === array[i])
			return i;
	}

	return -1;
}

/*================================封装AJAX函数================================*/
/*
	options = {
		type : "get|post", // 请求方式
		url : "", // 请求资源路径
		async : true, // 是否异步
		data : {"name":"小明","msg":"你好"}, // 需要发送给服务器的数据
		dataType : "text|json", // 预期服务器响应数据的格式
		headers : {"":"", "":""}, // 需要设置的请求头
		complete : function(xhr){}, // 请求资源成功/失败，都会执行的函数
		success : function(data){}, // 请求资源成功时执行的函数, data为响应的数据
		error : function(xhr){} // 请求资源失败时执行的函数
	};		
*/
function ajax(options) {
	if (!options.url) // 没有请求资源，则结束
		return;
	// 创建对象
	var xhr;
	if (window.XMLHttpRequest)
		xhr = new XMLHttpRequest();
	else
		xhr = new ActiveXObject("Microsoft.XMLHTTP");

	var method = options.type || "get", // 请求方式
		url = options.url, // 请求资源
		async = typeof options.async !== "undefined" ? options.async : true, // 是否异步
		param = null; // 查询字符串

	// 有查询字符串，则组装查询字符串
	if (options.data) {
		param = "";
		for (var attr in options.data) {
			param += attr + "=" + options.data[attr] + "&";
		}
		param = param.substring(0, param.length - 1);
	}
	if (method === "get"){ // get请求，将查询字符串连接到 url 后
		url += "?" + param;
		param = null;
	}

	// 建立连接
	xhr.open(method, url, async);
	// 如果是 post 提交请求，则设置头信息
	if (method === "post")
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	// 有其它头信息的设置
	if (options.headers) {
		for (var attr in options.headers) {
			xhr.setRequestHeader(attr, options.headers[attr]);
		}
	}
	// 发送请求
	xhr.send(param);
	// 异步回调
	xhr.onreadystatechange = function(){
		if (xhr.readyState === 4) { // 响应就绪
			options.complete && options.complete(xhr);
			if (xhr.status === 200) { // ok
				var data = xhr.responseText;
				if (options.dataType === "json")
					data = JSON.parse(data);
				// 请求资源成功执行函数
				options.success && options.success(data);
			} else {
				options.error && options.error(xhr);
			}
		}
	};
}

/*====================处理get请求=====================*/
// get("xxx.php", {name:"小明"}, function(){}, "json");
// get("yyy.php", function(){}, "json");
function get(url, data, fn, dataType){
	if (!url)
		return;
	if (typeof data === "function"){
		dataType = fn;
		fn = data;
	}
	var options = {
		"type" : "get",
		"url" : url,
		"data" : data,
		"success" : fn,
		"dataType" : dataType
	};
	ajax(options);
}

/*=========================处理post请求========================*/
function post(url, data, fn, dataType){
	if (!url)
		return;
	if (typeof data === "function"){
		dataType = fn;
		fn = data;
	}
	var options = {
		"type" : "post",
		"url" : url,
		"data" : data,
		"success" : fn,
		"dataType" : dataType
	};
	ajax(options);
}