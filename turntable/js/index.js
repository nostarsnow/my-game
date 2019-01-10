    var loadImgs = [],
        loadImage = function(sources,callback){
            var loadedImages = 0;    
            var numImages = 0;  
            for (var src in sources) {    
                numImages++;    
            }    
            for (var src in sources) {    
                loadImgs[src] = new Image(); 
                loadImgs[src].onload = function(){ 
                    if (++loadedImages >= numImages) { 
                        callback();    
                    }    
                };  
                loadImgs[src].src = sources[src];    
            } 
        };
    window.onload = function(){
        var sources = {
            bg : "img/bg.jpg",
            title : "img/turn_bg.png",
            watch : "img/turn_btn.png"
        };
        loadImage(sources,function(){
            $("#xl_loading").removeClass('xl_loding_show');
            load_h();
            $("#main").show();
        });
    };
$(function(){
    var $turn_btn = $(".turn_btn"),
        $turn_bg = $(".turn_bg"),
        $shareBtn = $("#share"),
        $shareover = $(".shareover"),
        $myGiftBtn = $("#mygift"),
        $mygift = $(".mygift"),
        $close = $(".close"),
        $myGiftList = $("#myGiftList"),
        $rankList = $("#rankList"),
        ajaxLock = 0,
        turnGoing = false,
        totalAngle = 0,
        getMyGiftList = 0,
        getGift = 0,
        getGiftInfo = '',
        gift = {
            0 : [
                {
                    name : '谢谢！继续努力！',
                    center : 300
                }
            ],
            g0 : [
                {
                    name : 'Apple6 plus',
                    center : 0
                }
            ],
            g1 : [
                {
                    name : '方特门票',
                    center : 180
                }
            ],
            g2 : [
                {
                    name : '绿博园门票',
                    center : 120
                }
            ],
            g3 : [
                {
                    name : '精美抽纸',
                    center : 240
                },
                {
                    name : '精美抽纸',
                    center : 60
                },
            ]
        },
        giftList = ['g0','g1','g2','g3'];
    //console.log(gift);
    function reg(){
        $log({
            title : "快参与活动赢取大奖吧！",
            con : '<div class="tip">请输入您的真实姓名和手机号！</div><label class="in_ic40"><span class="l"><i class="fa fa-user"></i></span><span class="r"><input type="text" placeholder="请输入姓名" id="name" name="name" maxlength="12"/></span></label><label class="in_ic40"><span class="l"><i class="fa fa-mobile"></i></span><span class="r"><input type="tel" placeholder="请输入手机号码" id="tel" name="tel" maxlength="11"/></span></label>',
            go : sendMes
        });
    };
    function sendMes(){
        var name = $("#name").val(),
            tel = $("#tel").val();
        if ( !check.name (name) ){
            return false;
        }
        if ( !check.tel(tel) ){
            return false;
        }
        load();
        $.ajax({
            url : check.ajaxUrl + "?rand="+Math.random(),
            type : check.ajaxType,
            dataType : check.ajaxDataType,
            data : {
                action: "reg",
                name : name,
                active : active,
                tel: tel,
                score : 0,
                openid : openid
            },
            success : function(data){
                if( data.errcode == 0 ){
                    $tip("注册成功！");
                    myName = name;
                    myTel = tel;
                    $(".myName").html(myName);
                    $(".myTel").html(myTel);
                    reged = 1;
                    $("#xl_dialog").remove();
                }else{
                    $tip(data.errmsg);
                }
                load_h();
            },
            error:function(){
                $tip(check.ajaxError);
            }
        });
    };
    function btn_go(rounds,times){
        if ( turnGoing ){
            return false;
        }
        if ( ajaxLock == 1 ){
            return;
        }
        turnGoing = true;
        ajaxLock = 1 ;
        var reset = 'rotate(' + (totalAngle%360) + 'deg)';
        $turn_bg.removeAttr('style').attr('style','transform: ' + reset + '; -webkit-transform: ' + reset + ';');
        load();
        $.ajax({
            url : check.ajaxUrl + "?rand="+Math.random(),
            type : check.ajaxType,
            dataType : check.ajaxDataType,
            data : {
                action: "addDetail",
                name : myName,
                active : active,
                tel: myTel,
                openid : openid,
                giftProbability : giftProbability
            },
            success : function(data){
                setTimeout(function(){
                    ajaxLock = 0;
                },1000);
                console.log(data);
                if( data.errcode == 0 ){
                    getGift = data.gift;
                    rounds = rounds || 10;
                    times = times || 5;
                    //var getGift = giftList[Math.floor(Math.random() * giftList.length)];
                    getGiftInfo = gift[getGift][Math.floor(Math.random() * gift[getGift].length)];
                    //console.log(getGiftInfo);
                    appendGift();
                    turnGoing = true;
                    totalAngle = 360 * rounds + getGiftInfo.center;
                    var rotate = 'rotate(' + totalAngle + 'deg)',
                        transition = 'all ease ' + times + 's';
                    $turn_bg.attr('style','transform: ' + rotate + '; -webkit-transform: ' + rotate + '; transition: ' + transition + '; -webkit-transition: ' + transition + ';');
                    setTimeout(function(){
                        turnGoing = false;
                        prizeShow(getGiftInfo,data.gift);
                    },times*1000);
                }else{
                    turnGoing = false;
                    $tip(data.errmsg);
                }
                load_h();
            },
            error:function(){
                $tip(check.ajaxError);
                ajaxLock = 0;
            }
        });
    }
    function prizeShow(getGiftInfo,rand) { //奖品展示
        var hasPrise;
        if ( rand == 0 ){
            hasPrise = "很遗憾，这次没有中奖，继续努力吧！";
        }else{
            hasPrise = "恭喜您，获得：<span class='t_green'>" + getGiftInfo.name + " </span>";
        }
        $log({
            btn1 : '我的奖品',
            con : '<div class="t_lh2r t_c"><p>' + hasPrise + '</p></div>'
        },function(r){
            if ( !r ){
                $myGiftBtn.trigger(click);
            }
        });
    }
    function checkReg(){
        if ( reged == 1 ){
            btn_go();
        }else{
            reg();
        }
    };
    function appendGift(){
        if ( getGift != 0 ){
            var html,
                MyGiftLength = $mygift.find("li").length;
            if ( MyGiftLength > 0 ){
                if ( $mygift.find(".noGift").length < 1 ){
                    html = '<li><span class="gift_name">奖品' + (MyGiftLength+1) + '：' + getGiftInfo.name + '</span><span class="gift_btn gift_btn_show">兑换</span></li>';
                    $myGiftList.append(html);
                }else{
                    html = '<li><span class="gift_name">奖品' + 1 + '：' + getGiftInfo.name + '</span><span class="gift_btn gift_btn_show">兑换</span></li>';
                    $myGiftList.html(html);
                }
            }
        }
    }
    $myGiftBtn.on(click,function(){
        if ( turnGoing ){
            return false;
        }
        if ( reged == 1 ){
            getAppleTimes = 1;
            if ( getMyGiftList == 0 ){
                if ( ajaxLock == 1 ){
                    return;
                }
                ajaxLock = 1 ;
                load();
                $.ajax({
                    url : check.ajaxUrl + "?rand="+Math.random(),
                    type : check.ajaxType,
                    dataType : check.ajaxDataType,
                    data : {
                        action: "queryDetailList",
                        active : active,
                        openid : openid
                    },
                    success : function(data){
                        ajaxLock = 0;
                        //console.log(data);
                        if( data.errcode == 0 ){
                            getMyGiftList = 1;
                            var list = data.list,
                                length = list.length,
                                html = "",
                                btn = "",
                                hadGift = 0,
                                giftListNum = 0;
                            if ( length > 0 ){
                                for (var i = 0; i < length; i++) {
                                    if ( list[i].gift != 0 ){
                                        giftListNum++;
                                        hadGift = 1;
                                        if ( list[i].exchange == 1 ){
                                            btn = '<span class="gift_btn no">已兑换</span>'
                                        }else{
                                            btn = '<span class="gift_btn gift_btn_show">兑换</span>';
                                        }
                                        html+= '<li data-id="' + list[i].oid + '">奖品' + (giftListNum) + '：<span class="gift_name">' + gift[list[i].gift][0]["name"] + '</span>' + btn + '</li>';
                                    }
                                };
                                if ( hadGift == 0 ){
                                    html+='<li class="t_c noGift">您还没有中奖呢！继续努力吧！</li>';
                                }
                            }else{
                                html+='<li class="t_c noGift">您还没有中奖呢！继续努力吧！</li>';
                            }
                            $myGiftList.html(html);
                            $mygift.show(300);
                        }
                        load_h();
                    },
                    error:function(){
                        $tip(check.ajaxError);
                        ajaxLock = 0;
                    }
                });
                $.ajax({
                    url : check.ajaxUrl + "?rand="+Math.random(),
                    type : check.ajaxType,
                    dataType : check.ajaxDataType,
                    data : {
                        action: "getActiveUserGiftList",
                        active : active
                    },
                    success : function(data){
                        ajaxLock = 0;
                        console.log(data);
                        if( data.errcode == 0 ){
                            var list = data.list,
                                length = list.length,
                                html = "",
                                giftListNum = 0;
                            if ( length > 0 ){
                                for (var i = 0; i < length; i++) {
                                    giftListNum++;
                                    html+= '<li><span class="rank_num">' + (giftListNum) + '</span><span class="rank_name">' + list[i].name + '</span><span class="gift_name">' + gift[list[i].gift][0]["name"] + '</span></li>';
                                };
                            }
                            $rankList.html(html);
                        }
                        load_h();
                    },
                    error:function(){
                        $tip(check.ajaxError);
                    }
                });
            }else{
                $mygift.show(300);
            }
            window.scrollTo(0,0);
        }else{
            reg();
        }
    });
    $(".gift_box_con").on(click,".gift_btn_show",function () {
        var $t = $(this),
            id = $t.parent().data("id");
        if ( $t.hasClass('no') ){
            return false;
        }
        var pwd = prompt("请输入兑换密码！" + " - " + $t.siblings(".gift_name").html());
        if ( pwd != "" && pwd != null ){
            if ( ajaxLock == 1 ){
                return;
            }
            ajaxLock = 1 ;
            load();
            //console.log(id);
            $.ajax({
                url : check.ajaxUrl + "?rand="+Math.random(),
                type : check.ajaxType,
                dataType : check.ajaxDataType,
                data : {
                    action: "giftExchange",
                    oid : id,
                    active : active,
                    pwd : pwd
                },
                success : function(data){
                    ajaxLock = 0;
                    //console.log(data);
                    if( data.errcode == 0 ){
                        $tip(data.errmsg);
                        $t.html("已兑换").addClass('no').removeClass('gift_btn_show');
                    }else{
                        $tip(data.errmsg);
                    }
                    load_h();
                },
                error:function(){
                    ajaxLock = 0;
                    $tip(check.ajaxError);
                }
            });
        }else{
            $tip("请输入兑换密码！");
            return false;
        };
    });
    $turn_btn.on(click,checkReg);
    $shareBtn.on(click, function(){
        $shareover.show(300);
    });
    $shareover.on(click, function(){
        $shareover.hide(300);
    });
    $close.on(click, function() {
        $mygift.hide(300);
    });
})