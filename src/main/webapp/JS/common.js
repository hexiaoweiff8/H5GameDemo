	//---------------΢�Žӿ�--------------------------
	/*
	 * -----------------------------------------------
	 *          ||�����ܲ���������Ӧ����||
	 * -----------------------------------------------
	 */
	var imgUrl = 'http://27.131.221.248/lapp/icbc02/img/share.jpg';
    var lineLink = window.location.href;
    var shareTitle = '�´���Ѱ�� �����������';
    var appid = '';
    var desc1 = '�Ѻ����� �ƶ��񻶽�';
    var desc2 = ' �´���Ѱ�� ���������';
     
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
    // ��΢���������������ڲ���ʼ����ᴥ��WeixinJSBridgeReady�¼���
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        // ���͸�����
        WeixinJSBridge.on('menu:share:appmessage', function(argv){
            shareFriend();
        });
        // ��������Ȧ
        WeixinJSBridge.on('menu:share:timeline', function(argv){
            shareTimeline();
        });
        // ����΢��
        WeixinJSBridge.on('menu:share:weibo', function(argv){
            shareWeibo();
        });
    }, false);
	//---------------΢�Žӿ�--------------------------
    //---------------��ͨ����--------------------------

	var mobiltReg = /1[3458]{1}\d{9}$/;						//�ֻ���������ʽ
	var nameReg = /[\u4E00-\u9FA5]{2,5}(?:��[\u4E00-\u9FA5]{2,5})*/;		//��ʵ����������ʽ
	var tokenKey = "Zfdk%H8@cM";							//У����token��Key
    /**
	 * ����ͼƬ
	 * 
	 * @param url
	 *            ͼƬurl
	 * @param callback
	 *            ������Ϻ�Ļص�, �Ὣimage��Ϊ��������
	 * @param complete
	 * 			  ���ؼ���
	 * @param allImageCount
	 * 			  ����ͼƬ����
	 * @param initDraw
	 * 			  ��ʼ������
	 * @param ctx
	 * 			  context����
	 */
	var loadImage = function(url, callback, complete, allImageCount, initDraw, ctx, width, height) {
		var image = new Image();
		image.src = url;
		image.onload = function(o) {
			callback(url, image, complete, allImageCount, initDraw, ctx, width, height);
		};
		image.onerror = function() {
			showMsg("#errorMsg", "����ʧ��, ˢ������.");
		};
	};
	

	/**
	 * ����ͼƬ�ص�
	 * 
	 * @param url
	 *            ͼƬurl
	 * @param image
	 *            ͼƬ����
	 * @param completeCount
	 *            �������count
	 * @param allImageCount
	 * 			  ����ͼƬ����
	 * @param initDraw
	 * 			  ��ʼ������
	 * @param ctx
	 * 			  context����
	 */
	var callback = function(url, image, complete, allImageCount, initDraw, ctx, width, height) {
		images[url] = image;
		complete.count++;
		loading(ctx, width, height, complete.count, allImageCount);
		if (complete.count == allImageCount) {			// ͼƬ�������,
			initDraw();									// ��ʼ����
		}
	};
	
	/**
	 * ������
	 * @param ctx
	 * 			 context����
	 * @param loadedImages
	 * 			�����е�ͼƬ����
	 * @param numImages
	 * 			ͼƬ������
	 */
	var loading = function(ctx, width, height, loadedImages, numImages){
		//�ػ�һ��������
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
	 * ��ȡ���޸ĸ���ϵ��
	 * 
	 * @param isFlow
	 *            ��������
	 * @param flow
	 *            ������С
	 * @param flow
	 *            ������ǰֵ
	 * @param flowCount
	 *            �����ٶ�
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
	 * ��õ���¼���x��y
	 * @param ev
	 * 			����¼�����
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
	 * �ж��Ƿ񱻵��
	 * @param posX �����x
	 * @param posY �����y
	 * @param x ͼ��x
	 * @param y ͼ��y
	 * @param w ͼ�ο�
	 * @param h ͼ�θ�
	 */
	var isCover = function(posX, posY, x, y, w, h){
		// ���Ͻ�����ھ������Ͻ�, С�ھ������½�, ���ھ�����
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
	 * ��������ͨ�÷���
	 * @param url    ����url
	 * @param type   ����Э��
	 * @param errFun ʧ�ܴ���
	 * @param sucFun �ɹ�����
	 * @param data ����
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
	 * ����������ʾͼ��
	 * @param drawObj
	 * @param type
	 */
	function showByType(drawObj, type){
		for(var i = 0; i < drawObj.length; i++){		//ѭ������ͼ��
			if(drawObj[i].imgType == type){
				drawObj[i].isShow = true;
				break;
			}
		}
	}
	
	/**
	 * ��ʾ��Ϣ
	 * @param id
	 * @param msg
	 */
	function showMsg(id, msg){
		$(id).html(msg + "<a href='#'>ȷ��</a>");
		$(id + " a").click(function(){$("#errorMsg").hide();});
		$(id).show();
	}
	

	/**
	 * ��ȡҳ��ʵ�ʴ�С
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
	 * ������
	 */
	var itear = function(drawObj, type, callback){
		for(var i = 0; i < drawObj.length; i++){
			if(drawObj[i].imgType == type){
				callback(drawObj[i]);
			}
		}
	};
	
	