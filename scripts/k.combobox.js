/**
 * @Author DingKai
 * Create time:2012/03/22
 * File type:components 组件库
 * Descript:基于jquery，开发一些网站页面中用到的小组件，方便维护和运用; 多功能下拉列表框
 * Contact: QQ群：195553540  
 * Email: cngraph@gmail.com
 */
;(function($){
    /**
     * 截取文字method 
     */
    $.fn.fixStr = function(str, num, chars) {
        if ( typeof str == "undefined") {
            return;
        }
        var resStr;
        var newStr = str.toString();
        if (!chars) {
            chars = "...";
        }
        var diLen = lenStr(newStr) - num;
        diLen > 0 ? resStr = cutStr(newStr, num) + chars : resStr = newStr;
        return resStr;
        function cutStr(str, num) {
            var n = 0;
            var p = [];
            for (var i = 0, len = str.length; i < len; i++) {
                if (n > num - 1) {
                    break;
                }
                if (str.charCodeAt(i) > 255) {
                    p.push(str.charAt(i));
                    n += 2;
                } else {
                    p.push(str.charAt(i));
                    n++;
                }
            }
            return p.join("");
        }
        function lenStr(str) {
            var k = 0;
            for (var i = 0; i < str.length; i++) {
                str.charCodeAt(i) > 255 ? k += 2 : k++;
            }
            return k;
        }
    };
    /**
     * Combox组件内容
     */
    $.fn.combox=function(ele,para){  //ele:对象,para:参数设置
        this.element = ele;
        this.opts = $.extend({},$.fn.combox.defaults,para);
        this._init();
    };
    $.fn.combox.prototype = {
        _init:function(){
            var _this = this;
            var thisVal = _this.element.val();
            //给combox定义宽度和高度
            var pannelWidth;
            var addDiv = "";
            if(_this.opts.width){
                pannelWidth = _this.opts.width;
            }else{
                _this.element.width()<_this.opts.minWidth ? pannelWidth = _this.opts.minWidth : pannelWidth = _this.element.width();
            }
            //是否显示select
            if(!_this.opts.debug){
                _this.element.hide();
            }
            var newEle = ["<span class='combox' style='width:"+pannelWidth+"px;'><input class='comboxText' style='width:"+(pannelWidth-37)+"px' readonly='readonly' type='text' value=''/>"
                            ,"<span class='comboxArrow'></span>"
                            ,"<input class='comboxValue' type='hidden' value='' /></span>"
                            ].join("");
            //插入模拟的select
            $(newEle).insertAfter(_this.element);
            //为Pannel中插入select内容
            var options = _this.element.find("option");
            var li="",ul="";
            options.each(function(index){
                if(options.eq(index).val()!=""){
                    var cls = options.eq(index).attr("manage")==2? group : "";
                    li += ("<li class='" + cls + "' value ='"+options.eq(index).val()+"' default='"+options.eq(index).text()+"'>"+$.fn.fixStr(options.eq(index).text(),18,"...")+"</li>");
                }
            });
            //添加“add”区域
            if(_this.opts.addList){
                addDiv = "<div class='comboxAdd'><span class='innerborder'><input class='deftest' type='text/css' value='' size='10' maxlength='" + (_this.opts.maxlength == undefined ? "20" : "" + _this.opts.maxlength) + "'/></span> <input class='addsort' type='button' value='添加新图格'/></div>";
            }
            ul = "<div class='pannel' style='width:"+pannelWidth+"px'><ul style='width:"+pannelWidth+"px'>"+li+"</ul>"+addDiv+"</div>";
            //插入pannel
            _this.element.next().append(ul);
            //给pannel增加样式
            $(".pannel li").each(function(){
                $(this).hover(function(){
                    $(this).removeClass("out").addClass("over");
                },function(){
                    $(this).addClass("out");
                });
            });
            //设置可读
            if(!this.opts.isSelect){
                $(".combox").eq(comIdex).find(".comboxText").css({"color":"#ccc"});
            }
            this.setValue(_this.element,thisVal);
            //设置可输入的select
            _this.element.next().find(".comboxText").eq(0).keyup(function(){
                if(_this.opts.allowAnyValue){
                    _this.element.next().find(".comboxText").eq(0).removeAttr("readonly");
                    var dex = $(".comboxText").index(this);
                    var pLeft = $(".combox").eq(dex).offset().left;  //计算居左值
                    var pTop = parseInt($(".combox").eq(dex).offset().top + 26);  //计算居顶值
                    $(".pannel").eq(index).offset().left = pLeft;  //pannel Left居左值
                    $(".pannel").eq(index).offset().top = pTop;  //pannel Top居上值
                    $(".pannel").eq(index).css({
                        left:pLeft
                    });
                    $(".pannel").eq(dex).show();
                    var value = $(this).val(); 
                    var len = $(".pannel").eq(dex).find("li").length;
                    $(".pannel").eq(dex).find("li").each(function(){
                        $(this).text().indexOf(value)!=0 ? $(this).hide() : $(this).show("slide");
                    });
                }
            });
            //下拉列表显示
            _this.element.next().bind("click",function(e){
                if(_this.opts.lock){
                    return;
                }
                var thisDoc = e.target;
                //增加选中区域
                if(!($(thisDoc).attr("class")=="comboxText"||$(thisDoc).attr("class")=="comboxArrow")){
                    return;
                }
                $(".pannel").hide();  //先隐藏所有，然后显示当前的pannel
                e.stopPropagation();  //阻止事件冒泡
                if(!_this.opts.isSelect){return;}
                var heightVal = 0;
                var index = $(".combox").index(this);
                var _combox = $(".combox").eq(index);  //获取当前combox
                var _pannel = _combox.find(".pannel");  //获取当前combox下的pannel
                var pLeft = '';  //居左距离
                var pTop = _combox.height();  //计算居顶值，采用的时绝对定位，父元素为相对哦
                //初始化pannel的高度
                var numLi = _pannel.find("ul li").length;
                numLi>5 ? heightVal = _this.opts.maxHeight : heightVal = numLi*30;
                //pannel定位
                _pannel.find("ul").css({height:heightVal});
                _pannel.find(".comboxAdd").css({height:"30px"});  //添加选项区域高度
                if(typeof _this.opts.position == "string" && _this.opts.position =="up"){
                    var diffHeight =  $(".combox").eq(index).offset().top - $(".pannel").eq(index).find("ul").eq(0).height();
                    $(".pannel").eq(index).css({top:diffHeight});
                }else{
                    $(".pannel").eq(index).css({top:'-1px'});
                }
                $(".pannel").eq(index).show();
                //给选择好的值定义初始位置
                var pos = $(".pannel").eq(index).find("ul>li").index($(".pannel").eq(index).find("ul>li.select").eq(0)) * 30 ;
                $(".pannel").eq(index).find("ul").scrollTop(pos);
                //点击赋值
                _combox.find("ul li").each(function(index){
                    $(this).unbind("click").bind("click",function(){
                        var _val=$(this).attr("default");
                        _combox.find(".comboxValue").val($(this).attr("value"));
                        //显示内容input
                        _combox.find(".comboxText").val(_val);
                        _combox.find(".pannel").hide();
                        _combox.find("ul>li").removeClass("select");
                        $(this).addClass("select");
                        //更新 select选中内容
                        setTimeout(function(){
                            _combox.prev().find("option").each(function(){
                                if($(this).text() == _val){
                                    this.setAttribute("selected","selected");
                                    //添加选中回调函数
                                    if(_this.opts.selectCallBack){
                                        _this.opts.selectCallBack($(this).attr("value"));
                                    }
                                }else{
                                    this.removeAttribute("selected");
                                }
                                
                            });
                        },200);
                    });
                });
                function filter (str) {
                    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&acute;').replace(/"/g, '&quot;').replace(/\|/g, '&brvbar;');
                }
                //添加按钮  鼠标滑动时效果
                $(".pannel").eq(index).find(":last-child").find("input.addsort").hover(function(){
                    $(this).addClass("addsorthover");
                },function(){
                    $(this).removeClass("addsorthover");
                });
                //添加事件
                $(".combox").eq(index).find("input.addsort").click(function(){
                        if(_this.opts.lock){
                            return;
                        }
                        var val =  $(this).prev().find("input.deftest").val();
                        var inputReg = /^([a-zA-Z0-9\-_\u4e00-\u9fa5]){1,20}/;  //增加快速添加图格验证
                        //为空，不处理
                        if( val=="" || !inputReg.test(val)){return;}
                        //执行回调函数
                        if(_this.opts.addListCallBack){
                            //alert(isDouble(val));
                            if(isDouble(val)>-1){
                                //重复  alert("重复了");
                                //给选择好的值定义初始位置
                                var pos = isDouble(val) * 30 ;
                                $(".pannel").eq(index).find("ul").scrollTop(pos);
                                _combox.find("ul li").each(function(index){
                                        if(index!=isDouble(val)){
                                            return;
                                        }
                                        var _val=$(this).text();
                                        _combox.find(".comboxValue").val($(this).attr("value"));
                                        //显示内容input
                                        _combox.find(".comboxText").val(filter(_val));
                                        _combox.find(".pannel").hide();
                                        _combox.find("ul>li").removeClass("select");
                                        $(this).addClass("select");
                                        //更新 select选中内容
                                        _combox.prev().find("option").each(function(){
                                            if($(this).text() == _val){
                                                this.setAttribute("selected","selected");
                                            }else{
                                                this.removeAttribute("selected");
                                            }
                                            
                                        });
                                });
                                return; 
                            }
                            _this.opts.addListCallBack(val);
                            //添加选中回调函数
                            if(_this.opts.selectCallBack){
                                setTimeout(function(){
                                    _this.opts.selectCallBack();
                                },500);
                            }
                        }
                        //清空输入框
                        $(this).prev().find("input.deftest").val("");
                        //内容大于5条记录时，显示的下拉层高度定高
                        var numLi = _combox.find("ul li").length;
                        if(numLi>5){
                            _combox.find("ul").css({
                                height:5*22
                            });
                        }
                        //获取添加的数据是否有重复
                        function isDouble(text){
                            var _opt = _combox.prev().find("option");
                            var sta = -1;
                            for(var o=0,len=_opt.length;o<len;o++){
                                if(_opt.eq(o).text().toLowerCase()==text.toLowerCase()){  //不管字母的大小写识别
                                    sta=o;
                                }
                            }
                            return sta;
                        }
                    });
                    
            });
            $(document).click(function(event){
                if (event.target.nodeName.toLowerCase() !="input") {
                    $(".pannel").hide();
                }
            });
        },
        getValue:function(obj){  //返回select的值
            return obj.next().find(".comboxValue").eq(0).val();
        },
        setValue:function(obj,val){  //赋值给select
            if(val==""){return;}
            var index = $(".combox").index(obj.next());
            var combx = $(".combox").eq(index);
            var pobj = $(".pannel").eq(index).find("ul>li"),ks=0;
            for(var i=0,len=pobj.length;i<len;i++){
                if(pobj[i].getAttribute("value")==val){
                    ks=i;
                }
            }
            var num = $(".pannel").eq(index).find("ul>li").index($(".pannel").eq(index).find("ul>li").eq(ks));
            var vals = $(".pannel").eq(index).find("ul>li").eq(num).attr("default");
            combx.find(".comboxValue").val($(".pannel").eq(index).find("ul>li").eq(num).attr("value"));
            combx.find(".comboxText").val(filter(vals));
            combx.find(".pannel>ul>li").removeClass("select");
            combx.find(".pannel>ul>li").eq(num).addClass("select");
            combx.prev().find("option").each(function(){
                if($(this).attr("value") == val){
                    this.setAttribute("selected","selected");
                }else{
                    this.removeAttribute("selected");
                }
            });
            function filter (str) {
                str = str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&acute;/g, '\'').replace(/&quot;/g, '"').replace(/&brvbar;/g, '\|');
                return str;
            }
        },
        lock:function(sta){
            this.opts.lock = sta;
        },
        setAllowAnyValue:function(val){
            var _this=this;
            _this.opts.allowAnyValue = val;
        },
        //插入元素
        addList:function(obj,tid,text){
            var index = $(".combox").index(obj.next());
            var _combox = $(".combox").eq(index);
            //去掉默认的样式
            _combox.find("ul li").each(function(){
                $(this).removeClass("select");
            });
            var newLi ="<li class='select' default='"+text+"' value='"+tid+"'>"+ text + "</li>";
            _combox.find("ul").append(newLi);
            _combox.find(".pannel").hide();
            //更新 select选中内容
            _combox.prev().find("option").each(function(){
                this.removeAttribute("selected");
            });
            //添加到select中去
            _combox.prev().append("<option selected='selected' manage='1' value='"+tid+"'>"+text+"</option>");
            _combox.find(".comboxValue").val(tid);
            $(".combox").eq(index).find(".comboxText").val(text);
            //添加选中回调函数
            if(this.opts.selectCallBack){
                this.opts.selectCallBack();
            }
            //给pannel增加样式
            $(".pannel li").each(function(){
                $(this).bind("mouseover",function(){
                    $(this).removeClass("out");
                    $(this).addClass("over");
                });
                $(this).bind("mouseout",function(){
                    $(this).addClass("out");
                });
            });
        }
    };
    $.fn.combox.defaults = {
        debug:true,  //设置select可见
        allowAnyValue:false,  //是否可以输入
        position:"down",  //展示方向
        isSelect:true,  //是否可以选择
        maxHeight:150,  //最大高度
        minWidth:50,  //最小宽度
        width:null,  //宽度
        addList:false,  //是否有添加选项功能
        lock:false,  //锁定，不可点击
        addListCallBack:null,  //添加选项回调函数
        selectCallBack:null  //选中添加回调函数
    };
})(jQuery);
