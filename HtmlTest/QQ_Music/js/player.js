//闭包进行封装，与外界隔绝
//传递一个参数window，与外界交互
(function($audio){
    //定义一个Player类，调用Player.prototype的init()方法
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype={
        constructor:Player,
        musicList:[],
        //定义init方法,完成创建Player类时的初始化
        init:function($audio){
            this.$audio=$audio;
            this.audio=$audio.get(0);//原生js中获取对象方法     
        },
        currentIndex: -1,
        PlayMusic: function(index,music) {
            //currentIndex==index，即为同一首音乐
            if(this.currentIndex == index){
                //此时点击的音乐、正在播放的音乐为同一首音乐
                //if判断，切换‘暂停’‘播放’
                if(this.audio.paused)
                    this.audio.play();
                else
                    this.audio.pause();
            }else{
                //此时点击的音乐、正在播放的音乐不是同一首音乐
                this.$audio.attr("src",music.link_url); //切换播放音乐的地址
                this.audio.play(); //然后播放
                this.currentIndex = index;
            }
        },
        nextIndex : function(){
            var index = this.currentIndex + 1;
            if(index > this.musicList.length - 1){
                index = 0;
            }
            return index;   
        },
        changeMusic: function(index){
            //根据index,删除musicList中对应的数据
            this.musicList.splice(index,1); //splice() 方法从数组中添加/删除项目，然后返回被删除的项目。

            //如果删除的音乐为，列表中正在播放的音乐的前面的音乐，重新修改currentIndex的值
            if(index < this.currentIndex){
                this.currentIndex -= 1;
            }
        },

        //更新进度条
        musicTimeUpdate: function(callBack){
            var $this = this;
            this.$audio.on("timeupdate",function(){
                var currentTime = $this.audio.currentTime;     //获取当前时长
                var duration = $this.audio.duration;           //获取总时长
                var timeStr = $this.formatDate(currentTime,duration);
                $(".pro_top_time").text(timeStr);
                callBack(duration,currentTime,timeStr);
            })
        },
        //更新进度条--格式化时间方法
        formatDate : function(currentTime,duration){
            //定义结束时间,by总时长
            var endMin = parseInt(duration / 60);
            var endSecond = parseInt(duration % 60);
            if(endMin < 10){
                endMin = "0" + endMin;
            }
            if(endSecond < 10){
                endSecond = "0" + endSecond;
            }
            //定义现在时间,by当前时长
            var startMin = parseInt(currentTime / 60);
            var startSecond = parseInt(currentTime % 60);
            if(startMin < 10){
                startMin = "0" + startMin;
            }
            if(startSecond < 10){
                startSecond = "0" + startSecond;
            }
            return startMin + ":" + startSecond + " / " + endMin + ":" + endSecond;
        },
        //使音乐跳转到指定位置
        musicSeekTo: function(value){   //传入的value为比例
            this.audio.currentTime = this.audio.duration * value;//设置当前时间 = 总时间 * 百分比
        }
    }
    //让init()函数的prototype从init.prototype,指向Player.prototype
    Player.prototype.init.prototype=Player.prototype;
    window.Player=Player;
})(window);