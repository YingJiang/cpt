/**
 * @Author DingKai
 * Create time:2012/03/22
 * File type:components 组件库
 * Descript:基于jquery，开发一些网站页面中用到的小组件，方便维护和运用; 标签切换/锁定标签
 * Contact: QQ群：195553540  
 * Email: cngraph@gmail.com
 */
;(function($){
    /**
     * Tabs 组件
     **/
    var isShow = false;
    $.fn.tab = function(options){
        this.opts = $.extend({},$.fn.tab.defaults,options);
        this._init();
        this.disableArr = [];  //禁用的tab号
    };
    $.fn.tab.prototype ={
        _init:function(){
            var _this = this;
            if($(_this.opts.tabList).length>0){
                $(_this.opts.tabList).each(function(index){
                    $(this).bind(_this.opts.eventType,function(){
                        if($.inArray(index,_this.disableArr)==-1&&(!isShow)&&$(this).attr("class").indexOf(_this.opts.tabActiveClass)==-1){
                            //开始时回调方法
                            if(_this.opts.callBackStartEvent){
                                _this.opts.callBackStartEvent(index);
                            }
                            $(_this.opts.tabList).removeClass(_this.opts.tabActiveClass);
                            $(this).addClass(_this.opts.tabActiveClass);
                            //显示tab内容
                            showContent(index,_this.opts);
                        }
                    });
                });
            }
        },
        setDisable:function(index){  //设置禁用的tab
            var _this=this;
            if($.inArray(index,_this.disableArr)==-1){
                _this.disableArr.push(index);
            }
        },
        setEnable:function(index){  //设置打开tab
            var _this = this;
            var i = $.inArray(index,_this.disableArr);
            if(i > -1){
                _this.disableArr.splice(i,1);
            }
        },
        triggleTab:function(index){  //设置显示tab
            $(this.opts.tabList).eq(index).trigger(this.opts.eventType);
        }
    },
    $.fn.tab.defaults = {
        tabList:".tabList li",  //tabs的头部title元素
        contentList:".tabContent",  //tabs的内容样式
        tabActiveClass:"active",  //tabs的激活样式
        tabDisableClass:"disable",  //tabs的隐藏样式
        eventType:"click",  //触发事件类型
        showType:"show",  //显示的效果
        showSpeed:200,  //显示效果的速度（毫秒）
        callBackStartEvent:null,  //事件触发开始时回调方法
        callBackHideEvent:null,  //当内容全部隐藏时回调方法
        callBackShowEvent:null  //当显示完当前tab内容时，回调方法
    };
    //内容显示动画效果
    function showContent(index,opts){
        isShow=true;
        var _this=this;
        switch(opts.showType){
            case "show":  //正常的显示和隐藏
                $(opts.contentList).hide();
                //$(opts.contentList+":visible").hide();
                if(opts.callBackHideEvent){
                    opts.callBackHideEvent(index);
                }
                $(opts.contentList).eq(index).show();
                if(opts.callBackShowEvent){
                    opts.callBackShowEvent(index);
                }
                isShow = false;
                break;
            case "fade":  //渐变的显示和隐藏
                $(opts.contentList+":visible").fadeOut(opts.showSpeed,function(){
                    if(opts.callBackHideEvent){
                        opts.callBackHideEvent(index);
                    }
                    $(opts.contentList).eq(index).fadeIn(function(){
                        if(opts.callBackShowEvent){
                            opts.callBackShowEvent(index);
                        }
                        isShow = false;
                    });
                });
                break;
            case "slide":  //下拉的显示和隐藏
                $(opts.contentList+":visible").slideUp(opts.showSpeed,function(){
                    if(opts.callBackHideEvent){
                        opts.callBackHideEvent(index);
                    }
                    $(opts.contentList).eq(index).slideDown(function(){
                        if(opts.callBackShowEvent){
                            opts.callBackShowEvent(index);
                        }
                        isShow = false;
                    });
                });
                break;
        }
    }
    
})(jQuery);
