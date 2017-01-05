	//---------------微信接口--------------------------
	/*
	 * -----------------------------------------------
	 *          ||分享功能参数请做相应调整||
	 * -----------------------------------------------
	 */
	var imgUrl = 'http://27.131.221.248/lapp/icbc02/img/share.jpg';
    var lineLink = window.location.href;
    var shareTitle = '新春大寻宝 豪礼等你来。';
    var appid = '';
    var desc1 = '搜狐焦点 移动狂欢节';
    var desc2 = ' 新春大寻宝 豪礼等你来';
     
    function shareFriend() {
      var num = bigSc;// $('#resultcont').text();
        WeixinJSBridge.invoke('sendAppMessage',{
            "appid": appid,
            "img_url": imgUrl,
            "img_width": "200",
            "img_height": "200",
            "link": lineLink,
            "desc": desc1 + num + desc2,
            "title": shareTitle
        }, function(res) {
            //_report('send_msg', res.err_msg);
        });
    }
    function shareTimeline(num) {
      var num = bigSc;// $('#resultcont').text();
        WeixinJSBridge.invoke('shareTimeline',{
            "img_url": imgUrl,
            "img_width": "200",
            "img_height": "200",
            "link": lineLink,
            "desc": desc1 + num + desc2,
            "title": desc1 + num + desc2
        }, function(res) {
               //_report('timeline', res.err_msg);
        });
    }
    function shareWeibo() {
        var num = bigSc;// $('#resultcont').text();
        WeixinJSBridge.invoke('shareWeibo',{
            "content": desc1 + num + desc2,
            "url": lineLink,
        }, function(res) {
            //_report('weibo', res.err_msg);
        });
    }
    // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        // 发送给好友
        WeixinJSBridge.on('menu:share:appmessage', function(argv){
            shareFriend();
        });
        // 分享到朋友圈
        WeixinJSBridge.on('menu:share:timeline', function(argv){
            shareTimeline();
        });
        // 分享到微博
        WeixinJSBridge.on('menu:share:weibo', function(argv){
            shareWeibo();
        });
    }, false);
	//---------------微信接口--------------------------
    //---------------共通方法--------------------------

	var mobiltReg = /1[3458]{1}\d{9}$/;						//手机号正则表达式
	var nameReg = /[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*/;		//真实姓名正则表达式
	var tokenKey = "Zfdk%H8@cM";							//校验码token的Key
    /**
	 * 加载图片
	 * 
	 * @param url
	 *            图片url
	 * @param callback
	 *            加载完毕后的回调, 会将image作为参数传入
	 * @param complete
	 * 			  加载计数
	 * @param allImageCount
	 * 			  所有图片数量
	 * @param initDraw
	 * 			  初始化方法
	 * @param ctx
	 * 			  context对象
	 */
	var loadImage = function(url, callback, complete, allImageCount, initDraw, ctx, width, height) {
		var image = new Image();
		image.src = url;
		image.onload = function(o) {
			callback(url, image, complete, allImageCount, initDraw, ctx, width, height);
		};
		image.onerror = function() {
			showMsg("#errorMsg", "加载失败, 刷新试试.");
		};
	};
	

	/**
	 * 加载图片回调
	 * 
	 * @param url
	 *            图片url
	 * @param image
	 *            图片对象
	 * @param completeCount
	 *            加载完毕count
	 * @param allImageCount
	 * 			  所有图片数量
	 * @param initDraw
	 * 			  初始化方法
	 * @param ctx
	 * 			  context对象
	 */
	var callback = function(url, image, complete, allImageCount, initDraw, ctx, width, height) {
		images[url] = image;
		complete.count++;
		loading(ctx, width, height, complete.count, allImageCount);
		if (complete.count == allImageCount) {			// 图片加载完毕,
			initDraw();									// 开始动画
		}
	};
	
	/**
	 * 加载中
	 * @param ctx
	 * 			 context对象
	 * @param loadedImages
	 * 			加载中的图片数量
	 * @param numImages
	 * 			图片总数量
	 */
	var loading = function(ctx, width, height, loadedImages, numImages){
		//重绘一个进度条
        ctx.clearRect(0, 0, width, height);
        console.log(width/3, height/4)
        
        ctx.fillText('Loading:'+(loadedImages * 100 / numImages)+'%', width * 3 / 7, height / 2 - 10);
        ctx.save();
        ctx.strokeStyle='#555';
        ctx.beginPath();
        ctx.moveTo(width * 4 / 5, height / 2);
        ctx.lineTo(width * 4 / 5, height / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.restore();
        ctx.moveTo(width * 4 / 5, height / 2);
        ctx.lineTo(loadedImages / numImages * width / 5, height / 2);  
        ctx.stroke();
	}
	
	/**
	 * 获取并修改浮动系数
	 * 
	 * @param isFlow
	 *            浮动方向
	 * @param flow
	 *            浮动大小
	 * @param flow
	 *            浮动当前值
	 * @param flowCount
	 *            浮动速度
	 */
	var getFlow = function(isFlow, flow, flowTmp, flowCount) {
		if (isFlow) {
			flowTmp += flowCount;
		} else {
			flowTmp -= flowCount;
		}
		return flowTmp;
	};
	
	

	
	/**
	 * 获得点击事件的x与y
	 * @param ev
	 * 			点击事件对象
	 */
	var getEventPosition = function(ev){
		  var x = 0, y = 0;
		  if (ev.layerX || ev.layerX == 0) {
		    x = ev.layerX;
		    y = ev.layerY;
		  } else if (ev.offsetX || ev.offsetX == 0) { 	// Opera
		    x = ev.offsetX;
		    y = ev.offsetY;
		  }
		  return {x: x, y: y};
	};

	
	/**
	 * 判断是否被点击
	 * @param posX 点击点x
	 * @param posY 点击点y
	 * @param x 图形x
	 * @param y 图形y
	 * @param w 图形宽
	 * @param h 图形高
	 */
	var isCover = function(posX, posY, x, y, w, h){
		// 左上角起大于矩形左上角, 小于矩形右下角, 则在矩形内
//		console.log("posX >= x:"+(posX >= x));
//		console.log("posX <= (x + w):"+(posX <= (x + w)));
//		console.log("posY >= y:"+(posY >= y));
//		console.log("posY <= (y + h):"+(posY <= (y + h)));
		if(posX >= x && posX <= (x + w) && posY >= y && posY <= (y + h)){
			 return true;
		}else{
			return false;
		}
	};
	
	/**
	 * 加载数据通用方法
	 * @param url    访问url
	 * @param type   传输协议
	 * @param errFun 失败处理
	 * @param sucFun 成功处理
	 * @param data 数据
	 */
	function load(url,type,errFun,sucFun,data)
	{
		$.ajax({
		 	type : type,
			dataType : "jsonp",
			url : url,
			data : data,
			//async:false, 
			error : function(e) {
				errFun(e);
			},
			success : function(data) {
				sucFun(data);
			}
		});
	}
	
	/**
	 * 根据类型显示图像
	 * @param drawObj
	 * @param type
	 */
	function showByType(drawObj, type){
		for(var i = 0; i < drawObj.length; i++){		//循环所有图形
			if(drawObj[i].imgType == type){
				drawObj[i].isShow = true;
				break;
			}
		}
	}
	
	/**
	 * 显示信息
	 * @param id
	 * @param msg
	 */
	function showMsg(id, msg){
		$(id).html(msg + "<a href='#'>确定</a>");
		$(id + " a").click(function(){$("#errorMsg").hide();});
		$(id).show();
	}
	

	/**
	 * 获取页面实际大小
	 */
	function getPageSize() {
		var xScroll = 0, yScroll = 0;

		if (window.innerHeight && window.scrollMaxY) {
			xScroll = document.body.scrollWidth;
			yScroll = window.innerHeight
					+ window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight) {
			sScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else {
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}

		var windowWidth = 0, windowHeight = 0;
		// var pageHeight,pageWidth;
		if (self.innerHeight) {
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		} else if (document.documentElement
				&& document.documentElement.clientHeight) {
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) {
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}
		var pageWidth = 0, pageHeight = 0;
		if (yScroll < windowHeight) {
			pageHeight = windowHeight;
		} else {
			pageHeight = yScroll;
		}
		if (xScroll < windowWidth) {
			pageWidth = windowWidth;
		} else {
			pageWidth = xScroll;
		}
		arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
		return arrayPageSize;
	}
	
	/**
	 * 迭代器
	 */
	var itear = function(drawObj, type, callback){
		for(var i = 0; i < drawObj.length; i++){
			if(drawObj[i].imgType == type){
				callback(drawObj[i]);
			}
		}
	};
	
	