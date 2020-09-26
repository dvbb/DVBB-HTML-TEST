$(function(){
    
    
    //songlist--监听歌曲的移入移出事件   
    //因为songlist_item为ajax动态创建，所以应该使用事件委托监听动态创建元素的事件
    $(".songlist").delegate(".songlist_item","mouseenter",function(){
        $(this).find(".listmenu ").stop().fadeIn(100);
        $(this).find(".listdel").stop().fadeIn(10);
        $(this).find(".songlist_time span").stop().fadeOut(10);
    })
    $(".songlist").delegate(".songlist_item","mouseleave",function(){
        $(this).find(".listmenu").stop().fadeOut(100);
        $(this).find(".listdel").stop().fadeOut(10);
        $(this).find(".songlist_time span").stop().fadeIn(10);
    })

    //监听songlist_item的播放按钮
    var $musicPlay=$(".footbar_play")
    $(".songlist").delegate(".listmenu_play","click",function(){
        //切换播放图标
        $(this).toggleClass("listmenu_playing") //listmenu_playing的优先级比listmenu_play高，所以存在playing时，会优先显示
        //复原其他播放图标
        $(this).parents(".songlist_item").siblings().find(".listmenu_play").removeClass("listmenu_playing");
        //同步footbar的播放按钮
        if($(this).hasClass("listmenu_playing")){
            //当前点击的this拥有类listmenu_playing,即为播放状态，底部应该也改为播放
            $musicPlay.addClass("footbar_play2");
        }else{
            $musicPlay.removeClass("footbar_play2");
        }
    })


    //加载歌词列表
    getPlayerList();
    function getPlayerList(){
        $.ajax({
            url:"./source/musiclist.json",
            dataType:"json",
            success:function(data){
                console.log(data);//data为json内的数据
                var $musicList = $(".songlist ul");
                //遍历获取到的音乐，对html创建item对象
                $.each(data,function(index,ele){
                    var $item=creatMusicItem(index,ele);
                    $musicList.append($item);
                })
            },
            error:function(e){
                console.log(e);
            }
        });
    }
    //creatMusicItem().为songlist列表加入item.即创建一条音乐
    function creatMusicItem(index,music){
        var $item=$("<li class=\"songlist_item\">"+
                        "<div class=\"songlist_edit\"><i></i></div>"+
                        "<div class=\"songlist_num\">"+(index+1)+"</div>"+
                        "<div class=\"songlist_name\">"+music.name+""+
                            "<div class=\"listmenu\">"+
                                "<a href=\"javascript:;\" title=\"播放\" class=\"listmenu_play\"></a>"+
                                "<a href=\"javascript:;\" title=\"添加\"></a>"+
                                "<a href=\"javascript:;\" title=\"下载\"></a>"+
                                "<a href=\"javascript:;\" title=\"分享\"></a>"+
                            "</div>"+
                        "</div>"+
                        "<div class=\"songlist_author\">"+music.singer+"</div>"+
                        "<div class=\"songlist_time\"><span>"+music.time+"</span> "+
                            "<div class=\"listdel\">"+
                                "<a href=\"javascript\" title=\"删除\"></a>"+
                            "</div>"+
                        "</div>  "+
                        "</li>"
                    );
        return $item;
    }
})