$(function(){
var loader = [],
    loadImage = function(sources,callback){
        var loadedImages = 0;    
        var numImages = 0;  
        for (var src in sources) {    
            numImages++;    
        };
        for (var src in sources) {
            /*if ( /.mp3/.test( sources[src] ) ){
                loader[src] = new Audio();
                loader[src].src = sources[src];
                loader[src].load();
                $xl_loading_p.html((loadedImages/numImages*100).toFixed(2) + "%");
                if (++loadedImages >= numImages) {  
                    callback();    
                }
                ++loadedImages;
                $xl_loading_p.html((loadedImages/numImages*100).toFixed(2) + "%");
                continue;
            }*/
            loader[src] = new Image();
            loader[src].onload = function(){ 
                $xl_loading_p.html((loadedImages/numImages*100).toFixed(2) + "%");
                if (++loadedImages >= numImages) {  
                    callback();
                }
            };
            loader[src].src = sources[src];
        } 
    },
    $xl_loading_p = $("#xl_loading_p"), 
    $xl_loading = $("#xl_loading");
    (function(){
        sources = {
            bg : "img/bg.jpg",
            bg1 : "img/bg1.jpg",
            t1 : "img/t1.png",
            t2 : "img/t2.png",
            h1 : "img/h1.png",
            h2 : "img/h2.png",
            man1_1 : "img/man1_1.png",
            man1_2 : "img/man1_2.png",
            man2_1 : "img/man2_1.png",
            man2_2 : "img/man2_2.png",
            tbg : "img/tbg.png",
            tbg1 : "img/tbg1.png",
            redbag : "img/redbag.png"
        };
        loadImage(sources,function(){
            $xl_loading_p.html("100%");
            $xl_loading.removeClass('xl_loding_show');
            ns.loadHide();
            $xl_loading_p.html("Loading...");
            $page1.addClass('current');
        });
    }());
    ns.load();
    var $main = $("#main"),
        $page = $(".page"),
        $page1 = $(".page1"),
        $page2 = $(".page2"),
        $page3 = $(".page3"),
        $page4 = $(".page4"),
        $page5 = $(".page5"),
        $page6 = $(".page6"),
        $btn_action = $("#btn_action"),
        $man0 = $("#man0"),
        $man1 = $("#man1"),
        $man2 = $("#man2"),
        $hand = $(".hand"),
        $btn_hit1 = $("#btn_hit1"),
        $btn_hit2 = $("#btn_hit2"),
        $txt = $("#txt"),
        $btn_again = $("#btn_again"),
        $btn_end = $("#btn_end"),
        $btn_rule = $("#btn_rule"),
        $btn_go = $("#btn_go"),
        $btn_back = $("#btn_back"),
        $btn_restart = $("#btn_restart"),
        $btn_map = $("#btn_map"),
        $redbag = $(".redbag"),
        $redbagNum = $("#redbag"),
        $info = $("#info"),
        $stxt = $("#stxt"),
        $stbox = $(".stbox"),
        SMTIME = 1500,
        clickTimes = 0,
        noPro = 1,
        canShake = false,
        txt,getTxt,noTxt;
    function init(){
        clickTimes = 0;
        txt = [
            '少侠好功夫！不过我是不会告诉你我们的基地是在银基——哦不，横店影视城的！',
            '好吧，别打了，我说我说……我听说银基王朝现有限时特价房，阔绰现房，新品加推，所以我就……',
            '呵呵，傻了吧。连我都知道银基王朝独享60亩法式园林，700米中央景观主轴，120米豪阔楼间距。疏密有致、通透开朗，营造出精致的中心园林景观。不仅地段好，豪宅也好，你说我来郑州干啥？',
            '童鞋，你难道不知道9月3号全国放假么？审判事小，粗来玩耍事大啊！能说的我都已经说了，要不就把我放了呗？'
        ];
        noTxt = [
            '来来来，这酸爽！再往上边打打！',
            '你是不是没吃饭啊！再用力啊！',
            '感谢各位大哥大姐！终于治好了我多年欠揍的坏毛病！',
            '生存还是毁灭？这是个力道的问题……',
            '你再怎么做我也不会说的！休想从我这里得到军事机密！',
            '那，打人呢，最重要的就是开心啦，累不累？要不要我下面给你吃？',
            '呦呵，手撕日本兵、裤裆揣手雷我都经历过，就凭这点本事，你是在给我挠痒吗？'
        ];
        getTxt = [
            '少侠好功夫！不过我是不会告诉你我们的基地是在银基——哦不，横店影视城的！',
            '好吧，别打了，我说我说……我听说银基王朝现有限时特价房，阔绰现房，新品加推，所以我就……',
            '呵呵，傻了吧。连我都知道银基王朝独享60亩法式园林，700米中央景观主轴，120米豪阔楼间距。疏密有致、通透开朗，营造出精致的中心园林景观。不仅地段好，豪宅也好，你说我来郑州干啥？',
            '童鞋，你难道不知道9月3号全国放假么？审判事小，粗来玩耍事大啊！能说的我都已经说了，要不就把我放了呗？'
        ];
        var assetsPath = "./img/";
        var sounds = [
            //{src: "torture.mp3", id: "bg"},
            {src: "btn.mp3", id: "btn"},
            {src: "hit1.mp3", id: "hit1"},
            {src: "hit2.mp3", id: "hit2"}
        ];
        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.addEventListener("fileload",createjs.proxy(soundLoaded, this))
        createjs.Sound.registerSounds(sounds,assetsPath);
    };
    function soundLoaded(){
        playSound("bg",-1);
    };
    function playSound(mp3,times) {
        times = times || 0;
        var instance = createjs.Sound.play(mp3,{loop:times});
    };
    function printTxt(obj,txt,speed,callback){ //打印文字
        var box = $(obj),
            speed = speed || 100,
            txt = txt || $(obj).html(),
            length = txt.length,
            charIndex = 0;
            function printS(init){
                if ( init ){
                    box.empty();
                }
                var thisChar = txt.charAt(charIndex),
                    next4Chars = txt.substr(charIndex,4);
                if(next4Chars=='<BR>' || next4Chars=='<br>'){
                    thisChar  = '<br>';
                    charIndex+=3;
                }
                charIndex++;
                box.append(thisChar);
                if(charIndex < length){
                    setTimeout(function(){
                        printS(false);
                    },speed);
                }else{
                    callback(true);
                }
            };
            printS(true);
    };
    function txtShow(){
        //console.log(clickTimes)
        if ( clickTimes >= 3 ){
            clickTimes = 0;
            ns.ajaxLock = true;
            $txt.empty();
            $stxt.empty();
            var s = Math.random();
            if ( s < noPro ){
                $stbox.show();
                noPro = 0.3;
                setTimeout(function(){
                    printTxt("#stxt",noTxt[Math.floor(s*noTxt.length)],50,function(){
                        ns.ajaxLock = false;
                    });
                },500);
                return;
            }
            var r = Math.floor(Math.random()*txt.length);
            $page.removeClass('current');
            $page3.addClass('current');
            setTimeout(function(){
                printTxt("#txt",txt[r],30,function(){
                    ns.ajaxLock = false;
                });
                //getTxt.push(txt[r]);
                txt.splice(r,1);
            },1000);
        }else{
            return false;
        }
    };
    $btn_go.on(click,function(){
        playSound("btn");
        $redbag.show(300);
        ns.tip("点击【去前线】，即可获得领奖地址哟！",5000);
    });
    $btn_action.on(click,function(){
        playSound("btn");
        $page.removeClass('current');
        $page2.addClass('current');
    });
    $btn_hit1.on(click,function(){
        if ( ns.ajaxLock ){
            ns.tip('正在审问中。。。');
            return;
        }
        $hand.hide(100);
        $stbox.hide();
        playSound("hit1",2);
        clickTimes++;
        $man0.addClass('v_h');
        $man1.show();
        ns.ajaxLock = true;
        setTimeout(function(){
            $man1.hide();
            $man0.removeClass('v_h');
            ns.ajaxLock = false;
            txtShow();
        },SMTIME);
    });
    $btn_hit2.on(click,function(){
        if ( ns.ajaxLock ){
            ns.tip('正在审问中。。。');
            return;
        }
        $hand.hide(100);
        $stbox.hide();
        playSound("hit2",3);
        clickTimes++;
        $man0.addClass('v_h');
        $man2.show();
        ns.ajaxLock = true;
        setTimeout(function(){
            $man2.hide();
            $man0.removeClass('v_h');
            ns.ajaxLock = false;
            txtShow();
        },SMTIME);
    });
    $btn_again.on(click,function(){
        playSound("btn");
        if ( ns.ajaxLock ){
            return;
        }
        if ( txt.length == 0 ){
            ns.tip("你已经折磨了Ta这么久了，是时候住手了吧！");
            return;
        }
        $page.removeClass('current');
        $page2.addClass('current');
        clickTimes = 0;
    });
    $btn_end.on(click,function(){
        playSound("btn");
        if ( ns.ajaxLock ){
            return;
        }
        canShake = true;
        for (var i = 0,length = getTxt.length,html=''; i < length; i++) {
            html += '<li><span class="num">' + (i+1) + '、</span>' + getTxt[i] + '</li>';
        };
        //html = html.replace(/(郑东核心腹地)|(高效便捷)|(精装奢适)|(国际化的物业服务标准)|(财富增值保障)/g,'<span class="bold">$&</span>');
        $info.html(html);
        $page.removeClass('current');
        $page4.addClass('current');
    });
    $btn_rule.on(click,function(){
        playSound("btn");
    });
    $redbag.on(click,function(){
        $redbag.hide(300);
    });
    init();
});