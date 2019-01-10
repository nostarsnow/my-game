$(function(){
var SnowCry=SnowCry||function(l,r){var s={},g=s.lib={},m=g.Base=function(){function a(){}return{extend:function(c){a.prototype=this;var b=new a;c&&b.mixIn(c);b.$super=this;return b},create:function(){var b=this.extend();b.init.apply(b,arguments);return b},init:function(){},mixIn:function(c){for(var b in c){c.hasOwnProperty(b)&&(this[b]=c[b])}c.hasOwnProperty("toString")&&(this.toString=c.toString)},clone:function(){return this.$super.extend(this)}}}(),k=g.WordArray=m.extend({init:function(b,a){b=this.words=b||[];this.sigBytes=a!=r?a:4*b.length},toString:function(a){return(a||n).stringify(this)},concat:function(d){var c=this.words,a=d.words,e=this.sigBytes,d=d.sigBytes;this.clamp();if(e%4){for(var b=0;b<d;b++){c[e+b>>>2]|=(a[b>>>2]>>>24-8*(b%4)&255)<<24-8*((e+b)%4)}}else{if(65535<a.length){for(b=0;b<d;b+=4){c[e+b>>>2]=a[b>>>2]}}else{c.push.apply(c,a)}}this.sigBytes+=d;return this},clamp:function(){var b=this.words,a=this.sigBytes;b[a>>>2]&=4294967295<<32-8*(a%4);b.length=l.ceil(a/4)},clone:function(){var a=m.clone.call(this);a.words=this.words.slice(0);return a},random:function(c){for(var b=[],a=0;a<c;a+=4){b.push(4294967296*l.random()|0)}return k.create(b,c)}}),h=s.enc={},n=h.Hex={stringify:function(d){for(var c=d.words,d=d.sigBytes,a=[],e=0;e<d;e++){var b=c[e>>>2]>>>24-8*(e%4)&255;a.push((b>>>4).toString(16));a.push((b&15).toString(16))}return a.join("")},parse:function(c){for(var b=c.length,a=[],d=0;d<b;d+=2){a[d>>>3]|=parseInt(c.substr(d,2),16)<<24-4*(d%8)}return k.create(a,b/2)}},i=h.Latin1={stringify:function(c){for(var b=c.words,c=c.sigBytes,a=[],d=0;d<c;d++){a.push(String.fromCharCode(b[d>>>2]>>>24-8*(d%4)&255))}return a.join("")},parse:function(c){for(var b=c.length,a=[],d=0;d<b;d++){a[d>>>2]|=(c.charCodeAt(d)&255)<<24-8*(d%4)}return k.create(a,b)}},f=h.Utf8={stringify:function(b){try{return decodeURIComponent(escape(i.stringify(b)))}catch(a){throw Error("Malformed UTF-8 data")}},parse:function(a){return i.parse(unescape(encodeURIComponent(a)))}},o=g.BufferedBlockAlgorithm=m.extend({reset:function(){this._data=k.create();this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=f.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(j){var c=this._data,a=c.words,q=c.sigBytes,b=this.blockSize,d=q/(4*b),d=j?l.ceil(d):l.max((d|0)-this._minBufferSize,0),j=d*b,q=l.min(4*j,q);if(j){for(var e=0;e<j;e+=b){this._doProcessBlock(a,e)}e=a.splice(0,j);c.sigBytes-=q}return k.create(e,q)},clone:function(){var a=m.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});g.Hasher=o.extend({init:function(){this.reset()},reset:function(){o.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=o.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(c,b){return a.create(b).finalize(c)}},_createHmacHelper:function(a){return function(c,b){return p.HMAC.create(a,b).finalize(c)}}});var p=s.algo={};return s}(Math);(function(){var c=SnowCry,d=c.lib.WordArray;c.enc.Base64={stringify:function(l){var m=l.words,h=l.sigBytes,b=this._map;l.clamp();for(var l=[],n=0;n<h;n+=3){for(var i=(m[n>>>2]>>>24-8*(n%4)&255)<<16|(m[n+1>>>2]>>>24-8*((n+1)%4)&255)<<8|m[n+2>>>2]>>>24-8*((n+2)%4)&255,a=0;4>a&&n+0.75*a<h;a++){l.push(b.charAt(i>>>6*(3-a)&63))}}if(m=b.charAt(64)){for(;l.length%4;){l.push(m)}}return l.join("")},parse:function(k){var k=k.replace(/\s/g,""),n=k.length,b=this._map,a=b.charAt(64);a&&(a=k.indexOf(a),-1!=a&&(n=a));for(var a=[],o=0,i=0;i<n;i++){if(i%4){var m=b.indexOf(k.charAt(i-1))<<2*(i%4),l=b.indexOf(k.charAt(i))>>>6-2*(i%4);a[o>>>2]|=(m|l)<<24-8*(o%4);o++}}return d.create(a,o)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();(function(p){function h(b,c,d,a,f,e,g){b=b+(c&d|~c&a)+f+g;return(b<<e|b>>>32-e)+c}function i(b,c,d,a,f,e,g){b=b+(c&a|d&~a)+f+g;return(b<<e|b>>>32-e)+c}function l(b,c,d,a,f,e,g){b=b+(c^d^a)+f+g;return(b<<e|b>>>32-e)+c}function r(b,c,d,a,f,e,g){b=b+(d^(c|~a))+f+g;return(b<<e|b>>>32-e)+c}var o=SnowCry,m=o.lib,s=m.WordArray,m=m.Hasher,n=o.algo,k=[];(function(){for(var a=0;64>a;a++){k[a]=4294967296*p.abs(p.sin(a+1))|0}})();n=n.MD5=m.extend({_doReset:function(){this._hash=s.create([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(a,c){for(var d=0;16>d;d++){var j=c+d,f=a[j];a[j]=(f<<8|f>>>24)&16711935|(f<<24|f>>>8)&4278255360}for(var j=this._hash.words,f=j[0],e=j[1],g=j[2],b=j[3],d=0;64>d;d+=4){16>d?(f=h(f,e,g,b,a[c+d],7,k[d]),b=h(b,f,e,g,a[c+d+1],12,k[d+1]),g=h(g,b,f,e,a[c+d+2],17,k[d+2]),e=h(e,g,b,f,a[c+d+3],22,k[d+3])):32>d?(f=i(f,e,g,b,a[c+(d+1)%16],5,k[d]),b=i(b,f,e,g,a[c+(d+6)%16],9,k[d+1]),g=i(g,b,f,e,a[c+(d+11)%16],14,k[d+2]),e=i(e,g,b,f,a[c+d%16],20,k[d+3])):48>d?(f=l(f,e,g,b,a[c+(3*d+5)%16],4,k[d]),b=l(b,f,e,g,a[c+(3*d+8)%16],11,k[d+1]),g=l(g,b,f,e,a[c+(3*d+11)%16],16,k[d+2]),e=l(e,g,b,f,a[c+(3*d+14)%16],23,k[d+3])):(f=r(f,e,g,b,a[c+3*d%16],6,k[d]),b=r(b,f,e,g,a[c+(3*d+7)%16],10,k[d+1]),g=r(g,b,f,e,a[c+(3*d+14)%16],15,k[d+2]),e=r(e,g,b,f,a[c+(3*d+5)%16],21,k[d+3]))}j[0]=j[0]+f|0;j[1]=j[1]+e|0;j[2]=j[2]+g|0;j[3]=j[3]+b|0},_doFinalize:function(){var b=this._data,c=b.words,d=8*this._nDataBytes,a=8*b.sigBytes;c[a>>>5]|=128<<24-a%32;c[(a+64>>>9<<4)+14]=(d<<8|d>>>24)&16711935|(d<<24|d>>>8)&4278255360;b.sigBytes=4*(c.length+1);this._process();b=this._hash.words;for(c=0;4>c;c++){d=b[c],b[c]=(d<<8|d>>>24)&16711935|(d<<24|d>>>8)&4278255360}}});o.MD5=m._createHelper(n);o.HmacMD5=m._createHmacHelper(n)})(Math);(function(){var h=SnowCry,j=h.lib,f=j.Base,g=j.WordArray,j=h.algo,i=j.EvpKDF=f.extend({cfg:f.extend({keySize:4,hasher:j.MD5,iterations:1}),init:function(a){this.cfg=this.cfg.extend(a)},compute:function(c,e){for(var b=this.cfg,k=b.hasher.create(),d=g.create(),v=d.words,a=b.keySize,b=b.iterations;v.length<a;){m&&k.update(m);var m=k.update(c).finalize(e);k.reset();for(var n=1;n<b;n++){m=k.finalize(m),k.reset()}d.concat(m)}d.sigBytes=4*a;return d}});h.EvpKDF=function(b,c,a){return i.create(a).compute(b,c)}})();SnowCry.lib.Cipher||function(i){var n=SnowCry,o=n.lib,r=o.Base,m=o.WordArray,h=o.BufferedBlockAlgorithm,s=n.enc.Base64,a=n.algo.EvpKDF,e=o.Cipher=h.extend({cfg:r.extend(),createEncryptor:function(b,d){return this.create(this._ENC_XFORM_MODE,b,d)},createDecryptor:function(b,d){return this.create(this._DEC_XFORM_MODE,b,d)},init:function(j,b,d){this.cfg=this.cfg.extend(d);this._xformMode=j;this._key=b;this.reset()},reset:function(){h.reset.call(this);this._doReset()},process:function(b){this._append(b);return this._process()},finalize:function(b){b&&this._append(b);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){return function(b){return{encrypt:function(q,d,j){return("string"==typeof d?f:g).encrypt(b,q,d,j)},decrypt:function(q,d,j){return("string"==typeof d?f:g).decrypt(b,q,d,j)}}}}()});o.StreamCipher=e.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var p=n.mode={},k=o.BlockCipherMode=r.extend({createEncryptor:function(d,b){return this.Encryptor.create(d,b)},createDecryptor:function(d,b){return this.Decryptor.create(d,b)},init:function(d,b){this._cipher=d;this._iv=b}}),p=p.CBC=function(){function d(v,u,q){var j=this._iv;j?this._iv=i:j=this._prevBlock;for(var t=0;t<q;t++){v[u+t]^=j[t]}}var b=k.extend();b.Encryptor=b.extend({processBlock:function(u,q){var j=this._cipher,t=j.blockSize;d.call(this,u,q,t);j.encryptBlock(u,q);this._prevBlock=u.slice(q,q+t)}});b.Decryptor=b.extend({processBlock:function(v,q){var j=this._cipher,t=j.blockSize,u=v.slice(q,q+t);j.decryptBlock(v,q);d.call(this,v,q,t);this._prevBlock=u}});return b}(),l=(n.pad={}).Pkcs7={pad:function(t,q){for(var u=4*q,u=u-t.sigBytes%u,b=u<<24|u<<16|u<<8|u,d=[],j=0;j<u;j+=4){d.push(b)}u=m.create(d,u);t.concat(u)},unpad:function(b){b.sigBytes-=b.words[b.sigBytes-1>>>2]&255}};o.BlockCipher=e.extend({cfg:e.cfg.extend({mode:p,padding:l}),reset:function(){e.reset.call(this);var j=this.cfg,d=j.iv,j=j.mode;if(this._xformMode==this._ENC_XFORM_MODE){var b=j.createEncryptor}else{b=j.createDecryptor,this._minBufferSize=1}this._mode=b.call(j,this,d&&d.words)},_doProcessBlock:function(d,b){this._mode.processBlock(d,b)},_doFinalize:function(){var d=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){d.pad(this._data,this.blockSize);var b=this._process(!0)}else{b=this._process(!0),d.unpad(b)}return b},blockSize:4});var c=o.CipherParams=r.extend({init:function(b){this.mixIn(b)},toString:function(b){return(b||this.formatter).stringify(this)}}),p=(n.format={}).OpenSSL={stringify:function(d){var b=d.ciphertext,d=d.salt,b=(d?m.create([1398893684,1701076831]).concat(d).concat(b):b).toString(s);return b=b.replace(/(.{64})/g,"$1\n")},parse:function(b){var b=s.parse(b),j=b.words;if(1398893684==j[0]&&1701076831==j[1]){var d=m.create(j.slice(2,4));j.splice(0,4);b.sigBytes-=16}return c.create({ciphertext:b,salt:d})}},g=o.SerializableCipher=r.extend({cfg:r.extend({format:p}),encrypt:function(b,j,d,q){var q=this.cfg.extend(q),t=b.createEncryptor(d,q),j=t.finalize(j),t=t.cfg;return c.create({ciphertext:j,key:d,iv:t.iv,algorithm:b,mode:t.mode,padding:t.padding,blockSize:b.blockSize,formatter:q.format})},decrypt:function(q,b,d,j){j=this.cfg.extend(j);b=this._parse(b,j.format);return q.createDecryptor(d,j).finalize(b.ciphertext)},_parse:function(d,b){return"string"==typeof d?b.parse(d):d}}),n=(n.kdf={}).OpenSSL={compute:function(b,d,j,q){q||(q=m.random(8));b=a.create({keySize:d+j}).compute(b,q);j=m.create(b.words.slice(d),4*j);b.sigBytes=4*d;return c.create({key:b,iv:j,salt:q})}},f=o.PasswordBasedCipher=g.extend({cfg:g.cfg.extend({kdf:n}),encrypt:function(q,b,d,j){j=this.cfg.extend(j);d=j.kdf.compute(d,q.keySize,q.ivSize);j.iv=d.iv;q=g.encrypt.call(this,q,b,d.key,j);q.mixIn(d);return q},decrypt:function(q,b,d,j){j=this.cfg.extend(j);b=this._parse(b,j.format);d=j.kdf.compute(d,q.keySize,q.ivSize,b.salt);j.iv=d.iv;return g.decrypt.call(this,q,b,d.key,j)}})}();(function(){var k=SnowCry,o=k.lib.BlockCipher,p=k.algo,s=[],m=[],h=[],a=[],e=[],g=[],r=[],l=[],n=[],f=[];(function(){for(var d=[],c=0;256>c;c++){d[c]=128>c?c<<1:c<<1^283}for(var j=0,q=0,c=0;256>c;c++){var v=q^q<<1^q<<2^q<<3^q<<4,v=v>>>8^v&255^99;s[j]=v;m[v]=j;var u=d[j],t=d[u],w=d[t],b=257*d[v]^16843008*v;h[j]=b<<24|b>>>8;a[j]=b<<16|b>>>16;e[j]=b<<8|b>>>24;g[j]=b;b=16843009*w^65537*t^257*u^16843008*j;r[v]=b<<24|b>>>8;l[v]=b<<16|b>>>16;n[v]=b<<8|b>>>24;f[v]=b;j?(j=u^d[d[d[w^u]]],q^=d[d[q]]):j=q=1}})();var i=[0,1,2,4,8,16,32,64,128,27,54],p=p.Nostar=o.extend({_doReset:function(){for(var c=this._key,b=c.words,d=c.sigBytes/4,c=4*((this._nRounds=d+6)+1),q=this._keySchedule=[],t=0;t<c;t++){if(t<d){q[t]=b[t]}else{var j=q[t-1];t%d?6<d&&4==t%d&&(j=s[j>>>24]<<24|s[j>>>16&255]<<16|s[j>>>8&255]<<8|s[j&255]):(j=j<<8|j>>>24,j=s[j>>>24]<<24|s[j>>>16&255]<<16|s[j>>>8&255]<<8|s[j&255],j^=i[t/d|0]<<24);q[t]=q[t-d]^j}}b=this._invKeySchedule=[];for(d=0;d<c;d++){t=c-d,j=d%4?q[t]:q[t-4],b[d]=4>d||4>=t?j:r[s[j>>>24]]^l[s[j>>>16&255]]^n[s[j>>>8&255]]^f[s[j&255]]}},encryptBlock:function(b,c){this._doCryptBlock(b,c,this._keySchedule,h,a,e,g,s)},decryptBlock:function(c,b){var d=c[b+1];c[b+1]=c[b+3];c[b+3]=d;this._doCryptBlock(c,b,this._invKeySchedule,r,l,n,f,m);d=c[b+1];c[b+1]=c[b+3];c[b+3]=d},_doCryptBlock:function(b,c,d,j,q,u,v,t){for(var x=this._nRounds,w=b[c]^d[0],y=b[c+1]^d[1],A=b[c+2]^d[2],z=b[c+3]^d[3],B=4,U=1;U<x;U++){var V=j[w>>>24]^q[y>>>16&255]^u[A>>>8&255]^v[z&255]^d[B++],W=j[y>>>24]^q[A>>>16&255]^u[z>>>8&255]^v[w&255]^d[B++],X=j[A>>>24]^q[z>>>16&255]^u[w>>>8&255]^v[y&255]^d[B++],z=j[z>>>24]^q[w>>>16&255]^u[y>>>8&255]^v[A&255]^d[B++],w=V,y=W,A=X}V=(t[w>>>24]<<24|t[y>>>16&255]<<16|t[A>>>8&255]<<8|t[z&255])^d[B++];W=(t[y>>>24]<<24|t[A>>>16&255]<<16|t[z>>>8&255]<<8|t[w&255])^d[B++];X=(t[A>>>24]<<24|t[z>>>16&255]<<16|t[w>>>8&255]<<8|t[y&255])^d[B++];z=(t[z>>>24]<<24|t[w>>>16&255]<<16|t[y>>>8&255]<<8|t[A&255])^d[B++];b[c]=V;b[c+1]=W;b[c+2]=X;b[c+3]=z},keySize:8});k.Nostar=o._createHelper(p)})();SnowCry.SnowKey=SnowCry.enc.Latin1.parse("myLittleSnow0707");SnowCry.SnowIv=SnowCry.enc.Latin1.parse("ohMyDearILoveYou");SnowCry.pad.Zero={pad:function(f,e){var d=e*4;f.clamp();f.sigBytes+=d-((f.sigBytes%d)||d)},unpad:function(d){var f=d.words;var e=d.sigBytes-1;while(!((f[e>>>2]>>>(24-(e%4)*8))&255)){e--}d.sigBytes=e+1}};function SnowCry_en(a,key,iv){return SnowCry.Nostar.encrypt(a.toString(),SnowCry.enc.Latin1.parse(key),{iv:SnowCry.enc.Latin1.parse(iv),mode:SnowCry.mode.CBC,padding:SnowCry.pad.Zero}).toString()};
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
	tipTime = 2,
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
		tipTime=2;
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
		if ( TIME < myBestScore || myBestScore == 0 ){
			upload();
		}else{
			$myScore.html(formateTime(TIME));
			$myRank.html(myBestRank);
		}
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
});