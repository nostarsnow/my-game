(function(){
var cj = createjs,
	loader = [
		{
			id : "bg",
			src : "bg.jpg"
		},
		{
			id : "t1",
			src : "t1.png"
		},
		{
			id : "btn_rule",
			src : "btn_rule.png"
		},
		{
			id : "btn_rank",
			src : "btn_rank.png"
		},
		{
			id : "btn_go",
			src : "btn_go.png"
		},
		{
			id : "rank",
			src : "rank.jpg"
		},
		{
			id : "btn_action",
			src : "btn_action.png"
		},
		{
			id : "road",
			src : "road.png",
		},
		{
			id : "roadLr",
			src : "roadLr.png",
		},
		{
			id : "man",
			src : "human.png",
		},
		{
			id : "coin",
			src : "coin.png",
		}
	],
	preload = new cj.LoadQueue(false, "./img/");
	preload.loadManifest(loader);
	preload.on("fileload", loadProgress);
	preload.on("complete", loaded);
var canvas = document.getElementById("canvas"),
	W = $(window).width() > 320 ? 320 : $(window).width(),
    H = $(window).height(),
    stage = new cj.Stage(canvas),
    isApple = navigator.userAgent.match(/iP(ad|hone|od)/i),
    pageIndex = 1,
    pageSize = 50,
    allSize = 0,
    rankEnd = false,
    $xl_loading_p = $("#xl_loading_p"),	
	$xl_loading = $("#xl_loading"),
	$main = $("#main"),
	$btn_go = $("#btn_go"),
	$page = $(".page"),
	$page1 = $(".page1"),
	$page2 = $(".page2"),
	$page3 = $(".page3"),
	$page4 = $(".page4"),
	$distance = $("#distance"),
	$time = $("#time"),
	$btn_action = $("#btn_action"),
	$phone = $(".phone"),
	$btn_rank = $(".btn_rank"),
	$btn_restart = $("#btn_restart"),
	$rank = $("#rank"),
	$rankList = $rank.find("ul"),
	$myRank = $("#myRank"),
	$myScore = $("#myScore"),
	$progress = $(".progress span");
function loadProgress(e){
	$progress.html((preload.progress*100).toFixed(2)+'%').width((preload.progress*100).toFixed(2)+'%');
}
function loaded() {
	$progress.parent().hide();
	$(".btn_action").show();
	reset();
	$main.show()
	ns.loadHide()
}
ns.load();
function roadAnim(){
	cj.Tween.get(roadLr)
		.to({y:0})
		.to({y:H},roadSpeed)
		.call(function(){
			if ( fallSpeed < roadSpeed ){
				roadSpeed = fallSpeed;
			}
			roadAnim();
		});
}
function reset(){
	cj.Touch.enable(stage);
	stage.clear();
	main = new cj.Container();
	stage.addChild(main);
	TIME=0;
	timeGo=null;
	fallSpeed = 5000;
	roadSpeed = fallSpeed;
	waitTime = 1500;
	COINS = [];
	Man_now = 0;
	SCORE=0;
	TIME=0;
	lastDeviceGet = 0;
	ACTION = false;
}
function init(){
	page1();
	clearInterval(timeGo);
	cj.Ticker.setFPS(60);
	cj.Ticker.addEventListener("tick",update);
	timeGo = setInterval(function(){
		TIME++;
	},1000);
}
function page1(){
	W = preload.getResult("roadLr").width*H/preload.getResult("roadLr").height;
	canvas.width = W;
	canvas.height = H;
	roadLr = new cj.Shape();
	roadLr.graphics.bf(preload.getResult("roadLr"),"repeat-y",new cj.Matrix2D(W/preload.getResult("road").width,0,0,H/preload.getResult("road").height,0,0) ).dr(0,-H,W,H*2);
	//roadLr.setTransform(0,-H,W/preload.getResult("roadLr").width,H/preload.getResult("roadLr").height);
	road = new cj.Bitmap(preload.getResult("road"));
	road.setTransform(0,0,W/preload.getResult("road").width,H/preload.getResult("road").height);
	man_set = {
		bw : 125,
		bh : 92,
		regX : 0,
		regY : 0,
		w : W*0.18,
		x : W*0.5,
		y : H*0.87,
		count : 10,
		speed : .07
	};
	man_set.h = man_set.bh*man_set.w/man_set.bw;
	man_set.hw = man_set.w*0.5;
	man_set.hh = man_set.h*0.5;
	man_set.bottom = man_set.y+man_set.hh;
	man_set.top = man_set.y-man_set.hh;
	coin_set = {
		bw : 130,
		bh : 115,
		regX : 0,
		regY : 0,
		w : W*0.13,
		h : W*0.115,
		countC : 5,
		probability : .3
	};
	coin_set.hw = coin_set.w*0.5;
	coin_set.hh = coin_set.h*0.5;
	coin_set.rowH = coin_set.h*3.5;
	coin_set.col = parseInt(H/coin_set.rowH)+1;
	S_LEFT = W*0.15;
	S_RIGHT = W*0.85;
	man_anim = new cj.SpriteSheet({
		"images" : [preload.getResult("man")],
		"frames" :  {width:man_set.bw, height:man_set.bh, count:man_set.count, regX: man_set.regX, regY:man_set.regY},
		"animations" : {
			//"man0" : [0,1,"man0",man_set.speed]
			"man0" : {
				frames : [0],
				next : null
			}
		}
	});
	man = new cj.Sprite(man_anim,"man"+Man_now);
	man.setTransform(man_set.x,man_set.y,man_set.w/man_set.bw,man_set.h/man_set.bh,0,0,0,man_set.bw*0.5,man_set.bh*0.5).framerate=30;
	man.maxL = S_LEFT + man_set.hw;
	man.maxR = S_RIGHT-man_set.hw;
	man.trs = W*0.5/90;
	/*coinsContainer = {
		coins1 : new cj.Container(),
		coins2 : new cj.Container()
	};*/
	coinsContainer = new cj.Container();
	scoreBg = new cj.Shape();
	scoreBg.graphics.f("#24981d").s("#fff").rr(W*0.17,10,W*0.66,H*0.1,7);
	scoreShow = new cj.Text("0 m", "1rem georgiab", "#fff");
 	scoreShow.x = W*0.5;
 	scoreShow.y = 10+H*0.05;
 	scoreShow.textAlign = "center";
 	scoreShow.textBaseline = "middle";
	main.addChild(roadLr,road,coinsContainer,scoreBg,scoreShow,man);
	/*man.on("pressmove",function(e){
		man.x = e.stageX;
	});*/
	if (window.DeviceMotionEvent) { 
		window.addEventListener('devicemotion',deviceMotionHandler, false); 
	}else{ 
	    $tip('亲，你的浏览器不支持重力感应哟~'); 
	}
}
function buildCoin(obj,top){
	/*var beforeFall = fallSpeed;
	if ( top ){
		var length = coin_set.col-2;
		if ( SCORE > 5000 ){
			length +=3;
			fallSpeed = 2200;
		}else if ( SCORE > 3000 ){
			fallSpeed = 3000;
			length +=2;
		}else if ( SCORE > 2000 ){
			//Man_now = 4;
			fallSpeed = 3500;
			length +=2;
		}else if ( SCORE > 1500 ){
			//Man_now = 3;
			fallSpeed = 4000;
			length +=1;
		}else if ( SCORE > 1000 ){
			//Man_now = 2;
			fallSpeed = 4250;
			length +=1;
		}else if ( SCORE > 500 ){
			//Man_now = 1;
			fallSpeed =4500;
		}
	}else{
		//var length = coin_set.col;
		var length = 0 ;
	}
	var c_y = 0;
	//man.gotoAndPlay("man"+Man_now);
	if ( obj == "coins2" || top ){
		c_y = -H;
	}
	coinsContainer[obj].removeAllChildren();
	if ( obj == "coins2" ){
		var s = new cj.Shape();
		s.graphics.f("rgba(0,0,0,.3)").r(0,0,W,H);
		coinsContainer[obj].addChild(s);
	}else{
		var s = new cj.Shape();
		s.graphics.f("rgba(255,0,0,.3)").r(0,0,W,H);
		coinsContainer[obj].addChild(s);
	}
	coinsContainer[obj].y=c_y;
	for (var i = 0; i < length ; i++) {
		var r = Math.random();
		if ( r > coin_set.probability ){
			continue;
		}
		var coin_s = coinCreate(Man_now);
		var x = W*(Math.random());
		var y = coin_set.rowH*i;
		if ( x < S_LEFT ){
			x = S_LEFT;
		}else if ( x > S_RIGHT-coin_set.w ){
			x = S_RIGHT-coin_set.w;
		}
		var j = i;
		coin_s.x = x;
		coin_s.y = y;
		if ( obj == "coins2" ){
			j = coin_set.col+i;
		}
		COINS[j] = coin_s;
		coinsContainer[obj].addChild(COINS[j]);
	};
	if ( fallSpeed < beforeFall ){
		return false;
	}
	if ( top ){
		cj.Tween.get(coinsContainer[obj]).to({y:H},fallSpeed*2).call(function(){
			buildCoin(obj,true);
		});
	}else{
		cj.Tween.get(coinsContainer[obj]).to({y:H},fallSpeed).call(function(){
			buildCoin(obj,true);
		});
	}*/
	if ( SCORE > 8000){
		fallSpeed = 1500;
		waitTime = 350;
	}else if ( SCORE > 6000 ){
		fallSpeed = 2000;
		waitTime = 450;
	}else if ( SCORE > 5000 ){
		fallSpeed = 2500;
		waitTime = 600;
	}else if ( SCORE > 4000 ){
		fallSpeed = 3000;
		waitTime = 700;
	}else if ( SCORE > 3000 ){
		fallSpeed = 3500;
		waitTime = 800;
	}else if ( SCORE > 2000 ){
		fallSpeed = 4000;
		waitTime = 1000;
	}else if ( SCORE > 1000 ){
		fallSpeed = 4500;
		waitTime = 1200;
	}
	if ( COINS.length > 15 ){
		COINS = COINS.splice(5,COINS.length);
		//coinsContainer.removeChildAt(0,1,2,3,4);
		//console.log(COINS.length,coinsContainer.children.length);
	}
	var coin_s = coinCreate(Man_now);
	var x = W*(Math.random());
	var y = -coin_set.h;
	if ( x < S_LEFT ){
		x = S_LEFT;
	}else if ( x > S_RIGHT-coin_set.w ){
		x = S_RIGHT-coin_set.w;
	}
	coin_s.x = x;
	coin_s.y = y;
	COINS.push(coin_s);
	coinsContainer.addChild(coin_s);
	cj.Tween.get(coin_s).to({y:H},fallSpeed);
	setTimeout(function(){
		buildCoin(obj,true);
	},waitTime);
}
function coinCreate(y){
	/*
	var coin = new cj.Shape(),
		r = Math.floor(Math.random()*coin_set.countC);
	coin.graphics.bf(preload.getResult("coin"),"no-repeat",new cj.Matrix2D(coin_set.w/preload.getResult("coin").width*5,0,0,coin_set.h/preload.getResult("coin").height*5,-coin_set.w*r,-coin_set.h*y) ).dr(0,0,coin_set.w,coin_set.h).f("rgba(0,0,0,.1").r(0,0,coin_set.w,coin_set.h);
	return coin;*/
	var r = Math.floor(Math.random()*coin_set.countC);
	var anim = new cj.SpriteSheet({
		"images" : [preload.getResult("coin")],
		"frames" : [
			[coin_set.bw*r,coin_set.bh*y,coin_set.bw,coin_set.bh,]
		],
		"animations" : {
			"go" : {
				frames : [0],
				next : null
			}
		}
	});
	var coin = new cj.Sprite(anim,"go");
	coin.setTransform(0,0,coin_set.w/coin_set.bw,coin_set.h/coin_set.bh).framerate=30;
	return coin;
}
function update(){
	stage.update();
	if ( ACTION ){
		scoreShow.text= ++SCORE + " m";
	}
	for (var i = 0,length = COINS.length; i < length; i++) {
		if ( !COINS[i] || COINS[i].geted ){
			continue;
		}
		//var dis = COINS[i].y+COINS[i].parent.y;
		if ( !COINS[i].geted && COINS[i].y-man_set.bottom > 0 ){
			gameOver();
			return;
		}
		if ( collCheck.rect(COINS[i],man) ){
			COINS[i].geted = true;
			cj.Tween.removeTweens(COINS[i]);
			cj.Tween.get(COINS[i]).to({x:W*0.5,y:-coin_set.h,alpha:0},500,cj.Ease.backIn);
		}
	};
};
function deviceMotionHandler(eventData) {
	var curTime = new Date().getTime();
    if ( curTime - lastDeviceGet > 30 ){
        lastDeviceGet = curTime;
		var acceleration = eventData.accelerationIncludingGravity; 
		/*var facingUp = -1; 
		if (acceleration.z > 0) { 
			facingUp = +1; 
		}*/
		var tiltLR = Math.round(((acceleration.x) / 9.81) * -90); 
		//scoreShow.text = acceleration.x.toFixed(4);
		//var tiltFB = Math.round(((acceleration.y + 9.81) / 9.81) * 90 * facingUp);
		if ( isApple ){
			tiltLR = tiltLR*-1;
		}
		var trs = man_set.x+(tiltLR*man.trs);
		//scoreShow.text=tiltLR;
		if ( trs < man.maxL ){
			trs = man.maxL;
		}
		if ( trs > man.maxR ){
			trs = man.maxR;
		}
		cj.Tween.removeTweens(man);
		cj.Tween.get(man).to({x:trs},100,cj.Ease.linear);
    } 
};
function gameOver() {
	if ( SCORE > myBestScore ){
		//upload();
		ns.numberTo($time,SCORE,37);
	}else{
		$time.html(myBestScore);
	}
	cj.Ticker.removeAllEventListeners();
	clearInterval(timeGo);
	$page.removeClass('current');
	$page3.addClass('current');
	//window.share.desc="我的火炬手在商丘恒大名都“全民乐跑 礼享名都”活动中用"+TIME+"秒前进了"+SCORE+"米！不服？来战！";
	ns.numberTo($distance,SCORE,37);
};
function updateMyInfo() {
    $.ajax({
        type : check.ajaxType,
        url : check.ajaxUrl + "?xl_r=" +Math.random().toFixed(3),
        data : {
            action: "queryInfo",
            active : active,
            openid : openid
        },
        dataType : check.ajaxDataType,
        success : function(data){
        	console.log(data);
            if ( data.errcode == 0 ){
				$myRank.html(data.rank);
				$myScore.html(data.score);
            }else{
                $tip(data.errmsg);
            }
        },
        error:function(){
            $tip(check.ajaxError);
        }
    });
};
function upload(){
	if ( !enKey || !enIv ){
		return;
	}
	load();
    $.ajax({
        url : check.ajaxUrl + "?xl_r="+Math.random().toFixed(3),
        type : check.ajaxType,
        dataType : check.ajaxDataType,
        data : {
            action: "addDetail",
            active : active,
            openid : openid,
            score : SnowCryEncrypt(SCORE,enKey,enIv),
            time : SnowCryEncrypt(TIME,enKey,enIv)
        },
        success : function(data){
        	console.log(data);
        	if ( data.errcode == 0 ){
        		updateMyInfo();
        		$tip("更新成功！");
        	}
            ns.loadHide();
        },
        error:function(){
            $tip(check.ajaxError);
            ajaxLock = 0;
        }
    });
};
function getList(){
    load();
    $.ajax({
        url: check.ajaxUrl + "?xl_r="+Math.random().toFixed(3),
        type: 'POST',
        dataType: 'json',
        data: {
            action : "queryList",
            pageIndex : pageIndex,
            pageSize : pageSize,
        	active : active
        },
        success : function(data){
            ns.loadHide();
            //console.log(currPage);
            console.log(data);
            if ( data.errcode == 0 ){
                ajaxLock = false;
                var list = data.list,
                    length = list.length,
                    html = "";
                if ( length > 0 ){
                    pageIndex++;
                    for (var i = 0; i < length; i++) {
                        allSize++;
                        html+='<li><span class="rank_num">' + allSize + '</span><span class="rank_name">' + list[i].name + '</span><span class="rank_score">' + (list[i].score||0) + '</span></li>';
                    };
                    $rankList.append(html);
                }else{
                    rankEnd = true;
                }
            }
        }
    });
};
function checkTimes(){
	$page.removeClass('current');
	$page2.addClass('current');
	init();
	man.y = H*0.2;
	return;
    load();
    $.ajax({
    	url : check.ajaxUrl + "?xl_r="+Math.random().toFixed(3),
        type : check.ajaxType,
        data : {
            action: "checkTimes",
            active : active,
            openid : openid
        },
        dataType : check.ajaxDataType,
        success : function(data){
            console.log(data);
            if ( data.errcode == 0 ){
				$page.removeClass('current');
				$page2.addClass('current');
				init();
				man.y = H*0.2;
            }else{
                $tip(data.errmsg);
            }
            ns.loadHide();
        },
        error:function(){
        	ns.loadHide();
            $tip(check.ajaxError);
        }
    });
};
$btn_go.on(click,function() {
	if ( reged == 1 ){
		checkTimes();
        return;
	}
    $log({
        title : "让你的朋友知道你吧！",
        conn : '<div class="tip">请输入您的昵称！</div><label class="in_ic40"><span class="l"><i class="fa fa-user"></i></span><span class="r"><input type="text" placeholder="请输入昵称" id="name" name="name" maxlength="12"/></span></label>',
        go : function(){
        		var name = $("#name").val(),
			        tel = '';
			    if ( !check.name (name) ){
			        return false;
			    }
			    load();
			    $.ajax({
			    	url : check.ajaxUrl + "?xl_r="+Math.random().toFixed(3),
			        type : check.ajaxType,
			        data : {
			            action: "reg",
			            name : name,
			            active : active,
			            tel: tel,
			            openid : openid
			        },
			        dataType : check.ajaxDataType,
			        success : function(data){
			            //console.log(data);
			            if( data.errcode == 0 ){
			            	myName = name;
			            	myTel = tel;
			            	reged = 1;
			                $tip("注册成功！");
			                location.href="index.html";
			            }else{
			                $tip(data.errmsg);
			            }
			            ns.loadHide();
			        },
			        error:function(){
			        	ns.loadHide();
			            $tip(check.ajaxError);
			        }
			    });
        }
    });
});
$btn_action.on(click,function () {
	$phone.hide();
	man.y = man_set.y;
	man.on("pressmove",function(e){
		if ( e.stageX < man.maxL ){
			man.x = man.maxL;
		}else if ( e.stageX > man.maxR ){
			man.x = man.maxR;
		}else{
			man.x = e.stageX;
		}
		if ( e.stageY > man_set.y ){
			man.y = man_set.y;
		}else if ( e.stageY < man_set.hh+40 ){
			man.y = man_set.hh+40;
		}else{
			man.y = e.stageY;
		}
	});
	$phone.hide();
	man.y = man_set.y;
	SCORE=0;
	ACTION=true;
	setTimeout(function(){
		buildCoin("coins1");
	},1000);
	roadAnim();
});

$btn_rank.on(click,function(){
	ns.tip('暂无排行！');
	return;
	$page.removeClass('current');
	$page4.addClass('current');
	$rankList.empty();
	pageIndex = 1;
	rankEnd = false;
	allSize = 0;
	getList();
});
$btn_restart.on(click,function(){
	if ( SCORE > 0 || TIME > 0 ){
		location.href="index.html";
	}else{
		$page.removeClass('current');
		$page1.addClass('current');
	}
});
$rank.scroll(function() {
    if ( !rankEnd && !ajaxLock && ($rankList.height() - $rank.height() - $rank.scrollTop() < 20 ) ){
        ajaxLock = true;
        getList();
    }
});
var bgm = document.getElementById("bgmp3"),
    bgmPlayed = false;
$(document).on("touchstart",function() {
    if ( !bgmPlayed ) {
        if ( bgm.paused !== false ) {
            bgm.load();
            bgmPlayed = true;
            bgm.play();
        }
    } else {
        bgm.play();
    }
    $(document).unbind('touchstart');
});
}());