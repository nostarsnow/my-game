(function($,window,undefined){
    "use strict";
    var nostar = {},
      	$body = nostar.body = $("body"),
      	div = "<div>",
      	button = "<button>",
      	userAgent = navigator.userAgent,
        _function = Function,
        _array = Array,
        _object = Object,
        _string = String,
        _number = Number,
      	isMobile = nostar.isMobile = (function(){
      		return userAgent.match(/.*Mobile.*/) ? true : false;
      	}()),
      	click = nostar.click = window.click = isMobile ? "tap": "click",
        fix = nostar.fix = function(str,num,isStr){
            num = num || 2;
            if ( isNaN(str) ){
                return str;
            }
            if ( isStr ){
                return Number(str).toFixed(num);
            }else{
                return Number(Number(str).toFixed(num));
            }
        },
        pad = nostar.pad = function(n) {
            return (n < 10 ? '0' : '') + n;
        };
        nostar.int = parseInt;
    /**
     * 显示页面提示 
     * exp : 
     * $.ns.tip('提示文字',3000,300,300);
     * 
     * @param  {string} txt      提示文字
     * @param  {number} time     停留时间。毫秒
     * @param  {number} showTime 显示动画时间。毫秒
     * @param  {number} hideTime 隐藏动画时间。毫秒
     * @return {element} 提示元素
     */
    nostar.tip = function(txt,time,showTime,hideTime){
    	  var tip = nostar.tip;
    	     time = time || 3000;
    	     showTime = showTime || 0;
  	       hideTime = hideTime || 300;
      	if ( tip.el === undefined || tip.txt === undefined ){
      			tip.el = $(div).attr('id','ns_alert').appendTo($body),
      			tip.txt = $(div).attr('id','ns_alert_txt').appendTo(tip.el);
      			tip.show = function(txt){
        				clearTimeout(tip.setTimeout),
        				tip.txt.html(txt);
        				tip.el.removeAttr("style").fadeIn(showTime,function(){
                    tip.setTimeout = setTimeout(tip.hide,time);
                });
                return tip.el;
      			};
      			tip.hide = function(){
      				  tip.el.fadeOut(hideTime,function(){
                    clearTimeout(tip.setTimeout)
                });
      			};
  	    	  tip.el.on(click,tip.hide);
  	    }
        return tip.show(txt);
    };

    /**
     * 加载动画
     * exp:
     * $.ns.load('loading...');
     * $.ns.loadHide();
     * 
     * @param  {string} txt 加载动画下的文字
     * @return {element}     加载动画的元素
     */
    nostar.load = function(txt){
    	var lo = nostar.load;
		txt = txt || 'loading...';
		if ( lo.el === undefined ){
			lo.el = $(div).attr('id','ns_loading').appendTo($body);
			lo.icon = $(div).attr('id','ns_loading_i').appendTo(lo.el);
			lo.txt = $(div).attr('id','ns_loading_p').appendTo(lo.el);
		}
		lo.txt.html(txt);
		return lo.el.show();
    }
    nostar.loadHide = function(){
    	if ( nostar.load.el === undefined ){
    		$("#ns_loading").hide();
    	}else{
    		nostar.load.el.hide();
    	}
        return nostar.load.el;
    }

    /**
     * dialog提示框
     * exp:
     * $.ns.log({
     *     title : '温馨提示',
     *     con : 'Hello word！'
     * })
     * 
     * @param {object} opts 显示配置对象
     * @param {string} title 显示标题。默认为'温馨提示'
     * @param {string} con 显示内容
     * @param {string} conType 显示内容类型。比如'input'。注册
     * @param {array} conInput 当conType设置为'input'的时候。配置参数
     *        默认数组值为 'name'表示内置姓名输入框。'tel'表示内置手机输入框
     *        对象格式为{
                            icon : 'user', //fa的图标
                            type : 'text', //input的类型
                            txt : '请输入姓名', //placeholder
                            id : 'ns_dialog_name', //input的ID
                            length : 12 // input最大长度
                        }
     * @param {string} btn_cancel 取消按钮的文字
     * @param {string} btn_confirm 确定按钮的文字
     * @param {function} cancel 点击取消按钮触发事件。默认隐藏
     * @param {function} confirm 点击确定按钮触发事件。默认不隐藏。this.hide()隐藏
     * @param {number} hideTime 隐藏动画的时间。毫秒
     * @return {undefined} undefined
     */
    nostar.log = function(opts){
    	var log = nostar.log,
    		con = opts.con;
    	opts = $.extend({
    		title : '温馨提示',
    		con : '',
    		conType : '',
            conInput : undefined,
    		type : 'alert',
    		btn_cancel : '取消',
    		btn_confirm : '确定',
            hideTime : 300,
    	},opts);
    	if ( log.el === undefined ){
    		log.el = $(div).attr('id','ns_dialog').addClass('ns_dialog').appendTo($body);
    		log.inner = $(div).addClass('ns_dialog_inner anim_smalljump').appendTo(log.el);
    		log.title = $(div).addClass('ns_dialog_header').appendTo(log.inner);
    		log.con = $(div).addClass('ns_dialog_body').appendTo(log.inner);
    		log.btn = $(div).addClass('ns_dialog_footer ns_fx').appendTo(log.inner);
    		log.btn_cancel = $(button).addClass('ns_btn ns_btn_cancel ns_fx1').appendTo(log.btn);
    		log.btn_confirm = $(button).addClass('ns_btn ns_btn_confirm ns_fx1').appendTo(log.btn);
            log.el.on(click,function(){
                log.inner.removeClass('anim_smalljump').addClass('anim_shake').one('webkitAnimationEnd animationend', function(){
                  log.inner.removeClass('anim_shake');
                });
            });
            log.inner.on(click,function(e){
                e.stopPropagation();
            });
            log.hide = function(){
                log.btn_cancel.off(click);
                log.btn_confirm.off(click);
                log.el.fadeOut(opts.hideTime,function(){
                    log.el.removeAttr('style').removeClass('ns_dialog_show');
                });
            }
    	}
    	if ( opts.conType === 'input' ){
            opts.type = 'confirm';
            if ( opts.title === '温馨提示' ){
                opts.title = '请输入您真实的信息！';
            }
    		var defaultsConInput = {
                    name : {
                        icon : 'user',
                        type : 'text',
                        txt : '请输入姓名',
                        id : 'ns_dialog_name',
                        length : 12
                    },
                    tel : {
                        icon : 'mobile',
                        type : 'tel',
                        txt : '请输入手机号码',
                        id : 'ns_dialog_tel',
                        length : 11
                    }
                },
                conInput = opts.conInput || ['name','tel'];
    		for( var i = 0,length = conInput.length,html=''; i < length ; i++ ){
                if ( typeof(conInput[i]) == 'string' ){
                    conInput[i] = defaultsConInput[conInput[i]];
                }
				html+= '<label class="ns_ic4">' +
				            '<div class="icon4_l">' +
				                '<i class="fa fa-' + conInput[i].icon + '"></i>' +
				            '</div>' +
				            '<div class="icon4_r">' +
				                '<input type="' + (conInput[i].type || 'text') + '" placeholder="' + (conInput[i].txt || '') + '" id="' + conInput[i].id + '" maxlength="' + (conInput[i].length || 30) + '"/>' +
				            '</div>' +
				        '</label>';
    		}
    		con = html;
    	}
        log.btn_type = {
            alert : function(){
                log.btn_cancel.hide();
                log.btn_confirm.show();
            },
            cancel : function(){
                log.btn_cancel.show();
                log.btn_confirm.hide();
            },
            confirm : function(){
                log.btn_cancel.show();
                log.btn_confirm.show();
            }
        };
        log.btn_type[opts.type]();
    	log.title.empty().html(opts.title);
    	log.con.empty().html(con);
    	log.btn_cancel.html(opts.btn_cancel);
    	log.btn_confirm.html(opts.btn_confirm);
    	log.el.removeAttr('style').addClass('ns_dialog_show');
        log.inner.addClass('anim_smalljump');
        log.btn_cancel.on(click,function(){
            if ( opts.cancel ){
               opts.cancel.call(log,false);
            }
            log.hide();
        });
        log.btn_confirm.on(click,function(){
            if ( opts.confirm ){
               opts.confirm.call(log,true);
            }else{
                log.hide();
            }
        });
    }
    nostar.ajaxUrl = 'conn/ajax.php';
    nostar.ajaxType = 'get';
    nostar.ajaxDataType = 'json';
    nostar.ajaxTimeout = 20000;
    nostar.ajaxGlobal = false;
    nostar.ajaxAsync = true;
    nostar.ajaxError = '请求失败，请稍后再试！';
    nostar.ajaxErrorFunc = function(){
        nostar.loadHide();
        nostar.tip(nostar.ajaxError);
        ns.ajaxLock = false;
    }
    /**
     * ajax的快速编写
     * @param  {object} data    传递的参数对象
     * @param  {function} success   ajax成功之后执行
     * @param  {object} opts    配置参数。包括url什么的
     * @param  {function} error   ajax错误之后执行
     * @return {undefined}         undefined
     */
    nostar.ajax = function(data,success,opts,error){
        var defaults = {
                url : nostar.ajaxUrl,
                type : nostar.ajaxType,
                dataType : nostar.ajaxDataType,
                timeout : nostar.ajaxTimeout,
                async : nostar.ajaxAsync,
                global : nostar.ajaxGlobal
            };
        if ( typeof opts === 'boolean' ){
            defaults.async = opts;
            opts = defaults;
        }else{
          opts = $.extend(defaults,opts);
        }
        opts.data = data;
        error = error || nostar.ajaxErrorFunc;
        opts.data.ns_r = Math.random()*0x777<<0;
        $.ajax(opts).done(success).fail(error);
    }

    /**
     * 图片加载
     * exp:
     * var loadImgs = ns.loadImgs({
            sources : {
                bg : "bg.jpg",
                title : "turn_bg.png",
                watch : "turn_btn.png"
            },
            dir : 'img/',
            progress : function(){
                console.log(this);
            },
            end : function(){
                console.log(this);
            }
        });
     * 
     * @param {object} opts 设置参数
     * @param {object} sources 加载图片的对象。格式为id:'路径'
     * @param {string} dir 加载图片加载之前的目录。每个都会加
     * @param {function} progress 每次加载图片回调函数。使用this来调用
     * @param {function} end 全部加载完成之后的回调函数。使用this来调用
     * @return {object} 返回所有加载图片的对象
     */
    nostar.loadImgs = function(opts){
        var loadImgs = {},
            curNum = 0,
            totalNum = 0;
        for (var src in opts.sources) {
            if ( opts.dir !== undefined ){
                opts.sources[src] = opts.dir + opts.sources[src];
            }
            totalNum++;
        }
        for (var src in opts.sources) {
            loadImgs[src] = new Image();
            loadImgs[src].onload = function(){
                curNum++;
                var _this = {
                    source : opts.sources,
                    cur : loadImgs[src],
                    total : loadImgs,
                    curNum : curNum,
                    totalNum : totalNum,
                    percent : fix(curNum/totalNum*100) + '%'
                }
                if (curNum >= totalNum) {
                    opts.end.call(_this);
                }else{
                    opts.progress.call(_this);
                }
            };  
            loadImgs[src].src = opts.sources[src];
        }
        return loadImgs;
    }

    /**
     * 获取链接上的查询字符串
     * exp:
     * var a = $.ns.getRequest('search');
     * @param  {string} name 需要获取的名称。若不传入。则默认返回所有字符串组成的对象
     * @return {object}      所有查询字符串组成的对象
     */
    nostar.getRequest = function(name){
        var url = location.search,
            theRequest = new Object();
        if ( url.indexOf("?") != -1 ) {
            var str = url.substr(1),
                strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        if ( name !== undefined ){
            return theRequest[name];
        }
        return theRequest;
    }

    /**
     * 格式化日期
     * @param  {string} date   需要转换的日期
     * @param  {string} format 转换日期的格式
     * @return {string}        转换后的日期
     */
    nostar.formatDate = function(date, format) { //格式化日期
        if (!date) return;
        if (!format) format = "yyyy-MM-dd HH:mm:ss";
        switch(typeof date) {
            case "string":
                date = new Date(date.replace(/-/, "/"));
                break;
            case "number":
                date = new Date(date);
                break;
        }
        if (!date instanceof Date) return;
        var dict = {
            "yyyy": date.getFullYear(),
            "M": date.getMonth() + 1,
            "d": date.getDate(),
            "H": date.getHours(),
            "m": date.getMinutes(),
            "s": date.getSeconds(),
            "MM": ("" + (date.getMonth() + 101)).substr(1),
            "dd": ("" + (date.getDate() + 100)).substr(1),
            "HH": ("" + (date.getHours() + 100)).substr(1),
            "mm": ("" + (date.getMinutes() + 100)).substr(1),
            "ss": ("" + (date.getSeconds() + 100)).substr(1)
        };
        return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
            return dict[arguments[0]];
        });
    };

    /**
     * 为手机添加摇一摇的功能
     * 
     * @param  {function} func  触发的事件
     * @param  {number} range 摇动幅度判断。默认25
     * @return {[type]}       [description]
     */
    nostar.shake = function(func,range){
        if(window.DeviceMotionEvent) {
            range = range || 25;
            var x = 0 , y = 0 , z = 0 , lastX = 0 , lastY = 0 , lastZ = 0;
            window.addEventListener('devicemotion', function(){
                var acceleration =event.accelerationIncludingGravity;
                x = acceleration.x;
                y = acceleration.y;
                if(Math.abs(x-lastX) > range || Math.abs(y-lastY) > range) {
                    func.call(null,{
                        x : x,
                        y : y,
                        z : z,
                        lastX : lastX,
                        lastY : lastY,
                        lastZ : lastZ
                    })
                }
                lastX = x;
                lastY = y;
            }, false);
        };
    }

    /**
     * 增加数字动画
     * @param  {string} obj   元素的选择器
     * @param  {number} to    要修改为该值
     * @param  {number} step  每次增加的大小
     * @param  {number} speed 每次增加的速度。毫秒
     */
    nostar.numberTo = function(obj,to,step,speed){
        var step = Number(step) || 7,
            speed = speed || 30,
            box = $(obj),
            now = Number(box.html()) || 0,
            toFix = 0;
        if( now > to ){
          step = -step;
        }
        if ( now % 1 > 0 || step % 1 > 0 ){
            toFix = 2;
        }
        var timmer = function(){
            setTimeout(function(){
                now = fix(now+step,toFix);
                box.html(Number(now));
                if( step < 0 ){
                  if( now >= to){
                    timmer();
                  }else{
                    box.html(to);
                  }
                }else{
                  if( now <= to){
                    timmer();
                  }else{
                    box.html(to);
                  }
                }
               
            },speed);
        }
        timmer();
    };
    /**
     * 打印文字效果
     * @param  {string} obj   要展示的元素
     * @param  {string} txt   要打印的文字。默认是该元素的内容
     * @param  {number} speed 打印的速度
     * @return {[type]}       [description]
     */
    nostar.printTxt = function(obj,txt,speed,step){
        var box = $(obj),
            txt = txt || $(obj).html(),
            speed = speed || 100,
            step = step || 1,
            length = txt.length,
            charIndex = 0;
            function printS(init){
                if ( init ){
                    box.empty();
                }
                var thisChar = txt.charAt(charIndex),
                    thisChar = txt.substr(charIndex,step),
                    next4Chars = txt.substr(charIndex,4);
                if(next4Chars=='<BR>' || next4Chars=='<br>'){
                    thisChar  = '<br>';
                    charIndex+=3;
                }
                charIndex+=step;
                box.append(thisChar);
                if(charIndex < length){
                    setTimeout(function(){
                        printS(false);
                    },speed);
                }
            };
            printS(true);
    };

    /**
     * 为页面按钮添加分享功能
     * @param {string} box      添加点击分享功能的按钮
     * @param {number} showTime 分享显示动画时间。毫秒
     * @param {number} hideTime 分享隐藏动画时间。毫秒
     */
    nostar.addShare = function(box,showTime,hideTime){
        if ( !box ) {
            return false;
        }
        var share = nostar.addShare,
            $box = $(box);
        if ( $box.length < 1 ){
            return false;
        }
        showTime = showTime || 300;
        hideTime = hideTime || 300;
        if ( share.el === undefined ){
            share.el = $(div).addClass('ns_shareover').appendTo($body);
            share.show = function(){
                share.el.fadeIn(showTime);
            }
            share.hide = function(){
                share.el.fadeOut(hideTime);
            }
            share.el.on('click',share.hide);
        }
        $box.on('click',share.show);
        return share.el;
    }
    /**
     * 设置。获取。删除cookie
     * @type {Object}
     */
    nostar.cookie = {
        set : function(name, value, days) {
            var expires = "";
            if (days) {
                var d = new Date();
                d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
                expires = "; expires=" + d.toGMTString();
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        },
        get: function (name) {
            var re = new RegExp("(\;|^)[^;]*(" + name + ")\=([^;]*)(;|$)");
            var res = re.exec(document.cookie);
            return res != null ? res[3] : null;
        },
        del : function ( name ){
            nostar.cookie.set(name,'',-1);
        }
    };

    /**
     * 检查格式的一些函数
     * @type {Object}
     */
    nostar.check = {
        empty : function (data,info){
            var regrex = /.+/;
            if ( regrex.test(data) ){
                return false;
            }
            if ( info ){
                nostar.tip(info);   
            }
            return true;;
        },
        tel : function (data,info){
            var regrex =  /^1[0-9]{10}$/
            info = info || "请输入正确的手机号码！";
            if (!regrex.test(data)){
                nostar.tip(info);
                return false;
            }
            return true;
        },
        name : function (data,info){
            var regrex =  /^[\u4e00-\u9fa5a-zA-Z]+$/;
            info = info || "请输入正确的姓名！";
            if ( !regrex.test(data) || data.length > 7 ){
                nostar.tip(info);
                return false;
            }
            return true;
        },
        pwd : function(data1,data2,info){
            info = info || "请确认两次密码输入一致并不为空！";
            if(!/.+/.test(data1) || data1 != data2){
                nostar.tip(info);
                return false;
            }
            return true;
        },
        num : function (data,info){
            if ( this.empty(data) || isNaN(data) ){
                if ( info ){
                    nostar.tip(info);   
                }
                return false;
            }
            return true;
        },
        int : function (data,info){
            var regrex =  /^\d+$/;
            if (!regrex.test(data)){
                if ( info ){
                    nostar.tip(info);
                }
                return false;
            }
            return true;
        }
    };

    /**
     * tab切换
     * @param  {object} opts 参数设置
     * @return {element}      this
     */
    $.fn.ns_tab = function ( opts ){
        var opts = $.extend({
                title : ".ns_tab_title", //切换标题选择器
                list : ".ns_tab_list", //切换内容选择器
                current : "ns_current", //当前标题和内容增加样式
                event : click //触发事件
            },opts),
            $t = $(this);
        $t.find(opts.title).each(function(i){
            var $t_t = $t.find(opts.title),
                $t_l = $t.find(opts.list);
            $t_t.eq(i).on(opts.event,function(){
                $t_t.removeClass(opts.current).eq(i).addClass(opts.current);
                $t_l.removeClass(opts.current).eq(i).addClass(opts.current);
            });
        });
        return $t;
    };

    if ( window.wx !== undefined && window.wx.config != undefined ){
        nostar.wxShare = function(share,debug,company,url){
            url = url || "http://wx.aiweimob.com/vote/conn/getJssdk.php";
            company = company || "qianyan",
            debug = debug || false;
            var jsApiList = [
                    'onMenuShareTimeline', // 分享到朋友圈
                    'onMenuShareAppMessage', // 分享给朋友
                    'hideOptionMenu', //隐藏右上角菜单
                    'showOptionMenu' // 显示右上角菜单
                ];
            if ( share.title === undefined ){
                jsApiList.length = 0;
                for ( var i in share ){
                    jsApiList.push(i);
                }
            }
            var data = {
                    company : company
                },
                success = function(data){
                    if ( data && data != null ){
                        wx.config({
                            debug: debug, 
                            appId: data.appId, 
                            timestamp: data.timestamp, 
                            nonceStr: data.nonceStr, 
                            signature: data.signature,
                            jsApiList: [
                                'onMenuShareTimeline', // 分享到朋友圈
                                'onMenuShareAppMessage', // 分享给朋友
                                'hideOptionMenu', //隐藏右上角菜单
                                'showOptionMenu' // 显示右上角菜单
                            ]
                        });
                        wx.ready(function(){
                            if ( share.title === undefined ){
                                for ( var i in share ){
                                    wx[i].call(wx,share[i]);
                                }
                            }else{
                                wx.onMenuShareTimeline(share);
                                wx.onMenuShareAppMessage(share);
                            }
                        });
                        wx.error(function(res){
                            console.log(res);
                        });
                    }
                },
                opts = {
                    async : false,
                    url : url
                };
            nostar.ajax(data,success,opts);
        }
    }
    window.ns = $.ns = nostar;
    ns.ajaxLock = false;
}(Zepto||jQuery,window,undefined));