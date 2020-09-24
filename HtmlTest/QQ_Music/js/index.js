$(function(){
    //监听歌曲的移入移出事件        
    $(".songlist_item").hover(function(){

        $(this).find(".listmenu ").stop().fadeIn(100);
        $(this).find(".listdel").stop().fadeIn(10);
        $(this).find(".songlist_time span").stop().fadeOut(10);
        
    },function(){
        $(this).find(".listmenu").stop().fadeOut(100);
        $(this).find(".listdel").stop().fadeOut(10);
        $(this).find(".songlist_time span").stop().fadeIn(10);
    });

    

})