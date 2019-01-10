//$(function(){
var W = $(window).width() > 640 ? 640 : $(window).width(),
    H = $(window).height(),
    canvas = $("#canvas")[0],
    cj = createjs,
	$main = $("#main"),
	$game = $("#game"),
	$page = $(".page"),
	$page0 = $(".page0"),
	$page1 = $(".page1"),
	$page2 = $(".page2"),
	$page3 = $(".page3"),
	$page4 = $(".page4"),
	$page5 = $(".page5"),
	$score = $("#score"),
	$info = $("#info"),
	$time = $("#time"),
	$btn_action = $("#btn_action"),
	$btn_restart = $(".btn_restart"),
	$btn_share = $("#btn_share"),
	$btn_gift = $(".btn_gift"),
	$btn_rank = $(".btn_rank"),
	$progress = $(".progress span");
var loader = [
		{
			id : "bg",
			src : "bg.jpg?1"
		},
		{
			id : "btn_action",
			src : "btn_action.png"
		},
		{
			id : "btn_rule",
			src : "btn_rule.png"
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
			src : "h1.jpg"
		},
		{
			id : "h2",
			src : "h2.jpg"
		},
		{
			id : "err",
			src : "err.png"
		},
		{
			id : "btn_restart",
			src : "btn_restart.png"
		},
		{
			id : "btn_share",
			src : "btn_share.png"
		},
		{
			id : "btn_gift",
			src : "btn_gift.png"
		},
		{
			id : "step",
			src : "step.mp3"
		},
		{
			id : "die",
			src : "die.mp3"
		},
		{
			id : "suc",
			src : "suc.mp3"
		}
	],
	preload = new cj.LoadQueue(false, "./img/");
	preload.installPlugin(cj.Sound);
	preload.loadManifest(loader);
	preload.on("fileload", loadProgress);
	preload.on("complete", loaded);
var col = 4,
	col_w = W/col,
	col_h = col_w,
	col_w_2 = col_w - 1,
	col_h_2 = col_h - 1,
	step_max = 100,
	border_color = "#fff",
	current = 1,
	total = 0,
	TOTALSTEP = [],
	TIME = 0,
	screenCount = Math.floor(H/col_h) + 1;
	timeGo = null,
	gamed = false,
	end = false;
