$(function(){var b=$("#go");function a(){var d=$("#name").val(),c="";if(!check.name(d)){return false}load();$.ajax({type:check.ajaxType,url:check.ajaxUrl+"?xl="+Math.random().toFixed(3),data:{action:"reg",name:d,active:active,tel:c,openid:openid},dataType:check.ajaxDataType,success:function(e){if(e.errcode==0){$tip("注册成功！");location.href="game.php"}else{$tip(e.errmsg)}load_h()},error:function(){$tip(check.ajaxError)}})}b.on(click,function(){if(reged==1){location.href="game.php";return}$log({title:"让你的朋友知道你吧！",con:'<div class="tip">请输入您的真实姓名！</div><label class="in_ic40"><span class="l"><i class="fa fa-user"></i></span><span class="r"><input type="text" placeholder="请输入姓名" id="name" name="name" maxlength="12"/></span></label>',go:a})})});