(function(){
var beforeLoader = [
    {
        id : "man1",
        src : "man1.png"
    },
    {
        id : "man1_json",
        src : "man1.json"
    }
],
loader = [
    {
        id : "bg",
        src : "bg.jpg"
    },
    {
        id : "man1_json",
        src : "man1.json"
    },
    {
        id : "t1",
        src : "t1.png"
    },
    {
        id : "btn_go",
        src : "btn_go.png"
    },
    {
        id : "btn_rank_i",
        src : "btn_rank_i.png"
    },
    {
        id : "btn_rule",
        src : "btn_rule.png"
    },
    {
        id : "man2",
        src : "man2.png"
    },
    {
        id : "bg1",
        src : "bg1.jpg"
    },
    {
        id : "gold",
        src : "gold.png"
    },
    {
        id : "obs",
        src : "obs.png"
    },
    {
        id : "hand",
        src : "hand.png"
    },
    {
        id : "timeBg",
        src : "timeBg.png"
    },
    {
        id : "coinBg",
        src : "coinBg.png"
    },
    {
        id : "btn_pause",
        src : "btn_pause.png"
    },
    {
        id : "coin",
        src : "mp3/coin.mp3"
    },
    {
        id : "die",
        src : "mp3/die.mp3"
    },
    {
        id : "site",
        src : "mp3/site.mp3"
    },
    {
        id : "jump",
        src : "mp3/jump.mp3"
    },
    {
        id : "suc",
        src : "mp3/suc.mp3"
    }
],
cj = createjs,
canvas = document.getElementById("canvas"),
W,H,
pageIndex = 1,
pageSize = 50,
allSize = 0,
rankEnd = false,
$main = $("#main"),
$page = $(".page"),
$page1 = $(".page1"),
$page2 = $(".page2"),
$page3 = $(".page3"),
$page4 = $(".page4"),
$bg = $(".bg"),
$t1 = $(".t1"),
$btn_go = $(".btn_go"),
$btn_rule = $(".btn_rule"),
$btn_rank_i = $('.btn_rank_i'),
$TIME = $("#TIME")[0],
$SCORE = $("#SCORE")[0],
$btn_pause = $(".btn_pause"),
$pause = $(".pause"),
$btn_play = $pause.find(".fa"),
$man = $(".man"),
$btn_rank = $(".btn_rank"),
$btn_restart = $(".btn_restart"),
$rank = $("#rank"),
$rankList = $rank.find("ul"),
$myRank = $("#myRank"),
$myScore = $("#myScore"),
$myBestScore = $(".myBestScore"),
$ruleBox = $(".ruleBox"),
loadingSet = {
    goAwaySpeed : 700,
    waitTime : 500
},
gameTips = {
    beforeLoad : "万达加速中...",
    loaded : "万达加速已完成。载入中。。。"
},
manSet,
roadSet,
bgSet,
obs = [],
coins = [],
TIME = 0,
SECONDS = 0,
SCORE = 0,
isGameStart = false,
isGameOver = false,
isGameEnd = false,
isInit = false,
isReset = false,
isPause = false,
obsPrevTime = 0,
preload;
function initConfig(){
/*    H = $(window).width();
    W = $(window).height();*/
    isInit = true;
    manSet = {
        w : W*0.12,
        h : "auto",
        x : W*0.07,
        animSpeed : 0.15,
        jumpSpeed : 150,
        jumpStep : -H*0.1,
        fallStep : -H*0.3/500,
        jumpType : cj.Ease.linear,
        fallType : cj.Ease.linear
    };
    roadSet = {
        h : H*0.17,
        mh : H*0.2,
        oh : H*0.17,
    };
    bgSet = {
        w : W * 1.03,
        h : H,
        speed : bgSpeed,
        action : false,
        tip : "加速行进中。。。"
    };
    preload = new cj.LoadQueue(false, "./img/");
    preload.loadManifest(beforeLoader);
    preload.on("complete", loading);
}
function getResult(img){
	return preload.getResult(img);
}
var Data = {
	fix : function(str,num,isStr){
		num = num || 3;
		if ( isNaN(str) ){
			return str;
		}
        if ( isStr ){
            return Number(str).toFixed(num);
        }else{
            return Number(Number(str).toFixed(num));
        }
		
	},
	int : function(str){
		return parseInt(str)
	},
	cx : function(x,w){
        var my,result;
        if ( my = /(right)_*(.*)/.exec(x) ){
            result = Data.fix(W - w - Math.round(my[2]));
        }else if ( my = /(\d*\.*\d*)_*(center)_*(\d*\.*\d*)/.exec(x) ){
            result = Data.fix((W - w)/2 + Math.round(my[1]) - Math.round(my[3]));
        }
        return result;
	},
	cy : function(y,h){
        var my,result;
        if ( my = /(bottom)_*(.*)/.exec(y) ){
            result = Data.fix(H - h - Math.round(my[2]));
        }else if ( my = /(\d*\.*\d*)_*(center)_*(\d*\.*\d*)/.exec(y) ){
            result = Data.fix((H - h)/2 + Math.round(my[1]) - Math.round(my[3]));
        }
        return result;
	}
};
var defaultsVertical = false;
var isVertical = false;
var isVerticalShow = false;
function checkScreenType(){
    var w = $(window).width(),
        h = $(window).height();
    if ( w < h ){
        isVertical = true;
        //return true;
    }else{
        isVertical = false;
        //return false;
    }
}
function checkVertical(){
    checkScreenType();
    if ( !isInit ){
        return false;
    }
    setTimeout(function(){
        if ( isVertical == defaultsVertical ){
            if ( $("#xl_dialog").length > 0 && isVerticalShow == true  ){
                $("#xl_dialog").remove();
                isVerticalShow = false;
                isPause = false;
            }
        }else{
            isPause = true;
            isVerticalShow = true;
            ns.log({
                title : "请不要在游戏过程中切换屏幕方式！！！<br>切换原屏幕方式自动继续游戏",
                confirm : function(){
                    ns.tip("请不要在游戏过程中切换屏幕方式！",3000);
                    this.hide()
                }
            })
        }
    },500);
}
if ( true || check.mobile ){
    checkScreenType();
    defaultsVertical = isVertical;
    if ( isVertical ){
        isVerticalShow = true;
        ns.log({
            title : "请开启手机和微信通用设置中的重力感应，切换成横屏之后点击确定，享受游戏体验。<br>或点击确定直接开始游戏！",
            confirm:function(r){
                ns.load();
                defaultsVertical = isVertical;
                if ( r && !isVertical ){
                    setTimeout(function(){
                        W = $(window).width();
                        H = $(window).height();
                        ns.loadHide();
                        initConfig();
                    },500);
                }else{
                    setTimeout(function(){
                        W = $(window).width();
                        H = Data.int(W/1.575);
                        $page.height(H);
                        $("html").css({
                            height: H,
                            minHeight: H
                        });
                        ns.loadHide();
                        initConfig();
                    },500);
                }
                this.hide()
            }
        })
    }else{
        ns.load();
        setTimeout(function(){
            W = $(window).width();
            H = $(window).height();
            ns.loadHide();
            initConfig();
        },500);
    }
    window.addEventListener( window.onorientationchange ? "orientationchange" : "resize", checkVertical, false);
}else{
    defaultsVertical = false;
    W = $(window).width();
    H = $(window).height();
    initConfig();
}
var stage,main,man1,loadingTxt;
function loading(){ //加载动画
	console.log("1.开始加载动画");
	canvas.width = W;
	canvas.height = H;
/*    var mainTrf = 'rotate(90deg) translate(' + Data.fix((H-W)/2/H,4)*100 + '%,' + Data.fix((W-H)/2/W,4)*100 + '%)';
    $main.css({
        'transform': mainTrf,
        '-webkit-transform': mainTrf
    });
    $page.css({
        width : W,
        height : H
    });
    $bg.css({
        width : W,
        height : H
    });
    $ruleBox.css({
        width : W,
        height : H
    });
    $pause.css({
        width : W,
        height : H
    });
    $page4.height(H*0.1);*/
    $man.height(W*0.2*93/69);
    stage = new cj.Stage(canvas);
    cj.Touch.enable(stage);
	cj.Ticker.setFPS(60);
	cj.Ticker.addEventListener("tick",update);
	main = new cj.Container();
	stage.addChild(main);
    loadingTxt = new CreateText(gameTips.beforeLoad+"0.00%","18px microsoft yahei","#fff",{
        w : W,
        h : 30,
        x : W*0.5,
        y : H*0.2 + "_center"
    }),
	man1 = new CreateSprite("man1",{
		w : manSet.w,
		h : manSet.h,
		x : "center",
		y : "center_"+loadingTxt.opts.h,
		begin : "run"
	},"man1_json");
    addEvent();
	main.addChild(loadingTxt,man1.mc);
	preload = new cj.LoadQueue(false, "./img/");
	preload.installPlugin(cj.Sound);
	preload.loadManifest(loader);
	preload.on("fileload", loadProgress);
	preload.on("complete", loaded);
}
function loadProgress(e){
	if ( preload.progress < 1 ){
		loadingTxt.text = gameTips.beforeLoad + Data.fix(preload.progress*100,2,true)+'%';
	}else{
		loadingTxt.text = gameTips.loaded;
	}
}
function play(mp3,times){
    times = times === undefined ? 0 : times;
    cj.Sound.play(mp3,{loop:times});
}
function loaded() {
    //play("bgm",-1);
	console.log("2.加载完成动画");
	cj.Tween.get( man1.mc )
			.wait(loadingSet.waitTime)
            .to( { x : W },loadingSet.goAwaySpeed)
            .call(page1);
    //page2();
}
var man2;
function page1(){
	console.log("3.游戏开始界面");
	main.removeChild(loadingTxt);
    $bg.show();
    $page1.addClass('current');
	loadingTxt = null;
	man2 = new CreateSprite("man2",{
		w : manSet.w,
		h : manSet.h,
		y : "bottom_"+H*0.07,
        x : "right_"+W*0.1,
		begin : "begin"
	},"man1_json");
    main.removeChild(man1.mc);
    main.addChild(man1.mc,man2.mc);
    cj.Tween.get(man1.mc)
    	.to( { x : -man1.opts.w , y : Data.cy("bottom_"+roadSet.h,man1.opts.h)})
        .to( { x : W*0.1 },700)
        .call(function () {
            man1.mc.gotoAndStop("begin");
        },this);
    $t1.addClass('anim');
    setTimeout(function(){
        $btn_go.addClass('anim').on(click,gameAction)
    },300);
    setTimeout(function(){
        $btn_rule.addClass('anim').on("click",function(){
            $ruleBox.show(300);
        });
    },600);
    setTimeout(function(){
        $btn_rank_i.addClass('anim').on("click",function(){
            $btn_rank.trigger(click);
        })
    },900);
    cj.Tween.get(man2.mc ,{ loop : true })
        .to({ y : man2.opts.y - 20},250,cj.Ease.circOut)
        .to({ y : man2.opts.y + 20},250,cj.Ease.circIn);
}
function gameAnim(){
	console.log("4.游戏开始动画");
    $page1.addClass('current');
    $t1.removeClass('anim').addClass('anim_go');
    setTimeout(function(){
        $btn_go.removeClass('anim').addClass('anim_go').off(click)
    },200);
    setTimeout(function(){
        $btn_rule.removeClass('anim').addClass('anim_go').off("click");
    },400);
    setTimeout(function(){
        $btn_rank_i.removeClass('anim').addClass('anim_go').off("click");
        cj.Tween.get(man2.mc)
            .to({ y : man2.opts.y } , 200 ,cj.Ease.circOut)
            .call(function(){
                man2.mc.gotoAndPlay("run")
            })
            .to({ x : W },500)
            .call(function(){
                man1.mc.gotoAndPlay("run");
                cj.Tween.get(man1.mc)
                    .to({ x : W , y : man2.opts.y },1500)
                    .call(function () {
                        page2();
                    },this);
                $bg.fadeOut(1500);
            });
    },600);
}
var obsGroup,coinsGroup,bg1,bg2,gold,ob,obsH = [],obsHLength;
function reset(){
    $page.removeClass('current');
    $page4.addClass('current');
    var lineHeight = W*0.065 + "px";
    $TIME.style.lineHeight = lineHeight;
    $SCORE.style.lineHeight = lineHeight;
    isGameOver = false;
    obs = [];
    coins = [];
    isGameStart = false;
    SCORE = 0;
    TIME = 0;
    SECONDS = 0;
}
function page2(){
	console.log("5.游戏开始");
    reset();
	obsGroup = new cj.Container();
	coinsGroup = new cj.Container();
    bg1 = new CreateBf("bg1",{
        w : bgSet.w,
        h : bgSet.h,
        alpha : 0
    });
    bg2 = new CreateBf("bg1",{
        w : bgSet.w,
        h : bgSet.h,
        x : W
    });
    gold = new CreateBitmap("gold",{
        w : W*0.06,
        h : W*0.06,
        x : W
    });
    ob = new CreateBitmap("obs",{
        w : "auto",
        h : H*0.2,
        x : W
    });
    tipBox = new cj.Container();
	main.addChild(bg1,bg2,obsGroup,coinsGroup,tipBox,man1.mc);
    gameInited();
}
function gameInited(){
    man1.mc.gotoAndPlay("run");
    man1.opts.y = Data.cy("bottom_"+roadSet.mh,man1.opts.h);
    cj.Tween.get(bg1)
        .to( { alpha : 1 } ,300 );
    if ( localStorage[active+"_tip"] === undefined ){
        tipBox.alpha=0;
        var tipBg = new cj.Shape();
        tipBg.graphics.f("rgba(0,0,0,.5)").dr(0,0,W,H);
        var tipText = new CreateText("长按可控制跳跃和幅度","20px bold","#fff",{
            x : "right_"+30,
            y : "bottom_"+30,
            align : "left",
            baseline : "top"
        });
        var tipHand = new CreateBf("hand",{
            w : "auto",
            h : H*0.2,
            x : "right_" + (tipText.opts.w+40),
            y : "bottom"
        });
        tipBox.addChild(tipBg,tipHand,tipText);
        localStorage[active+"_tip"] = 1;
        cj.Tween.get(tipBox)
            .wait(200)
            .to( { alpha : 1 },300);
        cj.Tween.get(man1.mc)
            .to( { x : -man1.opts.w , y : man1.opts.y })
            .to( { x : manSet.x },500 )
            .call(function(){
                man1.mc.gotoAndPlay("jump");
                cj.Tween.get(man1.mc)
                    .to( { y : H*0.2 },700 )
                    .call(function(){
                        man1.mc.gotoAndPlay("fall");
                        cj.Tween.get(man1.mc)
                            .to( { y : man1.opts.y },700 )
                            .call(function(){
                                man1.mc.gotoAndPlay("run");
                                cj.Tween.get(tipBox)
                                    .to( { alpha : 0 },300)
                                    .call(function(){
                                        main.removeChild(tipBox);
                                        tipBox=tipBg=tipHand=tipText = null;
                                    })
                                gameStart();
                            });
                    });
            });
    }else{
        main.removeChild(tipBox);
        cj.Tween.get(man1.mc)
            .to( { x : -man1.opts.w , y : man1.opts.y })
            .to( { x : manSet.x },500 )
            .call(gameStart);
    }
}
function restart(){
    bg1.x = 0;
    bg2.x = W;
    bg1.alpha = 0;
    obs=[];
    coins=[];
    obsGroup.removeAllChildren();
    coinsGroup.removeAllChildren();
    $page.removeClass('current');
    $page4.addClass('current');
    $(canvas).show();
    man1.jump = man1.fall = false;
    bgSet.speed = bgSpeed;
    SCORE = 0;
    TIME = 0;
    SECONDS = 0;
    isGameOver = false;
    isPause = false;
    isGameStart = false;
    $TIME.innerHTML = 0;
    $SCORE.innerHTML = 0;
    gameInited();
}
function gameStart(){
	isGameStart = true;
	bgSet.frame = W*1000/60;
    obsH = [0.6,0.7,0.8,0.9,1],
    obsHLength = obsH.length;
    bgSet.goldMx = W + gold.opts.w;
    bgSet.goldFrame = bgSet.goldMx*1000/60;
    bgSet.obsMx = W+ob.opts.w;
    bgSet.obsFrame = bgSet.obsMx*1000/60;
	man1.jump = man1.fall = false;
    manJumpAnim();
	main.on("mousedown",manJump);
	main.on("pressup",manFall);
}
function manJump(){
    if ( man1.jump || man1.fall ){
        return false;
    }
    play("jump");
    man1.jump = true;
    man1.mc.gotoAndPlay("jump");
}
function manJumpAnim(){
    man1.mc.on("tick",function(){
        if ( isPause ){
            return false;
        }
        if ( man1.jump ){
            man1.mc.y -= H*0.01;
            if ( man1.mc.y < H*0.1 ){
                manFall();
            }
        }
        if ( man1.fall ){
            man1.mc.y += H*0.01;
            if ( man1.mc.y > man1.opts.y ){
                man1.mc.y = man1.opts.y;
                manRoad();
            }
        }
    });
}
function manFall(){
    man1.jump = false;
    man1.fall = true;
    man1.mc.gotoAndPlay("fall");
}
function manRoad(){
    man1.jump = man1.fall = false;
    man1.mc.gotoAndPlay("run");
}
function update(){
    stage.update();
    if ( !isGameStart || isPause ){
        return false;
    }
    if ( !isGameOver ){
        for ( var i = 0,length=coins.length;i<length;i++ ){
            (function (i) {
                var s = coins[i]; 
                if ( !s.hited && collCheck.rect(s,man1.mc) ){
                    play("coin");
                    s.hited = true;
                    $SCORE.innerHTML = ++SCORE;
                    cj.Tween.removeTweens(s);
                    cj.Tween.get(s)
                        .to( { y : s.y - 30,alpha : 0 },200)
                        .call(function () {
                            coins.splice($.inArray(s,coins),1);
                            coinsGroup.removeChild(s);
                     });
                }
            }(i))
        }
        for ( var i = 0,length=obs.length;i<length;i++ ){
            (function (i) {
                var s = obs[i];
                if ( collCheck.px(s,man1.mc) ){
                    play("die");
                    main.removeAllEventListeners();
                    isPause = true;
                    cj.Tween.get(s)
                        .to( { alpha : .5 },200 )
                        .to( { alpha : 1 },200 )
                        .loop = true;
                    clearInterval(man1.jumpingInterVal);
                    man1.mc.gotoAndPlay("lose");
                    isGameOver = true;
                    setTimeout(function(){
                        gameOver();
                    },1200);
                }
            }(i))
        }
    }
    bg1.chx = Data.fix(bg1.x - bgSet.frame/bgSet.speed);
    if ( bg1.chx < -W ){
        bg1.chx = W;
    }
    bg1.x = bg1.chx;
    bg2.chx = Data.fix(bg2.x - bgSet.frame/bgSet.speed);
    if ( bg2.chx < -W ){
        bg2.chx = W;
    }
    bg2.x = bg2.chx;
    SECONDS = ~~(++TIME/60);
    $TIME.innerHTML = SECONDS;
    var lastSpeed = bgSet.speed;
    if ( SECONDS > 200 ){
        obsPercent = 0.02;
        coinPercent = 0.04;
        bgSet.speed = 1000;
    }else if ( SECONDS > 150 ){
        bgSet.speed = 1250;
    }else if ( SECONDS > 100 ){
        bgSet.speed = 1500;
    }else if ( SECONDS > 70 ){
        bgSet.speed = 1750;
    }else if ( SECONDS > 40 ){
        bgSet.speed = 2000;
    }else if ( SECONDS > 20 ){
        bgSet.speed = 2250;
    }else if ( SECONDS > 10 ){
        bgSet.speed = 2500;
    }
    if ( lastSpeed != bgSet.speed ){
        play("site");
    }
    drawObs();
}
function drawObs(){
    var r = Math.random();
    if ( r > coinPercent ){
        return false;
    }
    var sr = Math.random();
    if ( sr < 0.15 ){
        sr = 0.15;
    }
    if ( sr > 0.55 ){
        sr = 0.55;
    }
    var gold_s = gold.clone();
    var index = coins.push(gold_s) - 1;
    coins[index].y = H*sr;
    coins[index].hited = false;
    coinsGroup.addChild(coins[index]);
    coins[index].on("tick",function(){
        if ( isPause ){
            return false;
        }
        this.x -= Data.fix(bgSet.goldFrame/bgSet.speed);
        if ( this.x < -bgSet.goldMx ){
            coins.splice($.inArray(this,coins),1);
            coinsGroup.removeChild(this);
        }
    });
    if ( r > obsPercent ){
        var now = (new Date()).getTime();
        if ( now - obsPrevTime > bgSet.speed/10 ){
            var obs_h = Math.floor(Math.random()*obsHLength),
                obs_s = ob.clone(),
                gold_s = gold.clone(),
                index = obs.push(obs_s) - 1;
            obs[index].scaleX = ob.opts.sx*obsH[obs_h];
            obs[index].scaleY = ob.opts.sy*obsH[obs_h];
            obs[index].y = Data.cy("bottom_" + roadSet.oh,ob.opts.h*obsH[obs_h]);
            obsGroup.addChild(obs_s);
            obs[index].on("tick",function(){
                if ( isPause ){
                    return false;
                }
                this.x -= Data.fix(bgSet.obsFrame/bgSet.speed);
                if ( this.x < -bgSet.obsMx ){
                    obs.splice($.inArray(this,obs),1);
                    obsGroup.removeChild(this);
                }
            });
        }
        obsPrevTime = now;
    }
}
function gameOver(isWin){
	if ( isWin ){
		console.log("7.游戏结束！");
		$man.addClass('win');
	}else{
		$man.addClass('lose');
	}
	if ( SCORE > myBestScore ){
		//upload();
        myBestScore = SCORE;
		ns.numberTo($myBestScore,myBestScore,25);
	}else{
		$myBestScore.html(myBestScore);
	}
   //window.share.desc="酷跑青春，不玩才怪！我在万达酷跑活动中获得了"+SCORE+"个金币！不服？来战！";
    isPause = true;
    man1.mc.removeAllEventListeners();
    cj.Tween.removeAllTweens();
	$(canvas).hide();
	$page.removeClass('current');
	$page2.addClass('current');
	ns.numberTo($myScore,SCORE,25);
}
function gameAction() {
	if ( reged ){
		checkTimes();
        return;
	}
    $log({
        title : " ",
        conn : '<label class="in_ic40"><span class="l"><i class="fa fa-user"></i></span><span class="r"><input type="text" placeholder="请输入姓名" id="name" name="name" maxlength="12"/></span></label><label class="in_ic40"><span class="l"><i class="fa fa-mobile"></i></span><span class="r"><input type="tel" placeholder="请输入手机号码" id="tel" name="tel" maxlength="11"/></span></label>',
        go : function(){
    		var name = $("#name").val(),
		        tel = $("#tel").val();
		    if ( !check.name (name) ){
		        return false;
		    }
		    if ( !check.tel (tel) ){
		        return false;
		    }
            if ( ajaxLock ){
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
		            	reged = true;
		                updateMyInfo(true);
		                //location.href="index.php";
		            }else{
		                $tip(data.errmsg);
		            }
                    ajaxLock = false;
		            ns.loadHide();
		        },
		        error:function(){
                    ajaxLock = false;
		        	ns.loadHide();
		            $tip(check.ajaxError);
		        }
		    });
        }
    });
};
function checkTimes(){
    $page.removeClass('current');
    if ( reged && TIME > 0 ){
        restart();
    }else{
        gameAnim();
    }
    return;
    if ( ajaxLock ){
        return false;
    }
    ajaxLock = true;
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
                if ( reged && TIME > 0 ){
                    restart();
                }else{
                    gameAnim();
                }
            }else{
                $tip(data.errmsg);
            }
            ajaxLock = false;
            ns.loadHide();
        },
        error:function(){
            ajaxLock = false;
        	ns.loadHide();
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
            score : SnowCry_en(SCORE,enKey,enIv),
            time : SnowCry_en(SECONDS,enKey,enIv)
        },
        success : function(data){
        	console.log(data);
        	if ( data.errcode == 0 ){
        		updateMyInfo();
        	}
        },
        error:function(){
            $tip(check.ajaxError);
            ajaxLock = 0;
        }
    });
};
function updateMyInfo(reg) {
    $.ajax({
        type : check.ajaxType,
        url : check.ajaxUrl + "?xl_r=" +Math.random().toFixed(3),
        data : {
            action: "queryInfo",
            active : active,
            openid : openid,
            info : 7777
        },
        dataType : check.ajaxDataType,
        success : function(data){
        	console.log(data);
            if ( data.errcode == 0 ){
                if ( reg ){
                    $tip("注册成功！");
                    $("#xl_dialog").remove();
                    gameAction();
                }else{
                    $tip("更新成功！");
                }
                enKey = data.key;
                enIv = data.iv;
				$myRank.html(data.rank);
				$myBestScore.html(data.score);
                myBestScore = data.score;
            }else{
                $tip(data.errmsg);
            }
            ns.loadHide();
        },
        error:function(){
            $tip(check.ajaxError);
        }
    });
};
function getList(){
    if ( ajaxLock ){
        return false;
    }
    ajaxLock = true;
    load();
    $.ajax({
        url: check.ajaxUrl + "?xl_r="+Math.random().toFixed(3),
        dataType: check.ajaxDataType,
        data: {
            action : "queryList",
            pageIndex : pageIndex,
            pageSize : pageSize,
        	active : active
        },
        success : function(data){
            ns.loadHide();
            ajaxLock = false;
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
        },
        error : function(){
            ajaxLock = false;
            ns.loadHide();
            $tip(check.ajaxError);
        }
    });
};
function addEvent(){
    $btn_pause.on(click,function(){
        $pause.show();
        isPause = true;
    });
    $btn_play.on("click",function(){
        $pause.hide();
        isPause = false;
    });
    $btn_rank.on(click,function(){
        ns.tip('暂无排名！');
        return;
        $page.removeClass('current');
        $page3.addClass('current');
        $rankList.empty();
        pageIndex = 1;
        rankEnd = false;
        allSize = 0;
        getList();
    });
    $btn_restart.on(click,function(){
        if ( !reged || TIME < 1 ){
            $page.removeClass('current');
            $page1.addClass('current');
        }
        gameAction();
    });
    $rank.scroll(function() {
        if ( !rankEnd && !ajaxLock && ($rankList.height() - $rank.height() - $rank.scrollTop() < 20 ) ){
            getList();
        }
    });
    $ruleBox.on("click",function(){
        $ruleBox.fadeOut(300);
    })
    $(".rank_title").on(click,function(){
        localStorage.removeItem(active+"_tip");
    });
}
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
function CreateBf(img,opts){
    var getImg = getResult(img),
        isSheet = false;
    if ( opts.id !== undefined ){
        isSheet = true;
        opts.img = getImg.file.split(".")[0];
        img = getResult(opts.img);
        opts.img = img;
        opts.opt = getImg.frames[opts.id];
    }else{
        img = getImg;
        opts.img = img;
    }
    var defaults = {
        x : 0,
        y : 0,
        sW : W,
        sH : H,
        sx : 1,
        sy : 1,
        repeat : "no-repeat",
        regX : 0,
        regY : 0,
        alpha : 1,
        rotation : 0
    };
    if ( isSheet ){
        defaults.bw = opts.opt.w;
        defaults.bh = opts.opt.h;
        defaults.tx = -opts.opt.x;
        defaults.ty = -opts.opt.y;
    }else{
        defaults.bw = img.width;
        defaults.bh = img.height;
        defaults.tx = 0;
        defaults.ty = 0;
    }
    opts = opts === undefined ? defaults : $.extend(defaults,opts);
    if ( opts.w == undefined ){
            opts.w = opts.bw;
        }else{
            if ( opts.w == "auto" ){
                opts.w = Data.fix(opts.bw*opts.h/opts.bh);
            }
        }
    if ( opts.h == undefined ){
        opts.h = opts.bh;
    }else{
        if ( opts.h == "auto" ){
            opts.h = Data.fix(opts.bh*opts.w/opts.bw);
        }
    }
    if ( isNaN(opts.x) ){
        var my;
        if ( my = /(right)_*(.*)/.exec(opts.x) ){
            opts.x = Data.fix(opts.sW - opts.w - Math.round(my[2]));
        }else if ( my = /(\d*\.*\d*)_*(center)_*(\d*\.*\d*)/.exec(opts.x) ){
            opts.x = Data.fix((opts.sW - opts.w)/2 + Math.round(my[1]) - Math.round(my[3]));
        }
    }
    if ( isNaN(opts.y) ){
        var my;
        if ( my = /(bottom)_*(.*)/.exec(opts.y) ){
            opts.y = Data.fix(opts.sH - opts.h - Math.round(my[2]));
        }else if ( my = /(\d*\.*\d*)_*(center)_*(\d*\.*\d*)/.exec(opts.y) ) {
            opts.y = Data.fix((opts.sH - opts.h) / 2 + Math.round(my[1]) - Math.round(my[3]));
        }
    }
    if ( isNaN(opts.regX) ){
        opts.regX = opts.bw*Data.int(opts.regX)/100;
        opts.x+=opts.regX;
    }
    if ( isNaN(opts.regY) ){
        opts.regY = opts.bh*Data.int(opts.regY)/100;
        opts.y+=opts.regY;
    }
    opts.bsx = Data.fix(opts.w/opts.bw);
    opts.bsy = Data.fix(opts.h/opts.bh);
    opts.tx = Data.fix(opts.tx * opts.bsx);
    opts.ty = Data.fix(opts.ty * opts.bsy);
    var result = new cj.Shape();
    result.opts = opts;
    result.graphics.bf(opts.img,opts.repeat,new cj.Matrix2D(opts.bsx,0,0,opts.bsy,opts.tx,opts.ty) ).dr(0,0,opts.w,opts.h);
    result.x = opts.x;
    result.y = opts.y;
    result.regX = opts.regX;
    result.regY = opts.regY;
    result.rotation = opts.rotation;
    result.alpha = opts.alpha;
    result.scaleX = opts.sx;
    result.scaleY = opts.sy;
    return result;
}
function CreateBitmap(img,opts){
    img = getResult(img);
    opts.img = img;
    var defaults = {
        x : 0,
        y : 0,
        sW : W,
        sH : H,
        regX : 0,
        regY : 0,
        alpha : 1,
        rotation : 0
    };
    defaults.bw = img.width;
    defaults.bh = img.height;
    opts = opts === undefined ? defaults : $.extend(defaults,opts);
    if ( opts.w == undefined ){
            opts.w = opts.bw;
        }else{
            if ( opts.w == "auto" ){
                opts.w = Data.fix(opts.bw*opts.h/opts.bh);
            }
        }
    if ( opts.h == undefined ){
        opts.h = opts.bh;
    }else{
        if ( opts.h == "auto" ){
            opts.h = Data.fix(opts.bh*opts.w/opts.bw);
        }
    }
    if ( isNaN(opts.x) ){
        var my;
        if ( my = /(right)_*(.*)/.exec(opts.x) ){
            opts.x = Data.fix(opts.sW - opts.w - Math.round(my[2]));
        }else if ( my = /(\d*\.*\d*)_*(center)_*(\d*\.*\d*)/.exec(opts.x) ){
            opts.x = Data.fix((opts.sW - opts.w)/2 + Math.round(my[1]) - Math.round(my[3]));
        }
    }
    if ( isNaN(opts.y) ){
        var my;
        if ( my = /(bottom)_*(.*)/.exec(opts.y) ){
            opts.y = Data.fix(opts.sH - opts.h - Math.round(my[2]));
        }else if ( my = /(\d*\.*\d*)_*(center)_*(\d*\.*\d*)/.exec(opts.y) ) {
            opts.y = Data.fix((opts.sH - opts.h) / 2 + Math.round(my[1]) - Math.round(my[3]));
        }
    }
    if ( isNaN(opts.regX) ){
        opts.regX = opts.bw*Data.int(opts.regX)/100;
        opts.x+=opts.regX;
    }
    if ( isNaN(opts.regY) ){
        opts.regY = opts.bh*Data.int(opts.regY)/100;
        opts.y+=opts.regY;
    }
    opts.sx = opts.sx || Data.fix(opts.w/opts.bw);
    opts.sy = opts.sy || Data.fix(opts.h/opts.bh);
    var result = new cj.Bitmap(opts.img);
    result.opts = opts;
    result.setTransform(opts.x,opts.y,opts.sx,opts.sy,opts.rotation,0,0,opts.regX,opts.regY);
    result.alpha = opts.alpha;
    return result;
}
function CreateSprite(img,opts,json){
    var jsonType = false;
    if ( json !== undefined ){
        jsonType = true;
        json = getResult(json)[img];
    }
    img = getResult(img);
    var defaults = {
        bw : img.width,
        bh : img.height,
        sW : W,
        sH : H,
        x : 0,
        y : 0,
        regX : 0,
        regY : 0,
        alpha : 1,
        framerate : 30,
        rotation : 0,
        begin : ""
    };
    if ( jsonType ){
        defaults.frames = json.frames;
        defaults.animations = json.animations;
        defaults.bw = json.frames.width;
        defaults.bh = json.frames.height;
    }
    opts = opts === undefined ? defaults : $.extend(defaults,opts);
    opts.img = img;
    if ( opts.w == undefined ){
        opts.w = opts.bw;
    }else{
        if ( opts.w == "auto" ){
            opts.w = Data.fix(opts.bw*opts.h/opts.bh);
        }
    }
    if ( opts.h == undefined ){
        opts.h = opts.bh;
    }else{
        if ( opts.h == "auto" ){
            opts.h = Data.fix(opts.bh*opts.w/opts.bw);
        }
    }
    if ( isNaN(opts.x) ){
        var my;
        if ( my = /(right)_*(.*)/.exec(opts.x) ){
            opts.x = Data.fix(opts.sW - opts.w - Math.round(my[2]));
        }else if ( my = /(\d*\.*\d*)_*(center)_*(\d*\.*\d*)/.exec(opts.x) ){
            opts.x = Data.fix((opts.sW - opts.w)/2 + Math.round(my[1]) - Math.round(my[3]));
        }
    }
    if ( isNaN(opts.y) ){
        var my;
        if ( my = /(bottom)_*(.*)/.exec(opts.y) ){
            opts.y = Data.fix(opts.sH - opts.h - Math.round(my[2]));
        }else if ( my = /(\d*\.*\d*)_*(center)_*(\d*\.*\d*)/.exec(opts.y) ) {
            opts.y = Data.fix((opts.sH - opts.h) / 2 + Math.round(my[1]) - Math.round(my[3]));
        }
    }
    if ( isNaN(opts.regX) ){
        opts.regX = opts.bw*Data.num(opts.regX)/100;
        opts.x+=opts.regX;
    }
    if ( isNaN(opts.regY) ){
        opts.regY = opts.bh*Data.num(opts.regY)/100;
        opts.y+=opts.regY;
    }
    opts.sx = Data.fix(opts.w/opts.bw) || 1;
    opts.sy = Data.fix(opts.h/opts.bh) || 1;
    var result = {};
    result.opts = opts;
    result.spriteSheet = new cj.SpriteSheet({
        images : [opts.img],
        frames :  opts.frames,
        animations : opts.animations
    });
    result.mc = new cj.Sprite(result.spriteSheet,opts.begin);
    result.mc.setTransform(opts.x,opts.y,opts.sx,opts.sy,opts.rotation,0,0,opts.regX,opts.regY).framerate=opts.framerate;
    result.mc.alpha = opts.alpha;
    this.set = function(){
        console.log(this);
    }
    return result;
}
function CreateText(text,font,color,opts){
    var defaults = {
        align : "center",
        baseline : "middle",
        outline : 0,
        rotation : 0,
        sW : W,
        sH : H,
        x : 0,
        y : 0,
        sx : 1,
        sy : 1,
        regX : 0,
        regY : 0,
        alpha : 1
    };
    opts = opts === undefined ? defaults : $.extend(defaults,opts);
    var result = new cj.Text(text,font,color);
    if ( opts.w == undefined ){
        opts.w = result.getBounds().width;
    }
    if ( opts.h == undefined ){
        opts.h = result.getBounds().height;
    }
    if ( isNaN(opts.x) ){
        var my;
        if ( my = /(right)_*(.*)/.exec(opts.x) ){
            opts.x = Data.fix(opts.sW - opts.w - Math.round(my[2]));
        }else if ( my = /(\d*\.*\d*)_*(center)_*(\d*\.*\d*)/.exec(opts.x) ){
            opts.x = Data.fix((opts.sW - opts.w)/2 + Math.round(my[1]) - Math.round(my[3]));
        }
    }
    if ( isNaN(opts.y) ){
        var my;
        if ( my = /(bottom)_*(.*)/.exec(opts.y) ){
            opts.y = Data.fix(opts.sH - opts.h - Math.round(my[2]));
        }else if ( my = /(\d*\.*\d*)_*(center)_*(\d*\.*\d*)/.exec(opts.y) ) {
            opts.y = Data.fix((opts.sH - opts.h) / 2 + Math.round(my[1]) - Math.round(my[3]));
        }
    }
    if ( isNaN(opts.regX) ){
        opts.regX = opts.bw*Data.num(opts.regX)/100;
        opts.x+=opts.regX;
    }
    if ( isNaN(opts.regY) ){
        opts.regY = opts.bh*Data.num(opts.regY)/100;
        opts.y+=opts.regY;
    }
    result.opts = opts;
    result.lineWidth = opts.w;
    result.lineHeight = opts.h;
    result.regX = opts.regX;
    result.regY = opts.regY;
    result.x = opts.x;
    result.y = opts.y;
    result.scaleX = opts.sx;
    result.scaleY = opts.sy;
    result.textAlign = opts.align;
    result.textBaseline = opts.baseline;
    result.outline = opts.outline;
    result.alpha = opts.alpha;
    return result;
}
}());