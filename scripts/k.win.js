/**
 * @Author DingKai
 * Create time:2012/03/22
 * File type:components 组件库
 * Descript:基于jquery，开发一些网站页面中用到的小组件，方便维护和运用; 模拟window中的提示框 alert/comfirm/prompt
 * Contact: QQ群：195553540  
 * Email: cngraph@gmail.com
 */
;(function($){
    /**
     * 模拟window中的提示框 alert/comfirm/prompt
     */
    $.fn.win={
        //提示信息 alert
        alert:function(text,type){
            //参数说明：text:提示文字信息，type:提示类型,有"ok"和"error"类型  "warm" 类型
            var iconClass;
            switch (type){
                case "ok":
                    iconClass = "true";
                    break;
                case "error":
                    iconClass = "false";
                    break;
                case "warm":
                    iconClass = "warm";
                    break;
                default:
                    iconClass = "true";
            }
            var _html ='<div class="alertTips alert"><span class="altconfirm '+iconClass+' png">'+text+'</span></div>';
            $("body").append(_html);
            if($.browser.msie){
                setTimeout(function(){
                    $(".alertTips").remove();
                },2000);
            }else{
                setTimeout(function(){
                    $(".alertTips").animate({opacity:0},1000,function(){
                        $(".alertTips").remove();
                    });
                },3000);
            }
        },
        //定位提示tips
        posTips:function(obj,text,way,pos,func,classNames){
            /* 参数说明：obj:要定位的对象
             * text：显示的文字
             * way:位置：上下(up/down)
             * pos:左中右(left/center/right)
             * func:回调函数  宽度:223px
             * classNames 样式名称
             */
            setTimeout(function(){
                var _left,_top,_html,classSpan;
                _left = parseInt(obj.width()/2);
                //_top = Math.max(parseInt(obj.height()),30);
                _top = 30;
                //取位置
                if(way == "up"){
                    switch (pos){
                        case "left":
                            _left = obj.offset().left-190;
                            classSpan = "tipsupward-l";
                            break;
                        case "center":
                            _left = _left-155 ;
                            classSpan = "tipsupward-c";
                            break;
                        case "right":
                            _left = obj.offset().left-300;
                            classSpan = "tipsupward-r";
                            break;
                        default:
                            classSpan = "tipsupward-l";
                            return;
                    }
                }else{
                    switch (pos){
                        case "left":
                            _left = _left -25;
                            classSpan = "tipsdownward-l";
                            break;
                        case "center":
                            _left = _left - 100;
                            classSpan = "tipsdownward-c";
                            break;
                        case "right":
                            _left = _left - 190;
                            classSpan = "tipsdownward-r";
                            break;
                        default:
                            classSpan = "tipsdownward-l";
                            return;
                    }
                }
                _html=[
                    '<span class="newposTips" >'
                        ,'<span class="tipstopbg '+classNames+'">'
                            ,'<span class="tipsbottombg">'
                                ,'<span class="tipsarray '+classSpan+'"></span>'
                                ,'<span class="tipscontent">'+text+'</span>'
                                ,'<span class="tipsbutton"><em>我知道了</em></span>'
                            ,'</span>'
                        ,'</span>'
                    ,'</span>'
                ].join("");
                obj.parent().append(_html);
                if(way == "down"){
                    _top = _top - parseInt($(".tipstopbg").height()+obj.height());
                }
                //闪动效果 
                if(way == "up"){
                    setTimeout(function(){
                        $(".tipstopbg").animate({top:"-=5"},200).animate({top:"+=5"},200).animate({ top:"-=5"},200).animate({top:"+=5"},200);
                    },1000);
                }else{
                    setTimeout(function(){
                        $(".tipstopbg").animate({top:"+=5"},200).animate({top:"-=5"},200).animate({ top:"+=5"},200).animate({top:"-=5"},200);
                    },1000);
                }
                // 删除tips提示
                $(".tipsbutton em").die().live("click",function(){
                    func();
                    $(this).parents(".newposTips").remove();
                });
            },1500);
            
        },
        //定位confirm
        confirm:function(obj,text,func,way){
            if($("p.btcontainer").length==1){
                return;
            }
            //参数说明：obj：要定位的对象，text：显示的文字，func：回调函数
            var _left,_top,altConfirmUp="";
            _left = parseInt(obj.offset().left)+parseInt(obj.width()/2)-120;
            _top = parseInt(obj.offset().top)+ obj.height();
            if(way == "up"){
                _top = parseInt(obj.offset().top)+ obj.height();
                altConfirmUp="altconfirmup";
            }else{
                _top = parseInt(obj.offset().top)-131;
            }
            var _html=[
                      '<div style="height:0;" class="confirmclass">'
                      ,'<div class="altdiv '+altConfirmUp+' png">'
                        ,'<span class="altconfirm png">'+text+'</span>'
                        ,'<p class="btcontainer"><a href="javascript:void(0);" class="submitbtn confirm-btn">确认</a>&nbsp;<a href="javascript:void(0);" class="submitbtn cancel-btn">取消</a></p>'
                      ,'</div>'
                      ,'</div>'
                      ].join("");
            $("body").append(_html);
            
            $(".altdiv").css({
                top:_top,
                left:_left
            });
            $(".btcontainer .confirm-btn").click(function(){
                $(this).parent().parent().parent().find("shape").remove();
                if(func){
                    func();
                }
                $(this).parent().parent().parent().remove();
            });
            $(".btcontainer .cancel-btn").click(function(){
                $(this).parent().parent().parent().find("shape").remove();
                $(this).parent().parent().parent().remove();
            });
        },
        //相对居中confirm
        confirmCenter:function(obj,text,func){
            if($("div.altdivCenter").length==1) {
                return;
            }
            //参数说明：obj：要定位的对象，text：显示的文字，func：回调函数
            var _left = (document.documentElement.clientWidth)/2-131;
            var _top = $(window).scrollTop()+(document.documentElement.clientHeight)/2-120;
            var _html=[
                      '<div style="height:0;" class="confirmclass">'
                      ,'<div class="altdivCenter">'
                        ,'<span class="altconfirm">'+text+'</span>'
                        ,'<p class="btcontainer"><a href="javascript:void(0);" class="submitbtn confirm-btn">确认</a>&nbsp;<a href="javascript:void(0);" class="submitbtn cancel-btn">取消</a></p>'
                      ,'</div>'
                      ,'</div>'
                      ].join("");
            $("body").append(_html);
            
            $(".altdivCenter").css({
                top:_top,
                left:_left
            });
            $(".btcontainer .confirm-btn").click(function(){
                $(this).parent().parent().parent().find("shape").remove();
                if(func){   
                    func();
                }
                $(this).parent().parent().remove();
            });
            $(".btcontainer .cancel-btn").click(function(){
                $(this).parent().parent().parent().find("shape").remove();
                $(this).parent().parent().remove();
            });
        }
    };
})(jQuery);
