	//----------------------------���������-------------------------------
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
	//----------------------------���������--------------------------------
	var picAssets = {
		over : "ztimages/over01.png", 						// ������
		chest : "ztimages/close.png", 						// ����ر�ͼƬ
		chest2 : "ztimages/open.png", 						// �����ͼƬ
		lucky : "ztimages/lucky.png", 						// �н�
		unluck : "ztimages/unluck.png",						// δ�н�
		gift : "ztimages/ten_money.png",					//�н���Ϣ
	};
	var imgType = {												//ͼƬ����
			chest: 1,											//����
			lucky: 2,											//�н�
			unluck: 3,											//δ�н�
			over: 4,											//�齱��������
			chest2: 5,											//�����ѿ�
			gift: 9												//�н���Ϣ
	};
	var drawObj = []; 											// ��ͼ����, �Դ�img, x, y, w, h, flow, isShow
	var images = [];											// ͼƬ�б�
	$(document).ready(function() {
		// -------------------------��������-----------------------------
		var flashTime = 70; 								// 70����ˢ��һ�λ���

		var complete = {count : 0};							// ͼƬ���ؼ�¼
		var allImageCount = 6; 								// ����ͼƬ����

		var canvasBuffer;									// ˫����canvas
		var contextBuffer;
		var clicked = false;								// ���������
		var loading = false;								// �����п���
		
		var interfaceUrl = "http://dev.house.focus.cn/common/modules/lottery/2015/20150323.php"; //��̨�ӿڵ�ַ
		
		var realName = "";									//����
		var mobile = "";									//�ֻ���
		// -------------------------��������-----------------------------
		// ---------------------------��½����---------------------------
		$(".begin-btn").click(function(){
			var name = $("#name").val();
			var tal = $("#mobile").val();
			if(!nameReg.test(name)){
				showMsg("#errorMsg", "������������ʵ������");
				return;
			}
			
			if(!mobiltReg.test(tal)){
				showMsg("#errorMsg", "�����������ֻ����롣");
				return;
			}
			
			realName = name;
			mobile = tal;
			
			$("#login").hide();
			$("#wrap_body").show();
			
			startGame();
		});
		// ---------------------------��½����-----------------------------
		
		var canvas = document.getElementById('chestCanvas'); 	// ���canvas
		if (canvas.getContext("2d")) {// ֧��h5
			// ------------------------��ʼ��------------------------------
			var context = canvas.getContext("2d");				// 2d����
			var size = getPageSize();						// ��ȡviewBlock��С
			var w = 640;									// ��ÿ� �ƶ�������ʿ��640px, ��css��ƥ��
			var h = size[1];								// ��ø�
			// ���ÿ��
			canvas.width = w;
			canvas.height = h;

			// ------------------------��ʼ��--------------------------------
			// ------------------------ͨ�÷�������---------------------------

			var init = function() {
				context.clearRect(0, 0, canvas.width, canvas.height);
				// ˫����
				canvasBuffer = document.createElement("canvas");
				canvasBuffer.width = canvas.width;
				canvasBuffer.height = canvas.height;
				contextBuffer = canvasBuffer.getContext("2d");
				contextBuffer.clearRect(0, 0, canvasBuffer.width,
						canvasBuffer.height);
			};
			
			
			/**
			 * ��ʼ����ͼ ������Ҫ��ͼ�Ķ���
			 */
			var initDraw = function() {
				// ����λ��������
				var chestes = {
					chest1 : {x : canvas.width / 14, y : canvas.height * 3 / 7,
						w : canvas.width * 4 / 14, h : canvas.height * 3 / 16},
					chest2 : {x : canvas.width * 5 / 14, y : canvas.height * 3 / 7,
						w : canvas.width * 4 / 14, h : canvas.height * 3 / 16},
					chest3 : {x : canvas.width * 9 / 14, y : canvas.height * 3 / 7,
						w : canvas.width * 4 / 14, h : canvas.height * 3 / 16}
				};
				// ��ʾλ��������
				var info = {x : 20, y : canvas.height/4, w : canvas.width - 40, h : canvas.height/3};

				drawObj.push({									// ����1
					img : images[picAssets.chest],				// ͼƬ
					x : chestes.chest1.x,						// ���Ͻ�X
					y : chestes.chest1.y,						// ���Ͻ�Y
					w : chestes.chest1.w,						// ���
					h : chestes.chest1.h,						// �߶�
					flowx : 0,									// x�ḡ��
					flowxTmp : 0,								// x�ḡ�ȼ���
					flowxPlus : false,							// x���Ƿ񸡶�
					flowy : 15,									// y�ḡ��
					flowyTmp : 0,								// y�ḡ������
					flowyPlus : true,							// y���Ƿ񸡶�
					isShow : true,								// �ö����Ƿ���ʾ
					imgType : imgType.chest						// ͼƬ����
				});
				drawObj.push({									// ����2
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
				drawObj.push({									// ����3
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
				// �������
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
				});												// �н�
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
				});												// δ�н�
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
				});												// �齱��������
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
				});												// �н�
				
				// ��ʼˢ�»���
				setInterval(function() {draw(context, canvasBuffer, images);}, flashTime);
			};

			/**
			 * ����ˢ�� ʹ��˫����ˢ�»���
			 */
			var draw = function(context, bufferContext, images) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				contextBuffer.clearRect(0, 0, canvasBuffer.width, canvasBuffer.height);
				for ( var i = 0; i < drawObj.length; i++) {
					var obj = drawObj[i];
					if (obj.isShow) {							//�Ƿ���ʾ
						contextBuffer.drawImage(obj.img, obj.x + obj.flowxTmp,
								obj.y + obj.flowyTmp, obj.w, obj.h);//��ͼƬ����������
						
						if (obj.flowx) {						// ������ʾ
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
				context.drawImage(canvasBuffer, 0, 0);			//�����廭��ˢ����Ļ��
			};

			/**
			 * ��̨��ȡ�齱���
			 * @param url
			 * 			�齱url
			 */
			var luckDraw = function(url, mobile, drawObj){
				loading = true;
				var success = function(result){					//�ɹ��ص�����
					if(result){
						switch(result.status){
						case 1000:								// �ɹ� 
							if(result.data.is_luck == 1){		// �н���
								showByType(drawObj, imgType.gift);
							}else{								// δ�н�
								showByType(drawObj, imgType.unluck);
							}
							break;
						case 1001:								// ȱ�ٲ��� 
							showMsg("#errorMsg", "��������쳣�������ԡ�");
							break;
						case 1002:								// �ֻ��Ų���ȷ
							showMsg("#errorMsg", "�ֻ����벻��ȷ��");
							break;
						case 1003:								// �������Ƶ��
							showMsg("#errorMsg", "���緱æ�������ԡ�");
							break;
						case 1004:								// token����ȷ
							showMsg("#errorMsg", "����ͷ�쳣�������ԡ�");
							break;
						case 1005:								// ���ճ齱����������
							showByType(drawObj, imgType.over);
							break;
						case 1007:								// �����
							showMsg("#errorMsg", "�Բ��𣬻�ѽ�����");
							break;
						case 1008:								// �δ��ʼ
							showMsg("#errorMsg", "�δ��ʼ��");
							break;
						}
					}
					loading = false;
				};
				var now = new Date();							//��ǰʱ��
				var time = ("" + now.getTime());
				time = time.substring(0, time.length-3);		//10λʱ��
				var token = hex_md5(tokenKey + "tel" + mobile + "time" + time + tokenKey);//token
				var data = {tel: mobile, time: time, token: token};//data json
				
				setTimeout(function(){load(url, "post", function(e){alert("�齱ʧ��, ������."); loading = false;},success,data);}, 800);
				
				
			};
			
			/**
			 *�ر����б���
			 */
			var cleanChest = function(){
				itear(drawObj, imgType.chest2, function(o){
					o.img = images[picAssets.chest];	//��ͼƬ
					o.imgType = imgType.chest;
				})
			};
			
			/**
			 * �����ʾ����ֽ���е�һ��
			 */
			var randomShow = function(){
				var random = parseInt(Math.random() * 100 % 2);
				switch(random){
				case 0:showByType(drawObj, imgType.paper1);break;
				case 1:showByType(drawObj, imgType.paper2);break;
				}
			}

			// ------------------------ͨ�÷�������---------------------------
			// ------------------------��������-------------------------------

			//canvas����¼�
			$("#chestCanvas").click(function(e){
				if(loading){
					return;
				}
				var pos = getEventPosition(e);					//��õ����
				clicked = false;
				for(var i = drawObj.length - 1; i >= 0; i--){		//ѭ������ͼ��
					var obj = drawObj[i];
					if(obj.isShow){//�Ƿ���ʾ
						if(isCover(pos.x, pos.y, obj.x, obj.y, obj.w, obj.h)){//�������и�ͼ��
							switch(obj.imgType){
							case imgType.chest:					//����
								obj.img = images[picAssets.chest2];	//��ͼƬ
								obj.imgType = imgType.chest2;
								luckDraw(interfaceUrl, mobile, drawObj);//���ݺ�̨��������ж��Ƿ��н�
								clicked = true;
								break;
							case imgType.lucky: 				//�н�
							case imgType.unluck: 				//δ��
							case imgType.over: 					//�齱��������
								obj.isShow = false;
								clicked = true;
								cleanChest();
								break;
							case imgType.gift: 					//�н�
								obj.isShow = false;
								clicked = true;
								cleanChest();
								itear(drawObj, imgType.lucky, function(o){//��ʾluckyͼƬ
									o.isShow = true;
								});
								break;
							case imgType.chest2:				//�����ѿ�
								clicked = true;
								cleanChest();
								//��������
							}
							
							if(clicked){						//�е���¼����������ѭ��
								break;
							}
						}
					}
				}
			});
			
			var startGame = function(){
				// ------------------------�����н�-------------------------------
				loadImage(picAssets.lucky, callback, complete, allImageCount, initDraw, context, canvas.width, canvas.height);
				// ------------------------�����н�-------------------------------
	
				// ------------------------����δ�н�-----------------------------
				loadImage(picAssets.unluck, callback, complete, allImageCount, initDraw, context, canvas.width, canvas.height);
				// ------------------------����δ�н�-----------------------------
	
				// ------------------------���ر���-------------------------------
				loadImage(picAssets.chest, callback, complete, allImageCount, initDraw, context, canvas.width, canvas.height);
				loadImage(picAssets.chest2, callback, complete, allImageCount, initDraw, context, canvas.width, canvas.height);
				// ------------------------���ر���-------------------------------
	
				// ------------------------���س齱���---------------------------
				loadImage(picAssets.over, callback, complete, allImageCount, initDraw, context, canvas.width, canvas.height);
				// ------------------------���س齱���---------------------------
				
				// ------------------------�����н�---------------------------
				loadImage(picAssets.gift, callback, complete, allImageCount, initDraw, context, canvas.width, canvas.height);
				// ------------------------�����н�---------------------------

	
				// ------------------------��ʼ����-------------------------------
				init();
				// ------------------------��ʼ����-------------------------------
			};
		} else {
			showMsg("#errorMsg", "��Ǹ�������������֧��HTML5-canvas����ʹ��֧��HTML5���������");
		}
	});