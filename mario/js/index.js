var canvas = document.getElementById("canvas"),
	W = window.innerWidth > 640 ? 640 : window.innerWidth,
    H = window.innerHeight;
canvas.width = W;
canvas.height = H;
var cj = createjs;
var stage = new cj.Stage(canvas);
cj.Touch.enable(stage);
ns.load();
var loader = [],
	$xl_loading_p = $("#xl_loading_p"),	
	$xl_loading = $("#xl_loading"),
	$main = $("#main"),
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
window.onload = function(){
    var sources = {
        man : "img/man.png",
        coin : "img/coin.png",
        monster : "img/monster.png",
        road : "img/road.jpg"
    };
    loadImage(sources,loaded);
};
function loaded() {
	$xl_loading_p.html("100%");
	$main.css('display', 'block');
	$xl_loading.removeClass('xl_loding_show');
	ns.loadHide();
	reset();
	$(".choose_man .lr_1").on(click,function(){
		$(".choose_man .lr_1").removeClass('current');
		$(this).addClass('current');
	});
	$(".choose_dif li").on(click,function(){
		$(".choose_dif li").removeClass('current');
		$(this).addClass('current');
	});
	$(".btn_go").on(click,function(){
		if ( $(".choose_man .current").length < 1 ){
			ns.tip("请选择一个人物！");
			return;
		}
		if ( $(".choose_dif .current").length < 1 ){
			ns.tip("请选择一个难度！");
			return;
		}
		manSelect = $(".choose_man .current").data("id");
		switch( $(".choose_dif .current").data("id") ){
			case 0:
			monsterCol = 1;
			monsterRow = monsterHeight*2.5;
			leftRightSpeed = 3000;
			fallSpeed =  6000;
			minLeftRightSpeed = 1000;
			minFallSpeed = 2500;
			break;
			case 1:
			monsterCol = 1;
			monsterRow = monsterHeight*2;
			leftRightSpeed = 2000;
			fallSpeed =  5000;
			minLeftRightSpeed = 900;
			minFallSpeed = 2500;
			break;
			case 2:
			monsterCol = 1;
			monsterRow = monsterHeight*1.5;
			leftRightSpeed = 1500;
			fallSpeed =  4000;
			minLeftRightSpeed = 800;
			minFallSpeed = 1300;
			break;
			case 3:
			monsterCol = 2;
			monsterRow = monsterHeight*1.5;
			leftRightSpeed = 1000;
			fallSpeed =  2500;
			minLeftRightSpeed = 700;
			minFallSpeed = 1300;
			break;
		};
		$(".choose").hide();
		init();
	});
}
function reset(r){
	stage.clear();
	main = new cj.Container();
	stage.addChild(main);
	HIT=7;
	hited = true;
	$hit = $("#hit");
	$score = $("#score");
	$time = $("#time");
	S_LEFT = W*0.05;
	S_RIGHT = W*0.95;
	BUGTIME = 2000;
	TIME = 0;
	SCORE=0;
	monsterWidth = W*0.07;
	monsterHeight = W*0.07;
	monsterRow = monsterHeight*2;
	monsterCol = 1;
	leftRightSpeed = 2000;
	fallSpeed =  4000;
	minLeftRightSpeed = 700;
	minFallSpeed = 2000;
	manSelect = 0;
	monster=[];
	coin = [];
	PAUSE = false;
	$hit.html(7);
	$score.html(0);
	$time.html(0);
	if ( r ){
		init();
	}
}
function init(){
	bulidInit();
	page1();
	createjs.Ticker.setFPS(30);
	cj.Ticker.addEventListener("tick",update);
	timeGo = setInterval(function(){
		$time.html(++TIME);
	},1000);
}
function update(){
	stage.update();
	for (var i = 0; i < monster.length; i++) {
		if ( coin.length && coin[i] && coin[i].parent && i < coin.length ){
			if ( coin[i].noGet ){
				var x = Math.abs(man.x-coin[i].x);
				//console.log(coin[i].parent);
				var y = Math.abs(man.y-coin[i].y-coin[i].parent.y);
				if ( x < man.opts.hw+coin[i].opts.hw && y < man.opts.hh+coin[i].opts.hh ){
					coin[i].noGet = false;
					cj.Tween.removeTweens(coin[i]);
					cj.Tween.get(coin[i])
						.to({x:S_LEFT,y:-coin[i].parent.y,alpha:0},500,cj.Ease.backIn);
					$score.html(SCORE+=coin[i].opts.score);
				}
			}
		}
		var x = Math.abs(man.x-monster[i].x);
		var y = Math.abs(man.y-monster[i].y-monster[i].parent.y);
		if ( x < man.opts.hw+monster[i].opts.hw && y < man.opts.hh+monster[i].opts.hh ){
			if ( hited ){
				return false;
			}
			if ( HIT == 0 ){
				cj.Tween.removeAllTweens();
				man.removeAllEventListeners();
				road.removeAllEventListeners();
				//PAUSE = true;
				clearInterval(timeGo);
				setTimeout(function(){
					ns.log({
						title : "游戏成绩",
						con : '<div class="t_c"><p>获得金币：<span class="t_green">' + SCORE + '</span>个</p><p>坚持时间：<span class="t_green">' + TIME + '</span>个</p></div>',
						btn_cancel : "取消",
						btn_confirm : "再次挑战",
						confirm:function(){
							location.href="index.html";
						}
					});
				},500);
				return;
			}
			if ( HIT < 0 ){
				return;
			}
			bug();
			hited = true;
			$hit.html(--HIT);
		}
	};
}
function page1(){
	man_set = [
		{
			bw : 16,
			bh : 29,
			w : W*0.07,
			x : W*0.4,
			y : H*0.9,
			regX : 0,
			regY : 0,
			src : loader.man
		},
		{
			bw : 16,
			bh : 29,
			w : W*0.07,
			x : W*0.4,
			y : H*0.9,
			regX : 0,
			regY : 29,
			src : loader.man
		},
	];
	man = new man_bulid(man_set[manSelect]);
	monster_set = [
		{
			bw : 16,
			bh : 16,
			w : W*0.07,
			src : loader.monster,
			regX : 0,
			regY : 0
		},
		{
			bw : 16,
			bh : 16,
			w : W*0.07,
			src : loader.monster,
			regX : 0,
			regY : 16
		},
		{
			bw : 16,
			bh : 16,
			w : W*0.07,
			src : loader.monster,
			regX : 0,
			regY : 32
		}
	];
	coin_set = [
		{
			bw : 12,
			bh : 16,
			w : W*0.06,
			src : loader.coin,
			regX : 0,
			regY : 0,
			frames : [0,1,2,3],
			speed : .5,
			score : 1
		},
		{
			bw : 15,
			bh : 16,
			w : W*0.06,
			src : loader.coin,
			regX : 0,
			regY : 16,
			frames : [0],
			speed : 1,
			score : 2
		},
		{
			bw : 16,
			bh : 16,
			w : W*0.06,
			src : loader.coin,
			regX : 0,
			regY : 32,
			frames : [0],
			speed : 1,
			score : 5
		},
	]
	/*road = new road_bulid({
		x : S_LEFT,
		y : 0,
		w : S_RIGHT-S_LEFT,
		h : H,
		color : "#a1a3a2"
	});*/
	monsterContainer1 = new cj.Container();
	road = new cj.Shape();
	road.graphics.bf(loader.road,"repeat").dr(0,0,loader.road.width,loader.road.height);
	road.setTransform(0,-H,W/loader.road.width,H*2/loader.road.height);
	monsterContainer2 =  monsterContainer1.clone();
	main.addChild(road,monsterContainer1,monsterContainer2,man);
	man.on("pressmove",function(e){
		if ( e.stageX < man.opts.hw + S_LEFT ){
			man.x = man.opts.hw + S_LEFT;
		}else if ( e.stageX > S_RIGHT-man.opts.hw ){
			man.x = S_RIGHT-man.opts.hw;
		}else{
			man.x = e.stageX;
		}
		if ( e.stageY > man.opts.y ){
			man.y = man.opts.y;
		}else if ( e.stageY < man.opts.hh+40 ){
			man.y = man.opts.hh+40;
		}else{
			man.y = e.stageY;
		}
	});
	road.on("pressmove",function(e){
		if ( e.stageX < man.opts.hw + S_LEFT ){
			man.x = man.opts.hw + S_LEFT;
		}else if ( e.stageX > S_RIGHT-man.opts.hw ){
			man.x = S_RIGHT-man.opts.hw;
		}else{
			man.x = e.stageX;
		}
	});
	max_left = S_LEFT+monsterWidth*0.5;
	max_right = S_RIGHT-monsterWidth*0.5;
	buildMonster("monsterContainer1",false);
	buildMonster("monsterContainer2",true);
	bug();
	cj.Tween.get(road)
		.to({y:-H})
		.to({y:0},fallSpeed)
		.loop=true;
}
function buildMonster(obj,top){
	if ( leftRightSpeed > minLeftRightSpeed ){
		leftRightSpeed-=50;
	}
	if ( fallSpeed > minFallSpeed ){
		fallSpeed-=100;
	}
	H_monsterLength = parseInt((H*0.9-W*0.1)/monsterRow)+1;
	var c_y = 0;
	if ( obj == "monsterContainer2" || top ){
		c_y = -H;
	}
	window[obj].removeAllChildren();
	window[obj].y=c_y;
	//window[obj].addChild(road.clone());
	for (var i = 0; i < H_monsterLength; i++) {
		for (var m = 0; m < monsterCol; m++) {
			monster_s = new monster_bulid();
			y = monsterRow * i + monster_s.opts.hw;
			monster_s.opts.y = y;
			monster_s.opts.roadR = max_right-S_LEFT;
			monster_s.y = y;
			var j = monsterCol*i+m;
			var x = Math.random();
			monster_s.opts.speed = monster_s.opts.speed*(x+1);
			if ( W*x <= max_left ){
				x = max_left;
			}else if ( W*x >= max_right ){
				x = max_right;
			}else{
				x = W*x;
			}
			monster_s.x = x;
			monster_s.opts.x = x;
			monster_s.opts.roadX = x-S_LEFT;
			if ( obj == "monsterContainer2" ){
				j = H_monsterLength+monsterCol*i+m;
			}
			var hasCoin = Math.floor(Math.random()*20);
			if ( hasCoin > 1 ){
				var coin_s = new coin_bulid(hasCoin);
				coin_s.x = x;
				coin_s.y = y;
				coin[j] = coin_s;
				window[obj].addChild(coin[j]);
				if ( hasCoin > 18 ){
					cj.Tween.get(coin[j])
						.to({x:max_right},500*(1-monster_s.opts.roadX/monster_s.opts.roadR))
						.to({x:x},500*(1-monster_s.opts.roadX/monster_s.opts.roadR))
						.to({x:max_left},500*monster_s.opts.roadX/monster_s.opts.roadR)
						.to({x:x},500*monster_s.opts.roadX/monster_s.opts.roadR)
						.loop = true;
				}
			}
			monster[j] = monster_s;
			window[obj].addChild(monster[j]);
			if ( x > W*0.5 ){
				cj.Tween.get(monster[j])
					.to({x:max_right},monster_s.opts.speed*(1-monster_s.opts.roadX/monster_s.opts.roadR))
					.to({x:x},monster_s.opts.speed*(1-monster_s.opts.roadX/monster_s.opts.roadR))
					.to({x:max_left},monster_s.opts.speed*monster_s.opts.roadX/monster_s.opts.roadR)
					.to({x:x},monster_s.opts.speed*monster_s.opts.roadX/monster_s.opts.roadR)
					.loop = true;
			}else{
				cj.Tween.get(monster[j])
					.to({x:max_left},monster_s.opts.speed*monster_s.opts.roadX/monster_s.opts.roadR)
					.to({x:x},monster_s.opts.speed*monster_s.opts.roadX/monster_s.opts.roadR)
					.to({x:max_right},monster_s.opts.speed*(1-monster_s.opts.roadX/monster_s.opts.roadR))
					.to({x:x},monster_s.opts.speed*(1-monster_s.opts.roadX/monster_s.opts.roadR))
					.loop = true;
			}
		};
	};
	if ( top ){
		cj.Tween.get(window[obj]).to({y:H},fallSpeed*2).call(function(){
			buildMonster(obj,true);
		});
	}else{
		cj.Tween.get(window[obj]).to({y:H},fallSpeed).call(function(){
			buildMonster(obj,true);
		});
	}
};
function bulidInit(){
	man_bulid = function(opts){
		this.opts = opts;
		this.opts.h = this.opts.bh*this.opts.w/this.opts.bw;
		this.opts.hw = this.opts.w*0.5; //宽度一半
		this.opts.hh = this.opts.h*0.5; //高度一半
		return this.create();
	};
	man_bulid.prototype = {
		create : function(){
			var anim = new cj.SpriteSheet({
				"images" : [this.opts.src],
				"frames" : [
					[this.opts.regX,this.opts.regY,this.opts.bw,this.opts.bh],
					[this.opts.regX+this.opts.bw,this.opts.regY,this.opts.bw,this.opts.bh]
				],
				"animations" : {
					"go" : {
						frames : [0,1],
						next : "go",
						speed : .3
					}
				}
			});
			var man = new cj.Sprite(anim,"go");
			man.setTransform(this.opts.x,this.opts.y,this.opts.w/this.opts.bw,this.opts.h/this.opts.bh,0,0,0,this.opts.bw*0.5,this.opts.bh*0.5).framerate=30;
			man.opts = this.opts;
			return man;
		}
	};
	road_bulid = function(opts){
		this.opts = opts;
		return this.create();
	};
	road_bulid.prototype = {
		create : function(){
			var road = new cj.Shape();
			road.graphics.f(this.opts.color).r(this.opts.x,this.opts.y,this.opts.w,this.opts.h);
			road.opts = this.opts;
			return road;
		}
	};
	monster_bulid = function(opts){
		var r = Math.floor(Math.random()*monster_set.length);
		this.opts = {};
		for (var i in monster_set[r]) {
			this.opts[i] = monster_set[r][i];
		};
		this.opts.speed=leftRightSpeed;
		this.opts.h=this.opts.bh*this.opts.w/this.opts.bw;
		this.opts = $.extend(this.opts,opts);
		this.opts.hw = this.opts.w*0.5; //宽度一半
		this.opts.hh = this.opts.h*0.5; //高度一半
		return this.create();
	};
	monster_bulid.prototype = {
		create : function(){
			var anim = new cj.SpriteSheet({
				"images" : [this.opts.src],
				"frames" : [
					[this.opts.regX,this.opts.regY,this.opts.bw,this.opts.bh],
					[this.opts.regX+this.opts.bw,this.opts.regY,this.opts.bw,this.opts.bh]
				],
				"animations" : {
					"go" : {
						frames : [0,1],
						next : "go",
						speed : .3
					}
				}
			});
			var monster = new cj.Sprite(anim,"go");
			monster.setTransform(0,0,this.opts.w/this.opts.bw,this.opts.h/this.opts.bh).framerate=30;
			monster.regX = this.opts.bw*0.5;
			monster.regY = this.opts.bh*0.5;
			monster.opts = this.opts;
			return monster;
		}
	};
	coin_bulid = function(r){
		if ( r <= 16 ){ 
			r = 0;
		}else if ( r <= 18 ){
			r = 1;
		}else{
			r = 2;
		}
		this.opts = {};
		for (var i in coin_set[r]) {
			this.opts[i] = coin_set[r][i];
		};
		this.opts.h=this.opts.bh*this.opts.w/this.opts.bw;
		//this.opts = $.extend(this.opts,opts);
		this.opts.hw = this.opts.w*0.5; //宽度一半
		this.opts.hh = this.opts.h*0.5; //高度一半
		var length = this.opts.frames.length;
		this.opts.framesCut = [];
		for (var i = 0; i < length; i++) {
			this.opts.framesCut[i] = [this.opts.regX+this.opts.bw*i,this.opts.regY,this.opts.bw,this.opts.bh];
		};
		return this.create();
	};
	coin_bulid.prototype = {
		create : function(){
			var anim = new cj.SpriteSheet({
				"images" : [this.opts.src],
				"frames" : this.opts.framesCut,
				"animations" : {
					"go" : {
						frames : this.opts.frames,
						next : "go",
						speed : this.opts.speed
					}
				}
			});
			var coin = new cj.Sprite(anim,"go");
			coin.setTransform(0,0,this.opts.w/this.opts.bw,this.opts.h/this.opts.bh).framerate=30;
			coin.regX = this.opts.bw*0.5;
			coin.regY = this.opts.bh*0.5;
			coin.opts = this.opts;
			coin.noGet = true;
			return coin;
		}
	};
};
function bug(){
	cj.Tween.get(man)
		.to({alpha:.2},BUGTIME/5)
		.to({alpha:.4},BUGTIME/5)
		.to({alpha:.6},BUGTIME/5)
		.to({alpha:.8},BUGTIME/5)
		.to({alpha:1},BUGTIME/5)
		.call(function(){
			hited = false;
		});
}