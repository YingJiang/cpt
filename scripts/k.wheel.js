/**
 * @author dingkai
 * 模拟滚动条
 */
(function($){
    $.extend($.fn,{
        wheel:function(options){
            var defaults = {
                box:null,  //容器的obj
                scrBtn:null,  //滚动条的obj
                container:null,  //内容的obj
                type:"1", //显示类型，参数竖滚动条："1",横滚动条："2"
                arrow:!1,  //是否显示上下箭头
                bottom:!1  //是否显示一键到底的按钮
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
            //初始化滚动条显示的高度
            initBtn();  
            
            //滚动条拖动事件
            opts.scrBtn.mousedown(function(e){
                var dt = e.pageY;
                var top = parseInt(opts.scrBtn.css("top"));
                var o = opts.scrBtn;
                //按照鼠标移动
                $(document).mousemove(function(evt){
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
                var h = $(that).height(),h1 = $("#wcont").height(), n;
                if(h1>h){
                    n = Math.floor(h/h1*100)/100;
                    if(n*100 < 10){
                        n = 0.1;
                    }
                    opts.scrBtn.css("height",n*parseInt($(that).height()));
                }else{
                    return;
                }
            }
            //滚动方向和距离计算
            function toggle(n,way){
                var ctn = opts.container;
                var wbx = $(that);
                var t = parseInt(ctn.css("top")) || 0;
                var th;
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
            }
            function checkEnd(obj){
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
            }
            //到低端
            function end(){
                var h = $(that).height();
                opts.container.css("top",h-opts.container.height());
                opts.scrBtn.css("top",h-opts.scrBtn.height());
            }
            //初始化清零
            function clean(){
                opts.container.css("top",0);
                opts.scrBtn.css("top",0);
            }
            
        }
    });
})(jQuery);