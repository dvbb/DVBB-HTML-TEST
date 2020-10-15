$(function(){
    
    var $audio=$("audio");
    var player=new Player($audio);
    var $ProgressBar = $(".probar");
    var $ProgressLine = $(".probar_line");
    var $ProgressDot = $(".probar_dot");
    var progress = Progress($ProgressBar,$ProgressLine,$ProgressDot);
    progress.progressClick(function(value){
        player.musicSeekTo(value);
    });
    progress.progressMove(function(value){
        player.musicSeekTo(value);
    });
    //1、加载歌曲列表
    getPlayerList();
    function getPlayerList(){
        $.ajax({
            url:"./source/musiclist.json",
            dataType:"json",
            success:function(data){

                /* console.log(data);//data为json内的数据*/

                //把data传入player的musicList对象中
                player.musicList=data;

                //遍历获取到的音乐，对html创建item对象
                $.each(data,function(index,ele){
                    var $item=creatMusicItem(index,ele);
                    $(".songlist ul").append($item);
                });
                initMusicInfo(data[0]);
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
                                "<a href=\"javascript\"  title=\"删除\"></a>"+
                            "</div>"+
                        "</div>  "+
                        "</li>"
                    );
        //将index索引、music音乐，绑定到对应的每一个li中
        $item.get(0).index = index;
        $item.get(0).music = music;

        return $item;
    }
    //初始化歌曲信息
    function initMusicInfo(music){
        var musicImage=$(".song_info_pic img");
        var musicName=$(".song_info_name a");
        var musicAuthor=$(".song_info_author a");
        var musicAlbum=$(".song_info_album a");
        var musicProgressName=$(".pro_top_name");
        var musicProgressTime=$(".pro_top_time");
        var musicBG=$(".mask_bg");
        musicImage.attr("src",music.cover);
        musicName.text(music.name);
        musicAuthor.text(music.singer);
        musicAlbum.text(music.album);
        musicProgressName.text(music.name + " / " +music.singer);
        musicProgressTime.text("00:00 / "+music.time);
        musicBG.css("background-image","url('"+music.cover+"')");
    }


    //2、添加事件监听
    initEvents()
    function initEvents(){
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
            $item = $(this).parents(".songlist_item")
            //切换播放图标
            $(this).toggleClass("listmenu_playing") //listmenu_playing的优先级比listmenu_play高，所以存在playing时，会优先显示
            //复原其他播放图标
            $item.siblings().find(".listmenu_play").removeClass("listmenu_playing");
            //同步footbar的播放按钮
            if($(this).hasClass("listmenu_playing")){
                //当前点击的this拥有类listmenu_playing,即为播放状态，底部应该也改为播放
                $musicPlay.addClass("footbar_play2");
            }else{
                $musicPlay.removeClass("footbar_play2");
            }
            //隐藏序号，添加gif
            $item.find(".songlist_num").toggleClass("songlist_num2");
            $item.siblings().find(".songlist_num").removeClass("songlist_num2");
            //播放音乐
            player.PlayMusic($item.get(0).index,$item.get(0).music);
            //切换歌曲信息
            initMusicInfo($item.get(0).music);
            
        });
    };
    
    //3、底部菜单控制
    //监听‘播放’按钮
    $(".footbar_play").click(function(){
        //player.currentIndex == -1 即没有播放过音乐
        if(player.currentIndex == -1)
            $(".songlist_item").eq(0).find(".listmenu_play").trigger("click");
        else
            $(".songlist_item").eq(player.currentIndex).find(".listmenu_play").trigger("click");
    })
    //监听‘上一首’按钮
    $(".footbar_previous").click(function(){
        $(".songlist_item").eq(player.currentIndex-1).find(".listmenu_play").trigger("click");
        console.log(player.currentIndex-1);
    })
    //监听‘下一首’按钮
    $(".footbar_next").click(function(){
        $(".songlist_item").eq(player.nextIndex()).find(".listmenu_play").trigger("click");
    })

    //4、监听songlist的删除按钮
    $(".songlist").delegate(".listdel","click",function(){
        //找到点击按钮对应的li，执行删除
        $item = $(this).parents(".songlist_item");

        //如果删除的音乐为正在播放的音乐，切换至下一首
        if($item.get(0).index == player.currentIndex){
            $(".songlist_item").eq(player.nextIndex()).find(".listmenu_play").trigger("click");
            $item = $(this).parents(".songlist_item");
        }

        $item.remove(); //此时完成前端页面的删除
        player.changeMusic($item.get(0).index); //$item.get(0)获取原生的li，原生的li中保存了index。
      
        //重新排序
        $(".songlist_item").each(function(index,ele){
            ele.index = index;
            $(ele).find(".songlist_num").text(index + 1);
        })
    })

    //5、监听播放进度
    player.musicTimeUpdate(function(duration,currentTime,timeStr){
        //同步时间  00:00/04:12
        $(".pro_top_time").text(timeStr);
        //同步时间与进度条  
        var value = currentTime / duration *100;
        progress.setProgress(value);
    })
})