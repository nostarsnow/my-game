$(function(){
var	$ansWarp = $(window),
	$page = $(".page"),
	$page1 = $(".page1"),
	$page2 = $(".page2"),
	$page3 = $(".page3"),
	$page4 = $(".page4"),
	$btn_start = $("#btn_start"),
	$btn_rank = $(".btn_rank"),
	$ansCur = $("#ansCur"),
	$ansTotal = $("#ansTotal"),
	$time = $("#time"),
	$ansImg = $("#ansImg"),
	$ansRight = $(".ansRight"),
	$right = $ansRight.find("span"),
	$ansSelect = $(".ansSelect"),
	$btn_next = $("#btn_next"),
	$btn_tip = $("#btn_tip"),
	$btn_restart = $("#btn_restart"),
	$btn_rank =$(".btn_rank"),
	$rank = $("#rank"),
	$rankList = $rank.find("ul"),
	$myRank = $("#myRank"),
	$myScore = $("#myScore"),
	$myBestScore = $("#myBestScore"),
	$myBestRank = $("#myBestRank"),
	$close = $(".close"),
	$tipCur = $("#tipCur"),
	$tipTime = $("#tipTime"),
	$adb = $(".adb"),
	$adb_close = $(".adb_close"),
	W = $(window).width()*0.8,
	H = $(window).height()*0.92,
	ans = [
		{
			img : '1',
			text : "杏让火枣交孩老夫祸花雨子梨弟兄之孔付眉童孙上犁仔绒谦云融小利园发".split(''),
			right : "孔融让梨".split('')
		},
		{
			img : '2',
			text : "冰雪铺地银装霜花阳白门封路天冻舞立堆尺大飞飘交加前遍玉城程皑瑞雾".split(''),
			right : "程门立雪".split('') 
		},
		{
			img : '3',
			text : "吹食乞怜乘儿火哀束蕴告穷赖箫嗟搓之物碗饭箪给讨餐得酒来老叟热摇尾".split(''),
			right : "嗟来之食".split('') 
		},
		{
			img : '4',
			text : "室食肝采玉席桂薪牧枕块越勾竹犊反负卧坐悬脏空堂尝但抽止积火胆差剑".split(''),
			right : "卧薪尝胆".split('') 
		},
		{
			img : '5',
			text : "尝不雪梁借专映卧孜倦莹胆悬锥寒窗忘废食心致知绑刺寝股读志向苦灯夜".split(''),
			right : "悬梁刺股".split('') 
		},
		{
			img : '6',
			text : "言失得金行百久字诺若佑黄斤不鼎既出一为定待以大约布重信承千名九季".split(''),
			right : "一诺千金".split('') 
		},
		{
			img : '7',
			text : "愚不可及者千虑眉肉眼移根换叶风俗易石世易公老山私怂恿禺绳框绿担屋".split(''),
			right : "愚公移山".split('') 
		},
		{
			img : '8',
			text : "凿人书学凳墙砖翻壁石洞孔透坐偷看亮瑜璧光来砸造灯函穿过凶愉元羌输".split(''),
			right : "凿壁偷光".split('') 
		},
		{
			img : '9',
			text : "牛甭书生羊卷尖动桂角画孩墨布纸童坐看地头挂佳汗犊齿足牵悬起人郎儿".split(''),
			right : "牛角挂书".split('') 
		},
		{
			img : '10',
			text : "手服古不酒二野村八贵店而抬洒庄家华是手夺目树毕本宝好符过实其异人".split(''),
			right : "华而不实".split('')
		}
	],
	TIME=0,
	timeGo,
	tipTime = 40,
	pageIndex = 1,
	pageSize = 50,
	allSize = 0,
	rankEnd = false,
	hasInit = false,
	cur = 0,
	rightCur = 0,
	selectHeight = W*0.125+'px',
	_msg = ans.slice(0),
	msg=[],
	_msgText=[];
	function restart(){
		$page.removeClass('current');
		$page2.addClass('current');
		cur=0;
		TIME=0;
		tipTime=40;
		$tipTime.html(tipTime);
		$myScore.html('');
		$myRank.html('');
		$right.empty().removeClass('right error').addClass('empty');
		_msg = ans.slice(0);
		msg=[];
		_msgText=[];
		for (var i = 0,length = _msg.length; i < length ; i++ ){
	  		msg.push(_msg.splice(Math.floor(Math.random()*_msg.length),1)[0]);
		}
		timeGo = setInterval(timeGoing,10);
		createAns();
	}
	function createAns(){
		ns.load();
		var _ansCur = msg[cur].text.slice(0),
			ansCur = [];
		$ansImg.attr('src','img/ans' + msg[cur].img + '.png');
		$ansCur.html(cur+1);
		for (var i = 0,length = _ansCur.length,html=[];i < length ; i++ ){
			var selectCur = _ansCur.splice(Math.floor(Math.random()*_ansCur.length),1)[0];
			html[i] = '<span style="height:' + selectHeight + '" data-pos=' + i + '>' + selectCur + '</span>';
	  		ansCur.push(selectCur);
		}
		$ansSelect.html(html.join(''));
		_msgText.push(ansCur);
		ns.loadHide();
	}
	function checkRight(){
		var check = [],
			isRight = true;
		$right.each(function(i,el){
			check.push($.trim($(el).html()));
		});
		for ( var i = 0,length = check.length;i < length;i++ ){
			if ( check[i] != msg[cur].right[i] ){
				isRight = false;
				$right.eq(i).addClass('error');
			}
		}
		if ( isRight ){
			ns.ajaxLock = true;
			$right.removeClass('error').addClass('right');
			setTimeout(function(){
				if ( cur == 9 ){
					ns.ajaxLock = false;
					clearInterval(timeGo);
					gameOver();
					return false;
				}
				cur++;
				$right.empty().removeClass('right error').addClass('empty');
				createAns();
				ns.ajaxLock = false;
			},500);
		}
	}
	function page2(){
		restart();
		$ansSelect.on(click,'span',function(){
			if ( ns.ajaxLock ){
				return false;
			}
			var $t = $(this);
			if ( $t.hasClass('empty') ){
				return false;
			}
			var	pos = $t.data("pos"),
				html = $.trim($t.html()),
				rightEmpty = $ansRight.find(".empty"),
				rightNum = rightEmpty.length;
			if ( rightNum == 0 ){
				return false;
			}
			$right.eq(rightEmpty.eq(0).index()).html(html).data("pos",pos).removeClass('empty');
			$t.addClass('empty').empty();
			if ( rightNum-1 == 0 ){
				checkRight();
			}
		});
		$btn_tip.on('click',function(){
			if ( tipTime == 0 ){
				ns.tip("提示次数已用完！要靠你自己了！");
				return false;
			}
			if ( ns.ajaxLock ){
				return false;
			}
			var	rightEmpty = $ansRight.find(".empty"),
				rightNum = rightEmpty.length;
			if ( rightNum == 0 ){
				return false;
			}
			var	$t = rightEmpty.eq(0),
				tipCur = Math.floor(Math.random()*rightNum),
				tipEl = rightEmpty.eq(tipCur),
				tipIndex = rightEmpty.eq(tipCur).index(),
				tipText = msg[cur].right[tipIndex],
				tipSelectIndex = _msgText[cur].indexOf(tipText);
			$tipTime.html(--tipTime);
			tipEl.html(tipText).data("pos",tipSelectIndex).removeClass('empty');
			$ansSelect.find("span").eq(tipSelectIndex).addClass('empty').empty();
			if ( rightNum-1 == 0 ){
				checkRight();
			}
		});
		$right.on(click,function(){
			if ( ns.ajaxLock ){
				return false;
			}
			var $t = $(this);
			if ( $t.hasClass('empty') ){
				return false;
			}
			var	pos = $t.data("pos"),
				html = $t.html();
			$t.addClass('empty').removeClass('error').empty();
			$ansSelect.find("span").eq(pos).html(html).removeClass('empty');
		});
	}
	function page3(){
		$page.removeClass('current');
		$page3.addClass('current');
	}
	function init(){
		$ansRight.css('line-height', W*0.2+'px');
		$right.css('height', W*0.2+'px');
		$ansSelect.css('line-height',selectHeight);
        $myBestScore.html(formateTime(myBestScore) || 0);
		$myBestRank.html(myBestRank);
	}
	init();
	function formateTime(time){
		var _millsec = ~~(time%100);
		return ~~(time/100) +" '' " + ( _millsec < 10 ? '0' + _millsec : _millsec );
	}
	function timeGoing(){
		$time.html( formateTime(++TIME) );
	}
	function gameOver(){
		$myScore.html(formateTime(TIME));
		$myRank.html(myBestRank);
		page3();
	}
	function checkReg(){
		if ( !reged ){
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
					if ( ns.ajaxLock ){
						return false;
					}
					ns.ajaxLock = true;
				    ns.load();
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
				            ns.load();
				            ns.ajaxLock = false;
				            console.log(data);
				            if( data.errcode == 0 ){
				            	myName = name;
				            	myTel = tel;
				            	reged = true;
				                updateMyInfo();
				            }else{
				                ns.tip(data.errmsg);
				            }
				        },
				        error:function(){
				        	ns.load();
				        	ns.ajaxLock = false;
				            ns.tip(check.ajaxError);
				        }
				    });
				}
			})
		}else{
			checkGame();
		}
	}
	function checkGame(){
		if ( TIME > 0 ){
			restart();
		}else{
			page2();
		}
		return;
		if ( ns.ajaxLock ){
			return false;
		}
		ns.ajaxLock = true;
		ns.load();
	    $.ajax({
	        type : check.ajaxType,
	        url : check.ajaxUrl + "?xl_r=" +Math.random().toFixed(3),
	        data : {
	            action: "checkTimes",
	            active : active,
	            openid : openid
	        },
	        dataType : check.ajaxDataType,
	        success : function(data){
	            console.log(data);
	            ns.ajaxLock = false;
	            ns.load();
	            if( data.errcode == 0 ){
	            	if ( TIME > 0 ){
	            		restart();
	            	}else{
	            		page2();
	            	}
	            }else{
	                ns.tip(data.errmsg);
	            }
	        },
	        error:function(){
	        	ns.load();
	        	ns.ajaxLock = false;
	            ns.tip(check.ajaxError);
	        }
	    });
	}
	function getList(){
		if ( ns.ajaxLock ){
			return false;
		}
		ns.ajaxLock = true;
	    ns.load();
	    $.ajax({
	        url: check.ajaxUrl + "?xl_r="+Math.random().toFixed(3),
	        type: check.ajaxType,
	        dataType: check.ajaxDataType,
	        data: {
	            action : "queryList",
	            pageIndex : pageIndex,
	            pageSize : pageSize,
	        	active : active
	        },
	        success : function(data){
	            ns.load();
	            ns.ajaxLock = false;
	            //console.log(currPage);
	            console.log(data);
	            if ( data.errcode == 0 ){
	                var list = data.list,
	                    length = list.length,
	                    html = "";
	                if ( length > 0 ){
	                    pageIndex++;
	                    for (var i = 0; i < length; i++) {
	                        allSize++;
	                        html+='<li><span class="rank_num">' + allSize + '</span><span class="rank_name">' + list[i].name + '</span><span class="rank_score">' + (list[i].time ? formateTime(list[i].time) : 0) + '</span></li>';
	                    };
	                    $rankList.append(html);
	                }else{
	                    rankEnd = true;
	                }
	            }else{
	            	ns.tip(check.ajaxError);
	            }
	        },
	        error : function(){
	        	ns.load();
	            ns.ajaxLock = false;
	        	ns.tip(check.ajaxError);
	        }
	    });
	};
	function upload(){
		ns.tip("上传了！");
		return;
		if ( !enKey || !enIv ){
			return;
		}
		ns.load();
	    $.ajax({
	        url : check.ajaxUrl + "?xl_r="+Math.random().toFixed(3),
	        type : check.ajaxType,
	        dataType : check.ajaxDataType,
	        data : {
	            action: "addDetail",
	            active : active,
	            openid : openid,
	            time : SnowCry_en(TIME,enKey,enIv)
	        },
	        success : function(data){
	        	console.log(data);
	        	ns.ajaxLock = false;
	        	if ( data.errcode == 0 ){
	        		updateMyInfo();
	        	}
	        },
	        error:function(){
	            ns.tip(check.ajaxError);
	            ns.ajaxLock = false;
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
	        	ns.load();
	            if ( data.errcode == 0 ){
	                if ( TIME > 0 ){
	                    ns.tip("更新成功！");
	                }else{
	                    ns.tip("注册成功！",1000);
	                    $("#xl_dialog").remove();
	                    checkGame();
	                }
	                enKey = data.key;
	                enIv = data.iv;
	                if ( TIME > 0 ){
	                	$myScore.html(formateTime(data.time));
						$myRank.html(data.rank);
	                }
	                myBestScore = data.time || 0;
	                myBestRank = data.rank;
	                $myBestScore.html(formateTime(data.time) || 0);
					$myBestRank.html(myBestRank);
	                
	            }else{
	                ns.tip(data.errmsg);
	            }
	        },
	        error:function(){
	            ns.tip(check.ajaxError);
	        }
	    });
	};
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
    	checkGame();
    });
    $rank.scroll(function() {
        if ( !rankEnd && !ns.ajaxLock && ($rankList.height() - $rank.height() - $rank.scrollTop() < 20 ) ){
            getList();
        }
    });
    $close.on(click,function(){
    	$page.removeClass('current');
    	if ( TIME == 0 ){
    		$page1.addClass('current');
    	}else{
    		$page3.addClass('current');
    	}
    })
	$btn_start.on(click,checkReg);
	$adb_close.on(click,function(){
		$adb.hide(300);
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
});