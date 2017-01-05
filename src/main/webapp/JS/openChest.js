	//----------------------------浏览器区分-------------------------------
	var phoneWidth = parseInt(window.screen.width);
	var phoneScale = phoneWidth / 640;
	var ua = navigator.userAgent;
	if (/Android (\d+\.\d+)/.test(ua)) {
		var version = parseFloat(RegExp.$1);
		if (version > 2.3) {
			document.write('<meta name="viewport" content="width=640, minimum-scale = '
							+ phoneScale
							+ ', maximum-scale = '
							+ phoneScale
							+ ', target-densitydpi=device-dpi">');
		} else {
			document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
		}
	} else {
		document.write('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">');
	}
	//----------------------------浏览器区分--------------------------------
	var picAssets = {
		over : "ztimages/over01.png", 						// 结束了
		chest : "ztimages/close.png", 						// 宝箱关闭图片
		chest2 : "ztimages/open.png", 						// 宝箱打开图片
		lucky : "ztimages/lucky.png", 						// 中奖
		unluck : "ztimages/unluck.png",						// 未中奖
		gift : "ztimages/ten_money.png",					//中奖信息
	};
	var imgType = {												//图片类型
			chest: 1,											//宝箱
			lucky: 2,											//中奖
			unluck: 3,											//未中奖
			over: 4,											//抽奖次数用完
			chest2: 5,											//宝箱已开
			gift: 9												//中奖信息
	};
	var drawObj = []; 											// 绘图对象, 自带img, x, y, w, h, flow, isShow
	var images = [];											// 图片列表
	$(document).ready(function() {
		// -------------------------常量定义-----------------------------
		var flashTime = 70; 								// 70毫秒刷新一次画面

		var complete = {count : 0};							// 图片加载记录
		var allImageCount = 6; 								// 所有图片数量

		var canvasBuffer;									// 双缓冲canvas
		var contextBuffer;
		var clicked = false;								// 鼠标点击控制
		var loading = false;								// 加载中控制
		
		var interfaceUrl = "http://dev.house.focus.cn/common/modules/lottery/2015/20150323.php"; //后台接口地址
		
		var realName = "";									//姓名
		var mobile = "";									//手机号
		// -------------------------常量定义-----------------------------
		// ---------------------------登陆画面---------------------------
		$(".begin-btn").click(function(){
			var name = $("#name").val();
			var tal = $("#mobile").val();
			if(!nameReg.test(name)){
				showMsg("#errorMsg", "请输入您的真实姓名。");
				return;
			}
			
			if(!mobiltReg.test(tal)){
				showMsg("#errorMsg", "请输入您的手机号码。");
				return;
			}
			
			realName = name;
			mobile = tal;
			
			$("#login").hide();
			$("#wrap_body").show();
			
			startGame();
		});
		// ---------------------------登陆画面-----------------------------
		
		var canvas = document.getElementById('chestCanvas'); 	// 获得canvas
		if (canvas.getContext("2d")) {// 支持h5
			// ------------------------初始化------------------------------
			var context = canvas.getContext("2d");				// 2d对象
			var size = getPageSize();						// 获取viewBlock大小
			var w = 640;									// 获得宽 移动端最合适宽度640px, 与css中匹配
			var h = size[1];								// 获得高
			// 设置宽高
			canvas.width = w;
			canvas.height = h;

			// ------------------------初始化--------------------------------
			// ------------------------通用方法定义---------------------------

			var init = function() {
				context.clearRect(0, 0, canvas.width, canvas.height);
				// 双缓冲
				canvasBuffer = document.createElement("canvas");
				canvasBuffer.width = canvas.width;
				canvasBuffer.height = canvas.height;
				contextBuffer = canvasBuffer.getContext("2d");
				contextBuffer.clearRect(0, 0, canvasBuffer.width,
						canvasBuffer.height);
			};
			
			
			/**
			 * 初始化绘图 整理需要绘图的对象
			 */
			var initDraw = function() {
				// 宝箱位置与属性
				var chestes = {
					chest1 : {x : canvas.width / 14, y : canvas.height * 3 / 7,
						w : canvas.width * 4 / 14, h : canvas.height * 3 / 16},
					chest2 : {x : canvas.width * 5 / 14, y : canvas.height * 3 / 7,
						w : canvas.width * 4 / 14, h : canvas.height * 3 / 16},
					chest3 : {x : canvas.width * 9 / 14, y : canvas.height * 3 / 7,
						w : canvas.width * 4 / 14, h : canvas.height * 3 / 16}
				};
				// 提示位置与属性
				var info = {x : 20, y : canvas.height/4, w : canvas.width - 40, h : canvas.height/3};

				drawObj.push({									// 宝箱1
					img : images[picAssets.chest],				// 图片
					x : chestes.chest1.x,						// 左上角X
					y : chestes.chest1.y,						// 左上角Y
					w : chestes.chest1.w,						// 宽度
					h : chestes.chest1.h,						// 高度
					flowx : 0,									// x轴浮度
					flowxTmp : 0,								// x轴浮度计数
					flowxPlus : false,							// x轴是否浮动
					flowy : 15,									// y轴浮度
					flowyTmp : 0,								// y轴浮动计数
					flowyPlus : true,							// y轴是否浮动
					isShow : true,								// 该对象是否显示
					imgType : imgType.chest						// 图片类型
				});
				drawObj.push({									// 宝箱2
					img : images[picAssets.chest],
					x : chestes.chest2.x,
					y : chestes.chest2.y,
					w : chestes.chest2.w,
					h : chestes.chest2.h,
					flowx : 0,
					flowxTmp : 0,
					flowxPlus : false,
					flowy : 15,
					flowyTmp : 0,
					flowyPlus : true,
					isShow : true,
					imgType : imgType.chest
				});
				drawObj.push({									// 宝箱3
					img : images[picAssets.chest],
					x : chestes.chest3.x,
					y : chestes.chest3.y,
					w : chestes.chest3.w,
					h : chestes.chest3.h,
					flowx : 0,
					flowxTmp : 0,
					flowxPlus : false,
					flowy : 15,
					flowyTmp : 0,
					flowyPlus : true,
					isShow : true,
					imgType : imgType.chest
				});
				// 整理对象
				drawObj.push({
					img : images[picAssets.lucky],
					x : info.x,
					y : info.y,
					w : info.w,
					h : info.h * 1.3,
					flowx : 0,
					flowxTmp : 0,
					flowxPlus : false,
					flowy : 0,
					flowyTmp : 0,
					flowyPlus : false,
					isShow : false,
					imgType : imgType.lucky
				});												// 中奖
				drawObj.push({
					img : images[picAssets.unluck],
					x : info.x,
					y : info.y,
					w : info.w,
					h : info.h * 1.3,
					flowx : 0,
					flowxTmp : 0,
					flowxPlus : false,
					flowy : 0,
					flowyTmp : 0,
					flowyPlus : false,
					isShow : false,
					imgType : imgType.unluck
				});												// 未中奖
				drawObj.push({
					img : images[picAssets.over],
					x : info.x,
					y : info.y,
					w : info.w,
					h : info.h * 1.3,
					flowx : 0,
					flowxTmp : 0,
					flowxPlus : false,
					flowy : 0,
					flowyTmp : 0,
					flowyPlus : false,
					isShow : false,
					imgType : imgType.over
				});												// 抽奖次数用完
				drawObj.push({
					img : images[picAssets.gift],
					x : info.x,
					y : info.y,
					w : info.w,
					h : info.h * 1.8,
					flowx : 0,
					flowxTmp : 0,
					flowxPlus : false,
					flowy : 0,
					flowyTmp : 0,
					flowyPlus : false,
					isShow : false,
					imgType : imgType.gift
				});												// 中奖
				
				// 开始刷新画板
				setInterval(function() {draw(context, canvasBuffer, images);}, flashTime);
			};

			/**
			 * 画面刷新 使用双缓冲刷新画面
			 */
			var draw = function(context, bufferContext, images) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				contextBuffer.clearRect(0, 0, canvasBuffer.width, canvasBuffer.height);
				for ( var i = 0; i < drawObj.length; i++) {
					var obj = drawObj[i];
					if (obj.isShow) {							//是否显示
						contextBuffer.drawImage(obj.img, obj.x + obj.flowxTmp,
								obj.y + obj.flowyTmp, obj.w, obj.h);//将图片画到画板上
						
						if (obj.flowx) {						// 浮动显示
							obj.flowxTmp = getFlow(obj.flowxPlus, obj.flowx, obj.flowxTmp, 1);
							if (obj.flowxTmp > obj.flowx || obj.flowxTmp < 0) {
								obj.flowxPlus = !obj.flowxPlus;
							}
						}
						if (obj.flowy) {
							obj.flowyTmp = getFlow(obj.flowyPlus, obj.flowy, obj.flowyTmp, 1);
							if (obj.flowyTmp > obj.flowy || obj.flowyTmp < 0) {
								obj.flowyPlus = !obj.flowyPlus;
							}
						}
					}
				}
				context.drawImage(canvasBuffer, 0, 0);			//将缓冲画板刷到屏幕上
			};

			/**
			 * 后台获取抽奖情况
			 * @param url
			 * 			抽奖url
			 */
			var luckDraw = function(url, mobile, drawObj){
				loading = true;
				var success = function(result){					//成功回调方法
					if(result){
						switch(result.status){
						case 1000:								// 成功 
							if(result.data.is_luck == 1){		// 中奖了
								showByType(drawObj, imgType.gift);
							}else{								// 未中奖
								showByType(drawObj, imgType.unluck);
							}
							break;
						case 1001:								// 缺少参数 
							showMsg("#errorMsg", "网络参数异常，请重试。");
							break;
						case 1002:								// 手机号不正确
							showMsg("#errorMsg", "手机号码不正确。");
							break;
						case 1003:								// 请求过于频繁
							showMsg("#errorMsg", "网络繁忙，请重试。");
							break;
						case 1004:								// token不正确
							showMsg("#errorMsg", "网络头异常，请重试。");
							break;
						case 1005:								// 今日抽奖次数已用完
							showByType(drawObj, imgType.over);
							break;
						case 1007:								// 活动过期
							showMsg("#errorMsg", "对不起，活动已结束。");
							break;
						case 1008:								// 活动未开始
							showMsg("#errorMsg", "活动未开始。");
							break;
						}
					}
					loading = false;
				};
				var now = new Date();							//当前时间
				var time = ("" + now.getTime());
				time = time.substring(0, time.length-3);		//10位时间
				var token = hex_md5(tokenKey + "tel" + mobile + "time" + time + tokenKey);//token
				var data = {tel: mobile, time: time, token: token};//data json
				
				setTimeout(function(){load(url, "post", function(e){alert("抽奖失败, 请重试."); loading = false;},success,data);}, 800);
				
				
			};
			
			/**
			 *关闭所有宝箱
			 */
			var cleanChest = function(){
				itear(drawObj, imgType.chest2, function(o){
					o.img = images[picAssets.chest];	//换图片
					o.imgType = imgType.chest;
				})
			};
			
			/**
			 * 随机显示三张纸条中的一张
			 */
			var randomShow = function(){
				var random = parseInt(Math.random() * 100 % 2);
				switch(random){
				case 0:showByType(drawObj, imgType.paper1);break;
				case 1:showByType(drawObj, imgType.paper2);break;
				}
			}

			// ------------------------通用方法定义---------------------------
			// ------------------------程序流程-------------------------------

			//canvas点击事件
			$("#chestCanvas").click(function(e){
				if(loading){
					return;
				}
				var pos = getEventPosition(e);					//获得点击点
				clicked = false;
				for(var i = drawObj.length - 1; i >= 0; i--){		//循环所有图形
					var obj = drawObj[i];
					if(obj.isShow){//是否显示
						if(isCover(pos.x, pos.y, obj.x, obj.y, obj.w, obj.h)){//如果点击中该图形
							switch(obj.imgType){
							case imgType.chest:					//宝箱
								obj.img = images[picAssets.chest2];	//换图片
								obj.imgType = imgType.chest2;
								luckDraw(interfaceUrl, mobile, drawObj);//根据后台返回情况判断是否中奖
								clicked = true;
								break;
							case imgType.lucky: 				//中奖
							case imgType.unluck: 				//未中
							case imgType.over: 					//抽奖次数用完
								obj.isShow = false;
								clicked = true;
								cleanChest();
								break;
							case imgType.gift: 					//中奖
								obj.isShow = false;
								clicked = true;
								cleanChest();
								itear(drawObj, imgType.lucky, function(o){//显示lucky图片
									o.isShow = true;
								});
								break;
							case imgType.chest2:				//宝箱已开
								clicked = true;
								cleanChest();
								//不作处理
							}
							
							if(clicked){						//有点击事件已完成跳出循环
								break;
							}
						}
					}
				}
			});
			
			var startGame = function(){
				// ------------------------加载中奖-------------------------------
				loadImage(picAssets.lucky, callback, complete, allImageCount, initDraw, context, canvas.width, canvas.height);
				// ------------------------加载中奖-------------------------------
	
				// ------------------------加载未中奖-----------------------------
				loadImage(picAssets.unluck, callback, complete, allImageCount, initDraw, context, canvas.width, canvas.height);
				// ------------------------加载未中奖-----------------------------
	
				// ------------------------加载宝箱-------------------------------
				loadImage(picAssets.chest, callback, complete, allImageCount, initDraw, context, canvas.width, canvas.height);
				loadImage(picAssets.chest2, callback, complete, allImageCount, initDraw, context, canvas.width, canvas.height);
				// ------------------------加载宝箱-------------------------------
	
				// ------------------------加载抽奖完毕---------------------------
				loadImage(picAssets.over, callback, complete, allImageCount, initDraw, context, canvas.width, canvas.height);
				// ------------------------加载抽奖完毕---------------------------
				
				// ------------------------加载中奖---------------------------
				loadImage(picAssets.gift, callback, complete, allImageCount, initDraw, context, canvas.width, canvas.height);
				// ------------------------加载中奖---------------------------

	
				// ------------------------开始动画-------------------------------
				init();
				// ------------------------开始动画-------------------------------
			};
		} else {
			showMsg("#errorMsg", "抱歉，您的浏览器不支持HTML5-canvas，请使用支持HTML5的浏览器。");
		}
	});