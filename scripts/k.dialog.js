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
        var _this, selector = this.selector;
        this.length ? _this = this : _this = (function(){
            $('<div id="'+selector.substr(1)+'"></div>').appendTo($("body").eq(0));
            return $(selector);
        })();
        //默认传递参数
        var defaults = {
            title: "新信息窗口",  //标题
            width: 300,          //宽度
            height: 0,           //高度
            showClose:true,      //是否显示关闭按钮
            open:false,          //初始化是否显示
            modal:true,          //是否显示模态
            show:"normal",       //显示的形式
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
                //判断是否已经有生成遮罩的层了，如果有直接显示，没有就生成一个
                if(len > 0){
                    $(".maskDiv").show().css("height",Math.max(this.getBodyHeight(),this.getDocHeight())+"px");
                    return;
                }
                $("body").append("<div id='masksDiv"+ len +"' class='maskDiv'></div>");
                $("#masksDiv"+len).css("height",Math.max(this.getBodyHeight(),this.getDocHeight()));
            },
            _addWindow:function(){  //生成窗口
                var obj = arguments[0];
                var _cssheight=(opts.height==0) ? 'auto' : opts.height;
                obj.css({
                    left:parseInt(this.getDocWidth()/2-opts.width/2),
                    width:opts.width,
                    height:_cssheight,
                    zIndex:10001
                });
                obj.removeClass().addClass(opts.dialogClass);
                var newDiv="";
                if(opts.showClose){
                    newDiv = '<a class="js-close close"></a>';
                }
                $(obj.html(newDiv+opts.html)).appendTo('body');
                //判断ie6时，定位高度
                var diaH=(opts.height==0) ? obj.height() : opts.height;
                if( !($.browser.msie && parentInt($.browser.version) == 6)){
                    obj.css({
                        top:parseInt(this.getDocHeight()/2-diaH/2),
                        position:'fixed'
                    });
                }
                obj.show().find(".js-close").click(function(){
                    //关闭功能回调函数
                    if(opts.closeCallBack){
                        opts.closeCallBack();
                    }
                    $.fn.dialog.method["close"](obj);
                });
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
            getBodyWidth:function(){   //获取页面的宽度
                return document.body.clientWidth;
            },
            getBodyHeight:function(){  //获取页面的高度
                return document.body.clientHeight;
            },
            getDocWidth:function(){    //获取可见区域宽度
                return document.documentElement.clientWidth;
            },
            getDocHeight:function(){   //获取可见区域高度
                return document.documentElement.clientHeight;
            }
        };
        $.fn.dialog.method = {
            close:function(){
                $(".maskDiv").hide();
                arguments[0].hide();
            },
            open:function(){
                var obj = arguments[0];
                $(".maskDiv").show();
                var eleH = document.documentElement.clientHeight;
                //判断ie6时，定位高度
                if(!($.browser.msie && parentInt($.browser.version) == 6)){
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
