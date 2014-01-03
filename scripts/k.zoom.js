/**
 * @author dingkai
 */
;(function(){
    $.extend($.fn,{
       zoom: function(options){
           var defaults, that = this,opts,src,zoomObj,prop;
           defaults = {
               prop:1,  //放大比例
               src: null,  //选中放大区域
               zoomObj: null, //放置放大图片的容器
               miniBox:null,
               prev:null,
               next:null
           };
           opts = $.extend({},defaults,options);
           src = opts.src;
           zoomObj = opts.zoomObj;
           prop = opts.prop;
           that.mousemove(function(e){
               var x,y,x1,y1,diffX,diffY,w,h,W,H;
               //设置背景图片
               //容器的大小
               W = that.width();
               H = that.height();
               //鼠标的绝对坐标
               x = e.pageX;
               y = e.pageY;
               //容器的绝对位置
               x1 = that.offset().left;
               y1 = that.offset().top;
               //选框的大小
               w = src.width();
               h = src.height();
               //鼠标的相对坐标
               diffX = x - x1;
               diffY = y - y1;
               //求X方向
               if(diffX < w/2){
                   src.show().css("left",0);
                   zoomObj.show().css("backgroundPositionX",0);
               }else if((W-w/2) < diffX && diffX <= W){
                   src.show().css("left",W-w);
                   zoomObj.show().css("backgroundPositionX",-Math.floor((W-w)*prop));
               }else{
                   var $x = diffX - w/2;
                   src.show().css("left",$x);
                   zoomObj.show().css("backgroundPositionX",-Math.floor($x*prop));
               }
               //求Y方向
               if(diffY < h/2){
                   src.show().css("top",0);
                   zoomObj.show().css("backgroundPositionY",0);
               }else if( (H-h/2) < diffY && diffY <= H){
                   src.show().css("top",H-h);
                   zoomObj.show().css("backgroundPositionY",-Math.floor((H-h)*prop));
               }else{
                   var $y = diffY - h/2;
                   src.show().css("top",$y);
                   zoomObj.show().css("backgroundPositionY",-Math.floor($y*prop));
               }
               if(diffX > W || diffY > H){
                   src.hide();
                   zoomObj.hide();
               }
               
           });
           that.mouseleave(function(){
               src.hide();
               zoomObj.hide();
           });
           
           //加载图片方法
           var box = opts.miniBox.find("ul").eq(0);
           var sig = opts.miniBox.find("li").eq(0).width();
           
           //下一张
           opts.next.bind("click",function(){
               if(parseInt(box.css("marginLeft"))-opts.miniBox.width() >= -sig * (opts.miniBox.find("li").length-1)){
                   box.stop(!0,!0).animate({marginLeft:"-="+sig},200,function(){
                       endFront();
                   });
               }
           });
           //上一张
           opts.prev.bind("click",function(){
               if(parseInt(box.css("marginLeft")) >= 0){
                   return;
               }
               box.stop(!0,!0).animate({marginLeft:"+="+sig},200,function(){
                    endFront();
               });
           });
           //点击缩略图
           opts.miniBox.find("li").bind("click",function(){
               var bSrc = $(this).find("a").eq(0).data("large"), mSrc = $(this).find("a").eq(0).data("mini");
               opts.miniBox.find("li").removeClass("on");
               $(this).addClass("on");
               that.find("img").eq(0).attr("src",mSrc);
               zoomObj.css("background-image","url("+ bSrc +")");
           });
           //初始化第一张显示
           opts.miniBox.find("li").eq(0).click();
           endFront();
           
           function endFront(){
               var l =opts.miniBox.width() - parseInt(box.css("marginLeft"));
               var lis = sig * (opts.miniBox.find("li").length-1);
               if(lis < opts.miniBox.width()){
                   opts.prev.hide();
                   opts.next.hide();
               }
               l == opts.miniBox.width() ? opts.prev.addClass("un-prev") : opts.prev.removeClass("un-prev");
               l > lis ? opts.next.addClass("un-next") : opts.next.removeClass("un-next");
           }
       }
    });
})();
