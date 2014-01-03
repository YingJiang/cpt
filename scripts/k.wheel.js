/**
 * @author dingkai
 * 模拟滚动条
 */
(function($){
    $.extend($.fn,{
        wheel:function(options){
            var defaults = {
                type:1,  //滚动条方向 1:竖向  ，2:横向 
                box:null,  //容器的obj
                scrBtn:null,  //滚动条的obj
                container:null,  //内容的obj
                type:"1", //显示类型，参数竖滚动条："1",横滚动条："2"
                arrow:!1,  //是否显示上下箭头
                bottom:!1,  //是否显示一键到底的按钮
                maxHeight:400
            };
            var opts = $.extend({},defaults,options);
            var that = opts.box;
            
            var wheel = function(event) {
                    var delta = 0,e = event || window.event;
                    e.wheelDelta ?  delta = e.wheelDelta / 120 : delta = -e.detail / 3;  
                    if (delta){
                        handle(delta);
                    }
                    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0;
                    if (e.preventDefault){
                        e.preventDefault();
                    }
                    e.returnValue = !1;  
            };

            if (window.addEventListener) {  
                that.addEventListener('DOMMouseScroll', wheel, !1);  
            }
            that.onmousewheel = wheel;
            $(that).find(".tt").eq(0).mouseenter(function(){
                $(this).addClass("wt");
            }).mouseleave(function(){
                $(this).removeClass("wt");
            });
            $(opts.box).css({width:opts.container.width()});
            //初始化滚动条显示的高度
            if(opts.type == 1){
                opts.container.height() >= opts.maxHeight ? $(opts.box).css({height:opts.maxHeight}) : $(opts.box).css({height:opts.container.height()});
            }else{
                var ow = 0;
                opts.container.find("li").each(function(){
                    ow += $(this).width();
                });
                opts.container .css("width",ow);
                opts.container.width() >= opts.maxWidth ? $(opts.box).css({width:opts.maxWidth}) : $(opts.box).css({width:opts.container.width()});
            }
            
            setTimeout(function(){
                initBtn(); 
            },300);
            
            //滚动条拖动事件
            opts.scrBtn.mousedown(function(e){
                if(opts.type == 1){
                    var dt = e.pageY;
                    var top = parseInt(opts.scrBtn.css("top"));
                }else{
                    var dt = e.pageX;
                    var top = parseInt(opts.scrBtn.css("left"));
                }
                var o = opts.scrBtn;
                //按照鼠标移动
                $(document).mousemove(function(evt){
                    if(opts.type == 1){
                       var ddt = evt.pageY;
                       var diff = ddt-dt;
                       var tops = top+diff;
                       o.css("top",tops);
                       //按照比例来计算内容top：滚动条下面到容器下边缘的距离和容器的比 等于 内容底部到容器下边缘的距离和内容高度的比
                       var a1 = ($(that).height()-tops-o.height()) * opts.container.height() / $(that).height();
                       var h1 = Math.floor(opts.container.height() - $(that).height() - a1);
                       opts.container.css("top",-h1);
                       if(checkEnd(o)){
                           return;
                       }
                       e.stopPropagation();
                       if (e.preventDefault){
                          e.preventDefault();
                       }
                       e.returnValue = !1;  
                    }else{
                       var ddt = evt.pageX;
                       var diff = ddt-dt;
                       var tops = top+diff;
                       o.css("left",tops);
                       //按照比例来计算内容top：滚动条下面到容器下边缘的距离和容器的比 等于 内容底部到容器下边缘的距离和内容高度的比
                       var a1 = ($(that).width()-tops-o.width()) * opts.container.width() / $(that).width();
                       var h1 = Math.floor(opts.container.width() - $(that).width() - a1);
                       opts.container.css("left",-h1);
                       if(checkEnd(o)){
                           return;
                       }
                       e.stopPropagation();
                       if (e.preventDefault){
                          e.preventDefault();
                       }
                       e.returnValue = !1;  
                    }
                });
                //鼠标up时
                $(document).mouseup(function(e){
                    if(checkEnd(o)){
                        return;
                    }
                    $(document).unbind("mousemove");
                    e.stopPropagation();
                    if (e.preventDefault){
                        e.preventDefault();
                    }
                    e.returnValue = !1;  
                });
                e.stopPropagation();
                if (e.preventDefault){
                    e.preventDefault();
                }
                e.returnValue = !1;  
            });


            //内容跟着滚动条滚动时的高度
            var handle = function(delta) {
                var random_num = Math.floor((Math.random() * 100) + 50);  
                if (delta < 0) {  
                    toggle(random_num,-1);
                    return;  
                } else {  
                    toggle(random_num,1);
                    return;
                }
            }; 
            //计算初始化滚动条的高度
            function initBtn(){
                var h = $(that).height(),$h = $(that).width(), h1 = opts.container.height(), $h1 = opts.container.width(), n;
                if(opts.type == 1){
                    if(h1 > h){
                        n = Math.floor(h/h1*100)/100;
                        if(n*100 < 10){
                            n = 0.1;
                        }
                        opts.scrBtn.css("height",n*parseInt($(that).height()));
                    }
                }else{
                    if($h1 > $h){
                        n = Math.floor($h/$h1*100)/100;
                        if(n*100 < 10){
                            n = 0.1;
                        }
                        opts.scrBtn.css("width",n*parseInt($(that).width()));
                    }
                }
                
            }
            //滚动方向和距离计算
            function toggle(n,way){
                var ctn = opts.container;
                var wbx = $(that);
                var th;
                if(opts.type == 1){
                    var t = parseInt(ctn.css("top")) || 0;
                    if(way > 0){
                        //向上
                        if(t >= 0){
                            clean();
                            return false;
                        }
                        ctn.css("top",t+n);
                    }else{
                        //向下
                        if(wbx.height()-t >= ctn.height()){
                            checkEnd(ctn);
                            return false;
                        }
                        ctn.css("top",t-n);
                    }
                    th = wbx.height() - opts.scrBtn.height()-(((ctn.height() - wbx.height() + parseInt(ctn.css("top")))*wbx.height())/ctn.height());
                    opts.scrBtn.css("top",th);
                    checkEnd(ctn);
                }else{
                    var t = parseInt(ctn.css("left")) || 0;
                    if(way > 0){
                        //向上
                        if(t >= 0){
                            clean();
                            return false;
                        }
                        ctn.css("left",t+n);
                    }else{
                        //向下
                        if(wbx.width()-t >= ctn.width()){
                            checkEnd(ctn);
                            return false;
                        }
                        ctn.css("left",t-n);
                    }
                    th = wbx.width() - opts.scrBtn.width()-(((ctn.width() - wbx.width() + parseInt(ctn.css("left")))*wbx.width())/ctn.width());
                    opts.scrBtn.css("left",th);
                    checkEnd(ctn);
                }
            }
            function checkEnd(obj){
                if(opts.type == 1){
                    var t = parseInt(obj.css("top")), h = obj.height(), H = $(that).height();
                    if(h < H){
                        if(t+h<h){
                            clean();
                            return !0;
                        }
                        if(t + h >= H){
                            end();
                            return !0;
                        }else{
                            return !1;
                        }
                    }else{
                        if(H - t >= h){
                            end();
                            return !0;
                        }else{
                            return !1;
                        }
                    }
                }else{
                    var t = parseInt(obj.css("left")), h = obj.width(), H = $(that).width();
                    if(h < H){
                        if(t+h<h){
                            clean();
                            return !0;
                        }
                        if(t + h >= H){
                            end();
                            return !0;
                        }else{
                            return !1;
                        }
                    }else{
                        if(H - t >= h){
                            end();
                            return !0;
                        }else{
                            return !1;
                        }
                    }
                }
            }
            //到低端
            function end(){
                if(opts.type == 1){
                    var h = $(that).height();
                    opts.container.css("top",h-opts.container.height());
                    opts.scrBtn.css("top",h-opts.scrBtn.height());
                }else{
                    var h = $(that).width();
                    opts.container.css("left",h-opts.container.width());
                    opts.scrBtn.css("left",h-opts.scrBtn.width());
                }
            }
            //初始化清零
            function clean(){
                if(opts.type == 1){
                    opts.container.css("top",0);
                    opts.scrBtn.css("top",0);
                }else{
                    opts.container.css("left",0);
                    opts.scrBtn.css("left",0);
                }
            }
        }
    });
})(jQuery);