/**
 * @Author DingKai
 * Create time:2012/03/22
 * File type:components 组件库
 * Descript:基于jquery，开发一些网站页面中用到的小组件，方便维护和运用; 弹层
 * Contact: QQ群：195553540  
 * Email: cngraph@gmail.com
 */
;(function($){
    /**
     * Dialog组件
     */
    $.fn.dialog = function(para){
        var _this;
		if(!this.length){
			$("<div id="+ this.selector.substr(1) +"></div>").appendTo($("body")[0]);
	        _this = $("#"+this.selector.substr(1));
		}else{
			_this = this;
		}
        //默认传递参数
        var defaults = {
            title: "新信息窗口",  //标题
            width: 300,          //宽度
            height: 0,           //高度
            showClose:true,      //是否显示关闭按钮
            open:false,          //初始化是否显示
            modal:true,          //是否显示模态
            show:"normal",       //显示的形式
            isAutoClose:!1,      //是否自动定时关闭
            url:null,            //页面地址 iframe形式显示
            buttons: null,       //增加的按钮 : [{text:"",icon:"",handler:function(){}}] 
            html: "",            //内容html
            dialogClass:"",      //dialog的样式
            closeCallBack:null   //关闭回调函数
        };
        
        //把arguments传递给defaults
        if(typeof para =="object"){
            var opts = $.extend(defaults, para);
        }
        if(typeof para=="string"){
            if(para in $.fn.dialog.method){
                $.fn.dialog.method[para](_this);
            }
        }
        //创建Dialog原型
        function newDialog(){
            this._init();
        }
        newDialog.prototype = {
            _init:function(){  //加载处理
                if(typeof para=="string"){
                    return;
                }
                //调用生成遮罩方法
                if(opts.modal){
                    this._maskDiv();
                }
                //调用生成窗口方法
                this._addWindow(_this);
                //调用生成底部按钮方法
                if(opts.buttons){
                    this.buttons(opts.buttons);
                }
                //判断窗口是否显示
                if(!opts.open){
                    $.fn.dialog.method["close"](_this);
                }
            },
            _maskDiv:function(){  //生成遮罩层
                var len = $(".maskDiv").length;
                $("body,html").css({"overflow":"hidden"});
                //判断是否已经有生成遮罩的层了，如果有直接显示，没有就生成一个
                /**
                if(len > 0){
                    $(".maskDiv").show();
                    $(".maskDiv").css("height",Math.max(this.getBodyHeight(),this.getDocHeight())+"px");
                    return;
                }**/
                var newDiv = [
                "<div id='masksDiv"+ len +"' class='maskDiv' style='"
                ,"z-index:"+(10000+len)+";width:100%;'></div>"
                ].join(" ");
                $("body").append(newDiv);
                $("#masksDiv"+len).css("height",Math.max(this.getBodyHeight(),this.getDocHeight()));
            },
            _addWindow:function(){  //生成窗口
                var obj = arguments[0];
                var _cssheight=(opts.height==0)?'auto':opts.height;
                obj.css({
                    left:parseInt(this.getDocWidth()/2-opts.width/2),
                    width:opts.width,
                    height:_cssheight,
                    zIndex:10000+$(".maskDiv").length
                });
                obj.removeClass().addClass(opts.dialogClass);
                var newDiv="";
                if(opts.showClose){
                    newDiv = [
                        '<a class="js-close close"></a>'
                    ].join("");
                }
                if(opts.url){
                    obj.html(newDiv + opts.html + '<iframe frameborder="0" src="'+ opts.url +'" width="'+ opts.width +'" height="'+ opts.height +'"/>');
                }else{
                    obj.html(newDiv + opts.html);
                }
                //$(obj.html(newDiv+opts.html)).appendTo('body');
                //判断ie6时，定位高度
                var diaH=(opts.height==0)?obj.height():opts.height;
                var Sys = $.browser;
                if(Sys.version != "6.0"){
                    obj.css({
                        top:parseInt(this.getDocHeight()/2-diaH/2),
                        position:'fixed'
                    });
                }else{
                    obj.css({
                        top:parseInt(this.getDocTop()+(this.getDocHeight()/2-diaH/2))
                    });
                }
                obj.show();
                
                obj.find(".js-close").click(function(){
                    //关闭功能回调函数
                    if(opts.closeCallBack){
                        opts.closeCallBack();
                    }
                    $.fn.dialog.method["close"](obj);
                });
                if(opts.isAutoClose){
                    setTimeout(function(){
                         $.fn.dialog.method["close"](obj);
                    },500);
                }
            },
            buttons:function(){  //生成按钮方法
                var arg = arguments[0];
                for(var i=0;i<arg.length;i++){
                    this.addButton(arg[i]);
                }
                var len = _this.find(">div").eq(2).find(">input");
                for(var j=0;j<len.length;j++){
                    _this.find(">div").eq(2).find(">input").eq(j).bind("click",function(){
                         return arg[_this.find(">div").eq(2).find(">input").index(this)].handler();
                    });
                }
            },
            addButton:function(){  //添加具体的按钮内容
                var butt = arguments[0];
                var buttHtml = "<input type='button' class='dialogBtn' value='"+ butt.text +"'/>";
                _this.find(">div").eq(2).html(_this.find(">div").eq(2).html()+buttHtml);
            },
            getDocTop:function(){  
                return $(document).scrollTop();
            },
            getBodyWidth:function(){  //获取页面的宽度
                return document.body.clientWidth;
            },
            getBodyHeight:function(){  //获取页面的高度
                return document.body.clientHeight;
            },
            getDocWidth:function(){  //获取可见区域宽度
                return document.documentElement.clientWidth;
            },
            getDocHeight:function(){  //获取可见区域高度
                return document.documentElement.clientHeight;
            }
        };
        //对象的方法
        $.fn.dialog.method = {
            close:function(){
                var len =  $(".maskDiv").length;
                $(".maskDiv").eq(len-1).remove();
                arguments[0].hide();
                //关闭功能回调函数
                try{
                    if(opts.closeCallBack !== null){
                        opts.closeCallBack();
                    }
                }catch(e){}
                $("body,html").css({"overflow":"auto"});
            },
            open:function(){
                var obj = arguments[0];
                $(".maskDiv").show();
                var eleH = document.documentElement.clientHeight;
                //判断ie6时，定位高度
                if(Sys.ie!="6.0"){
                    obj.css("top",parseInt(eleH/2 - parseInt(obj.height())/2));  //更新高度
                }
                //设定遮罩层的高度
                $(".maskDiv").css("height",Math.max(document.body.clientHeight,document.documentElement.clientHeight));
                obj.show();
            }
        };
        //生成Dialog实例
        return new newDialog();
    };
})(jQuery);
