(function(window){
    function Progress($ProgressBar,$ProgressLine,$ProgressDot){
        return new Progress.prototype.init($ProgressBar,$ProgressLine,$ProgressDot);
    }
    Progress.prototype={
        constructor: Progress,
        init : function($ProgressBar,$ProgressLine,$ProgressDot){
           this.$ProgressBar = $ProgressBar;
           this.$ProgressLine = $ProgressLine;
           this.$ProgressDot = $ProgressDot;
        },
        //进度条的点击事件
        progressClick: function(callBack){
            var $this = this;   //！！这里的this位于progress，所以这个this指代progress
            this.$ProgressBar.click(function(event){
                //normalLeft为‘进度条’距离窗口左边框的距离
                //eventLeft为‘点击位置’距离窗口左边框的距离
                var normalLeft = $(this).offset().left;
                var eventLeft = event.pageX;
                
                //点击改变line的长度
                $this.$ProgressLine.css("width",eventLeft - normalLeft);    
                        //这里的this位于ProgressBar，所以this指代ProgressBar，此时要拿到外面的progress，所以用$this

                //计算进度条的比例
                var value = (eventLeft - normalLeft) / $(this).width;
                callBack(value);
            })
        },
        //进度条的拖拽事件
        progressMove: function(callBack){
            var $this = this;
            //1、监听鼠标按下事件
            this.$ProgressBar.mousedown(function(){
                //2、监听鼠标移动事件
                //为了更好的交互体验，使用document对象来监听，确保鼠标移出进度条范围，也能进行拖拽
                var normalLeft = $(this).offset().left;
                $(document).mousemove(function(){
                    var eventLeft = event.pageX;
                    if(eventLeft <= 958)
                        $this.$ProgressLine.css("width",eventLeft - normalLeft);    
                    
                    //计算进度条的比例
                    var value = (eventLeft - normalLeft) / $(this).width;
                    callBack(value);
                })
            })
            //3、监听鼠标抬起事件
            $(document).mouseup(function(){
                $(document).off("mousemove");
            })
        },
        //设置进度条宽度
        setProgress: function(value){
            if(value < 0 || value > 100) return;
            this.$ProgressLine.css({
                width: value + "%" 
            });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress
})(window)