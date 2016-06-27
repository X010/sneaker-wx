var PageTouch = function(el, scroll, page, fn) {
    this.scroll = scroll?scroll:'content';
    this.fn = fn?fn:null;
    this.el =  el?el:null//当前页面的对象
    this.height='100%'; //设备高度
    this.width='100%';   //设备宽度
    this.move;
    this.flag_loading;
    this.flag_refresh;
    this.pageX;  //横向的手指落点
    this.pageY;
    this.step_load = 100;
    this.step_refresh = 100;
    this.cannottouchmove = true;

    this.permitpost = true;
    this.page = page?page:'page_board';
    this.loading = true;
    this.refresh_expired = 10;
};

PageTouch.prototype.init = function(){
    return this;
};

//为页面绑定各种事件的绑定函数
PageTouch.prototype.bindEvents = function() {
    var self = this;
    window.addEventListener('resize orientationchange', this.resize.bind(this), false);
    'touchstart touchmove touchend touchcancel'.split(' ').forEach(function(evn) {
        //将四个触控函数（申明在后面）绑定到每个页面
        self.el.addEventListener(evn, self[evn].bind(self), false);
    })
};
//初始化时获得设备的宽高
PageTouch.prototype.resize = function() {
    this.width = this.el.clientWidth;
    this.height = this.el.clientHeight;
    return this;
};

// 四个内建的滑动事件函数,与前面绑定函数相呼应
PageTouch.prototype.touchstart = function(e) {
    var touches = e.touches[0]

    //touch start initializing
    //this.flag = null
    this.move = 0

    //record coordinates
    //this.pageX = touches.pageX
    this.pageY = touches.pageY

};
PageTouch.prototype.touchmove = function(e) {
    var touches = e.touches[0];
    //var X = touches.pageX - this.pageX;
    var Y = touches.pageY - this.pageY;
    if(Y>this.step_refresh) this.flag_refresh = 1;
    if(Y<-this.step_load) this.flag_loading = -1;
    if(Y>-60 && Y<60) {
        this.cannottouchmove = false;
        if(Y>30) this.flag_refresh = 1;
        if(Y<-30) this.flag_loading = -1;
    }
    else
        this.cannottouchmove = true;
    //this.clnum(this.pageY, Y);
};
PageTouch.prototype.clnum = function(start,offset){

    var show = $('#cnum');
    var postion = start + offset;
    //console.log('------>',$('#CLN_A').offset().top -20, $('#CLN_A').offset().top + 20);
    var numlist = ['A','B','C','D','E','F'];

    var x = $('#CLN_'+numlist[1]).offset().top - $('#CLN_'+numlist[0]).offset().top;
    $('#navCart i').html(x+','+postion);
    for(var i=0 ; i< numlist.length; i++){
        var num = $('#CLN_'+numlist[i]);
        console.log(num);
        if( postion >(num.offset().top - x) && postion < (num.offset().top + x) ){$('#navCart i').html('111');
            console.log(show.find('i'))
            show.find('h1').text(num.text());
            show.css('top', num.offset().top);
            show.css('left', num.offset().left - 50);
            show.show();
        }
    }
    //show.hide();
    //console.log('++++++++>',postion);
}
PageTouch.prototype.touchend = function(e) {
    if(this.cannottouchmove){
        if(this.loading)
            if (this.flag_loading<0) this.reached();
        if (this.flag_refresh>0) this.refresh();
    }
};
PageTouch.prototype.touchcancel = function(e) {
    if(!this.cannottouchmove){
        if(this.loading)
            if (this.flag_loading<0) this.reached();
        if (this.flag_refresh>0) this.refresh();
    }
};
PageTouch.prototype.refresh = function(){
    var sc =$('#'+this.scroll);
    var scrollTop = sc.scrollTop();//滚动高度
    if(scrollTop === 0) {
        $('#list-refresh').show();
        $('#list-refresh span').text('正在刷新......');
        var isrefresh = getLocalCacheForSec('is_refreshing');
        isrefresh = ( isrefresh !=null )? isrefresh : '0';

        if(isrefresh === '0') {
            setLocalCacheForSec('is_refreshing','1',this.refresh_expired);
            setTimeout(function () {
                location.reload();
            }, 3000);
        }else {
            this.resetRefresh();
            setTimeout(function(){
                $('#list-refresh').hide();
            },200);
        }
    }
};
PageTouch.prototype.resetRefresh = function(){
    setTimeout(function(){
            setLocalCacheForSec('is_refreshing','0',this.refresh_expired);
        },
        10000);
};
PageTouch.prototype.reached = function(){
     var sc =$('#'+this.scroll);
     var viewH = sc.height();//可见高度
     var contentH = sc.get(0).scrollHeight;//内容高度
     var scrollTop = sc.scrollTop();//滚动高度

     if(this.permitpost && scrollTop && (contentH - viewH - scrollTop <= 100)) {
         this.permitpost = false;
         $('#list-loading').show();


         if($('#'+this.page).attr('data-ismax') === '0')
            $('#list-loading span').text('正在努力加载......');
         else
            $('#list-loading span').text('已经加载完毕');


         setTimeout(
             (this.resetpost() && eval($(this.fn)) || eval(this.fn))
             , 2000
         );
     }
};
PageTouch.prototype.resetpost = function(){
    this.permitpost = true;
},
//重置方法,用于初始化以及当前页面的重置
PageTouch.prototype.reset = function(opts) {
    this.fn = opts.fn
    this.el = opts.el
    this.resize().init().bindEvents() ;//初始化
}


