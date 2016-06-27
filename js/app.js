/**
* @Author: jeffrey
* @Date:   2016-06-27T18:48:34+08:00
* @Last modified by:   jeffrey
* @Last modified time: 2016-06-27T21:00:55+08:00
*/



var THUMB_XS = '@4e_0o_1l_50sh_120h_120w_90q.src';
var THUMB_SM = '@4e_0o_1l_50sh_180h_180w_90q.src';
var THUMB_MD = '@4e_0o_1l_50sh_380h_380w_80q.src';
var THUMB_LG = '@4e_0o_1l_50sh_500h_500w_80q.src';
var THUMB_RAW = '@4e_0o_1l_100sh_800h_800w_80q.src';

//初始化购物车
var cart = new $.Cart(true, getLocalCache("ccid"));

$().ready(function(){
    disNavCart();

    //if(!checkMicroMessenger()) {
    //    alert("请从微信里打开商城");
    //    window.location.reload();
    //    console.log('请用微信浏览器打开！');
  //      return false;
  //  }
});

//判断当前浏览器是否为微信浏览器
function checkMicroMessenger(){
    var pattern = /MicroMessenger/ig;
    if(pattern.test(navigator.userAgent)){
        return true;
    }else{
        if (typeof WeixinJSBridge == "object"){
            return true;
        }else{
            return false;
        }
    }
}

function addToCart(objectId, dimgId) {

    console.log(objectId + ","+ dimgId);
    var object = $("#" + objectId);
    var dimg = $("#" + dimgId);
    cart.addToCart(object);
    refreshCart('+1', 1700);
    fly('mainTabCart', dimg);
}

function addToCartForGoodsItem(objectId, dimgId) {

    console.log(objectId + ","+ dimgId);
    var object = $("#" + objectId);
    var dimg = $("#" + dimgId);
    cart.addToCart(object);
    refreshCart('+1', 1700);
    fly('mainTabCartGoodsItem', dimg);
}

// 导航展示购物车信息
function disNavCart() {
    var total = cart.getCartTotal();
    $('#mainTabCart i').html(total);
    $('#mainTabCartGoodsItem i').html(total);

}

// 刷新购物车信息
function refreshCart(inc, lyz) {
    //disNavCart();
    setTimeout("disNavCart()",lyz);
}

function emptyCart() {
    cart.emptyCart();
}

//立即购买
function buyNowGoodsItem(objectId){
    $("#btnBuyNow").attr("data-qty",$("#buyNowNum").val());
    setTimeout(function(){
        var object = $(objectId);
        cart.addToCartBuyNow(object);
        window.location.href = "cart_check.html?mode=buynow";
    },300);

}
