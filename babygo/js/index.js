(function(){

var loader = [],
	loadImage = function(sources,callback){
        var loadedImages = 0;    
        var numImages = 0;  
        for (var src in sources) {    
            numImages++;    
        };
        for (var src in sources) {
            if ( /.mp3/.test( sources[src] ) ){
                loadedImages;
                loader[src] = new Audio(sources[src]);
                loader[src].load();
                if (++loadedImages >= numImages) {  
                    callback();    
                }
                continue;
            }
            loader[src] = new Image();
            loader[src].onload = function(){ 
            	$xl_loading_p.html((loadedImages/numImages*100).toFixed(2) + "%");
                if (++loadedImages >= numImages) {  
                    callback();
                }
            };
            loader[src].src = sources[src];
        } 
	};
ns.load()
var canvas = document.getElementById("canvas"),
	W = $(window).width() > 640 ? 640 : $(window).width(),
    H = $(window).height(),
    cj = createjs,
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
	$myScore = $("#myScore");
window.onload = function(){
    var sources = {
        road : "img/road.png",
        roadLr : "img/roadLr.png",
        man : "img/man.png",
        coin : "img/coin.png",
        buildingBg : "img/buildingBg.png",
        buildingOn : "img/buildingOn.png",
        car : "img/car.png"
	};
    loadImage(sources,loaded);
};
cj.Touch.enable(stage);
function loaded() {
	$xl_loading_p.html("100%");
	$main.show();
	$xl_loading.removeClass('xl_loding_show');
	ns.loadHide();
	$xl_loading_p.html("Loading...");
	reset();
}
function reset(){
	stage.clear();
	main = new cj.Container();
	stage.addChild(main);
	TIME=0;
	timeGo=null;
	fallSpeed = 2300;
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
	W = loader.roadLr.width*H/loader.roadLr.height;
	canvas.width = W;
	canvas.height = H;
	roadLr = new cj.Shape();
	roadLr.graphics.bf(loader.roadLr,"repeat-y",new cj.Matrix2D(W/loader.road.width,0,0,H/loader.road.height,0,0) ).dr(0,-H,W,H*2);
	//roadLr.setTransform(0,-H,W/loader.roadLr.width,H/loader.roadLr.height);
	road = new cj.Bitmap(loader.road);
	road.setTransform(0,0,W/loader.road.width,H/loader.road.height);
	man_set = {
		bw : 100,
		bh : 148,
		regX : 0,
		regY : 0,
		w : W*0.15,
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
		bw : 160,
		bh : 160,
		regX : 0,
		regY : 0,
		w : W*0.18,
		h : W*0.18,
		countC : 5,
		probability : .3
	};
	coin_set.hw = coin_set.w*0.5;
	coin_set.hh = coin_set.h*0.5;
	coin_set.rowH = coin_set.h*2.5;
	coin_set.col = parseInt(H/coin_set.rowH)+1;
	S_LEFT = W*0.15;
	S_RIGHT = W*0.85;
	man_anim = new cj.SpriteSheet({
		"images" : [loader.man],
		"frames" :  {width:man_set.bw, height:man_set.bh, count:man_set.count, regX: man_set.regX, regY:man_set.regY},
		"animations" : {
			"man0" : [0,1,"man0",man_set.speed],
			"man1" : [2,3,"man1",man_set.speed],
			"man2" : [4,5,"man2",man_set.speed],
			"man3" : [6,7,"man3",man_set.speed],
			"man4" : [8,9,"man4",man_set.speed],
		}
	});
	man = new cj.Sprite(man_anim,"man"+Man_now);
	man.setTransform(man_set.x,man_set.y,man_set.w/man_set.bw,man_set.h/man_set.bh,0,0,0,man_set.bw*0.5,man_set.bh*0.5).framerate=30;
	man.maxL = S_LEFT + man_set.hw;
	man.maxR = S_RIGHT-man_set.hw;
	man.trs = W*0.35/90;
	coinsContainer = {
		coins1 : new cj.Container(),
		coins2 : new cj.Container()
	};
	scoreBg = new cj.Shape();
	scoreBg.graphics.f("#24981d").s("#fff").rr(W*0.17,10,W*0.66,H*0.1,7);
	scoreShow = new cj.Text("0 m", "1rem georgiab", "#fff");
 	scoreShow.x = W*0.5;
 	scoreShow.y = 10+H*0.05;
 	scoreShow.textAlign = "center";
 	scoreShow.textBaseline = "middle";
	main.addChild(roadLr,road,coinsContainer.coins1,coinsContainer.coins2,scoreBg,scoreShow,man);
	if (window.DeviceMotionEvent) { 
		window.addEventListener('devicemotion',deviceMotionHandler, false); 
	}else{ 
	    alert('亲，你的浏览器不支持重力感应哟~'); 
	}
}
function buildCoin(obj,top){
	if ( top ){
		var length = coin_set.col-2;
		if ( SCORE > 5000 ){
			length +=3;
			fallSpeed = 2000;
		}else if ( SCORE > 3000 ){
			fallSpeed = 2500;
		}else if ( SCORE > 2000 ){
			Man_now = 4;
			fallSpeed = 3000;
			length +=2;
		}else if ( SCORE > 1500 ){
			Man_now = 3;
			fallSpeed = 3500;
		}else if ( SCORE > 1000 ){
			Man_now = 2;
			fallSpeed = 4000;
			length +=1;
		}else if ( SCORE > 500 ){
			Man_now = 1;
			fallSpeed =4500;
		}
	}else{
		//var length = coin_set.col;
		var length = 0 ;
	}
	var c_y = 0;
	man.gotoAndPlay("man"+Man_now);
	if ( obj == "coins2" || top ){
		c_y = -H;
	}
	coinsContainer[obj].removeAllChildren();
	/*if ( obj == "coins2" ){
		var s = new cj.Shape();
		s.graphics.f("rgba(0,0,0,.3)").r(0,0,W,H);
		coinsContainer[obj].addChild(s);
	}else{
		var s = new cj.Shape();
		s.graphics.f("rgba(255,0,0,.3)").r(0,0,W,H);
		coinsContainer[obj].addChild(s);
	}*/
	coinsContainer[obj].y=c_y;
	for (var i = 0; i < length ; i++) {
		/*var r = Math.random();
		if ( r > coin_set.probability ){
			continue;
		}*/
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
	if ( top ){
		cj.Tween.get(coinsContainer[obj]).to({y:H},fallSpeed*2).call(function(){
			buildCoin(obj,true);
		});
	}else{
		cj.Tween.get(coinsContainer[obj]).to({y:H},fallSpeed).call(function(){
			buildCoin(obj,true);
		});
	}
}
function coinCreate(y){
	/*
	var coin = new cj.Shape(),
		r = Math.floor(Math.random()*coin_set.countC);
	coin.graphics.bf(loader.coin,"no-repeat",new cj.Matrix2D(coin_set.w/loader.coin.width*5,0,0,coin_set.h/loader.coin.height*5,-coin_set.w*r,-coin_set.h*y) ).dr(0,0,coin_set.w,coin_set.h).f("rgba(0,0,0,.1").r(0,0,coin_set.w,coin_set.h);
	return coin;*/
	var r = Math.floor(Math.random()*coin_set.countC);
	var anim = new cj.SpriteSheet({
		"images" : [loader.coin],
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
		var dis = COINS[i].y+COINS[i].parent.y;
		if ( !COINS[i].geted && dis-man_set.bottom > 0 ){
			gameOver();
			return;
		}
		if ( collCheck.rect(COINS[i],man) ){
			COINS[i].geted = true;
			cj.Tween.get(COINS[i])
					.to({x:W*0.5,y:-COINS[i].parent.y,alpha:0},500,cj.Ease.backIn);
		}
	};
};
function deviceMotionHandler(eventData) {
	var curTime = new Date().getTime();
    if ( curTime - lastDeviceGet > 100 ){
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
		/*if ( trs < man.maxL ){
			trs = man.maxL;
		}
		if ( trs > man.maxR ){
			trs = man.maxR;
		}*/
		cj.Tween.get(man).to({x:trs},100,cj.Ease.linear);    
    } 
};
function gameOver() {
	//if ( SCORE > myBestScore ){
		//upload();
		ns.numberTo($time,SCORE,37);
	//}else
	//	$time.html(myBestScore);
	//}
	cj.Ticker.removeAllEventListeners();
	clearInterval(timeGo);
	$page.removeClass('current');
	$page3.addClass('current');
	//window.share.title="我的Baby用"+TIME+"秒爬了"+SCORE+"米！不服？来战！";
	ns.numberTo($distance,SCORE,37);

};
function updateMyInfo() {
    $.ajax({
        type : check.ajaxType,
        url : check.ajaxUrl + "?xl=" +Math.random().toFixed(3),
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
                alert(data.errmsg);
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
        url : check.ajaxUrl + "?rand="+Math.random(),
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
            load_h();
        },
        error:function(){
            $tip(check.ajaxError);
            ns.ajaxLock = 0;
        }
    });
};
function getList(){
    ns.load();
    ns.ajax({
		action : "queryList",
		pageIndex : pageIndex,
		pageSize : pageSize,
		active : active
	},function(data){
		ns.loadHide();
		if ( data.errcode == 0 ){
			ns.ajaxLock = false;
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
    });
};
function checkTimes(){
	$page.removeClass('current');
	$page2.addClass('current');
	init();
	man.y = H*0.3;
	return;
    ns.load();
    ns.ajax({
		action: "checkTimes",
		active : active,
		openid : openid
	},function(data){
		if ( data.errcode == 0 ){
			$page.removeClass('current');
			$page2.addClass('current');
			init();
			man.y = H*0.3;
		}else{
			alert(data.errmsg);
		}
		ns.loadHide();
    });
};
$btn_go.on(click,function() {
	if ( reged == 1 ){
		checkTimes();
        return;
	}
    $log({
        title : "让你的朋友知道你吧！",
        con : '<div class="tip">请输入您的真实姓名和手机号！</div><label class="in_ic40"><span class="l"><i class="fa fa-user"></i></span><span class="r"><input type="text" placeholder="请输入姓名" id="name" name="name" maxlength="12"/></span></label><label class="in_ic40"><span class="l"><i class="fa fa-mobile"></i></span><span class="r"><input type="tel" placeholder="请输入手机号码" id="tel" name="tel" maxlength="11"/></span></label>',
        go : function(){
        		var name = $("#name").val(),
			        tel = $("#tel").val();
			    if ( !check.name (name) ){
			        return false;
			    }
			    if ( !check.tel (tel) ){
			        return false;
			    }
			    load();
			    $.ajax({
			        type : check.ajaxType,
			        url : check.ajaxUrl + "?xl=" +Math.random().toFixed(3),
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
			            load_h();
			        },
			        error:function(){
			        	load_h();
			            $tip(check.ajaxError);
			        }
			    });
        }
    });
});
$btn_action.on(click,function () {
	$phone.hide();
	man.y = man_set.y;
	cj.Tween.get(roadLr)
		.to({y:0})
		.to({y:H},fallSpeed)
		.loop=true;
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
	SCORE=0;
	ACTION=true;
	buildCoin("coins1");
	buildCoin("coins2",true);
});
$btn_rank.on(click,function(){
	ns.tip('暂无排行！')
	return false;
	$page.removeClass('current');
	$page4.addClass('current');
	$rankList.empty();
	pageIndex = 1;
	rankEnd = false;
	allSize = 0;
	
});
$btn_restart.on(click,function(){
	if ( SCORE > 0 || TIME > 0 ){
		location.href="index.html";
	}else{
		$page.removeClass('current');
		$page1.addClass('current');
	}
});
$rank.scroll(function(event) {
    if ( !rankEnd && !ns.ajaxLock && ($rankList.height() - $rank.height() - $rank.scrollTop() < 20 ) ){
        ns.ajaxLock = true;
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