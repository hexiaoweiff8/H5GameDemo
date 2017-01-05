// 定义全局属性
G = {};
$(function() {

	// -------------------------加载器------------------------------
	G.loader = {};
	// 加载中状态, 0: 已完成 , 1: 加载中, -1: 加载失败
	G.loader.loadingState = 0;
	// 加载队列 key:value方式解决多线程加载问题.
	G.loader.loadingQueue = {};
	// 加载队列ID, 自增
	G.loader.loadingId = 0;
	// 已加载资源列表
	G.loader.loadedList = [];
	// 已加载资源路径列表， 用于排除反复加载，
	G.loader.loadedPathList = [];
	// 加载完毕事件, 加载完毕会调用的事件, 应由使用者赋值
	// G.loader.loadComplete = function(){
	// console.log("G.loader.loadComplete is not init.");
	// };
	// --------------------------计时器------------------------------
	G.ticker = {};
	/**
	 * 计时器tick列表
	 */
	G.ticker.tickList = [];

	/**
	 * 计时器id(自增)
	 */
	G.ticker.tickId = 0;

	/**
	 * 计时器刷新速率 次/秒
	 */
	G.ticker.flashSpeed = 60;

	/**
	 * 启动计时器
	 */
	G.ticker.startTick = function() {
		// 启动计时器, 每秒flashSpeed次
		window.setInterval(function() {
		}, 1000 / 60);
	};

	/**
	 * 添加计时 time: 回调时间 单位毫秒 callback: 回调方法 return callbackId
	 */
	G.ticker.add = function(time, callback) {
		var tmpId = G.ticker.tickId++;
		G.ticker.tickList[tmpId] = {
			time : time,
			callback : callback
		};
		return tmpId;
	};

	/**
	 * 根据id删除tick tickId: tickid, 用于查找tick
	 */
	G.ticker.del = function(tickId) {
		G.ticker.tickList.del(tickId);
	};

	// --------------------------常量定义-----------------------------
	G.common = {};
	// 加载超时时间 单位毫秒
	G.common.OverTime = 30000;
	// 屏幕边框
	G.common.screenBorderWidth = 0.1;
	G.common.screenBorderHeight = 0.1;
	// TODO canvas由js添加至页面, 指定标签进行添加
	// 获得canvas
	G.canvas = document.getElementById("Screen");
	G.context = G.canvas.getContext("2d");
	// 浏览器区分
	G.common.phoneWidth = parseInt(window.screen.width);
	// 设置高度
	G.common.phoneHeight = parseInt(window.screen.height);
	// 设置canvas为全屏-屏幕边框
	G.canvas.width = G.common.phoneWidth - G.common.phoneWidth
			* G.common.screenBorderWidth;
	G.canvas.height = G.common.phoneHeight - G.common.phoneHeight
			* G.common.screenBorderHeight;

	// context.beginPath();
	// ----------------------封装绘图板--------------------------------
	/**
	 * 绘制图片 img: 图片对象 x: 绘制位置x(左上角位置) y: 绘制位置y(左上角位置) w: 绘制图形宽度 h: 绘制图形高度 r:
	 * 旋转角度 单位°
	 */
	G.canvas.drawImage = function(img, x, y, w, h, r) {
		console.log(img);
		if (r && r != 0) {
			// 保存状态
			G.context.save();
			// 设置中心点为坦克位置中心
			G.context.translate(x - w / 2, y - h / 2);
			// 旋转角度
			G.context.rotate(r * Math.PI / 180);
			// 绘制图片
			G.context.drawImage(img, 0, 0);
			// 恢复画布旋转与位置状态
			G.context.restore();
		} else {
			console.log(img, x, y, w, h);
			G.context.drawImage(img, x, y, w, h);
		}
	};

	/**
	 * 绘制文字 txt: 文字内容 x: 绘制位置x(左上角位置) y: 绘制位置y(左上角位置) size: 字体大小
	 */
	G.canvas.drawText = function(txt, x, y, size) {
		G.context.strokeText(txt, x, y, size);
	};

	/**
	 * 填充颜色 color: 颜色 "#000000" x: 绘制位置x(左上角位置) y: 绘制位置y(左上角位置) w: 绘制图形宽度 h:
	 * 绘制图形高度
	 */
	G.canvas.fillRect = function(color, x, y, w, h) {
		G.context.fillStyle = color;
		G.context.fillRect(x, y, w, h);
	};
	/**
	 * 画直线 x1: 绘制点x1 y1: 绘制点y1 x2: 绘制点x2 y2: 绘制点y2 size: 线宽度
	 */
	G.canvas.drawLine = function(color, x1, y1, x2, y2, size) {
		G.context.strokeStyle = color;
		G.context.lineWidth = size;
		G.context.moveTo(x1, y1);
		G.context.lineTo(x2, y2);
		G.context.closePath();
		G.context.stroke();
	};

	// TODO 两种方式, 一种单机模式, 目前实现这种方式, 所有操作都在本地
	// 另一种服务器模式, 使用长连接, 所有运动数据来自于服务器, 只发送操作数据到服务器 websocket, iComet

	// TODO 尝试增加拖尾效果, 使用马赛克方式实现(小方块)
	// 传入源, 使用跟随的方式

	// 图片加载使用预加载, 加载完成显示100%
	G.loader = {};
	/**
	 * 图片预加载 图片加载完成返回100 使用状态中断方式, 成功后置状态1, 超时置状态-1 在G中生成image键值列表 imgList:
	 * 图片列表(键值对列表[{imageName:name, imageSrc: src},...]) // * callback: 结束回调,
	 * 如果加载失败传入状态-1, 超时失败传入-2, 如果加载成功传入状态1.
	 */
	G.loader.loadImageList = function(imgList, callback) {
		// 创建加载队列
		var loadingContainer = {};
		// 设置开始加载时间
		loadingContainer.startTime = new Date().getTime();
		// 加载状态为加载中
		// loadingContainer.state = 1;
		// 加载列表总数量
		loadingContainer.allCount = imgList.length;
		// 已加载完毕数量
		loadingContainer.loadedCount = 0;
		for ( var item in imgList) {
			if (item) {
				var imageName = item.imageName;
				var loadItem = {};
				// 图片对象
				loadItem.img = new Image();
				// 加载成功
				loadItem.img.onload = function() {
					loadingContainer++;
					// 设置加载状态为: 加载完毕
					loadItem.loadState = 0;
					// 加载完毕
					if (loadingContainer.allCount == loadingContainer.loadedCount) {
						// loadingContainer.state = 0;
						callback(1);
					}
					// 将已加载资源放入已加载列表
					G.loader.loadedList[imageName] = loadItem.img;
				};
				loadItem.img.onerror = function() {
					loadingContainer.state = -1;
					callback(-1);
				};
				loadItem.img.src = item.imageSrc;
				// 加载状态为: 加载中
				loadItem.loadState = 1;
				loadingContainer.loadList[imageName] = loadItem;
			}
		}
		;
		// TODO 超时操作
		G.loader.loadingQueue[G.loader.loadingId] = loadingContainer;
	};

	// -------------------------对象---------------------------------

	/**
	 * 元对象 包含位置,大小
	 */
	function Block(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		// 缩小耦合范围
		this.GForObj = G;
		// 在绘图板上绘制
		// this.draw = function(){
		// // 默认绘制纯色块
		// this.GForObj.canvas.fillRect("#ffffff", x, y, w, h);
		// };
		// TODO 判断执行,给予"视野"任意判断,判断为true任意执行
		// this.judgeDo = function(all){
		//		
		// };
	}

	/**
	 * 坦克对象 根据坦克类型绘制坦克
	 */
	function Tank(x, y, tankType) {
		// 继承Block
		// this.tmpObj=Block;
		Block.call(this, x, y, tankType.w, tankType.h);
		// delete this.tmpObj;
		// tankType中包含坦克的组件列表
		// this.turretImg = tankType.turretImg;
		// this.tankBody = tankType.tankBody;
		// 控制放到外面, 将操作以对象方式放在外面由基本操作封装的操作列表进行拦截调用
		// this.controller = tankType.controller;
		// 初始化角度
		this.angle = 0;
		// 图层列表
		// this.layerList = tankType.layerList;
		// 图层描述列表 描述内容: 图片, [颜色, 形状], 旋转角度, 位移, ...
		this.layerDateList = tankType.layerDataList;
		// 事件列表
		this.eventList = tankType.eventList;
		// 重构draw
		// this.draw = function(){
		// // 依照层次 画tank的绘制列表
		// for(var layer in tankType.layerList){
		// var tmpLayerData = this.layerDateList[layer.layerName];
		// if(tmpLayerData){
		// this.GForObj.canvas.drawImage(layer.img, x + tmpLayerData.offX, y +
		// tmpLayerData.offY, tmpLayerData.w, tmpLayerData.h, tmpLayerData.r);
		// }
		// }
		// };
	}

	// 所有类中只存储数据
	// 绘制有专门的绘制器绘制
	// 所有逻辑与数据输入归为一点

	// ------------------------- 绘制器------------------------
	G.drawer = {};
	/**
	 * 绘制block block: 绘制的基本对象
	 */
	G.drawer.drawBlock = function(block) {
		// 循环对象中所有需要绘制的列表
		for (var i = 0; i < block.layerDateList.length; i++) {
			var part = block.layerDateList[i];
			// TODO x绘制方法抽象出去, 不是死硬的写在这里
			G.canvas.drawImage(part.img, block.x + part.offsetX, block.y
					+ part.offsetY, part.w, part.h, part.r);
		}
	};

	// ---------------------------操作拦截器------------------------
	G.controller = {};
	/**
	 * 操作拦截器列表
	 * 单元结构:{key: key, execute: 执行方法}
	 */
	G.controller.controlList = [];
	
	/**
	 * 拦截所有键盘操作
	 */
	$(G.canvas).keydown(function(e){
		for(var control in G.controller.controlList){
			if(e.key.toLowerCase() == control.keytoLowerCase()){
				control.execute();
			}
		}
	});
	
	// 绘图结构使用堆栈实现点击层级
	
	//--------------------------碰撞检测----------------------------
	/**
	 * 判断是否有碰撞
	 */
	G.detector.contact = function(block1, block2){
		
		return false;
	};
	
});



// 游戏逻辑
$(function(){
	// 创建坦克结构
	// 坦克操作逻辑
	// 坦克技能与事件绑定
	// 
});
