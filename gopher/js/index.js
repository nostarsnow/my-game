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
	ns.load();
var W = $(window).width() > 640 ? 640 : $(window).width(),
    H = $(window).height(),
    pageIndex = 1,
    pageSize = 50,
    allSize = 0,
    rankEnd = false,
    $xl_loading_p = $("#xl_loading_p"),	
	$xl_loading = $("#xl_loading"),
	$main = $("#main"),
	$canvas = $("#canvas"),
	$btn_go = $("#btn_go"),
	$page = $(".page"),
	$page1 = $(".page1"),
	$page2 = $(".page2"),
	$page3 = $(".page3"),
	$page4 = $(".page4"),
	$lavetime = $("#lavetime"),
	$goingTime = $("#goingTime"),
	$goingScore = $("#goingScore"),
	$score = $("#score"),
	$title = $("#title"),
	$time = $("#time"),
	$showTitle = $("#showTitle"), 
	$btn_action = $("#btn_action"),
	$btn_rank = $(".btn_rank"),
	$btn_restart = $(".btn_restart"),
	$rankTop = $(".rankTop"),
	$rank = $("#rank"),
	$rankList = $rank.find("ul"),
	$myRank = $("#myRank"),
	$myScore = $("#myScore"),
	$stop = $("#stop");
