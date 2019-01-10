var loader = [],
	$main = $("#main"),
	$title = $("#title"),
	$show = $("#show"),
	$time = $("#time"),
	$score = $("#score"),
	$lavetime = $("#lavetime"),
	$xl_loading = $("#xl_loading"),
	$xl_loading_p = $("#xl_loading_p"),
	$game = $(".game"),
	$myScore = $("#myScore"),
	$myResultShow = $(".myResultShow"),
	$scoreShow = $("#scoreShow"),
	$timeShow = $("#timeShow"),
	$rank = $(".rank"),
	$rankList = $rank.find("ul"),
    loadImage = function(sources,callback){
        var loadedImages = 0;    
        var numImages = sources.length;
        for (var i = 0; i < numImages; i++) {
			loader[i] = new Image();
            loader[i].src = sources[i][1];
            loader[i].onload = function(){ 
            	$xl_loading_p.html((loadedImages/numImages*100).toFixed(2) + "%");
                if (++loadedImages >= numImages) {  
                    callback();
                }
            };
            loader[i].name = sources[i][0];
        };
    };
window.onload = function(){
    var sources = getLogos();
    sources.push(["num0","img/num0.png"]);
    sources.push(["num1","img/num1.png"]);
    sources.push(["num2","img/num2.png"]);
    sources.push(["num3","img/num3.png"]);
    loadImage(sources,loaded);
};
function getLogos(){
	return [
	    ['Google', 'img/google.png'],
	    ['苹果', 'img/apple.png'],
	    ['三星', 'img/samsung.png'],
	    ['QQ', 'img/qq.png'],
	    ['微信', 'img/weixin.png'],
	    ['中国移动', 'img/cmcc.png'],
	    ['百度', 'img/baidu.png'],
	    ['新浪微博', 'img/weibo.png'],
	    ['微软', 'img/microsoft.png'],
	    ['联想', 'img/lianxiang.png'],
	    ['中国联通', 'img/liantong.png'],
	    ['中国工商银行', 'img/gonghang.png'],
	    ['LG', 'img/lg.png'],
	    ['红牛', 'img/hongniu.png'],
	    ['沃尔玛', 'img/woerma.png'],
	    ['麦当劳', 'img/maidanglao.png'],
	    ['肯德基', 'img/kendeji.png'],
	    ['中国石油', 'img/shiyou.png'],
	    ['DELL', 'img/dell.png'],
	    ['HP', 'img/hp.png']
	];
};
$("#rank").on(click,function(){
  ns.tip('暂无排名！')
	/*isAjax = false;
	$(".titleShow").html("游戏排行");
	$myResultShow.hide();
	$game.hide();
	$myScore.show();
	$rank.show();
	$(this).unbind(click);
	getList();*/
});
$rankList.scroll(function(event) {
    if ( !end && (isAjax == false) && ($rankList.height() - $rank.height() - $rankList.scrollTop() < 20 ) ){
        isAjax = true;
        getList();
    }
});
function loaded() {
	$xl_loading_p.html("100%");
	$main.css('display', 'block');
	$xl_loading.removeClass('xl_loding_show');
	ns.loadHide();
	logos = getLogos();
	W = $main.width();
	num = 0;
	score = 0;
	allTimes = 60; 
	times = 60;
	laveTime = 4;
	length = loader.length-4;
	chooseLock = false;
	wrongTxt = ["你不是在开玩笑吧？","你逗呢吧？","你太不细心了！"];
	function timeAction(){
		$time.html(times);
		if ( --times < 0 ){
			gameOver();
		}
	}
	function laveTimeAction(){
		$lavetime.show();
		if ( --laveTime < 0 ){
			$lavetime.hide();
			startTime = new Date().getTime();
			init();
			timesGo = setInterval(timeAction,1000);
			timeAction();
			clearInterval(laveTimeGo);
			return;
		}
		$lavetime.html('<img src="img/num' + laveTime + '.png"/>');
	}
	function checkTimes(){
		laveTimeGo = setInterval(laveTimeAction,1000);
		laveTimeAction();
		return;
	    ns.load();
	    ns.ajax({
          action: "checkTimes",
          active : active,
          openid : openid
      },function(data){
          console.log(data);
          if ( data.errcode == 0 ){
              laveTimeGo = setInterval(laveTimeAction,1000);
            laveTimeAction();
          }else{
              alert(data.errmsg);
              $("#rank").trigger(click);
          }
          ns.loadHide();
	    });
	};checkTimes();
}
function init(){
  this.hide && this.hide();
	chooseLock = false;
  $score.html(score);
	if ( ++num > length ){
		gameOver(true);
		return;
	}
	//console.log(num);
	var n = Math.floor(Math.random()*logos.length),
		logo = logos[n],
		H = logo.height*W/logo.width,
		html = "",
		random = [1,2,3,4];
	html += '<img src="' + logo[1] + '" />';
	for (var i = 0; i < 4; i++) {
		var r = random.splice(Math.floor(Math.random()*random.length),1),
			p = "";
		if ( r == 1 ){
			p = 0 + "px " + 0 + "px";
		}else if ( r == 2 ){
			p = -W*0.5 + "px " + 0 + "px";
		}else if ( r == 3 ){
			p = 0 + "px " + -W*0.5 + "px";
		}else if ( r == 4 ){
			p = -W*0.5 + "px " + -W*0.5 + "px";
		}
		html += '<div class="s s' + (i+1) + '" data-name="' + logo[0] + '" data-id="' + r + '" style="height:' + W*0.5 + 'px;background-image:url(' + logo[1] + ');background-size:' + W + "px " + W + 'px;background-position:' + p + '"></div>';
	};
	$show.html(html);
	logos.splice(n,1);
}
$show.on(click,".s",function(){
	if ( chooseLock ){
		return;
	}
	chooseLock = true;
	var $t = $(this),
		id = $t.data("id"),
		name = $t.data("name"),
		rand = Math.floor(Math.random()*3);
	var right = "答对了，你太棒了！";
	var wrong = wrongTxt[rand] + name + "的标志都不知道！</span>";
	if ( name == "中国石油" ){
		right = "答对了，爱岗爱司小能手！";
		wrong = "小团不开心，你不爱我们。";
	}	
	if ( id == 1 ){
		score+=5;
		ns.log({
			title : '<span class="t_green">' + right + '</span>',
      btn_confirm : "继续挑战",
      confirm : init
		});
	}else{
		ns.log({
			title : '<span class="t_red">' + wrong + '</span>',
			btn_confirm : "继续挑战",
      confirm : init
		});
	}
});
function gameOver(type){
  ns.log.hide()
	$show.unbind(click);
	clearInterval(timesGo);
	if ( type ){
		endTime = new Date().getTime();
		var timeUsed = ((endTime - startTime)/1000).toFixed(2);
	}else{
		var timeUsed = (allTimes-times-1).toFixed(2);
	};
	window.share.title=myName + "" + timeUsed + "秒认出" + score/5 + "个品牌logo，得分" + score + "。你能认出多少个？";
	/*if ( score > myBestScore ){
		upload(timeUsed);
	}else if ( score >= myBestScore && myBestTime > 0 && timeUsed < myBestTime ){
		upload(timeUsed);
  }*/
	$scoreShow.html(score);
	$timeShow.html(timeUsed);
	$myResultShow.show();
	setTimeout(function(){
		$game.hide();
		$myScore.show();
	},300);
};
var currPage = 1,
    pageSize = 10,
    allSize = 0,
    end = 0,
    isAjax = true;
