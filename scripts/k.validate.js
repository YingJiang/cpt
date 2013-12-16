/**
 * @Author DingKai
 * Create time:2012/03/22
 * File type:components 组件库
 * Descript:基于jquery，开发一些网站页面中用到的小组件，方便维护和运用; 表单验证
 * Contact: QQ群：195553540  
 * Email: cngraph@gmail.com
 */
;(function($){
    /**
     * 表单验证
     **/
    $.fn.user = {};
    $.fn.user.validate = {
        //检查昵称
        thisObjError:function(obj , val){
            this.animate($(obj).parent());
            $(obj).addClass('errortest').parent().parent().next('span').removeClass().addClass('errortips').show().text(val);
            return false ;
        },
        thisObjTrue:function(obj){
            $(obj).attr('rel' , '1').removeClass('errortest').parent().parent().next('span').css({'display':'inline-block'}).removeClass().addClass('good');
            return true;
        },
        thisFocus:function(obj , val){
            $(obj).removeClass().addClass('deftest').parent().parent().next('span').removeClass().addClass('gray iblock').show().text(val);
            return true ;
        },
        animate:function(obj){
          obj.animate({left:'+=10'},100);
          obj.animate({left:'-=10'},100);
          obj.animate({left:'+=5'},100);
          obj.animate({left:'-=5'},100);
        },
        checkName:function(obj){
            //得到输入字符的长度 
            var len = this.checkLength($(obj).val());
            
            if(len<4 ){
                this.thisObjError(obj ,'昵称字符范围为4-20之间！');
                return false;
            }else{
                this.thisObjTrue(obj);
                return true;
            }
        },
        //检查电子邮箱
        checkEmail:function(obj , type){
            var regexp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
            var str = $(obj).val();
            var sta = true;
            var _this = this ;
            //过滤中文字
            if(!str){
                this.thisObjError(obj ,'邮箱不能为空');
                sta = false;
            }else{
                if(!regexp.test(str)){
                    this.thisObjError(obj ,'邮箱格式不正确');
                    sta = false;
                }else{
                    if(type){
                        this.thisObjTrue(obj);
                    }else{
                        $(obj).attr('rel' , '1').removeClass('errortest').parent().parent().next('span').hide();
                    }
                    
                }
            }
            return sta ;
        },
        //检查密码
        checkPassword:function(obj , type){
            var str = $(obj).val();
            var sta = true;
            
            //过滤中文字
            var _this =$(obj).addClass('errortest').parent().parent().next(".errortips");
            if(str){
                sta = this.checkCn(str);
            }
            var len = this.checkLength($(obj).val());
            if ( 5<len && len<17 && sta) {
                if(str.indexOf(' ') == -1){
                    if(type){
                        this.thisObjTrue(obj);
                    }else{
                        $(obj).attr('rel' , '1').removeClass('errortest').parent().parent().next('span').hide();
                        sta = true;
                        return true ;
                    }
                }else{
                    this.thisObjError(obj ,'您有特殊字符！');
                    sta = false;
                }
                //$.ajax
            } else if(str == ""){
                sta = false;
                this.thisObjError(obj ,'密码不能为空');
            }else{
                this.thisObjError(obj ,'密码为6～16个字母、数字或符号，区分大小写！');
                sta = false;
            }
            return sta;
        },
        //检查验证码
        kaptcha:function(obj){
            var str = $(obj).val();
            var sta = true;
            var ajaxSta = true;
            var _this = $(obj) ;
            //过滤中文字
            if(str){
                sta = this.checkCn(str);
            }
            var len = this.checkLength($(obj).val());
            if ( len==4) {
                $.ajax({
                    type:"get",
                    url:"/captcha/check?captcha="+str,
                    dataType:"text",
                    success:function(data){
                        if(data){
                            _this.removeClass('errortest').parent().parent().parent().find('.stata').hide();
                            return true;
                        }else{
                            _this.animate(_this.parent());
                            _this.addClass('errortest').parent().parent().parent().find('.stata').show().text('请正确输入！');
                            return false ;
                        }
                    }
                });
            } else{
                this.animate(_this.parent());
                _this.addClass('errortest').parent().parent().parent().find('.stata').show().text('请正确输入！');
                return false ;
            }
            //return ajaxSta;
        },
        //获取字符串的实际长度
        checkLength:function(str){
            var len=0;
            for(var i=0;i<str.length;i++){
                str.charCodeAt(i)>255 ? len+=2 : len++;
            }
            return len;
        },
        //检查字符串中是否有中文
        checkCn:function(str){
            var sta = true;
            for(var i=0;i<str.length;i++){
                if(str.charCodeAt(i)>255){
                    sta = false;
                    break;
                }
            }
            return sta;
        },
        checkCharact:function(str){
            var reg = /^([a-zA-Z0-9\-_\u4e00-\u9fa5]){2,30}$/; 
            if (reg.test(str)){
                return true; 
            }else{
                return false ;
            }
            return true;
        },
        service:function(obj){
            return obj.checked;
        },
        //注册昵称检查
        regName:function(obj){
            //得到输入字符的长度 
            var len = this.checkLength($(obj).val());
            var str = $(obj).val();
            var _this = this ;
            
            if(str == ''){
                this.thisObjError(obj , '昵称不能为空');
            }else if(len<4 ){
                this.thisObjError(obj , '昵称不能少于4个字符');
            }else if(len > 30){
                this.thisObjError(obj , '昵称不能超过30个字符');
                
            }else{
                if(!this.checkCharact(str)){
                    this.thisObjError(obj , '昵称只支持汉字、英文、下划线和减号');
                    return false ;
                }
                _this.thisObjTrue(obj);
                
                $.post('/regist/nickname',{userNickname:str},function(data){
                    if(typeof eval(data).result != "undefined"){
                        _this.thisObjError(obj , data.result);
                    }else{
                        _this.thisObjTrue(obj);
                    }
                },"json");
                return true;
            }
        },
        
        regEmail:function(obj){
            var str = $(obj).val();
            var sta = true;
            var _this = this ;
            var regexp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z\u4e00-\u9fa5]{2,4})$/;
            //过滤中文字
            if(!str){
                this.thisObjError(obj ,'邮箱不能为空');
            }else{
                if(!regexp.test(str)){
                    this.thisObjError(obj ,'您的电子邮箱格式错误');
                }else{
                    $(obj).removeClass('errortest').parent().next(".errortips").hide();
                    $.post('/regist/email',{userEmail:str},function(data){
                        if(typeof eval(data).result != "undefined"){
                            //_this.show().text(data.result);
                            _this.thisObjError(obj ,data.result);
                            $(obj).addClass('errortest');
                            //__this.animate($(obj).parent());
                            return false;
                        }else{
                            _this.thisObjTrue(obj);
                        }
                    },"json");
                    return true;
                }
            }
        
        },
        openEmail:function(obj){
            var str = $(obj).val();
            var sta = true;
            var _this =this;
            //过滤中文字
            if(str){
                sta = this.checkCn(str);
            }else{
                _this.thisObjError(obj ,'邮箱不能为空');
                return false ;
            }
            
            if (str.indexOf("@")>1 && str.indexOf(".")>1 && sta) {
                $(obj).removeClass('errortest').parent().next(".errortips").hide();
                $.post('/regist/email',{userEmail:str},function(data){
                    if(typeof eval(data).result == "undefined" || typeof eval(data).result == ""){
                        _this.thisObjError(obj ,'邮箱不存在，请重新输入');
                    }else{
                        _this.thisObjTrue(obj);
                    }
                },"json");
                return true;
            } else{
                _this.thisObjError(obj ,'邮箱格式不正确');
            }
        },
        haveEmail:function(obj){
            this.thisObjError(obj ,'该帐号已经被绑定！');
        },
        errorPassword:function(obj){
            this.animate($(obj).parent());
            this.thisObjError(obj ,'密码错误，请重试');
        },
        checkMoreEmail:function(mails){
            var str = mails;
            var sta = true;
            var s_space = mails.split(/[, ，]/);
            var _status = true;
            for(var i=0;i<s_space.length;i++){
                  var mail = $.trim(s_space[i]);
                  if (mail.length > 0){
                      var result = _check(mail);
                      if (result == false){
                          _status =  false;
                      }
                  }
              }
            return _status;
            function _check(str){
                //过滤中文字
                if(str){
                    sta = $.fn.user.validate.checkCn(str);
                }
                if (str.indexOf("@")>1 && str.indexOf(".")>1 && sta) {
                    return true;
                } else{
                    return false;
                };
            }
        },
        //检查表单按钮的显示提交问题
        checkForm:function(opt){
            var _defaults={
                objValue:{ele:null,type:"",func:null,defaultSta:true},  //[{ele:,type:,func:,defaultSta:false}]要验证表单元素对象{ele:元素，type：元素类型，func：验证的方法,defaultSta默认是否检测}
                element:null,  //按钮对象
                openClass:"",  //可点击样式
                closeClass:""  //不可点击时样式
            };
            var opts =$.extend({},_defaults,opt);
            var status = []; //所有表单元素状态集合
            if(opts.objValue){
                for(var i=0,len=opts.objValue.length;i<len;i++){
                    switch(opts.objValue[i].type){
                        case "text":
                            status[i] = false;
                            inputCheck(opts.objValue[i].ele , opts.objValue[i].func , i, opts.objValue[i].defaultSta);
                            break;
                        case "select":
                            status[i] = false;
                            selectCheck(opts.objValue[i].ele , opts.objValue[i].func , i);
                            break;
                        case "checkbox":
                            break;
                        case "radio":
                            status[i] = false;
                            radioCheck(opts.objValue[i].ele , opts.objValue[i].func , i);
                            break;
                        case "textarea":
                            status[i] = false;
                            inputCheck(opts.objValue[i].ele , opts.objValue[i].func , i, opts.objValue[i].defaultSta);
                            break;
                        case "combox":
                            status[i] = opts.objValue[i].func(opts.objValue[i].ele);
                            comboxCheck(opts.objValue[i].ele,opts.objValue[i].func,i);
                            break;
                        case "hiddenText":  //隐藏文本
                            status[i] = opts.objValue[i].func(opts.objValue[i].ele);
                            hiddenText(opts.objValue[i].ele , opts.objValue[i].func , i);
                            break;
                        default : 
                            break;
                    }
                }
            }
            //radio检测
            function radioCheck(obj,func,num){
                obj.each(function(){
                    if($(this).attr("checked")=="checked"){
                        var _sta = func($(this));
                        status[num] = _sta;
                        getTrue(status) ? opts.element.removeClass(opts.closeClass).addClass(opts.openClass) : opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
                    }
                    $(this).click(function(){
                        var _sta = func($(this));
                        status[num] = _sta;
                        getTrue(status) ? opts.element.removeClass(opts.closeClass).addClass(opts.openClass) : opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
                    });
                });
            }
            function hiddenText(obj,func,num){
                var _sta = func(obj);
                status[num] = _sta;
                getTrue(status) ? opts.element.removeClass(opts.closeClass).addClass(opts.openClass) : opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
            }
            //combox检测
            function comboxCheck(obj,func,num){
                var _sta = func(obj);
                status[num] = _sta;
                getTrue(status) ? opts.element.removeClass(opts.closeClass).addClass(opts.openClass) : opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
            }
            //检查Text,Textarea表单
            var thisTime = null;
            function inputCheck(obj,func,num,sta){
                if(sta){
                    var _sta = func(obj);
                    status[num] = _sta;
                    getTrue(status) ? opts.element.removeClass(opts.closeClass).addClass(opts.openClass) : opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
                }else{
                    status[num] = false;
                    opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
                }
                
                obj.keyup(function(){
                    //防止连续为空，只显示一次提示
                    if(thisTime !== null){
                        return;
                    }
                    var _sta = func($(this));
                    thisTime = setTimeout(function(){
                        status[num] = _sta;
                        getTrue(status) ? opts.element.removeClass(opts.closeClass).addClass(opts.openClass) : opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
                        thisTime = null;
                    },30);
                });
                
                obj.blur(function(){
                    if(this.nodeName.toLowerCase()=="input"){
                        //防止连续为空，只显示一次提示
                        if(thisTime !== null){
                            return;
                        }
                        var _sta = func($(this),true);
                        thisTime = setTimeout(function(){
                            status[num] = _sta;
                            getTrue(status) ? opts.element.removeClass(opts.closeClass).addClass(opts.openClass) : opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
                            thisTime = null;
                        },30);
                    }
                });
            }
            //检查Select表单
            function selectCheck(obj,func,num){
                var _sta = func(obj);
                status[num] = _sta;
                getTrue(status) ? opts.element.removeClass(opts.closeClass).addClass(opts.openClass) : opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
                obj.change(function(){
                    var _sta = func($(this));
                    status[num] = _sta;
                    getTrue(status) ? opts.element.removeClass(opts.closeClass).addClass(opts.openClass) : opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
                });
            }
            //检查数组里集合为True还是为False
            function getTrue(arr){
                var sts = true;
                for(var per=0;per<arr.length;per++){
                    if(!arr[per]){
                        sts = false;
                        break;
                    }
                }
                return sts;
            }
        },
        checkTextarea:function(obj){
            var sta = true;
            for(var i=0,len=obj.length;i<len;i++){
                if($.fn.getbytelength(obj[i].val().Trim())>140){
                    obj[i].addClass('bgcolor').animate({opacity:'0.25'},50).animate({opacity:'1'},50).animate({opacity:'0.25'},50).animate({opacity:'1'},50);
                    setTimeout(function(){
                        obj[i].removeClass('bgcolor');
                    },400);
                    return false;
                }
            }
            return sta;
        }
    };
})(jQuery);
