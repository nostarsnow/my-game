$(function(){
    ns.load();
    var loadImgs = ns.loadImgs({
            sources : {
                bg : "bg.jpg",
                title : "title.png",
                tree : "tree.png",
                apple1 : "apple1.png",
                apple2 : "apple2.png",
                btn1 : "btn1.png",
                btn2 : "btn2.png",
                btn3 : "btn3.png"
            },
            dir : 'img/',
            progress : function(){
                ns.load(this.percent);
            },
            end : pageInit
        });
    var $main = $("#main"),
        $apple = $(".apple"),
        $myName = $("#myName"),
        $myTel = $("#myTel"),
        $treebox = $(".treebox"),
        $giftbox = $(".giftbox"),
        $shareBtn = $("#share"),
        $myGiftBtn = $("#mygift"),
        $mygift = $(".mygift"),
        $exchange = $(".exchange"),
        $close = $(".close"),
        $gift_name = $(".exchange .gift_name"),
        $pwd = $("#pwd"),
        $pwd_go = $("#pwd_go"),
        $gift = $("#gift"),
        $btn_goMyGift = $(".btn_goMyGift"),
        $btn_close = $(".btn_close"),
        appleNum = $apple.length,
        getMyGiftList = true,
        reged = false,
        gift = [],
        myName = '',
        myTel = '',
        lineInfo = '<div class="linebox"><div class="line line1"></div><div class="line line2"></div><div class="line line3"></div><div class="line line4"></div><div class="line line5"></div></div>';
    function getUserInfo(){
        var data = {
                action : "queryInfo",
                openid : openid,
                active : active
            },
            success = function(data){
                //console.log(data);
                if ( data.errcode == 0 ){
                    reged = true;
                    $myName.html(myName = data.name);
                    $myTel.html(myTel = data.tel);
                }
            };
        ns.ajax(data,success,false);
    };
    function getGiftList(){
        var data = {
                action : "queryGiftList",
                active : active
            },
            success = function(data){
                //console.log(data);
                if ( data.errcode == 0 ){
                    gift = data.list;
                }else{
                    getGiftList();
                }
            };
        ns.ajax(data,success,false)
    }
    function pageInit(){
        ns.loadHide();
        $main.show();
        //getUserInfo();
        //getGiftList();
    }
    function appleShow(){
        var appleShowArr = [];
        for (var i = 0; i < appleNum; i++) {
            appleShowArr[i] = i;
        };
        function appleShowRand(init){
            if ( init ){
                $apple.removeClass('show appleShake fall');
            }
            if ( appleShowArr.length > 0 ){
                var a = Math.floor(Math.random()*appleShowArr.length);
                $apple.eq(appleShowArr[a]).addClass('show');
                appleShowArr.splice(a,1);
            }else{
                $apple.addClass('ining');
                return false;
            }
            setTimeout(function(){
                appleShowRand();
            },150);
        };appleShowRand();
    };appleShow(true);
    function lineShow(){
        var $linebox = $(".linebox"),
            $line = $(".line"),
            lineNum = $line.length,
            lineShowCur = 0;
        function lineShowGo(){
            if ( lineShowCur > lineNum ){
                return false;
            }else if ( lineShowCur == lineNum ){
                $giftbox.show();
            }
            $line.eq(lineShowCur).addClass('show');
            lineShowCur++;
            setTimeout(lineShowGo,100);
        };lineShowGo();
    };
    function appleShakeAuto(){
        var $appleNow = $apple.not(".fall"),
            num = $appleNow.length,
            a = Math.floor(Math.random()*num);
        $appleNow.removeClass("appleShake").eq(a).addClass("appleShake");
    };
    var appleShakeAutoTimes = window.setInterval(appleShakeAuto,2500); 
    function reg(){
        ns.log({
            conType : "input",
            confirm : function(){
                if ( ns.ajaxLock ){
                    return false;
                }
                var name = $("#ns_dialog_name").val(),
                    tel = $("#ns_dialog_tel").val();
                if ( !ns.check.name (name) ){
                    return false;
                }
                if ( !ns.check.tel(tel) ){
                    return false;
                }
                ns.load();
                ns.ajaxLock = true;
                var data = {
                        action: "reg",
                        name : name,
                        active : active,
                        tel: tel,
                        openid : openid
                    },
                    _this = this,
                    success = function(data){
                        ns.loadHide();
                        ns.ajaxLock = false;
                        ns.tip(data.errmsg);
                        if( data && data.errcode == 0 ){
                            reged = true;
                            $myName.html(myName = name);
                            $myTel.html(myTel = tel);
                            _this.hide();
                        }
                    };
                ns.ajax(data,success);
            }
        });
    };
    function checkReg(){
        getApple();
        return;
        if ( reged ){
            getApple();
        }else{
            reg();
        }
    };
    function getApple(){
        if ( ns.ajaxLock ){
            return false;
        }
        setTimeout(function(){
            ns.ajaxLock = false;
        },2500);
        $(".fall").remove();
        var prise = "";
        ns.tip('获取成功！');
        prise = "恭喜您获得<br>礼物";
        getMyGiftList = true;
        $gift.html(prise);
        //clearInterval(appleShakeAutoTimes);
        var $apple = $(".apple"),
            a = Math.floor(Math.random()*$apple.length);
        $apple.eq(a).addClass("appleShake");
        setTimeout(function(){
            $apple.eq(a).addClass('fall').append(lineInfo);
            setTimeout(function(){
                lineShow();
            },700);
        },1500);
    };
    function getGift(){
        if ( ns.ajaxLock ){
            return false;
        }
        ns.load();
        ns.ajaxLock = true ;
        var data = {
                action: "queryDetailList",
                active : active,
                openid : openid
            },
            success = function(data){
                ns.loadHide();
                ns.ajaxLock = false;
                if( data && data.errcode == 0 ){
                    getMyGiftList = false;
                    var list = data.list,
                        length = list.length,
                        html = "",
                        btn = "",
                        hadGift = 0;
                    if ( length > 0 ){
                        for (var i = 0; i < length; i++) {
                            if ( list[i].gift != 0 ){
                                hadGift = 1;
                                if ( list[i].exchange == '1' ){
                                    btn = '<span class="gift_btn">已兑换</span>';
                                }else{
                                    btn = '<span class="gift_btn gift_btn_show"><img src="img/a3.png"></span>';
                                }
                                html+= '<li data-id="' + list[i].oid + '">' +
                                            '<span class="gift_name to_e">' + gift[list[i].gift]["name"] + '</span>' +
                                            btn +
                                        '</li>';
                            }
                        };
                        if ( hadGift == 0 ){
                            html += '<li class="t_c">您还没有中奖呢！继续努力吧！</li>';
                        }
                    }else{
                        html+='<li class="t_c">您还没有中奖呢！继续努力吧！</li>';
                    }
                    $mygift.show().find('ul').html(html);
                }
            }
        ns.ajax(data,success);
    }
    function giftExchange(id){
        var $li = $(this),
            pwd = $pwd.val();
        if ( ns.check.empty(pwd,"请输入兑换密码！") ){
            return false;
        };
        if ( ns.ajaxLock ){
            return false;
        }
        ns.load();
        ns.ajaxLock = true;
        var data = {
                action: "giftExchange",
                oid : id,
                active : active,
                pwd : pwd
            },
            success = function(data){
                ns.loadHide();
                ns.ajaxLock = false;
                ns.tip(data.errmsg);
                if( data.errcode == 0 ){
                    $exchange.hide();
                    $li.append('<span class="gift_btn">已兑换</span>').find('.gift_btn_show').remove();
                }
            };
        ns.ajax(data,success);
    }
    $treebox.on(click,checkReg);
    ns.shake(checkReg);
    $btn_close.on(click,function(){
        $giftbox.hide();
    });
    $btn_goMyGift.on(click,function(){
        $giftbox.hide();
        $myGiftBtn.trigger(click)
    });
    $myGiftBtn.on(click,function(){
        if ( reged ){
            if ( getMyGiftList ){
                getGift();
            }else{
                $mygift.show();
            }
        }else{
            reg();
        }
    });
    $mygift.on(click, ".gift_btn_show" ,function() {
        var $t = $(this),
            $li = $(this).parents("li")
            id = $li.data("id"),
            name = $li.find(".gift_name").html();
        $exchange.show().find('.gift_name').html(name);
        $pwd_go.on(click,function(){
            giftExchange.call($li,id);
        });
    });
    $close.on(click, function() {
        var par = $(this).parents(".box_cl");
        par.hide();
        if ( par.hasClass('mygift') ){
            getAppleTimes = 0;
        }
    });
    ns.addShare('#share');
})