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
        id : "man2",
        src : "man2.png"
    },
    {
        id : "man1_json",
        src : "man1.json"
    },
    {
        id : "icon",
        src : "icon.png",
    },
    {
        id : "icon_json",
        src : "icon.json",
    },
    {
        id : "bg1",
        src : "bg1.jpg"
    },
    {
        id : "bg",
        src : "bg.jpg"
    },
    {
        id : "site",
        src : "site.png"
    },
    {
        id : "site_json",
        src : "site.json"
    },
    {
        id : "gold",
        src : "gold.png"
    },
    {
        id : "obs_1",
        src : "obs_1.png"
    },
    {
        id : "obs_2",
        src : "obs_2.png"
    },
    {
        id : "hand",
        src : "hand.png"
    }
];
function initConfig(){
    loadingSet = {
        goAwaySpeed : 700,
        waitTime : 500
    };
    gameTips = {
        beforeLoad : "少女祈祷中...",
        loaded : "少女祈祷已完成。载入中。。。"
    };
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
        oh : H*0.11,
    };
    loadingTxt = new CreateText(gameTips.beforeLoad+"0.00%","25px microsoft yahei","#fff",{
        w : W,
        h : 30,
        x : W*0.5,
        y : H*0.2 + "_center"
    });
    siteSet = {
        siteCur : 0,
        siteMax : 9,
        w : "auto",
        h : H*0.65,
        x : W*0.2,
        y : "bottom_"+roadSet.h,
        gold : 7
    };
    obs = [];
    coins = [];
    bgSet = {
        w : W * 1.01,
        h : H,
        speed : 3000,
        action : false
    };
    distance = 0;
    totalDistance = 60*bgSet.speed/50;
    SCORE = 0;
    isGameOver = false;
    isGameEnd = false;
    obsPercent = 0.012;
    coinPercent = 0.02;
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