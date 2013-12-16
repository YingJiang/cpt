/**
 * @Author DingKai
 * Create time:2012/03/22
 * File type:components 组件库
 * Descript:基于jquery，开发一些网站页面中用到的小组件，方便维护和运用; 输入框sugestion
 * Contact: QQ群：195553540  
 * Email: cngraph@gmail.com
 */
;(function($){
    /**
     * TextInput组件
     **/
    $.fn.textInput = function(ele,para){
        this.element = ele;
        this.opts = $.extend({},$.fn.textInput.defaults,para);
        this.init();
    };
    $.fn.textInput.prototype={
        init:function(){
            var thisObj = this;
            var _this = this.element;
            var _html=[
                    '<div class="handlist" id="jqury-handlist"><ul></ul></div>'
                ].join("");
            $(_html).insertAfter(_this);
            var newUl = _this.next(".handlist").find("ul");
            _this.next(".handlist").css({
                height:'190px'
            }).hide();
            
            _this.keyup(function(){
                if($(_this).val()==""){
                    return;
                }
                var textValue = $(_this).val();
                $.ajax({
                    url:thisObj.opts.url,
                    data:"nickName="+encodeURI(textValue),
                    dataType:"json",
                    type:"GET",
                    success:function(data){
                        //只输入不点击时检查
                        if(data.length==0){
                            $(_this).attr("to_user_id",0);
                        }else{
                            for(var len=data.length;len--;){
                                if(data[len].nickname == $(_this).val()){
                                    $(_this).attr("to_user_id",data[len].id);
                                }else{
                                    $(_this).attr("to_user_id",0);
                                }
                            }
                        }
                        //显示list
                        insertList(data);
                        
                        //更新高度
                        if(newUl.find('li').length > 0 && newUl.find('li').length < 6){
                            _this.next(".handlist").height(38 * newUl.find('li').length +'px');
                        }else{
                            _this.next(".handlist").height('190px');
                        }
                        _this.next().slideDown("slow");
                    }
                });
                
            });
            $(document).bind("click",function(){
                _this.next().hide();
            });
            function insertList(obj){
                var jsonObj = obj;
                var li="";
                for(var i=0,len=jsonObj.length;i<len;i++){
                    li+="<li id='"+jsonObj[i].id+"' class='cf' realName='"+jsonObj[i].nickname+"'><img src='"+jsonObj[i].avatarTiny+"'/>&nbsp;<span>"+jsonObj[i].displayName+"</span></li>";
                }
                
                newUl.html(li);
                newUl.find("li").each(function(){
                    $(this).bind("click",function(){
                        _this.val($(this).attr("realName"));
                        _this.attr("to_user_id",$(this).attr("id"));
                    });
                });
                //定义div高度
            }
            var _hover = $('#jqury-handlist ul li').live('mouseover' ,function(){
                $('#jqury-handlist ul li').removeClass('hover');
                $(this).addClass('hover');
            });
        }
    };
    $.fn.textInput.defaults = {
        url:"",  //请求地址
        height:100,  //高度
        width:100  //最小宽度
    };
})(jQuery);
