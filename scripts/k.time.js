/**
 * @Author DingKai
 * Create time:2012/03/22
 * File type:components 组件库
 * Descript:基于jquery，开发一些网站页面中用到的小组件，方便维护和运用; 倒计时
 * Contact: QQ群：195553540  
 * Email: cngraph@gmail.com
 */
;(function($){
    /**
     *倒计时功能实现
     */
    $.fn.timeDown = function(startTime,lastTime,step){
        this.startTime = startTime;  //开始时间
        this.lastTime = lastTime;  //到期时间
        this.step = step || 1000;  //执行的阶段时间，一般是1秒，即1000
    };
    $.fn.timeDown.prototype = {
        atTime:function(a,b){
            //参数说明：a:到期回调方法，b:倒计时回调方法
            var that = this;
            var e_daysold = (that.lastTime - that.startTime) / (24 * 60 * 60 * 1000);
            var daysold = Math.floor(e_daysold);  //天
            var e_hrsold = (e_daysold - daysold) * 24;
            var hrsold = Math.floor(e_hrsold);  //小时
            var e_minsold = (e_hrsold - hrsold) * 60;
            var minsold = Math.floor((e_hrsold - hrsold) * 60);  //分钟
            var seconds = Math.floor((e_minsold - minsold) * 60);  //秒
            var msSeconds = Math.ceil(Math.floor(((e_minsold - minsold) * 60 - seconds)*1000)/100)*10;
            if(msSeconds ==100){
                msSeconds = 99;
            }
            if(that.startTime >= that.lastTime) {
                arguments[0]();
            }else{
                arguments[1](that.getStr(daysold),that.getStr(hrsold),that.getStr(minsold),that.getStr(seconds),that.getStr(msSeconds));
                that.startTime = parseInt(that.startTime) +that.step;
                setTimeout(function(){that.atTime(a,b);}, that.step);
            }
        },
        getStr:function(num){
            return num.toString().length < 2 ? "0" + num : num ;
        }
    };
})(jQuery);
