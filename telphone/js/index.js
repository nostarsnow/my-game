$(function(){
	var cj = createjs,
		loader = [
		"p1_bg.jpg",
		"p1_t1.png",
		"p1_t2.png",
		"footer.jpg",
		"p2_t1.png",
		"p3_t1.jpg",
		"p3_t2.jpg",
		"p3_t3.png",
		"p4_t1.jpg",
		"wxshare.png",
		"h0.jpg",
		"h1.jpg",
		"h2.jpg",
		"h3.jpg",
		"h4.jpg",
		"h5.jpg",
		"h6.jpg",
		"h7.jpg",
		"h8.jpg",
		"hm.jpg"
	],
	msgList = [
		{
			name : "我",
			img : 'm'
		},
		{
			name : "爸爸",
			img : 0,
			msg : "儿子，在不在？"
		},
		{
			name : "二姑",
			img : 1,
			msg : "过儿，姑姑在这儿。。。"
		},
		{
			name : "小婶",
			img : 2,
			msg : "你叔呢？"
		},
		{
			name : "妹妹",
			img : 3,
			msg : "我是你妹！"
		},
		{
			name : "弟弟",
			img : 4,
			msg : "哥。给我买个iPhone 6s！"
		},
		{
			name : "小叔",
			img : 5,
			msg : "你婶呢？"
		},
		{
			name : "姐姐",
			img : 6,
			msg : "小青。让仕林小心！"
		},
		{
			name : "二姑夫",
			img : 7,
			msg : "我给你打点儿钱吧！"
		}
	],
	daddyMes = [
		{
			type : "time"
		},
		{
			type : "left",
			headimg : 0,
			msg : '儿子，在不在？',
			time : 0
		},
		{
			type : "right",
			headimg : "m",
			msg : '怎么了？'
		},
		{
			type : "left",
			headimg : 0,
			msg : '刚教会你爷爷玩微信，想建个群给家里人都拉进来。',
			time : 1000
		},
		{
			type : "right",
			headimg : "m",
			msg : '哇，爷爷好新潮！那我直接建立吧！'
		}
	],
	familyMes = [
		{
			type : "time",
			msg : "你邀请了爸爸,二姑,妹妹...参与群聊",
			time : 0
		},
		{
			type : "time",
			time : 500
		},
		{
			type : "left",
			headimg : 4,
			msg : '哇！',
			time : 700
		},
		{
			type : "time",
			msg : '爸爸邀请青松进入家庭群',
			time : 1000
		},
		{
			type : "time",
			time : 500
		},
		{
			type : "left",
			headimg : 0,
			msg : '呵呵，爸来了！',
			time : 800
		},
		{
			type : "left",
			headimg : 8,
			msg : '大家好！',
			time : 1000
		},
		{
			type : "left",
			headimg : 3,
			msg : '列队欢迎！',
			time : 1200
		},
		{
			type : "left",
			headimg : 1,
			msg : '棒！',
			time : 500
		},
		{
			type : "left",
			headimg : 2,
			msg : '爸重阳节快乐！',
			time : 700
		},
		{
			type : "left",
			headimg : 6,
			msg : '爷爷好！',
			time : 700
		},
		{
			type : "left",
			headimg : 4,
			msg : '爷爷好！',
			time : 900
		},
		{
			type : "left",
			headimg : 7,
			msg : '重阳节到了，祝爸爸身体健康！！',
			time : 900
		},
		{
			type : "right",
			headimg : "m",
			msg : '爷爷好！棒棒哒！'
		},
		{
			type : "left",
			headimg : 4,
			msg : '<img src="img/wxshare.png" class="wxshare"/>',
			time : 1000,
			link : "http://x.eqxiu.com/s/Nz8aK8py"
		}
	],
	W = $(window).width(),
	H = $(window).height(),
	last = {
		begin : 0,
		day : 0,
		min : 0
	},
	pageStyle = [
		[1,2,3],
		[2,3,4],
		[3,4,5],
		[4,5,6],
		[2,6],
		[1,2,6]
	],
	dragW = W*0.5,
	timeGo,
	time = -1,
	timeInterval = 10000,
	power = 77,
	minPower = 7,
	powerInterval = 1,
	pageTime = 500,
	pageInit = [0,0,0,0,0,0,0];
	$header = $("#header"),
	$time = $(".time"),
	$date = $(".date"),
	$nettype = $(".nettype"),
	$signal = $(".signal"),
	$powernum = $header.find(".powernum"),
	$powerProgress = $header.find(".powerProgress"),
	$page = {
		page : $(".page"),
		page1 : $(".page1"),
		page2 : $(".page2"),
		page3 : $(".page3"),
		page4 : $(".page4"),
		page5 : $(".page5"),
		page6 : $(".page6"),
	},
	$progress = $("#progress"),
	$drag = $(".drag"),
	$wxheader = $(".wxheader"),
	$wx_mes = $(".wx_meslist ul"),
	preload = new cj.LoadQueue(false, "img/");
	//preload.installPlugin(cj.Sound);
	preload.loadManifest(loader);
	preload.on("fileload", loadProgress);
	preload.on("complete", init);
	function loadProgress(e){
		$progress.html((preload.progress*100).toFixed(2)+'%');
	}
	function play(mp3,times){
	    times = times === undefined ? 0 : times;
	    cj.Sound.play(mp3,{loop:times});
	}
	function getNowTime(){
		var date = new Date(),
			month = date.getMonth()+1,
			day = date.getDate(),
			hour = date.getHours(),
			min = date.getMinutes();
		return {
			month : month > 9 ? month : '0' + month,
			day : day > 9 ? day : '0' + day,
			hour : hour > 9 ? hour : '0' + hour,
			min : min > 9 ? min : '0' + min,
			week : date.getDay()
		}
	}
	function timeGoing(){
		var now = getNowTime();
		if ( last.begin == 0 ){
			last.begin = now;
		}
		time++;
		if ( power >= minPower && time%powerInterval == 0 ){
			$powernum.html(power + '%');
			$powerProgress.width(power + '%');
			power--;
		}
		if ( last.min != now.min ){
			last.min = now.min;
			$time.html(now.hour + ":" + now.min);
		}
		if ( last.day != now.day ){
			last.day = now.day;
			$date.html(now.month + '月' + now.day + '日 星期' + '日一二三四五六'[now.week]);
		}
	}
	function bindEvent(){
		$drag.on("touchstart",function(e){
			if ( this.moving ){
				return false;
			}
			if ( $(this).hasClass('message') ){
				$(this).addClass('movedown');
			}
			this.moving = true;
			this.bx = e.touches[0].pageX;
		});
		$drag.on("touchmove",function(e){
			if ( !this.moving ){
				return false;
			}
			var x = e.touches[0].pageX,
				cx = x-this.bx;
			if ( cx > dragW ){
				this.moving = false;
				page2();
				return false;
			}
			if ( cx > 0 ){
				$(this).css("left",cx);
			}
		});
		$drag.on("touchend",function(e){
			var _this = this;
			this.moving = false;
			$(this).removeClass("movedown").animate({
				left : 0
			},300);
		});
	}
	function createMesList(){
		var _msg = msgList.slice(2),msg=[];
		for (var i = 0,length = _msg.length; i < length ; i++ ){
	  		msg.push(_msg.splice(Math.floor(Math.random()*_msg.length),1)[0]);
		}
		for ( var i = 0,length = msg.length,html=[],date = new Date(),hour,min; i < length ; i++ ){
			date.setMinutes(last.begin.min- ~~(i*Math.random()*17+11));
			date.setHours(last.begin.hour - i*1.5 );
			hour = date.getHours();
			if ( hour < 10 ){
				hour = '0' + hour;
			}
			min = date.getMinutes();
			if ( min < 10 ){
				min = '0' + min;
			}
			html.push('<li>' + 
						'<a href="javascript:;">' +
	                        '<div class="headimg">' +
	                            '<img src="img/h' + msg[i].img +'.jpg"/>' +
	                        '</div>' +
	                        '<div class="mesbox">' +
	                            '<p class="nickname">' + msg[i].name + '</p>' +
	                            '<p class="message">' + msg[i].msg + '</p>' +
	                        '</div>' +
	                        '<div class="mestime">' + hour + ':' + min + '</div>' +
                        '</a>' +
                    '</li>');
		}
		$wx_mes.append(html.join(''));
	}
	function pageSet(x,y,z){
		$page.page.removeClass("current");
		$(".list").removeClass(function(index, css){
		　　return (css.match(/list(-.*)?/g) || []).join(' ');
		}).removeClass('current');
		x && $page['page' + x ].addClass('current list list--1');
		y && $page['page' + y ].addClass('current list list-0');
		z && $page['page' + z ].addClass('current list list-1');
	}
	function pageGo(left){
		var $listx = $(".list--1"),
			$listy = $(".list-0"),
			$listz = $(".list-1");
		if ( left ){
			$listz.removeClass('current list--1');
			$listy.removeClass('list-0').addClass('list-1');
			$listx.removeClass('list--1').addClass('list-0');
		}else{
			$listx.removeClass('current list--1');
			$listy.removeClass('list-0').addClass('list--1');
			$listz.removeClass('list-1').addClass('list-0');
		}
	}
	function createMes(message,group){
		var html,
			type = message.type,
			headimg = message.headimg,
			msg = message.msg,
			nickname = '',
			link = message.link;
		if ( type == 'time' ){
			html = '<li class="mes_time"><span>'
			if ( msg ){
				html += msg;
			}else{
				var now = getNowTime();
				html += now.hour + ':' + now.min;
			}
			html += '</span></li>';
		}else{
			if ( group ){
				nickname = '<div class="nickname">' +
                            	msgList[headimg+1].name +
                            '</div>';
			}
			html = '<li class="mes_' + type +'">' +
                        ( message.link ? '<a href="' + link + '" class="wx_link">' : '<a href="javascript:;">' ) +
                            '<div class="headimg">' +
                                '<img src="img/h' + headimg + '.jpg"/>' +
                            '</div>' +
                            nickname +
                            '<div class="mesbox">' +
                              	msg + 
                            '</div>' +
                        '</a>' +
                    '</li>';
		}
		return html;
	}
	function page1(){
		pageInit[1] = 1;
		$page.page.removeClass("current");
		$page.page1.addClass('current');
		bindEvent();
		$signal.each(function(i,el){
			(function(i){
				setTimeout(function(){
					$(el).addClass('full');
				},i*300);
			})(i)
		})
		if ( navigator.userAgent.match(/wifi/i) ){
			$nettype.addClass('wifi');
		}else{
			$nettype.addClass('cmnet');
		}
	}
	function page2(type){
		ajaxLock = false;
		if ( type ){
			pageSet.apply(this,pageStyle[5]);
		}else{
			pageSet.apply(this,pageStyle[0]);
		}
		if ( pageInit[2] == 1 ){
			ajaxLock = false;
			return false;
		}
		pageInit[2] = 1;
		var $wxheader = $(".page2 .wxheader"),
			$wxbody = $(".page2 .wxbody"),
			$wxfooter = $(".page2 .wxfooter"),
			$daddy = $wxbody.find(".daddy"),
			$hand = $daddy.find(".hand");
			$wxbody.height(H-$header.height()-$wxheader.height()-$wxfooter.height());
			$daddy.find(".mestime").html(last.begin.hour + ":" + last.begin.min),
/*		$hand.addClass("up").css({
			left : "4%",
			top : $daddy.offset().top + $daddy.height()*0.7
		}).show();*/
		$hand.show();
		createMesList();
		$daddy.on(click,function(){
			if ( ajaxLock ){
				return false;
			}
			$hand.hide();
			pageSet.apply(this,pageStyle[0]);
			$(".page2 .daddy .newmes").hide();
			ajaxLock = true;
			pageGo();
			setTimeout(function(){
				page3();
			},pageTime);
		});
		$wx_mes.on(click,'.group',function(){
			if ( ajaxLock ){
				return false;
			}
			pageSet.apply(this,pageStyle[5]);
			ajaxLock = true;
			pageGo();
			setTimeout(function(){
				page6();
			},pageTime);
		});
	}
	function page3(){
		pageSet.apply(this,pageStyle[1]);
		if ( pageInit[3] == 1 ){
			ajaxLock = false;
			return false;
		}
		pageInit[3] = 1;
		var $mes = $(".page3 .wx_mes ul"),
			$wxheader = $(".page3 .wxheader"),
			$goback = $wxheader.find(".goback"),
			$confirm = $wxheader.find(".right"),
			$handConfirm = $wxheader.find(".hand"),
			$wxbody = $(".page3 .wxbody"),
			$wxfooter = $(".page3 .wxfooter"),
			$wxmes = $wxfooter.find(".mes"),
			$small = $wxfooter.find(".messmall"),
			$handSmall = $small.find(".hand"),
			$big = $wxfooter.find(".mesbig"),
			$input = $wxfooter.find(".mesinput"),
			$btn = $wxfooter.find(".mesbtn"),
			$handBtn = $btn.find(".hand"),
			$hand = $(".page3 .hand"),
			$daddyMes = $(".page2 .daddy .message"),
			mes = [],
			step = 0,
			totalStep = daddyMes.length;
		$wxbody.height(H-$header.height()-$wxheader.height()-$wxfooter.height());
		function createMessage(){
			setTimeout(function(){
				mes[step] = createMes(daddyMes[step]);
				$mes.append(mes[step]);
				$daddyMes.html(daddyMes[step].msg);
				$wxbody[0].scrollTop = H;
				step++;
				if ( step == 2 || step == 4 ){
					/*$hand.attr('style','').removeClass("up").addClass("down").css({
						left : "20%",
						bottom : "10%"
					}).show();*/
					$handSmall.show();
				}
				if ( step < totalStep && daddyMes[step].type != "right"  ){
					createMessage();
				}
			},daddyMes[step].time);
		}
		createMessage();
		$goback.on(click,function(){
			$hand.hide();
			pageGo(true);
			page2();
		});
		$small.on(click,function(){
			if ( step >= totalStep ){
				return false;
			}
			if ( daddyMes[step].type != "right" ){
				return false;
			}
			$wxmes.removeClass("current");
			$big.addClass('current');
			/*$hand.attr('style','').removeClass("up").addClass("down").css({
				right : "11%",
				bottom : $btn.height()*1.5
			}).show();*/
			$handBtn.show();
			$input.html(daddyMes[step].msg).css('line-height', $input.height()+'px');
		});
		$btn.on("click",function(){
			if ( daddyMes[step].type != "right" ){
				return false;
			}
			$hand.hide();
			mes[step] = createMes(daddyMes[step]);
			$mes.append(mes[step]);
			$daddyMes.html(daddyMes[step].msg);
			$wxbody[0].scrollTop = H;
			$wxmes.removeClass("current");
			$small.addClass('current');
			$input.empty();
			step++;
			if ( step > totalStep ){
				return false;
			}
			if ( step == totalStep ){
				/*$hand.attr('style','').removeClass("down").addClass("up").css({
					right : "0%",
					top : $confirm.offset().top + $confirm.height()*0.8
				}).show();*/
				$handConfirm.show();
				ajaxLock = false;
				return;
			}
			createMessage();
		});
		$confirm.on(click,function(){
			if ( ajaxLock ){
				ns.tip("先和爸爸说几句话吧！");
				return false;
			}
			$hand.hide();
			ajaxLock = true;
			pageGo();
			setTimeout(function(){
				page4();
			},pageTime);
		});
	}
	function page4(){
		pageSet.apply(this,pageStyle[2]);
		ajaxLock = false;
		if ( pageInit[4] == 1 ){
			ajaxLock = false;
			return false;
		}
		var $goback = $(".page4 .wxheader .goback"),
			$adduser = $("#adduser"),
			$hand = $(".adduser .hand");
		pageInit[4] = 1;
		/*$hand.attr('style','').removeClass("down").addClass("up").css({
			left : $adduser.offset().left + $adduser.width()*0.25,
			top : $adduser.offset().top + $adduser.height()*0.8
		}).show();*/
		$hand.show();
		$goback.on(click,function(){
			$hand.hide();
			pageGo(true);
			page3();
		});
		$adduser.on(click,function(){
			if ( ajaxLock ){
				return false;
			}
			$hand.hide();
			ajaxLock = true;
			pageGo();
			setTimeout(function(){
				page5();
			},pageTime);
		});
	}
	function page5(){
		pageSet.apply(this,pageStyle[3]);
		if ( pageInit[5] == 1 ){
			ajaxLock = false;
			return false;
		}
		pageInit[5] = 1;
		var $wxheader = $(".page5 .wxheader"),
			$wxbody = $(".page5 .wxbody"),
			$goback = $wxheader.find(".goback"),
			$wxfooter = $(".page5 .wxfooter"),
			$wx_userselected = $(".wx_userselected"),
			$userList = $(".page5 .wx_userlist ul"),
			$confirm = $wxheader.find(".right"),
			$handConfirm = $wxheader.find(".hand");
		$wxbody.height(H-$header.height()-$wxheader.height()-$wxfooter.height());
		/*$hand.attr('style','').removeClass("down").addClass("up").css({
			left : "0%",
			top : $(".page5 .wx_userlist").offset().top + H*0.17
		}).show();*/
		var _msg = msgList.slice(2),msg=[];
		for (var i = 0,length = _msg.length; i < length ; i++ ){
	  		msg.push(_msg.splice(Math.floor(Math.random()*_msg.length),1)[0]);
		}
		for ( var i = 0,length = msg.length,html=[]; i < length ; i++ ){
			var hand;
			if ( i == 0 ){
				var hand = '<div class="hand up">' +
			                    '<i class="fa fa-hand-o-up"></i>' +
			                '</div>';
			}else{
				hand = '';
			}
			html.push('<li>' +
                        '<a href="javascript:;">' +
                            '<div class="selector">' +
                                '<i class="fa fa-circle-o"></i>' +
                                hand +
                            '</div>' +
                            '<div class="headimg">' +
                                '<img src="img/h' + msg[i].img + '.jpg"/>' +
                            '</div>' +
                            '<div class="nickname">' +
                                msg[i].name +
                            '</div>' +
                        '</a>' +
                    '</li>');
		}
		$userList.append(html.join(''));
		var $handSelect = $userList.find(".hand").show(),
			$hand = $(".page5 .hand");
		$userList.on(click,'li',function(){
			var $t = $(this),
				$selected
				html = [];
			$hand.hide();
			$t.toggleClass('selected');
			$selected = $userList.find(".selected");
			$selected.each(function(i,el){
				html[i] = '<li>' +
	                        '<a href="javascript:;">' +
	                            '<div class="headimg">' +
	                                '<img src="' + $(el).find(".headimg img").attr("src") + '"/>' +
	                            '</div>' +
	                        '</a>' +
	                    '</li>'
			});
			if ( $selected.length == length ){
				/*$hand.attr('style','').removeClass("down").addClass("up").css({
					right : "0%",
					top : $confirm.offset().top + $confirm.height()*0.7
				}).show();*/
				$handConfirm.show();
				ajaxLock = false;
				$confirm.html('确定 ('+length + ')').addClass('canClick');
			}else{
				ajaxLock = true;
				$confirm.html('确定 (' + $selected.length + ')').removeClass('canClick');
			}
            $wx_userselected.html(html.join(''));
		});
		$goback.on(click,function(){
			$hand.hide();
			pageGo(true);
			page4();
		});
		$confirm.on(click,function(){
			if ( ajaxLock || $userList.find(".selected").length != length ){
				ns.tip("要把所有家人都选择进来哟！");
				return false;
			}
			$hand.hide();
			ajaxLock = true;
			page6();
		});
	}
	function page6(){
		pageSet.apply(this,pageStyle[4]);
		if ( pageInit[6] == 1 ){
			ajaxLock = false;
			return false;
		}
		pageInit[6] = 1;
		var $mes = $(".page6 .wx_mes ul"),
			$wxheader = $(".page6 .wxheader"),
			$goback = $wxheader.find(".goback"),
			$title = $wxheader.find(".title"),
			$wxbody = $(".page6 .wxbody"),
			$wxfooter = $(".page6 .wxfooter"),
			$wxmes = $wxfooter.find(".mes"),
			$small = $wxfooter.find(".messmall"),
			$big = $wxfooter.find(".mesbig"),
			$input = $wxfooter.find(".mesinput"),
			$btn = $wxfooter.find(".mesbtn"),
			$handConfirm = $wxheader.find(".hand"),
			$handSmall = $small.find(".hand"),
			$handBtn = $btn.find(".hand"),
			$hand = $(".page6 .hand"),
			$wx_link,
			mes = [],
			step = 0,
			totalStep = familyMes.length;
		$wxbody.height(H-$header.height()-$wxheader.height()-$wxfooter.height());
		msgList.push({
			name : "爷爷",
			img : 8,
			msg : "我是爷爷！"
		});
		function createMessage(){
			setTimeout(function(){
				mes[step] = createMes(familyMes[step],true);
				$mes.append(mes[step]);
				if ( step == totalStep - 3 ){
					/*$hand.attr('style','').removeClass("up").addClass("down").css({
						left : "20%",
						bottom : "10%"
					}).show();*/
					$handSmall.show()
				}
				if ( step == totalStep - 1 ){
					setTimeout(function(){
						$wxbody[0].scrollTop = H*3;
						/*$hand.attr('style','').removeClass("up").addClass("down").css({
							left : "25%",
							bottom : "32%"
						}).show();*/
					},100);
				}else{
					$wxbody[0].scrollTop = H*3;
				}
				if ( step == 3 ){
					$title.html("家族群(10)");
				}
				step++;
				if ( step == totalStep ){
					var $wx_link = $mes.find(".wx_link");
					$wx_link.append('<div class="hand down"><i class="fa fa-hand-o-down"></i></div>').on(click,function(){
						load();
					})
					$wx_link.find(".hand").show();
					$hand = $(".page6 .hand");
					ajaxLock = false;
					var now = getNowTime(),
					html = '<li class="group">' + 
						'<a href="javascript:;">' +
	                        '<div class="headimg">' +
	                            '<img src="img/hg.jpg"/>' +
	                        '</div>' +
	                        '<div class="mesbox">' +
	                            '<p class="nickname">家族群</p>' +
	                            '<p class="message">弟弟:[链接]我在长大，你却老了</p>' +
	                        '</div>' +
	                        '<div class="mestime">' + now.hour + ':' + now.min + '</div>' +
                        '</a>' +
                    '</li>';
                    $wx_mes.prepend(html);
				}
				if ( step < totalStep && familyMes[step].type != "right"  ){
					createMessage();
				}
			},familyMes[step].time)
		}
		createMessage();
		$small.on(click,function(){
			if ( step >= totalStep ){
				return false;
			}
			if ( familyMes[step].type != "right" ){
				return false;
			}
			/*$hand.attr('style','').removeClass("up").addClass("down").css({
				right : "11%",
				bottom : $btn.height()*1.5 || "11%"
			}).show();*/
			$handBtn.show();
			$wxmes.removeClass("current");
			$big.addClass('current');
			$input.html(familyMes[step].msg).css('line-height', $input.height()+'px');
		});
		$btn.on("click",function(){
			if ( familyMes[step].type != "right" ){
				return false;
			}
			$hand.hide();
			mes[step] = createMes(familyMes[step]);
			$mes.append(mes[step]);
			$wxbody[0].scrollTop = H*3;
			$wxmes.removeClass("current");
			$small.addClass('current');
			$input.empty();
			if ( ++step >= totalStep ){
				return false;
			}
			createMessage();
		});
		$goback.on(click,function(){
			$hand.hide();
			if ( ajaxLock ){
				return false;
			}
			pageGo(true);
			page2(true);
		});
	}
	function init(){
		timeGoing();
		page1();
		timeGo = setInterval(timeGoing,timeInterval);
	}
});