function gameOver(err){
	gamed = true;
	clearInterval(timeGo);
	if ( err ){
		setTimeout(function(){
			ns.numberTo($score,TIME.toFixed(2),0.7,20);
			$info.html("胜败乃兵家常事，大侠请重新来过！");
			$page.removeClass('current');
			$page3.addClass('current');
		},1000);
		cj.Sound.play("die",{loop:0});
		//window.share.title = "我在银基王朝用了" + TIME.toFixed(2) + "秒也没有帮小骨找到师傅！你来试试吧！还有奖品拿喔！";
		return false;
	}
	cj.Sound.play("suc",{loop:0});
	//window.share.title = "我在银基王朝帮小骨找到了师傅，只用了" + TIME.toFixed(2) + "秒！你也来试试吧！还有奖品拿喔！";
	ns.numberTo($score,TIME.toFixed(2),0.7,20);
	$page.removeClass('current');
	$page3.addClass('current');
	//uploadScore();
}
function loadProgress(e){
	$progress.html((preload.progress*100).toFixed(2)+'%').width((preload.progress*100).toFixed(2)+'%');
}
function loaded() {
	$progress.parent().hide();
	$(".btn_action").show();
}
function timeGoing(){
	TIME += 0.05;
	$time.html( TIME.toFixed(2) );
}
function create(x,y,type){
    var block = new cj.Shape();
    if ( type !== undefined ){
    	if ( type == "right" ){
			var img = preload.getResult("h1");
    	}else if ( type == "right_c" ){
			var img = preload.getResult("h2");
    	}else{
			var img = preload.getResult("err");
    	}
		block.graphics.s(border_color).bf(img).r(0,0,img.width,img.height);
		block.setTransform(x,y,col_w_2/img.width,col_h_2/img.height);
    }else{
    	block.graphics.s(border_color).f("rgba(255,255,255,.01)").r(x,y,col_w_2,col_h_2);
    }
    return block;
}
function createRow(count){
	count = count || 1;
    for(var i = total; i < total+count ; i++ ){
    	//TOTALSTEP[i] = [];
    	var r = Math.floor(Math.random()*col);
		for (var j = 0,block,right; j < col; j++) {
			if ( r == j && i != 0 ){
				right = true;
				block = create(j*col_w,H-(i+1)*col_h,"right");
			}else{
				right = false;
				block = create(j*col_w,H-(i+1)*col_h);
			}
			main.addChild(block);
			/*TOTALSTEP[i][j] = {
				is : right,
				block : block
			};*/
			(function(i,j,r){
				block.on("click",function(e){
					if ( current == 1 ){
						timeGo = setInterval(timeGoing,50);
					}
					if ( i != current || gamed ){
						return false;
					}
					if ( Math.random() < randomRedBag ){
						getRedBag();
					}
					if ( r ){
						cj.Sound.play("step",{loop:0});
						current++;
						this.graphics = null;
						main.addChild(create(j*col_w,H-(i+1)*col_h,"right_c"));
						if ( current > screenCount ){
							/*var top = current*col-screenCount*col;
							console.log(top);*/
							main.removeChildAt(0,1,2,3,4);
						}
						if ( current == total ){
							gameOver();
						}
						if ( total <= step_max ){
							createRow(1);
						}
						if ( current < step_max - 1 ){
							main.y+=col_h;
						}
						/*cj.Tween.get(main)
						.to({y:main.y+col_h},100,cj.Ease.linear);*/
					}else{
						this.graphics = null;
						var err = create(j*col_w,H-(i+1)*col_h,"err");
						main.addChild(err);
						cj.Tween.get(err)
							.to({alpha : .5},400,cj.Ease.linear)
							.to({alpha : .8},400,cj.Ease.linear)
							.to({alpha : .5},400,cj.Ease.linear)
							.loop = true;
						gameOver(true);
					}
				});
			}(i,j,right))
		};
    }
	total+=count;
}
function init(){
    canvas.width = W;
	canvas.height = H;
	stage = new cj.Stage(canvas),
	main = new cj.Container();
	cj.Ticker.setFPS(60);
	cj.Touch.enable(stage);
	cj.Ticker.addEventListener("tick",stage);
	stage.addChild(main);
	createRow(screenCount+10);                           
}
function checkReg(){
	if ( reged == 0 ){
		$log({
			type : "reg",
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
				ajaxLock = true;
			    ns.load();
			    $.ajax({
			        type : check.ajaxType,
			        url : check.ajaxUrl + "?xl=" +Math.random().toFixed(3),
			        data : {
			            action: "reg",
			            name : name,
			            wxid : active,
			            tel: tel,
			            openid : openid
			        },
			        dataType : check.ajaxDataType,
			        success : function(data){
			            console.log(data);
			            if( data.errorcode == 0 ){
			            	myName = name;
			            	myTel = tel;
			            	reged = 1;
			                $tip("注册成功！");
			                setTimeout(function(){
			                	location.href="index.html";
			                },500);
			            }else{
			                $tip(data.errormsg);
			            }
			            ns.loadHide();
			            ajaxLock = false;
			        },
			        error:function(){
			        	ns.loadHide();
			        	ajaxLock = false;
			            $tip(check.ajaxError);
			        }
			    });
			}
		})
	}else{
		checkGame();
	}
}
function checkGame(){
	ns.load();
	$page.removeClass('current');
	$page2.addClass('current');
	setTimeout(function(){
		ns.loadHide();
		init();
	},500);
	return;
	if ( ajaxLock ){
		return false;
	}
	ajaxLock = true;
	ns.load();
    $.ajax({
        type : check.ajaxType,
        url : check.ajaxUrl + "?xl=" +Math.random().toFixed(3),
        data : {
            action: "text",
            wxid : active,
            activetypeoid: '86c7778b-2f3f-4efe-b689-2edc040f37e3',
            openid : openid
        },
        dataType : check.ajaxDataType,
        success : function(data){
            console.log(data);
            ajaxLock = false;
            ns.loadHide();
            if( data.errorcode == 0 ){
            	ns.load();
				$page.removeClass('current');
				$page2.addClass('current');
				setTimeout(function(){
					ns.loadHide();
					init();
				},500);
            }else{
                $tip(data.errormsg);
            }
        },
        error:function(){
        	ns.loadHide();
        	ajaxLock = false;
            $tip(check.ajaxError);
        }
    });
}
function uploadScore(){
	ns.load();
	console.log(TIME.toFixed(2),SnowCryEncrypt(TIME.toFixed(2),enKey,enIv));
    $.ajax({
        type : check.ajaxType,
        url : check.ajaxUrl + "?xl=" +Math.random().toFixed(3),
        data : {
            action: "recordscore",
            name : myName,
            wxid : active,
            activetypeoid: '86c7778b-2f3f-4efe-b689-2edc040f37e3',
            score : SnowCryEncrypt(TIME.toFixed(2),enKey,enIv),
            openid : openid
        },
        dataType : check.ajaxDataType,
        success : function(data){
            console.log(data);
            $tip("上传成绩成功！");
            ns.loadHide();
        },
        error:function(){
        	ns.loadHide();
            $tip(check.ajaxError);
        }
    });
};
function getMyGift(){
	if ( ajaxLock ){
		return false;
	}
	ajaxLock = true;
	ns.load();
    $.ajax({
        type : check.ajaxType,
        url : check.ajaxUrl + "?xl=" +Math.random().toFixed(3),
        data : {
            action: "getaward",
            wxid : active,
            activetypeoid: '86c7778b-2f3f-4efe-b689-2edc040f37e3',
            openid : openid
        },
        dataType : check.ajaxDataType,
        success : function(data){
            console.log(data);
            if ( data.errorcode == 0 && data.errormsg.length > 0 ){
            	for (var i = 0,length = data.errormsg.length,html="",btn=""; i < length; i++) {
            		if ( data.errormsg[i].awardstate == "未兑奖" ){
            			btn = '<a class="exchange" data-id="' + data.errormsg[i].awardid + '">领取</a>';
            		}else{
            			btn = '<a class="t_gray">' + data.errormsg[i].awardstate + '</a>';
            		}
            		html += '<tr>' + 
            					'<td class="t_green">' + data.errormsg[i].awardname + ' - ' + data.errormsg[i].score + '元</td>' +
            			 		'<td>' + btn + '</td>' +
        			 		'</tr>';
			 		//html+=html;
            	};
            }else{
            	var html = '<tr><td colspan="2">还没获得奖品呢！继续努力吧！</td></tr>';
            }
            $(".gift .q_table tbody").html(html);
            ns.loadHide();
            ajaxLock = false;
        },
        error:function(){
        	ns.loadHide();
        	ajaxLock = false;
            $tip(check.ajaxError);
        }
    });
};
function getRedBag(){
	ns.tip('获得红包！可惜是假的');
	return;
	if ( ajaxLock ){
		return false;
	}
	ajaxLock = true;
	ns.load();
    $.ajax({
        type : check.ajaxType,
        url : check.ajaxUrl + "?xl_r=" +Math.random().toFixed(3),
        data : {
            action: "shake",
            wxid : active,
            activetypeoid: '86c7778b-2f3f-4efe-b689-2edc040f37e3',
            openid : openid
        },
        dataType : check.ajaxDataType,
        success : function(data){
        	console.log(data);
        	if ( data.errorcode == 0 ){
        		$tip("恭喜你！幸运的获得" + data.cash + "元现金红包" );
        	}
            ns.loadHide();
            ajaxLock = false;
        },
        error:function(){
        	ns.loadHide();
        	ajaxLock = false;
            $tip(check.ajaxError);
        }
    });
}
function getRank(){
	if ( ajaxLock ){
		return false;
	}
	ajaxLock = true;
	ns.load();
    $.ajax({
        type : check.ajaxType,
        url : check.ajaxUrl + "?xl=" +Math.random().toFixed(3),
        data : {
            action: "getscorelist",
            wxid : active,
            activetypeoid: '86c7778b-2f3f-4efe-b689-2edc040f37e3',
            openid : openid
        },
        dataType : check.ajaxDataType,
        success : function(data){
            console.log(data.errormsg);
            if ( data.errorcode == 0 ){
	            if ( data.errormsg.length > 0 ){
	            	for (var i = 0,length = data.errormsg.length,html=""; i < length; i++) {
	            		var isMe = '';
	            		if ( bopenid ==  data.errormsg[i].openid ){
	            			isMe = ' isme';
	            		}
	            		html += '<tr class=" ' + isMe + ' ">' + 
	            					'<td class="t_geo">' + (i+1) + '</td>' +
	            			 		'<td>' + data.errormsg[i].name + '</td>' +
	            			 		'<td>' + data.errormsg[i].score + '</td>' +
	        			 		'</tr>';
				 		//html+=html;
	            	};
	            }
            }else{
            	var html = '<tr><td colspan="3">暂无排行数据！</td></tr>';
            }
			$(".rank .q_table tbody").html(html);
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
$btn_action.on(click,checkReg);
$btn_gift.on(click,function(){
	ns.tip('没有奖品！');
	return;
	getMyGift();
	$page.removeClass('current');
	$page4.addClass('current');
});
$btn_rank.on(click,function(){
	ns.tip('暂无排行！');
	return;
	getRank();
	$page.removeClass('current');
	$page5.addClass('current');
});
$(".gift .q_table tbody").on(click,'.exchange',function(){
	if ( ajaxLock ){
		return false;
	}
	ajaxLock = true;
	var $t = $(this);
	ns.load();
    $.ajax({
        type : check.ajaxType,
        url : check.ajaxUrl + "?xl=" +Math.random().toFixed(3),
        data : {
            action: "applyredpackage",
            wxid : active,
            id : $t.attr("data-id"),
            activetypeoid: '86c7778b-2f3f-4efe-b689-2edc040f37e3',
            openid : openid
        },
        dataType : check.ajaxDataType,
        success : function(data){
        	console.log(data);
        	if ( data.errorcode == 0 ){
        		$t.removeClass('exchange').addClass('t_gray').html("已兑换");
        		$log({
        			title : '恭喜您领取了' + data.GrantCash + '元现金红包！'
        		});
        	}else{
        		$tip(data.errormsg);
        	}
            ns.loadHide();
            ajaxLock = false;
        },
        error:function(){
        	ns.loadHide();
        	ajaxLock = false;
            $tip(check.ajaxError);
        }
    });
});
ns.addShare($btn_share);
//});