function getList(){
    ns.load();
    $.ajax({
        url: 'conn/ajax.php?xl_r='+Math.random(),
        type: 'POST',
        dataType: 'json',
        data: {
            action : "queryList",
            currPage : currPage,
            pageSize : pageSize,
            tabName : "activeUser",
            showColumn : "*",
            strCondition : " activeId='" + active + "'",
            ascColumn : "convert(DECIMAL,score) DESC,CONVERT (DECIMAL, time) ASC,updateScoreTime asc",
            pkColumn : "id"
        },
        success : function(data){
            ns.loadHide();
            //console.log(currPage);
            console.log(data);
            if ( data.errcode == 0 ){
            	if ( currPage == 1 ){
            		setTimeout(function(){
            			$("#rank").attr("href","index.php").html('<img src="img/btn_reset.png"/>');
            		},1000);
            	}
                isAjax = false;
                var list = data.list,
                    length = list.length,
                    html = "";
                if ( length > 0 ){
                    currPage++;
                    for (var i = 0; i < length; i++) {
                        allSize++;
                        html+='<li><span class="num">' + allSize + '</span><span class="name">' + list[i].name + '</span><span class="score">' + (list[i].score||0) + '</span><span class="stime">' + (list[i].time||0) + '</span></li>';
                    };
                    $rankList.append(html);
                }else{
                    end = 1;
                }
            }
        }
    });
};
function upload(time){
	ns.load();
    $.ajax({
        url : check.ajaxUrl + "?rand="+Math.random(),
        type : check.ajaxType,
        dataType : check.ajaxDataType,
        data : {
            action: "addDetail",
            active : active,
            openid : openid,
            score : score,
            time : time
        },
        success : function(data){
        	console.log(data);
            ns.loadHide();
        },
        error:function(){
            $tip(check.ajaxError);
            ajaxLock = 0;
        }
    });
}