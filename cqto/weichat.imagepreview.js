/**
 * Created by yubo on 16/8/10.
 * 仿微信的图片预览jquery插件
 * 前置js需要jquery,还有jquery.touchSwipe
 */
(function($){
    $.fn.extend({
        weimg:function(option){
            var defaults = {
                title : true,
                pages : true,
                leftright : true
            }
            var options = $.extend(defaults,option);
            var imgs = $(this).find("img");
            $(this).find("img").each(function(i){
                $(this).data("num",i);
                $(this).on("click",function(){
                    // console.log($(this).data("num"));
                    var num = parseInt($(this).data("num")) + 1;
                    initweiImg(options,imgs,num);//将当前是第几张传过去
                    createMask();
                })
            })
        }
    })
    /*初始化图片预览插件*/
    var initweiImg = function(opt,imgs,num){
        initImgBox(imgs,num);
        if(opt.title){
            var t = $("#imgBox").find("img:first-child").data("title");
            showImgTitle(t);
        }
        if(opt.pages){
            initFooter(num,imgs.length);
        }
        initCloseBtn();
    }
    /* 初始化图片容器 */
    var initImgBox = function(imgs,num){
        var style = {
            height:$(window).height() - 100,
            width:$(window).width(),
            top:"50px",
            left:"0px",
            position:"fixed",
            "z-index":"20",
            "overflow":"hidden"
        }
        var html = "<div id='imgBox'></div>";
        var uls = [];
        uls.push('<div class="ul" style="list-style: none;width:'+$(window).width() * imgs.length+'px;he\ight:'+ ($(window).height() - 100) +'px;white-space: nowrap;position:absolute;opacity: 0;">');
        for(var i = 0 ; i<imgs.length ; i++ ){
            uls.push("<div style='float: left;width: "+$(window).width()+"px;'><img src='"+imgs[i].src+"' style='width: 100%;vertical-align: middle' data-title='"+imgs[i].title+"' data-num ='"+(i+1)+"'></div>");
        }
        uls.push("</div>");
        $("body").append(html);
        $("#imgBox").css(style).append(uls.join(""));
        swipeBind();
        setTimeout(function(){
            pos(".ul");
            $(".ul").css("opacity",1);
        },100)
        initPos(num);
    }
    /* init current img position */
    function initPos(num){
        var x = parseInt($(window).width());
        var y = parseInt(num) - 1;
        console.log(y);
        console.log(x*y);
        $(".ul").css({
            left: -x*y
        })
    }

    /* reset img preview box position */
    function pos(obj){
        var h = $(obj).find("img").height();
        $(obj).css("top",($(window).height() - h - 100  )/2 +"px");
    }
    /* 滑动绑定 */
    function swipeBind(){
        $("#imgBox").find("img").each(function(){
            $(this).swipe({
                swipeLeft:function(){
                    //左滑动事件
                    if( -$(this).parents(".ul").offset().left == ($(this).parents(".ul").width() - $(window).width()) ){
                        return;
                    }else{
                        $(this).parents(".ul").animate({
                            left:$(this).parents(".ul").offset().left-$(window).width()
                        })
                    }
                    resetTitle($(this).data("title"));
                    pos(".ul");
                    resetfooterNum(parseInt($(this).data("num"))+1);
                },
                swipeRight:function(){
                    //右滑动事件
                    if($(this).parents(".ul").offset().left == 0){
                        return;
                    }else{
                        $(this).parents(".ul").animate({
                            left:$(this).parents(".ul").offset().left+$(window).width()
                        })
                    }
                    pos(".ul");
                    resetTitle($(this).data("title"));
                    console.log($(this).data("num"));
                    resetfooterNum(parseInt($(this).data("num"))-1)
                }
            })
        })
    }

    /* 初始化关闭按钮 */
    function initCloseBtn(){
        var html = "<span id='p_close' style='width: 40px;height: 40px;position: fixed;top: 5px;right:" +
            " 10px;background-color: rgba(255,255,255,0.8);display: block;z-index: 30;line-height: 40px;text-align:" +
            " center;' onclick='$(\"#imgTitle,#imgBox,.imgPreviewFooter,.imgmask,#p_close\").remove();'>X</span>"
        $("body").append(html);
    }
    /* 显示底部信息 */
    function initFooter(cur,cou){
        var html = [];
        html.push("<div class='imgPreviewFooter' style='height: 50px;position: fixed;bottom: 0px;width:" +
            " 100%;background-color: rgba(0,0,0,0.5);z-index: 20;text-align:center;'>")
        html.push("<span style='font-size: 14px;line-height: 50px;color: #fff;'><em class='cur'>"+cur+"</em>/<em" +
            " class='cou'>"+cou+"</em></span>")
        html.push("</div>")
        $("body").append(html.join(""));
    }
    var resetfooterNum = function(num){
        $(".cur").html(num);
    }

    /* 显示标题 */
    var showImgTitle = function(title){
        var html = "<div id='imgTitle' style='height: 50px;line-height: 50px;background-color: rgba(0,0,0,0.6);color:" +
            " #fff;position: fixed;top:0px;left:0px;width: 100%;z-index: 10;padding: 0px 45px 0px 10px;'>"+title+"</div>"

        $("body").append(html);
    }
    /* 重置标题 */
    var resetTitle = function(title){
        $("#imgTitle").html(title);
    }
    /* create mask */
    var createMask = function(){
        var html = "<div class='imgmask' style='background-color: rgba(0,0,0,0.6);width: 100%;height: 100%;position:" +
            " fixed;top:0px;left: 0px;'>"
        $("body").append(html);
    }
    /* delete mask */
    $(window).resize(function(){
        pos(".ul");
    })
})(jQuery)