window.onload = function(){
    sources = {
        man0 : "img/man0.png",
        man1 : "img/man1.png",
        logo : "img/logo.png",
        hand : "img/hand.png",
        bg : "img/bg.jpg",
        t1 : "img/t1.png",
        num0 : "img/num0.png",
        num1 : "img/num1.png",
        num2 : "img/num2.png",
        num3 : "img/num3.png"
    };
    loadImage(sources,loaded);
};
function loaded() {
	$xl_loading_p.html("100%");
	$main.show();
	$xl_loading.removeClass('xl_loding_show');
	ns.loadHide();
	$xl_loading_p.html("Loading...");
	reset();
	//init();
}
function reset(){
	TIME=0;
	timeGo=null;
	STOP = 0;
	STOP_PRO = 0.2;
	STOP_TIME = 2000;
	upSpeed = 1000;
	downSpeed = 1000;
	waitTime = 500;
	nextTime = 2000;
	handSpeed = 100;
	animType = "linear";
	GAME = null;
	SCORE=0;
	TIME=0;
	TOTAL=0;
	lastDeviceGet = 0;
	laveTime = 4;
	laveTimeGo = null;
	TITLE = [
		{
			name : "打鼠小能手",
			img : "img/s1.png"
		},
		{
			name : "灭鼠小行家",
			img : "img/s2.png"
		},
		{
			name : "打地鼠超人",
			img : "img/s3.png"
		}
	];
	TITLEGET = null;
}
function laveTimeAction(){
	$lavetime.show();
	if ( --laveTime < 0 ){
		$lavetime.hide();
		gameGo();
		startTime = new Date().getTime();
		clearInterval(laveTimeGo);
		return;
	}
	$lavetime.html('<img src="img/num' + laveTime + '.png"/>');
}
function init(){
	page1();
}
function page1(){
	W = W*0.9;
	H = H*0.5;
	holl_set = {
		w : W*0.3,
		h : 20,
		row : 3,//行
		col : 3,//列
		count : 9
	};
	html = "";
	for (var i = 0; i < holl_set.row ; i++) {
		for (var j = 0; j < holl_set.col ; j++) {
			html += '<div class="box">' +
						'<img src="img/man0.png" class="mouse down"/>' +
						'<img src="img/logo.png" class="logo down"/>' +
					'</div>' ;
		};
	};
	$canvas.html(html);
	$box = $(".box");
	$mouse = $(".mouse");
	$logo = $(".logo");
	$mouse.on(click,function(e){
		var $t = $(this);
		if ( $t.hasClass('hited') ){
			return;
		}
		$t.addClass('hited');
		var $hand = $("<img/>").addClass('hand').attr("src",sources.hand).css({
			top : e.target.y,
			left : e.target.x
		}).appendTo($page2);
		$hand.animate({
			translate : "30%,-20%",
			rotate : 0
		},handSpeed,animType,function () {
			$t.attr("src",sources.man1);
			$goingScore.html(++SCORE);
			$hand.animate({
		  		opacity : 0
			},handSpeed,animType,function () {
				$hand.remove();
			});
		});
	});
	$logo.on(click,function (e) {
		STOP++;
		ns.tip("你敢打我！我妈都没打过我。！",2000);
		$stop.show();
		setTimeout(function(){
			$stop.fadeOut(300);
		},STOP_TIME-300);
		var $hand = $("<img/>").addClass('hand').attr("src",sources.hand).css({
			top : e.target.y,
			left : e.target.x
		}).appendTo($page2);
		$hand.animate({
			translate : "30%,-20%",
			rotate : 0
		},handSpeed,animType,function () {
			$hand.animate({
		  		opacity : 0
			},handSpeed,animType,function () {
				$hand.remove();
			});
		});
	});
}
function gameGo(){
	clearInterval(timeGo);
	timeGo = setInterval(function(){
		$goingTime.html(++TIME);
	},1000);
	going();
	GAME = setInterval(game,nextTime);
}
function game(){
	if ( SCORE >= 30 ){
		SCORE == 30;
		gameOver();
		clearInterval(GAME);
		return;
	}
	if ( SCORE == 5 ){
		upSpeed = 700;
		downSpeed = 700;
		waitTime = 500;
		nextTime = 1300;
		clearInterval(GAME);
		GAME = setInterval(game,nextTime);
	}else if ( SCORE == 10 ){
		upSpeed = 500;
		downSpeed = 500;
		waitTime = 300;
		nextTime = 700;
		clearInterval(GAME);
		GAME = setInterval(game,nextTime);
	}else if ( SCORE == 15 ){
		upSpeed = 300;
		downSpeed = 300;
		waitTime = 300;
		nextTime = 500;
		clearInterval(GAME);
		GAME = setInterval(game,nextTime);
	}else if ( SCORE == 20){
		upSpeed = 300;
		downSpeed = 300;
		waitTime = 200;
		nextTime = 300;
		clearInterval(GAME);
		GAME = setInterval(game,nextTime);
	}else if ( SCORE == 25 ){
		upSpeed = 100;
		downSpeed = 100;
		waitTime = 100;
		nextTime = 200;
		clearInterval(GAME);
		GAME = setInterval(game,nextTime);
	}else if ( SCORE >= 30 ){
		SCORE == 30;
		gameOver();
		clearInterval(GAME);
		return;
	}
	TOTAL++;
	going();
}
function going(){
	var logo_r = Math.random(),
		$b = $(".mouse.down"),
		length = $b.length,
		r = Math.floor(Math.random()*length),
		$t;
	if ( logo_r <= STOP_PRO ){
		$t = $(".logo.down").eq(r);
		$t.attr("src",sources.logo)
	}else{
		$t = $b.eq(r);
		$t.attr("src",sources.man0)
	}
	$t.removeClass("down hited").addClass('up').animate({
  		bottom : 0
	},upSpeed,animType,function () {
		setTimeout(function(){
			$t.animate({
		  		bottom : "-110%"
			},downSpeed,animType,function () {
				$t.removeClass("up").addClass('down');
			});
		},waitTime)
	});
}
function gameOver() {
	endTime = new Date().getTime();
	var timeUsed = ((endTime - startTime)/1000).toFixed(2);
	if ( timeUsed < 50 ){
		TITLEGET = 2;
	}else if ( timeUsed < 90 ){
		TITLEGET = 1;
	}else{
		TITLEGET = 0;
	}
	if ( timeUsed < myBestTime || myBestTime == 0 ){
		upload(timeUsed);
	}
	clearInterval(timeGo);
	$showTitle.attr('src', TITLE[TITLEGET].img);
	$title.html(TITLE[TITLEGET].name);
	$page.removeClass('current');
	$page3.addClass('current');
	//window.share.title="我刚用"+timeUsed+"秒消灭了"+SCORE+"只地鼠！获得了" + TITLE[TITLEGET].name + "称号！不服？来战！";
	ns.numberTo($score,SCORE,3,100);
	ns.numberTo($time,timeUsed,3,100);
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
				$myScore.html(data.time);
            }else{
                alert(data.errmsg);
            }
        },
        error:function(){
            ns.tip(check.ajaxError);
        }
    });
};
function upload(time){
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
            time : SnowCryEncrypt(time,enKey,enIv)
        },
        success : function(data){
        	console.log(data);
        	if ( data.errcode == 0 ){
        		updateMyInfo();
        		ns.tip("更新成功！");
        	}
            ns.loadHide();
        },
        error:function(){
            ns.tip(check.ajaxError);
            ajaxLock = 0;
        }
    });
};
function getList(){
    load();
    $.ajax({
        url: 'conn/ajax.php?xl_r='+Math.random(),
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
                        html+='<li><span class="rank_num">' + allSize + '</span><span class="rank_name">' + list[i].name + '</span><span class="rank_score">' + (list[i].time||0) + '</span></li>';
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
	laveTimeGo = setInterval(laveTimeAction,1000);
	init();
	laveTimeAction();
	return;
    load();
    $.ajax({
        type : check.ajaxType,
        url : check.ajaxUrl + "?xl=" +Math.random().toFixed(3),
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
				laveTimeGo = setInterval(laveTimeAction,1000);
				init();
				laveTimeAction();
            }else{
                alert(data.errmsg);
            }
            ns.loadHide();
        },
        error:function(){
        	ns.loadHide();
            ns.tip(check.ajaxError);
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
			                ns.tip("注册成功！");
			                location.href="index.html";
			            }else{
			                ns.tip(data.errmsg);
			            }
			            ns.loadHide();
			        },
			        error:function(){
			        	ns.loadHide();
			            ns.tip(check.ajaxError);
			        }
			    });
        }
    });
});
$btn_rank.on(click,function(){
	ns.tip('暂无排行!');
	return;
	$page.removeClass('current');
	$page4.addClass('current');
	$rankList.find("li").not(".rank_title").remove();
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
$rank.scroll(function(event) {
    if ( !rankEnd && !ajaxLock && ($rankList.height() - $rank.height() - $rank.scrollTop() < 20 ) ){
        ajaxLock = true;
        getList();
    }
});
$rankTop.on(click,function () {
	$btn_restart.trigger(click);
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