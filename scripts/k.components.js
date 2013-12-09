/**
 * @Author DingKai
 * Create time:2012/03/22
 * Update time:2013/12/9
 * File type:components 组件库
 * Descript:基于jquery，开发一些网站页面中用到的小组件，方便维护和运用。
 * Contact: QQ群：195553540  
 * Email: cngraph@gmail.com
 * 
 * 1、dialog
 * 2、model alert 模拟window中的提示框 alert/comfirm/prompt
 * 3、combox  多功能下拉列表框
 * 4、tabs  标签切换
 * 5、textInput  输入框sugestion
 * 6、validate  表单验证
 * 7、userOperation对象方法
 * 8、showTimes 倒计时
 * 9、delayImg 图片延迟加载
 * 10、asynchronous js 动态加载js文件
 * 11、ad images 图片轮播
 * 12、user card 名片功能
 */

(function($){
	/**
	 * Dialog组件
	 */
	$.fn.dialog = function(para){
		var _this = this;
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
					$(".maskDiv").show();
					$(".maskDiv").css("height",Math.max(this.getBodyHeight(),this.getDocHeight())+"px");
					return;
				}
				var newDiv = "<div id='masksDiv"+ len +"' class='maskDiv'></div>";
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
					zIndex:10001
				});
				obj.removeClass().addClass(opts.dialogClass);
				var newDiv="";
				if(opts.showClose){
					newDiv = [
						'<a class="js-close close"></a>'
					].join("");
				}
				$(obj.html(newDiv+opts.html)).appendTo('body');
				//判断ie6时，定位高度
				var diaH=(opts.height==0)?obj.height():opts.height;
				if( !($.browser.msie && parentInt($.browser.version) == 6)){
					obj.css({
						top:parseInt(this.getDocHeight()/2-diaH/2),
						position:'fixed'
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
	
	/**
	 * 模拟window中的提示框 alert/comfirm/prompt
	 */
	$.fn.win={
	    //提示信息
		alert:function(text,type){
			//参数说明：text:提示文字信息，type:提示类型,有"ok"和"error"类型
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
		posAlert:function(obj,text){
			//参数说明：obj:要定位的对象，text：显示的文字
			var _left = parseInt(obj.offset().left)+parseInt(obj.width()/2)-120;
			var _top = parseInt(obj.offset().top)-131;
			var _html=[
					'<div class="positionAlt altdiv png">'
					,'<span class="altsuccess png">'+text+'</span>'
					,'</div>'
				].join("");
			$("body").append(_html);
			$(".altdiv").css({
				top:_top,
				left:_left
			});
			if(navigator.userAgent.indexOf("MSIE")>0){
				setTimeout(function(){
					$(".positionAlt").remove();
				},2000);
			}else{
				setTimeout(function(){
					$(".positionAlt").animate({opacity:0},1000,function(){
					$(".positionAlt").remove();
				});
				},2000);
			}
		},
		posTips:function(obj,text,way,pos,func,classNames){
			/*参数说明：obj:要定位的对象，
			 *text：显示的文字,
			 *way:位置：上下(up/down),
			 *pos:左中右(left/middle/right),
			 *func:回调函数  宽度:223px
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
						case "middle":
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
						case "middle":
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
						$(".tipstopbg").animate({	top:"-=5"},200).animate({top:"+=5"},200).animate({	top:"-=5"},200).animate({top:"+=5"},200);
					},1000);
				}else{
					setTimeout(function(){
						$(".tipstopbg").animate({	top:"+=5"},200).animate({top:"-=5"},200).animate({	top:"+=5"},200).animate({top:"-=5"},200);
					},1000);
				}
				// 删除tips提示
				$(".tipsbutton em").die().live("click",function(){
					func();
					$(this).parents(".newposTips").remove();
				});
			},1500);
			
		},
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
		//居中
		confirmCenter:function(obj,text,func){
			if($("div.altdivCenter").length==1) {
				return;
			}
			//参数说明：obj：要定位的对象，text：显示的文字，func：回调函数
			var _left = (document.documentElement.clientWidth)/2-131;
			var _top = $(window).scrollTop()+(document.documentElement.clientHeight)/2-120;
			var _html=[
					  '<div style="height:0;" class="confirmclass">'
					  ,'<div class="altdivCenter png">'
						,'<span class="altconfirm png">'+text+'</span>'
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
	
	/**
	 * Combox组件内容
	 */
	$.fn.combox=function(ele,para){  //ele:对象,para:参数设置
		this.element = ele;
		this.opts = $.extend({},$.fn.combox.defaults,para);
		this._init();
	};
	$.fn.combox.prototype = {
		_init:function(){
			var _this = this;
			//给combox定义宽度和高度
			var pannelWidth;
			var addDiv = "";
			if(_this.opts.width){
				pannelWidth = _this.opts.width;
			}else{
				if(_this.element.width()<_this.opts.minWidth){
					pannelWidth = _this.opts.minWidth;
				}else{
					pannelWidth = _this.element.width();
				}
			}
			//是否显示select
			if(!_this.opts.debug){
				_this.element.hide();
			}
			var newEle = ["<span class='combox' style='width:"+pannelWidth+"px;'><input class='comboxText' style='width:"+(pannelWidth-37)+"px' readonly='readonly' type='text' value=''/>"
			,"<span class='comboxArrow'></span>"
			,"<input class='comboxValue' type='hidden' value='' /></span>"
			].join("");
			//插入模拟的select
			$(newEle).insertAfter(_this.element);
			if(!_this.opts.pleaseSelect==""){
				_this.element.next().find(".comboxText").eq(0).val(_this.opts.pleaseSelect);
			}
			//为Pannel中插入select内容
			var options = _this.element.find("option");
			var li="",ul="";
			for(var i = 0;i<options.length;i++){
				if(options.eq(i).val()!=""){
					if(options.eq(i).attr("manage")==2){
						li+=("<li class='group' value ='"+options.eq(i).val()+"' default='"+options.eq(i).text()+"'>"+$.fn.fixStr(options.eq(i).text(),18,"...")+"</li>");
					}else{
						li+=("<li value ='"+options.eq(i).val()+"' default='"+options.eq(i).text()+"'>"+$.fn.fixStr(options.eq(i).text(),18,"...")+"</li>");
					}
				}
			}
			//添加“add”区域
			if(_this.opts.addList){
				addDiv = "<div class='comboxAdd'>" +
						"<span class='innerborder'>" +
							"<input class='deftest' type='text/css' value='' size='10' maxlength='" + (_this.opts.maxlength == undefined ? "20" : "" + _this.opts.maxlength) + "'/>" +
						"</span> <input class='addsort' type='button' value='添加新图格'/>" +
						"</div>";
			}
			ul = "<div class='pannel' style='width:"+pannelWidth+"px'><ul style='width:"+pannelWidth+"px'>"+li+"</ul>"+addDiv+"</div>";
			//插入pannel
			//$("body").append(ul);
			_this.element.next().append(ul);
			
			
			//给pannel增加样式
			$(".pannel li").each(function(){
				$(this).bind("mouseover",function(){
					$(this).removeClass("out");
					$(this).addClass("over");
				});
				$(this).bind("mouseout",function(){
					$(this).addClass("out");
				});
			});
			//设置可读
			if(!this.opts.isSelect){
				$(".combox").eq(comIdex).find(".comboxText").css({
					"color":"#ccc"
				});
			}
			
			//设置可输入的select
			_this.element.next().find(".comboxText").eq(0).keyup(function(){
				if(_this.opts.allowAnyValue){
					_this.element.next().find(".comboxText").eq(0).removeAttr("readonly");
					var dex = $(".comboxText").index(this);
					var pLeft = $(".combox").eq(dex).offset().left;  //计算居左值
					var pTop = parseInt($(".combox").eq(dex).offset().top + 26);  //计算居顶值
					$(".pannel").eq(index).offset().left = pLeft;  //pannel Left居左值
					$(".pannel").eq(index).offset().top = pTop;  //pannel Top居上值
					$(".pannel").eq(index).css({
						left:pLeft
					});
					$(".pannel").eq(dex).show();
					var value = $(this).val(); 
					var len = $(".pannel").eq(dex).find("li").length;
					$(".pannel").eq(dex).find("li").each(function(){
						if($(this).text().indexOf(value)!=0){
							$(this).hide();
						}else{
							$(this).show("slide");
						}
					});
				}
			});
			//下拉列表显示
			_this.element.next().bind("click",function(e){
				if(_this.opts.lock){
					return;
				}
				var thisDoc = e.target;
				//增加选中区域
				if(!($(thisDoc).attr("class")=="comboxText"||$(thisDoc).attr("class")=="comboxArrow")){
					return;
				}
				$(".pannel").hide();  //先隐藏所有，然后显示当前的pannel
				e.stopPropagation();  //阻止事件冒泡
				if(!_this.opts.isSelect){return;}
				var heightVal = 0;
				var index = $(".combox").index(this);
				var _combox = $(".combox").eq(index);  //获取当前combox
				var _pannel = _combox.find(".pannel");  //获取当前combox下的pannel
				var pLeft = '';  //居左距离
				var pTop = _combox.height();  //计算居顶值，采用的时绝对定位，父元素为相对哦
				//初始化pannel的高度
				var numLi = _pannel.find("ul li").length;
				numLi>5 ? heightVal = _this.opts.maxHeight : heightVal = numLi*30;
				//pannel定位
				_pannel.find("ul").css({height:heightVal});
				_pannel.find(".comboxAdd").css({height:"30px"});  //添加选项区域高度
				if(typeof _this.opts.position == "string" && _this.opts.position =="up"){
					var diffHeight =  $(".combox").eq(index).offset().top - $(".pannel").eq(index).find("ul").eq(0).height();
					$(".pannel").eq(index).css({top:diffHeight});
				}else{
					$(".pannel").eq(index).css({top:'-1px'});
				}
				$(".pannel").eq(index).show();
				//给选择好的值定义初始位置
				var pos = $(".pannel").eq(index).find("ul>li").index($(".pannel").eq(index).find("ul>li.select").eq(0)) * 30 ;
				$(".pannel").eq(index).find("ul").scrollTop(pos);
				//点击赋值
				_combox.find("ul li").each(function(index){
					$(this).unbind("click").bind("click",function(){
						var _val=$(this).attr("default");
						_combox.find(".comboxValue").val($(this).attr("value"));
						//显示内容input
						_combox.find(".comboxText").val(_val);
						_combox.find(".pannel").hide();
						_combox.find("ul>li").removeClass("select");
						$(this).addClass("select");
						//更新 select选中内容
						setTimeout(function(){
							_combox.prev().find("option").each(function(){
								if($(this).text() == _val){
									this.setAttribute("selected","selected");
									//添加选中回调函数
									if(_this.opts.selectCallBack){
										_this.opts.selectCallBack($(this).attr("value"));
									}
								}else{
									this.removeAttribute("selected");
								}
								
							});
						},200);
					});
				});
				function filter (str) {
					str = str.replace(/&/g, '&amp;');
					str = str.replace(/</g, '&lt;');
					str = str.replace(/>/g, '&gt;');
					str = str.replace(/'/g, '&acute;');
					str = str.replace(/"/g, '&quot;');
					str = str.replace(/\|/g, '&brvbar;');
					return str;
				}
				//添加按钮  鼠标滑动时效果
				$(".pannel").eq(index).find(":last-child").find("input.addsort").hover(function(){
					$(this).addClass("addsorthover");
				},function(){
					$(this).removeClass("addsorthover");
				});
				//添加事件
				$(".combox").eq(index).find("input.addsort").click(function(){
						if(_this.opts.lock){
							return;
						}
						var val =  $(this).prev().find("input.deftest").val();
						var inputReg = /^([a-zA-Z0-9\-_\u4e00-\u9fa5]){1,20}/;  //增加快速添加图格验证
						//为空，不处理
						if( val=="" || !inputReg.test(val)){return;}
						
						//执行回调函数
						if(_this.opts.addListCallBack){
							//alert(isDouble(val));
							if(isDouble(val)>-1){
								//重复  alert("重复了");
								//给选择好的值定义初始位置
								var pos = isDouble(val) * 30 ;
								$(".pannel").eq(index).find("ul").scrollTop(pos);
								_combox.find("ul li").each(function(index){
										if(index!=isDouble(val)){
											return;
										}
										var _val=$(this).text();
										_combox.find(".comboxValue").val($(this).attr("value"));
										//显示内容input
										_combox.find(".comboxText").val(filter(_val));
										_combox.find(".pannel").hide();
										_combox.find("ul>li").removeClass("select");
										$(this).addClass("select");
										//更新 select选中内容
										_combox.prev().find("option").each(function(){
											if($(this).text() == _val){
												this.setAttribute("selected","selected");
											}else{
												this.removeAttribute("selected");
											}
											
										});
								});
								return;	
							}
							_this.opts.addListCallBack(val);
							//添加选中回调函数
							if(_this.opts.selectCallBack){
								setTimeout(function(){
									_this.opts.selectCallBack();
								},500);
							}
						}
						//清空输入框
						$(this).prev().find("input.deftest").val("");
						//内容大于5条记录时，显示的下拉层高度定高
						var numLi = _combox.find("ul li").length;
						if(numLi>5){
							_combox.find("ul").css({
								height:5*22
							});
						}
						//获取添加的数据是否有重复
						function isDouble(text){
							var _opt = _combox.prev().find("option");
							var sta = -1;
							for(var o=0,len=_opt.length;o<len;o++){
								if(_opt.eq(o).text().toLowerCase()==text.toLowerCase()){  //不管字母的大小写识别
									sta=o;
								}
							}
							return sta;
						}
					});
					
			});
			$(document).click(function(event){
				if (event.target.nodeName !="INPUT") {
					$(".pannel").hide();
				}
			});
		},
		getValue:function(obj){  //返回select的值
			return obj.next().find(".comboxValue").eq(0).val();
		},
		setValue:function(obj,val){  //赋值给select
			var index = $(".combox").index(obj.next());
			var combx = $(".combox").eq(index);
			var pobj = $(".pannel").eq(index).find("ul>li"),ks=0;
			for(var i=0,len=pobj.length;i<len;i++){
				if(pobj[i].getAttribute("value")==val){
					ks=i;
				}
			}
			var num = $(".pannel").eq(index).find("ul>li").index($(".pannel").eq(index).find("ul>li").eq(ks));
			var vals = $(".pannel").eq(index).find("ul>li").eq(num).attr("default");
			combx.find(".comboxValue").val($(".pannel").eq(index).find("ul>li").eq(num).attr("value"));
			combx.find(".comboxText").val(filter(vals));
			combx.find(".pannel>ul>li").removeClass("select");
			combx.find(".pannel>ul>li").eq(num).addClass("select");
			combx.prev().find("option").each(function(){
				if($(this).attr("value") == val){
					this.setAttribute("selected","selected");
				}else{
					this.removeAttribute("selected");
				}
			});
			function filter (str) {
				str = str.replace(/&amp;/g, '&');
				str = str.replace(/&lt;/g, '<');
				str = str.replace(/&gt;/g, '>');
				str = str.replace(/&acute;/g, '\'');
				str = str.replace(/&quot;/g, '"');
				str = str.replace(/&brvbar;/g, '\|');
				return str;
			}
		},
		lock:function(sta){
			this.opts.lock = sta;
		},
		setAllowAnyValue:function(val){
			var _this=this;
			_this.opts.allowAnyValue = val;
		},
		//插入元素
		addList:function(obj,tid,text){
			var index = $(".combox").index(obj.next());
			var _combox = $(".combox").eq(index);
			//去掉默认的样式
			_combox.find("ul li").each(function(){
				$(this).removeClass("select");
			});
			var newLi ="<li class='select' default='"+text+"' value='"+tid+"'>"+ text + "</li>";
			_combox.find("ul").append(newLi);
			_combox.find(".pannel").hide();
			//更新 select选中内容
			_combox.prev().find("option").each(function(){
				this.removeAttribute("selected");
			});
			//添加到select中去
			_combox.prev().append("<option selected='selected' manage='1' value='"+tid+"'>"+text+"</option>");
			_combox.find(".comboxValue").val(tid);
			$(".combox").eq(index).find(".comboxText").val(text);
			//添加选中回调函数
			if(this.opts.selectCallBack){
				this.opts.selectCallBack();
			}
			//给pannel增加样式
			$(".pannel li").each(function(){
				$(this).bind("mouseover",function(){
					$(this).removeClass("out");
					$(this).addClass("over");
				});
				$(this).bind("mouseout",function(){
					$(this).addClass("out");
				});
			});
		}
	};
	$.fn.combox.defaults = {
		debug:true,  //设置select可见
		pleaseSelect:"",  //初始text
		allowAnyValue:false,  //是否可以输入
		position:"down",  //展示方向
		isSelect:true,  //是否可以选择
		maxHeight:150,  //最大高度
		minWidth:50,  //最小宽度
		width:null,  //宽度
		addList:false,  //是否有添加选项功能
		lock:false,  //锁定，不可点击
		addListCallBack:null,  //添加选项回调函数
		selectCallBack:null  //选中添加回调函数
	};
	
	/**
	 * Tab 组件
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
			    alert(opts.contentList);
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
	
	/**
	 * 表单验证
	 **/
	im.user = {};
	im.user.validate = {
		//检查昵称
		thisObjError:function(obj , val){
			this.animate($(obj).parent());
			$(obj).addClass('errortest').parent().parent().next('span').removeClass().addClass('errortips').show().text(val);
			return false ;
		},
		thisObjTrue:function(obj){
			$(obj).attr('rel' , '1').removeClass('errortest').parent().parent().next('span').css({'display':'inline-block'}).removeClass().addClass('good');
			return true;
		},
		thisFocus:function(obj , val){
			$(obj).removeClass().addClass('deftest').parent().parent().next('span').removeClass().addClass('gray iblock').show().text(val);
			return true ;
		},
		animate:function(obj){
		  obj.animate({left:'+=10'},100);
	      obj.animate({left:'-=10'},100);
	      obj.animate({left:'+=5'},100);
	      obj.animate({left:'-=5'},100);
		},
		checkName:function(obj){
			//得到输入字符的长度 
			var len = this.checkLength($(obj).val());
			
			if(len<4 ){
				this.thisObjError(obj ,'昵称字符范围为4-20之间！');
				return false;
			}else{
				this.thisObjTrue(obj);
				return true;
			}
		},
		//检查电子邮箱
		checkEmail:function(obj , type){
			var regexp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,3})$/;
			var str = $(obj).val();
			var sta = true;
			var _this = this ;
			//过滤中文字
			if(!str){
				this.thisObjError(obj ,'邮箱不能为空');
				sta = false;
			}else{
				if(!regexp.test(str)){
					this.thisObjError(obj ,'邮箱格式不正确');
					sta = false;
				}else{
					if(type){
						this.thisObjTrue(obj);
					}else{
						$(obj).attr('rel' , '1').removeClass('errortest').parent().parent().next('span').hide();
					}
					
				}
			}
			return sta ;
		},
		//检查密码
		checkPassword:function(obj , type){
			var str = $(obj).val();
			var sta = true;
			
			//过滤中文字
			var _this =$(obj).addClass('errortest').parent().parent().next(".errortips");
			if(str){
				sta = this.checkCn(str);
			}
			var len = this.checkLength($(obj).val());
			if ( 5<len && len<17 && sta) {
				if(str.indexOf(' ') == -1){
					if(type){
						this.thisObjTrue(obj);
					}else{
						$(obj).attr('rel' , '1').removeClass('errortest').parent().parent().next('span').hide();
						sta = true;
						return true ;
					}
				}else{
					this.thisObjError(obj ,'您有特殊字符！');
					sta = false;
				}
				//$.ajax
			} else if(str == ""){
				sta = false;
				this.thisObjError(obj ,'密码不能为空');
			}else{
				this.thisObjError(obj ,'密码为6～16个字母、数字或符号，区分大小写！');
				sta = false;
			}
			return sta;
		},
		//检查验证码
		kaptcha:function(obj){
			var str = $(obj).val();
			var sta = true;
			var ajaxSta = true;
			var _this = $(obj) ;
			//var _this =$(obj).addClass('errortest').parent().parent().next(".errortips");
			//过滤中文字
			if(str){
				sta = this.checkCn(str);
			}
			var len = this.checkLength($(obj).val());
			if ( len==4) {
				$.ajax({
					type:"get",
					url:"/captcha/check?captcha="+str,
					dataType:"text",
					success:function(data){
						//alert(eval(eval(data)))
						if(data){
							_this.removeClass('errortest').parent().parent().parent().find('.stata').hide();
							return true;
						}else{
							_this.animate(_this.parent());
							_this.addClass('errortest').parent().parent().parent().find('.stata').show().text('请正确输入！');
							return false ;
						}
					}
				});
			} else{
				this.animate(_this.parent());
				_this.addClass('errortest').parent().parent().parent().find('.stata').show().text('请正确输入！');
				return false ;
			}
			//return ajaxSta;
		},
		//获取字符串的实际长度
		checkLength:function(str){
			var len=0;
			for(var i=0;i<str.length;i++){
				if(str.charCodeAt(i)>255){
					len+=2;
				}else{
					len++;
				}
			}
			return len;
		},
		//检查字符串中是否有中文
		checkCn:function(str){
			var sta = true;
			for(var i=0;i<str.length;i++){
				if(str.charCodeAt(i)>255){
					sta = false;
					break;
				}
			}
			return sta;
		},
		checkCharact:function(str){
			var reg = /^([a-zA-Z0-9\-_\u4e00-\u9fa5]){2,30}$/; 
			if (reg.test(str)){
				return true; 
			}else{
				return false ;
			}
	     	return true;
		},
		service:function(obj){
			return obj.checked;
		},
		//注册昵称检查
		regName:function(obj){
			//得到输入字符的长度 
			var len = this.checkLength($(obj).val());
			var str = $(obj).val();
			var _this = this ;
			
			if(str == ''){
				this.thisObjError(obj , '昵称不能为空');
			}else if(len<4 ){
				this.thisObjError(obj , '昵称不能少于4个字符');
			}else if(len > 30){
				this.thisObjError(obj , '昵称不能超过30个字符');
				
			}else{
				if(!this.checkCharact(str)){
					this.thisObjError(obj , '昵称只支持汉字、英文、下划线和减号');
					return false ;
				}
				_this.thisObjTrue(obj);
				
		   		$.post('/regist/nickname',{userNickname:str},function(data){
					if(typeof eval(data).result != "undefined"){
						_this.thisObjError(obj , data.result);
					}else{
						_this.thisObjTrue(obj);
					}
				},"json");
		   		return true;
			}
		},
		
		regEmail:function(obj){
			var str = $(obj).val();
			var sta = true;
			var _this = this ;
			var regexp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z\u4e00-\u9fa5]{2,4})$/;
			//过滤中文字
			//alert(str);
			if(!str){
				this.thisObjError(obj ,'邮箱不能为空');
				
				//return false ;
			}else{
				if(!regexp.test(str)){
					this.thisObjError(obj ,'您的电子邮箱格式错误');
				}else{
					$(obj).removeClass('errortest').parent().next(".errortips").hide();
			   		$.post('/regist/email',{userEmail:str},function(data){
						if(typeof eval(data).result != "undefined"){
							//_this.show().text(data.result);
							_this.thisObjError(obj ,data.result);
							$(obj).addClass('errortest');
							//__this.animate($(obj).parent());
							return false;
						}else{
							_this.thisObjTrue(obj);
						}
					},"json");
					return true;
				}
			}
		
		},
		
		openEmail:function(obj){
			var str = $(obj).val();
			var sta = true;
			var _this =this;
			//过滤中文字
			if(str){
				//alert(1);
				sta = this.checkCn(str);
			}else{
				_this.thisObjError(obj ,'邮箱不能为空');
				return false ;
			}
			
			if (str.indexOf("@")>1 && str.indexOf(".")>1 && sta) {
				$(obj).removeClass('errortest').parent().next(".errortips").hide();
		   		$.post('/regist/email',{userEmail:str},function(data){
					if(typeof eval(data).result == "undefined" || typeof eval(data).result == ""){
						_this.thisObjError(obj ,'邮箱不存在，请重新输入');
					}else{
						//this.animate($(obj).parent());
						_this.thisObjTrue(obj);
					}
				},"json");
				return true;
			} else{
				_this.thisObjError(obj ,'邮箱格式不正确');
			}
		},
		
		haveEmail:function(obj){
			this.thisObjError(obj ,'该帐号已经被绑定！');
			
		},
		errorPassword:function(obj){
			this.animate($(obj).parent());
			this.thisObjError(obj ,'密码错误，请重试');
		},
		checkMoreEmail:function(mails){
			var str = mails;
			var sta = true;
			var s_space = mails.split(/[, ，]/);
		    var _status = true;
			for(var i=0;i<s_space.length;i++){
				  var mail = $.trim(s_space[i]);
				  if (mail.length > 0){
					  var result = _check(mail);
					  if (result == false){
						  _status =  false;
					  }
				  }
			  }
		    return _status;
			function _check(str){
				//过滤中文字
				if(str){
					sta = im.user.validate.checkCn(str);
				}
				if (str.indexOf("@")>1 && str.indexOf(".")>1 && sta) {
					return true;
				} else{
					return false;
				};
			}
		},
		//检查表单按钮的显示提交问题
		checkForm:function(opt){
			var _defaults={
				objValue:{ele:null,type:"",func:null,defaultSta:true},  //[{ele:,type:,func:,defaultSta:false}]要验证表单元素对象{ele:元素，type：元素类型，func：验证的方法,defaultSta默认是否检测}
				element:null,  //按钮对象
				openClass:"",  //可点击样式
				closeClass:""  //不可点击时样式
			};
			var opts =$.extend({},_defaults,opt);
			var status = []; //所有表单元素状态集合
			if(opts.objValue){
				for(var i=0,len=opts.objValue.length;i<len;i++){
					switch(opts.objValue[i].type){
						case "text":
							status[i] = false;
							inputCheck(opts.objValue[i].ele , opts.objValue[i].func , i, opts.objValue[i].defaultSta);
							break;
						case "select":
							status[i] = false;
							selectCheck(opts.objValue[i].ele , opts.objValue[i].func , i);
							break;
						case "checkbox":
							break;
						case "radio":
							status[i] = false;
							radioCheck(opts.objValue[i].ele , opts.objValue[i].func , i);
							break;
						case "textarea":
							status[i] = false;
							inputCheck(opts.objValue[i].ele , opts.objValue[i].func , i, opts.objValue[i].defaultSta);
							break;
						case "combox":
							status[i] = opts.objValue[i].func(opts.objValue[i].ele);
							comboxCheck(opts.objValue[i].ele,opts.objValue[i].func,i);
							break;
						case "hiddenText":  //隐藏文本
							status[i] = opts.objValue[i].func(opts.objValue[i].ele);
							hiddenText(opts.objValue[i].ele , opts.objValue[i].func , i);
							break;
						default : 
							break;
					}
				}
			}
			//radio检测
			function radioCheck(obj,func,num){
				obj.each(function(){
					if($(this).attr("checked")=="checked"){
						var _sta = func($(this));
						status[num] = _sta;
						if(getTrue(status)){
							opts.element.removeClass(opts.closeClass).addClass(opts.openClass);
						}else{
							opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
						}
					}
					$(this).click(function(){
						var _sta = func($(this));
						status[num] = _sta;
						if(getTrue(status)){
							opts.element.removeClass(opts.closeClass).addClass(opts.openClass);
						}else{
							opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
						}
					});
				});
			}
			function hiddenText(obj,func,num){
				var _sta = func(obj);
				status[num] = _sta;
				if(getTrue(status)){
					opts.element.removeClass(opts.closeClass).addClass(opts.openClass);
				}else{
					opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
				}
			}
			//combox检测
			function comboxCheck(obj,func,num){
				var _sta = func(obj);
				status[num] = _sta;
				if(getTrue(status)){
					opts.element.removeClass(opts.closeClass).addClass(opts.openClass);
				}else{
					opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
				}
			}
			//检查Text,Textarea表单
			var thisTime = null;
			function inputCheck(obj,func,num,sta){
				if(sta){
					var _sta = func(obj);
					status[num] = _sta;
					if(getTrue(status)){
						opts.element.removeClass(opts.closeClass).addClass(opts.openClass);
					}else{
						opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
					}
				}else{
					status[num] = false;
					opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
				}
				
				obj.keyup(function(){
					//防止连续为空，只显示一次提示
					if(thisTime !== null){
						return;
					}
					var _sta = func($(this));
					thisTime = setTimeout(function(){
						status[num] = _sta;
						if(getTrue(status)){
							opts.element.removeClass(opts.closeClass).addClass(opts.openClass);
						}else{
							opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
						}
						thisTime = null;
					},30);
				});
				
				obj.blur(function(){
					if(this.nodeName.toLowerCase()=="input"){
						//防止连续为空，只显示一次提示
						if(thisTime !== null){
							return;
						}
						var _sta = func($(this),true);
						thisTime = setTimeout(function(){
							status[num] = _sta;
							if(getTrue(status)){
								opts.element.removeClass(opts.closeClass).addClass(opts.openClass);
							}else{
								opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
							}
							thisTime = null;
						},30);
					}
				});
			}
			//检查Select表单
			function selectCheck(obj,func,num){
				var _sta = func(obj);
				status[num] = _sta;
				if(getTrue(status)){
					opts.element.removeClass(opts.closeClass).addClass(opts.openClass);
				}else{
					opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
				}
				obj.change(function(){
					var _sta = func($(this));
					status[num] = _sta;
					if(getTrue(status)){
						opts.element.removeClass(opts.closeClass).addClass(opts.openClass);
					}else{
						opts.element.removeClass(opts.openClass).addClass(opts.closeClass);
					}
				});
			}
			//检查数组里集合为True还是为False
			function getTrue(arr){
				var sts = true;
				for(var per=0;per<arr.length;per++){
					if(!arr[per]){
						sts = false;
						break;
					}
				}
				return sts;
			}
		},
		checkTextarea:function(obj){
			var sta = true;
			for(var i=0,len=obj.length;i<len;i++){
				if($.fn.getbytelength(obj[i].val().Trim())>140){
					obj[i].addClass('bgcolor').animate({opacity:'0.25'},50).animate({opacity:'1'},50).animate({opacity:'0.25'},50).animate({opacity:'1'},50);
					setTimeout(function(){
						obj[i].removeClass('bgcolor');
					},400);
					return false;
				}
			}
			return sta;
		}
		
	};
	
	/**
	 * 用户信息相关操作调用
	 **/
	//userOperation对象方法
	$.fn.userOperation = {};
	$.fn.userOperation.userId = [];
	$.fn.userOperation.init = function(obj,pera){
		var _this=this;
		var userId;
		if(arguments.length>1){
			userId = pera.slice(0);
		}else{
			userId = _this.userId;
		}
		obj.bind("click",function(){
			if($(this).attr("class").indexOf("current")>-1){
				$(this).removeClass("current");
				$(this).find("span:nth-child(1)").removeClass("true");
				for(var i =0;i<userId.length;i++){
					if(userId[i]==$(this).attr("userId")){
						userId.splice(i,1);
					}
				}
			}else{
				$(this).addClass("current");
				$(this).find("span:nth-child(1)").addClass("true");
				userId.push($(this).attr("userId"));
			}
			
		});
	};
	$.fn.userOperation.select = function(id,scrtop){
		//id:newpocket 修改为参数
		 $("#"+id).animate({marginTop: scrtop}, "1000");
	};
	$.fn.userOperation.back = function(id){
		//id:newpocket 修改为参数
		 $("#"+id).animate({marginTop: '0px'}, "1000");
	};
	$.fn.userOperation.update = function(parentId,json){
		//{"value" : {"id" : "37","title":"aaa","shareType":"1"},"errors" : null}
		var content = json;
		var _par = $("#"+parentId).find("div[dataId="+content.value.id+"]").find(".contentsms");
		var _h = _par.height();
		//当前列数
		var cols=_par.offsetParent().attr("columns");
		//当前board的top值
		var docTop = parseInt(_par.offsetParent().css("top"));
		//alert($.fn.filterStr(content.value.title));
		//常规元素   活动主题加亮
		function unique(data){
		    data = data || [];
		    var a = {};
		    for (var i=0; i<data.length; i++) {
		        var v = data[i];
		        if (typeof(a[v]) == 'undefined'){
		            a[v] = 1;
		        }
		    };
		    data.length=0;
		    for (var i in a){
		        data[data.length] = i;
		    }
		    return data;
	     }
		var nTitle = content.value.title;
		var rr =/(?:#[A-Za-z0-9\u4E00-\u9FA5]+#)/gi;
	   	var mm = unique(nTitle.match(rr));
	   	var o = nTitle;
   		if(mm){
	   		for(var i = 0;i<mm.length;i++){
	   			o=nTitle.replace(new RegExp(mm[i], "gm"),'<a href="/tag?tag='+mm[i].substring(1,mm[i].length-1)+'" class="themTitle">'+mm[i]+'</a>');
	   			nTitle=o;
	   		}
   		}
			   		
		$("#"+parentId).find("div[dataId="+content.value.id+"]").find(".contentsms").html(o);
		//获取增加的高度
		var addHeight = parseInt(_par.height()-_h);
		if(autoLayout.defaults){
			try{
				updateHeight(autoLayout.defaults.contentID,cols,addHeight,docTop);
			}catch(e){}
		}
		function updateHeight(objs,col,diffHeight,bTop){
			//参数说明：objs:内容容器,col:当前列数,diffHeight:增加的高度,bTop:当前元素距顶得高度
			//取一级孩子节点
			var objDiv = autoLayout.getElements(objs);
			for(var i = objDiv.length;i--;){
				var colums = $(objDiv[i]).attr("columns");
				var docTop = parseInt($(objDiv[i]).css("top"));
				if(colums == col && docTop > bTop){
					$(objDiv[i]).css({top:docTop+diffHeight});
				}
			}
			autoLayout.colArray[col] += diffHeight;
			//更新装载内容的容器高度
			document.getElementById(autoLayout.defaults.contentID).style.height = Math.max.apply(Math, autoLayout.colArray) + "px";
		}
		
	};
	$.fn.userOperation.deleteBoard = function(parentId,dataId){
		
		$("#"+parentId).find("div[dataId="+dataId+"]").remove();
		//更新boards坐标
		autoLayout.debounceFunc( autoLayout.updateDiv(), 30, true);
	};
})(jQuery);

/**
 *倒计时功能实现
 */
im.zm.showTimes = function(startTime,lastTime,obj,step){
	this.startTime = startTime;  //开始时间
	this.lastTime = lastTime;  //到期时间
	this.obj = obj;  //显示内容容器
	this.step = step;  //执行的阶段时间，一般是1秒，即1000
};
im.zm.showTimes.prototype = {
	atTime:function(a,b){
		//参数说明：a:到期回调方法，b:倒计时回调方法
		var that = this;
		var timeold = (that.lastTime - that.startTime);
		var msPerDay = 24 * 60 * 60 * 1000;
		var e_daysold = timeold / msPerDay;
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
			window.setTimeout(function(){that.atTime(a,b);}, that.step);
		}
	},
	getStr:function(num){
		return num.toString().length < 2 ? "0" + num : num ;
	}
};
/**
 *图片延迟加载方法
 */
im.zm.delayImg = {
	init:function(scrollObj){
		var that = this,t;
		that.imgObj = $("img[data-delay]");
		var clientH = document.documentElement.clientHeight;
		var scrTop = $(scrollObj).scrollTop();
		if(!that.imgObj.length){return;}
		this.imgObj.each(function(){
			if(typeof scrollObj == "string"){
				t = $(this).offset().top;
				scrTop = $(scrollObj).offset().top;
			}else{
				t = $(this).offset().top;
			}
			if(t < clientH + scrTop){
				that.delayImg.push($(this));
			}
		});
		that.run(that.delayImg);
	},
	imgObj:null,
	delayImg:[],
	run:function(delayImgs){
		if(delayImgs.length == 0){
			return;
		}
		for(var i = 0,len = delayImgs.length;i < len;i++){
			delayImgs[i].attr("src",delayImgs[i].data("delay")).removeAttr("data-delay");
		}
		this.delayImg=[];
	}
};

/**
 *动态加载js文件
 */
im.zm.load = function(){
	if(!arguments[0]){return;}
	if(typeof arguments[0] == "string"){
		createJs(arguments[0]);
	}else{
		for(var i = 0,lens = arguments[0].length; i < lens;i++){
			createJs(arguments[0][i]);
		}
	}
	function createJs(){
		var script = document.createElement("SCRIPT");
		script.setAttribute("type","text/javascript");
		script.setAttribute("charset","utf-8");
		script.setAttribute("src",arguments[0]);
		document.getElementsByTagName("head")[0].appendChild(script);
	}
};

/**
 *图片轮播 
 */
im.zm.autoImg = {
	timer:null,
	scroll:!1,
	width:500,//图片的宽度
	index:0,//图片的索引，表示从哪张图开始
	ele:null,//大图展示对象
	objNum:null,//序号对象
	curClass:'curImg',//当前状态样式
	init:function(obj) {
		this.scrollimg(obj);
		var that=this;
		this.objNum.each(function(index){
			$(this).hover(function(){
				that.scroll = !0;
				clearTimeout(that.timer);
				that.scrollimg({index:index});
			},function(){
				that.scroll = !1;
				that.scrollimg({index:index});
			});	
		});
	},
	scrollimg:function(obj){
		$.extend(this,obj);
		var that=this;
		var imgIndex=that.index;
		var target=-that.width*imgIndex;
		var imgNum=that.objNum.size();
		if(imgIndex>imgNum-1) {
			target=0;imgIndex=0;
		}
		that.ele.stop(true,true).animate({marginLeft:target},300);
		that.objNum.removeClass();
		that.objNum.eq(imgIndex).addClass(that.curClass);
		if(imgIndex < imgNum){
			imgIndex++;
		}
		if(!that.scroll) {
			that.timer = setTimeout(function(){
				that.scrollimg({index:imgIndex});
			},3000);
		}
	}
};
/**
 * @(at)功能 
 */
im.zm.getAutoUser = function(o){
	var friendsData = [];
	// 上面是数据
	var config = {
			boxID:"autoTalkBox",
			valuepWrap:'autoTalkText',
			wrap:'recipientsTips',
			listWrap:"autoTipsUserList",
			position:'autoUserTipsPosition',
			positionHTML:'<span id="autoUserTipsPosition">&nbsp;123</span>',
			className:'autoSelected'
		};
	var html = '<div id="autoTalkBox"style="z-index:-2000;top:$top$px;left:$left$px;width:$width$px;height:$height$px;z-index:1;position:absolute;scroll-top:$SCTOP$px;overflow:hidden;overflow-y:auto;visibility:hidden;word-break:break-all;word-wrap:break-word;*letter-spacing:0.6px;"><span id="autoTalkText"></span></div><div id="recipientsTips" class="atusers"><p>选择昵称或轻敲空格完成输入</p><ul id="autoTipsUserList"></ul></div>';
	//var listHTML = '<li><a title="$ACCOUNT$" rel="$ID$" >$NAME$(@$SACCOUNT$)</a></li>';
	var listHTML = '<li><a title="$ACCOUNT$" rel="$ID$" >$SACCOUNT$</a></li>';
	
	
	/*
	 * D 基本DOM操作
	 * $(ID)
	 * DC(tn) TagName
	 * EA(a,b,c,e)
	 * ER(a,b,c)
	 * BS()
	 * FF
	 */
	var D = {
		$:function(ID){
			return document.getElementById(ID);
		},
		DC:function(tn){
			return document.createElement(tn);
		},
	    EA:function(a, b, c, e) {
	        if (a.addEventListener) {
	            if (b == "mousewheel") {
	            	b = "DOMMouseScroll";
	            }
	            a.addEventListener(b, c, e);
	            return true;
	        } else {
	        	return a.attachEvent ? a.attachEvent("on" + b, c) : false;
	        }
	    },
	    ER:function(a, b, c) {
	        if (a.removeEventListener) {
	            a.removeEventListener(b, c, false);
	            return true;
	        } else{
	        	return a.detachEvent ? a.detachEvent("on" + b, c) : false;
	        } 
	    },
		BS:function(){
			var db=document.body,
				dd=document.documentElement,
				top = db.scrollTop+dd.scrollTop,
				left = db.scrollLeft+dd.scrollLeft;
			return { 'top':top , 'left':left };
		},
		
		FF:(function(){
			var ua=navigator.userAgent.toLowerCase();
			return /firefox\/([\d\.]+)/.test(ua);
		})()
	};
	
	/*
	 * TT textarea 操作函数
	 * info(t) 基本信息
	 * getCursorPosition(t) 光标位置
	 * setCursorPosition(t, p) 设置光标位置
	 * add(t,txt) 添加内容到光标处
	 */
	var TT = {
		info:function(t){
			var o = t.getBoundingClientRect();
			var w = t.offsetWidth;
			var h = t.offsetHeight;
			return {top:o.top, left:o.left, width:w, height:h};
		},
		getCursorPosition: function(t){
			if (document.selection) {
				t.focus();
				var ds = document.selection;
				var range = null;
				range = ds.createRange();
				var stored_range = range.duplicate();
				stored_range.moveToElementText(t);
				stored_range.setEndPoint("EndToEnd", range);
				t.selectionStart = stored_range.text.length - range.text.length;
				t.selectionEnd = t.selectionStart + range.text.length;
				return t.selectionStart;
			} else {
				return t.selectionStart;
			}
		},
		setCursorPosition:function(t, p){
			var n = p == 'end' ? t.value.length : p;
			if(document.selection){
				var range = t.createTextRange();
				range.moveEnd('character', -t.value.length);         
				range.moveEnd('character', n);
				range.moveStart('character', n);
				range.select();
			}else{
				t.setSelectionRange(n,n);
				t.focus();
			}
		},
		add:function (t, txt){
			var val = t.value;
			var wrap = wrap || '' ;
			if(document.selection){
				document.selection.createRange().text = txt;  
			} else {
				var cp = t.selectionStart;
				var ubbLength = t.value.length;
				t.value = t.value.slice(0,t.selectionStart) + txt + t.value.slice(t.selectionStart, ubbLength);
				this.setCursorPosition(t, cp + txt.length); 
			};
		},
		del:function(t, n){
			var p = this.getCursorPosition(t);
			var s = t.scrollTop;
			t.value = t.value.slice(0,p - n) + t.value.slice(p);
			this.setCursorPosition(t ,p - n);
			D.FF && setTimeout(function(){t.scrollTop = s;},10);
		}
	};
	/*
	 * DS 数据查找
	 * inquiry(data, str, num) 数据, 关键词, 个数
	 * 
	 */
	var DS = {
		inquiry:function(data, str, num){
			//if(str == '') return friendsData.slice(0, num);
			var sd = [];
			var i = 0;
			if(str == ''){
				while(sd.length < num && i < data.length){
					sd.push(data[i]);
					i++;
				}	
			}else{
				var reg = new RegExp(str, 'i');
				//var dataUserName = {};
				while(sd.length < num && i < data.length){
					//if(reg.test(data[i]['user'])){
						sd.push(data[i]);
						//dataUserName[data[i]['user']] = true;
					//}
					i++;
				}	
			}
			return sd;
		}
	};
	
	/*
	 * selectList
	 * _this
	 * index
	 * list
	 * selectIndex(code) code : e.keyCode
	 * setSelected(ind) ind:Number
	 */
	var selectList = {
		_this:null,
		index:-1,
		list:null,
		selectIndex:function(code){
			if(D.$(config.wrap).style.display == 'none'){
				return true;
			} 
			var i = selectList.index;
			switch(code){
			   case 40:
				 i = i + 1;
				 break;
			   case 38:
				 i = i - 1;
				 break;
			   case 13:
				return selectList._this.enter();
				break;
			}
	
			i = i >= selectList.list.length ? 0 : i < 0 ? selectList.list.length-1 : i;
			return selectList.setSelected(i);
		},
		setSelected:function(ind){
			if(selectList.index >= 0) selectList.list[selectList.index].className = '';
			try{
				selectList.list[ind].className = config.className;
			}catch(e){}
			selectList.index = ind;
			return false;
		}
	
	};
	
	/*
	 *
	 */
	var AutoTips = function(A){
		var elem = A.id ? D.$(A.id) : A.elem;
		var checkLength = 5;
		var _this = {};
		var key = '';
		_this.start = function(){
			if(!D.$(config.boxID)){
				var h = html.slice();
				var info = TT.info(elem);
				var div = D.DC('DIV');
				var bs = D.BS();
				h = h.replace('$top$',(info.top + bs.top)).
						replace('$left$',(info.left + bs.left)).
						replace('$width$',info.width).
						replace('$height$',info.height).
						replace('$SCTOP$','0');
				div.innerHTML = h;
				document.body.appendChild(div);
			}else{
				_this.updatePosstion();
			}
		};
	  	_this.keyupFn = function(e){
			var e = e || window.event;
			if(e.type == "keyup"){
				if(!e.keyCode){
					return;
				}
			}
			var code = e.keyCode;
			if(code == 38 || code == 40 || code == 13) {
				if(code==13 && D.$(config.wrap).style.display != 'none'){
					_this.enter();
				}
				return false;
			}
			var cp = TT.getCursorPosition(elem);
			if(!cp) {
				return _this.hide();
			}
			var valuep = elem.value.slice(0, cp);
			var val = valuep.slice(-checkLength);
			//var chars = val.match(/(\w+)?@(\w|[\u4E00-\u9FA5\uF900-\uFA2D]+)$|@$/);
			var chars = val.match(/(\w+)?@(\w+)|([\u4E00-\u9FA5\uF900-\uFA2D]+)$|@$/);
			if(chars == null) {
				return _this.hide();
			}
			//var b_char = chars[2] ? chars[2] : '';
			var b_char;
			if(chars[2]){
				b_char = chars[2];
			}else if(chars[3]){
				b_char = chars[3];
			}else{
				b_char = "";
			}
			D.$(config.valuepWrap).innerHTML = valuep.slice(0,valuep.length - b_char.length).replace(/\n/g,'<br/>').replace(/\s/g,'&nbsp;') + config.positionHTML;
			_this.showList(b_char);
		};
		_this.showList = function(b_char){
			key = b_char;
			//请求数据接口
			$.ajax({
				type:"get",
				url:uri("URI_FANS_FRIENDS_NICKNAME", 10007),
				data:{chars:key},
				dataType:"json",
				success:function(datas){
					var friendsData = [];
					for(var i = 0,len=datas.length;i<len;i++){
						friendsData[i] = {};
						friendsData[i].user = datas[i];
						friendsData[i].name = datas[i];
					}
					var data = DS.inquiry(friendsData, b_char, 8);//显示数据的个数
					var html = listHTML.slice();
					var h = '';
					var len = data.length;
					if(len == 0){
						_this.hide();
						return;
					}
					var reg = new RegExp(b_char);
					var em = '<em>'+ b_char +'</em>';
					for(var i=0; i<len; i++){
						var hm = data[i]['user'].replace(reg,em);
						h += html.replace(/\$ACCOUNT\$|\$NAME\$/g,data[i]['name']).
									replace('$SACCOUNT$',hm).replace('$ID$',data[i]['user']);
					}
					_this.updatePosstion();
					var p = D.$(config.position).getBoundingClientRect();
					var bs = D.BS();
					var d = D.$(config.wrap).style;
					d.top = p.top + 20 + bs.top + 'px';
					d.left = p.left - 5 + 'px';
					D.$(config.listWrap).innerHTML = h;
					_this.show();
				}
			});
		};
		_this.KeyDown = function(e){
			var e = e || window.event;
			var code = e.keyCode;
			if(code == 38 || code == 40 || code == 13){
				return selectList.selectIndex(code);
			}
			return true;
		};
		_this.updatePosstion = function(){
			var p = TT.info(elem);
			var bs = D.BS();
			var d = D.$(config.boxID).style;
			d.top = p.top + bs.top +'px';
			d.left = p.left + bs.left + 'px';
			d.width = p.width+'px';
			d.height = p.height+'px';
			D.$(config.boxID).scrollTop = elem.scrollTop;
		};
		_this.show = function(){
			selectList.list = D.$(config.listWrap).getElementsByTagName('li');
			selectList.index = -1;
			selectList._this = _this;
			_this.cursorSelect(selectList.list);
			elem.onkeydown = _this.KeyDown;
			D.$(config.wrap).style.display = 'block';	
			$("#autoTipsUserList li").die().live("click",function(){
				TT.del(elem, key.length, key);
				TT.add(elem, $(this).find("a").attr("title")+' ');
				setTimeout(_this.hide, 100);
				//_this.hide();
			});
		};
		_this.cursorSelect = function(list){
			for(var i=0; i<list.length; i++){
				list[i].onmouseover = (function(i){
					return function(){selectList.setSelected(i);};
				})(i);
				//list[i].onclick = _this.enter;
			}
		};
		_this.hide = function(){
			selectList.list = null;
			selectList.index = -1;
			selectList._this = null;
			D.ER(elem, 'keydown', _this.KeyDown);
			D.$(config.wrap).style.display = 'none';
		};
		_this.bind = function(){
			elem.onkeyup = _this.keyupFn;
			elem.onclick = _this.keyupFn;
			elem.onblur = function(){
				setTimeout(_this.hide, 300);
			};
			//elem.onkeyup= fn;
			//D.EA(elem, 'keyup', _this.keyupFn, false)
			//D.EA(elem, 'keyup', fn, false)
			//D.EA(elem, 'click', _this.keyupFn, false);
			//D.EA(elem, 'blur', function(){setTimeout(_this.hide, 100)}, false);
		};
		_this.enter = function(){
			TT.del(elem, key.length, key);
			TT.add(elem, selectList.list[selectList.index].getElementsByTagName('A')[0].rel+' ');
			_this.hide();
			return false;
		};
		return _this;
	};
	var userAutoTips = function(args){
			var a = AutoTips(args);
			a.start();
			a.bind();
	};
	userAutoTips(o);
};
