$(function(){
var W = $(window).width() > 640 ? 640 : $(window).width(),
    H = $(window).height(),
    canvas = document.getElementById("canvas"),
	cj = createjs,
	stage = new cj.Stage(canvas),
    $xl_loading_p = $("#xl_loading_p"),	
	$xl_loading = $("#xl_loading"),
	$main = $("#main"),
	$rule = $("#rule"),
	$page = $(".page"),
	$page0 = $(".page0"),
	$page1 = $(".page1"),
	$page2 = $(".page2"),
	$score = $("#score"),
	$lavetime = $("#lavetime"),
	$btn_action = $("#btn_action"),
	$btn_go = $("#btn_go"),
	$btn_restart = $("#btn_restart"),
	$btn_share = $("#btn_share"),
	$btn_goBox = $(".btn_goBox"),
	$btn_showBox = $(".btn_showBox"),
	$showBg = $(".showBg"),
	$show = $("#show"),
	$progress = $(".progress span"),
	$title = $("title");
var loader = [
		{
			id : "bg",
			src : "bg.jpg?3"
		},
		{
			id : "t1",
			src : "t1.png?3"
		},
		{
			id : "bg1",
			src : "bg1.jpg?3"
		},
		{
			id : "t3",
			src : "t3.png?3"
		},
		{
			id : "t4",
			src : "t4.png"
		},
		{
			id : "t5",
			src : "t5.png"
		},
		{
			id : "num0",
			src : "num0.png"
		},
		{
			id : "num1",
			src : "num1.png"
		},
		{
			id : "num2",
			src : "num2.png"
		},
		{
			id : "num3",
			src : "num3.png"
		},
		{
			id : "h1",
			src : "h1.png?3"
		},
		{
			id : "h2",
			src : "h2.png?3"
		},
		{
			id : "btn_action",
			src : "btn_action.png?1"
		},
		{
			id : "btn_go",
			src : "btn_go.png?1"
		},
		{
			id : "btn_restart",
			src : "btn_restart.png?1"
		},
		{
			id : "btn_share",
			src : "btn_share.png?1"
		},
		{
			id : "btn",
			src : "btn.mp3"
		}
	],
	preload = new createjs.LoadQueue(false, "./img/");
	preload.installPlugin(cj.Sound);
	preload.loadManifest(loader);
	preload.on("fileload", loadProgress);
	preload.on("complete", loaded),
	preloadLength = loader.length,
	preloadCurrent = 0;
function loadProgress(e){
	$progress.html((preload.progress*100).toFixed(2)+'%').width((preload.progress*100).toFixed(2)+'%');
}
function loaded() {
	$progress.parent().hide();
	$(".btn_action").show();
}
function reset(){
	TIME=0;
	timeGo=null;
	SCORE=0;
	scoreHad =false;
	laveTimeGo = null;
	laveTime = 4;
	$show.hide();
	$showBg.hide();
	$btn_goBox.show();
	$score.html(0.00);
}
function laveTimeAction(){
	$lavetime.show();
	if ( --laveTime < 0 ){
		$lavetime.hide();
		gameGo();
		//startTime = new Date().getTime();
		clearInterval(laveTimeGo);
		return;
	}
	$lavetime.html('<img src="img/num' + laveTime + '.png"/>');
}
function gameGo(){
    canvas.width = W;
	canvas.height = H;
	cj.Touch.enable(stage);
	cj.Ticker.setFPS(60);
	cj.Ticker.addEventListener("tick", stage);
	main = new cj.Container();
	stage.addChild(main);
	init();
}
function restart(){
	reset();
	main.removeAllChildren();
	clearInterval(laveTimeGo);
	laveTimeGo = setInterval(laveTimeAction,1000);
	laveTimeAction();
}
function init(){
	hn = Math.random();
	hImg = 1;
	if ( hn < 0.2 ){
		hImg = 2;
	};
	photo = {
		w : W*0.6,
		h : W*0.6,
		x : W*0.2,
		y : H*0.3,
		r : 12
	};
	line = {
		w : W*0.1,
		h : W*0.1
	};
	h = {
		w : W*0.2,
		h : '',
		x : W*0.5,
		y : -H*0.05
	};
	hbg = {
		w : W*0.4,
		x : W*0.5,
		y : -H*0.05
	};
	h.h = preload.getResult("h"+hImg).height*h.w/preload.getResult("h"+hImg).width;
	hbg.h = preload.getResult("t4").height*hbg.w/preload.getResult("t4").width;
	hbg.y += h.h*0.5;
	photoS = new cj.Shape();
	photoS.graphics.s("#fcd901").ss(5).rr(photo.x,photo.y,photo.w,photo.h,photo.r);
	photobg = new cj.Shape();
	photobg.graphics.f("#fff").rr(photo.x-5,photo.y-5,photo.w+5,photo.h+5,photo.r);
	photobg.alpha = 0;
	photoShow = new cj.Container();
	photo_1 = new cj.Shape();
	photo_1.graphics.s("#fff").ss(10).rr(0,0,photo.w,photo.h,photo.r);
	photo_1bg = new cj.Bitmap(preload.getResult("bg1"));
	photo_1bg.sourceRect = {
		x:photo.x*preload.getResult("bg1").width/W,
		y:photo.y*preload.getResult("bg1").height/H,
		width : photo.w*preload.getResult("bg1").width/W,
		height : photo.h*preload.getResult("bg1").height/H
	};
	photo_1bg.setTransform(0,0,W/preload.getResult("bg1").width,H/preload.getResult("bg1").height);
	photoShow.setTransform(photo.x*2+photo.w/2,photo.y*2+photo.h/2,1,1,0,0,0,photo.x+photo.w/2,photo.y+photo.h/2);
	lineS = new cj.Shape();
	lineS.graphics.s("#fcd901")
		.ss(5)
		.mt(photo.x+photo.w*0.5-line.w*0.5,photo.y+photo.h*0.5)
		.lt(photo.x+photo.w*0.5+line.w*0.5,photo.y+photo.h*0.5)
		.mt(photo.x+photo.w*0.5,photo.y+photo.h*0.5-line.h/2)
		.lt(photo.x+photo.w*0.5,photo.y+photo.h*0.5+line.h/2);
	hS = new cj.Shape();
	hS.graphics.bf(preload.getResult("h"+hImg)).dr(0,0,preload.getResult("h"+hImg).width,preload.getResult("h"+hImg).height);
	hS.setTransform(h.x,h.y,h.w/preload.getResult("h"+hImg).width,h.h/preload.getResult("h"+hImg).height,0,0,0,preload.getResult("h"+hImg).width/2,preload.getResult("h"+hImg).height/2);
	hbgS = new cj.Shape();
	hbgS.graphics.bf(preload.getResult("t4")).dr(0,0,preload.getResult("t4").width,preload.getResult("t4").height);
	hbgS.setTransform(hbg.x,hbg.y,hbg.w/preload.getResult("t4").width,hbg.h/preload.getResult("t4").height,0,0,0,preload.getResult("t4").width/2,preload.getResult("t4").height/2);
	photoShow.addChild(photo_1bg,photo_1);
	photoShow.alpha = 0;
	main.addChild(photoS,lineS,hS,photoShow,photobg,hbgS);
	cj.Tween.get(hS)
		.wait(300)
		.to({y:H+h.h},1700-(hn*2+hImg)*200,cj.Ease.circIn)
		.call(getScore);
}
function getScore(){
	cj.Tween.removeTweens(hS);
	cj.Sound.play("btn",{loop:0});
	
	var h1 = hS.clone(true);
	h1.x = hS.x-photo.x;
	h1.y = hS.y-photo.y;
	h1.mask = photo_1;
	photoShow.addChild(h1);
	main.removeChild(photoS,lineS,hS,photobg,hbgS);
	if ( scoreHad ){
		return false;
	}
	scoreHad = true;
	//window.h = h;
	//console.log("人物原点：" + h.y + "\n" + "图片原点:" + (photo_y+photo_h*0.5) + "\n" + "圆框高度：" + photo_y + "," + (photo_y+photo_h) );
	var hY = hS.y,
		pT = photo.y,
		pB = (photo.y+photo.h),
		C =  (photo.y+photo.h*0.35);
	if ( hY < pT || hY > pB ){
		SCORE = 0;
	}
	else if ( hY <= C ){
		SCORE = (hY - pT)/(C - pT) - 0.003732;
	}else if ( hY > C ){
		SCORE = (pB - hY)/(pB - C)  - 0.003732;
	}
	if ( SCORE < 0 ){
		SCORE = 0;
	}
	SCORE = Math.abs(SCORE*100*hImg).toFixed(2);
	//window.share.title = ;
	$title.html("我拍到了戴王冠的公主，得了" + SCORE + "分！还有奖品拿喔！");
	cj.Tween.get(photobg)
		.to({alpha : .5},300)
		.to({alpha : 0},200);
	cj.Tween.get(photoShow)
		.wait(100)
		.to({alpha : 1})
		.to({rotation:15},300)
		.call(function(){
			show();
		})
		.to({scaleX : .5,scaleY:.5,x:photo.w*0.5,y:photo.y*1.2},300)
		.call(function(){
			for (var i = 0,length = showInfo.length; i < length; i++) {
				if ( SCORE <= showInfo[i].score ){
					//window.share.desc = showInfo[i].info;
					/*ns.log({
						title : '<span class="t_geo t_red">' + SCORE + '</span>',
						conn : showInfo[i].info,
						btn_confirm : '再拍一次',
						btn_cancel : "知道了",
						confirm:function(r){
							restart();
						}
					});*/
					break;
				}
			};
		});
}
function show(){
	$score.html(SCORE);
	$btn_goBox.hide();
	$show.show();
	$showBg.show();
}
function isIphone(){
	var ua = navigator.userAgent.toLowerCase();
    if ( /iphone/i.test(ua) || /ipad/i.test(ua) ){
        return true;
    }else{
        return false;
    }
}
if ( isIphone() ){
	var bgm = document.getElementById("bgmp3"),
	    bgmPlayed = false;
	$(document).on(click,function() {
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
}
$btn_action.on(click,function(){
	$page.removeClass('current');
	$page2.addClass('current');
	reset();
});
$rule.on(click,function(){
	reset();
	$rule.hide();
	clearInterval(laveTimeGo);
	laveTimeGo = setInterval(laveTimeAction,1000);
	laveTimeAction();
});
$btn_go.on('tap',getScore);
$btn_restart.on(click,restart);
ns.addShare($btn_share);
});