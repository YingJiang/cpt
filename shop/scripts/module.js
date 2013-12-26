;(function($){
    /**
     * 图片轮播图(渐隐)
     */
    $.extend($.fn,{
        doImages:function(options){
            var defaults = {
                imgs:null,  //图片对象集合
                thumbs:null,  //标识对象集合
                num:2,  //默认从第几张图片显示
                thumbsClass:"",  //标识的选中样式
                type:"click",  //触发类型
                auto:false,  //是否轮显
                time:3000  //轮显时间间隔
            };
            var opts = $.extend({},defaults,options),sta = true;
            if(!opts.thumbs.length){return;}
            var timers=null;
            
            $(opts.thumbs).each(function(index){
                //点击切换
                if(opts.type == "click"){
                    $(this).bind(opts.type,function(){
                        clearTimeout(timers);
                        sta = !0;
                        imgsPlay(index);
                        sta = !1;
                    });
                }else if(opts.type == "mouseover"){
                    //onmouseover切换
                    $(this).hover(function(){
                        clearTimeout(timers);
                        imgsPlay(index);
                        sta = !1;
                    },function(){
                        sta = !1;
                        imgsPlay(index);
                        sta = !0;
                    });
                }
            });
            //鼠标停留图片上
			/**
            $(opts.imgs).hover(function(){
                sta = !1;
                clearTimeout(timers);
            },function(){
                sta = !0;
                imgsPlay($(opts.imgs).index(this));
            });
            */
            //函数开始
            function imgsPlay(obj){
                var _this,s;
                if(!sta){ return; }
                sta = !1;
                if(typeof obj == "object"){
                    _this = obj;
                    s = $(opts.thumbs).index(_this);
                }else{
                    s = obj%opts.thumbs.length;
                    _this = opts.thumbs[s];
                }
                $(opts.thumbs).removeClass();
                $(_this).addClass(opts.thumbsClass);
                //切换图片时，显示的index最高
                $(opts.imgs).css({
                    display:"block"
                }).removeClass("imgBlock").css("z-index","1").eq(s).attr("class","imgBlock").css("z-index","2").stop(!0,!0).animate({opacity:"+=1"},600,function(){
                    $(opts.imgs).not(this).css("opacity",0);
                    sta = !0;
                });
                if(opts.auto){
                    timers = setTimeout(function(){
                        imgsPlay(s);
                    },opts.time);
                }
                s++;
            }
            //函数结束
            $(opts.imgs[opts.num]).css({display:"block",zIndex:"2"}).attr("class","imgBlock");
            $(opts.thumbs[opts.num]).removeClass().addClass(opts.thumbsClass);
            if(opts.auto){
                imgsPlay(opts.num);
            }
        }
    });
})(jQuery);