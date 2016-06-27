//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    //console.log(window.location);
    if (r != null) {
        return decodeURI(r[2]);
        //return unescape(r[2]);
    }
    return null; //返回参数值
}

/**
 * 保存本地缓存
 * @param key
 * @param value
 */
function setLocalCache(key, value) {
    var storage = window.localStorage;
    try {
        storage.setItem(key, value);
    } catch (e) {
        console.log(e);
    }
}

/**
 * 保存本地缓存，设置天
 * @param key
 * @param value
 * @param day
 */
function setLocalCacheForExp(key, value, day) {
    setLocalCache(key, value);
}

/**
 * 以秒级别为单的设置Cookie
 * @param key
 * @param value
 * @param day
 */
function setLocalCacheForSec(key, value, sec) {
    var exp = new Date();
    exp.setTime(exp.getTime() + sec * 1000);
    document.cookie = key + "=" + encodeURI(value) + ";expires=" + exp.toUTCString();
}

/**
 * 获取原生的Cookie
 * @param key
 */
function getLocalCacheForSec(key) {
    var arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
    if (arr != null)
        return decodeURI(arr[2]);
    return null;
}

/**
 * 获取本地缓存
 * @param key
 */
function getLocalCache(key) {
    var storage = window.localStorage;
    return storage.getItem(key);
}

/**
 * 删除本地的缓存
 * @param key
 */
function clearLocalCache(key)
{
    var storage=window.localStorage;
    storage.removeItem(key);
}


/**
 * HTML解析
 * @param str
 * @returns {string|XML|*}
 */
function htmlspecialchars_decode(str) {
    str = str.replace(/&amp;/g, '&');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&quot;/g, "\"");
    str = str.replace(/&#039;/g, "'");
    return str;
}

/**
 * 显示提示浮层
 * @param msg
 */
function showAlert(msg) {
    console.log(msg);
    $("#overlayMsg").html(msg).fadeIn().delay(1000).fadeOut(function () {
        $("#overlayMsg").empty();
    });
}

/**
 * 数据加载或提交浮层
 * @param msg
 */
function showLoading(msg) {
    console.log(msg);
    $("#overlay").fadeIn();
    $("#overlayMsg").html(msg).fadeIn(function () {
    });
    setTimeout('$("#overlayMsg").html("网络超时，请重试").delay(2000).fadeOut();$("#overlay").delay(2000).fadeOut()',3000);
}

/**
 * 返回设备参数信息
 * @param data
 */
function getScreenInfo() {
    var data = {
        width : $(window).innerWidth(),
    }
    return data;
}

/**
 * 返回客户类型名称
 * @param id
 */
function showCustomType(id,format) {
    var customTypeData = [
        {id:1, cname_l : "经销商", cname_s : "经销", color: ""},
        {id:2, cname_l : "酒店饭店", cname_s : "酒店"},
        {id:3, cname_l : "商场超市", cname_s : "商超"},
        {id:4, cname_l : "便利店", cname_s : "便利"}
    ];

    var showName = "";
    if(format == "longname"){
        showName = customTypeData[parseInt(id-1)].cname_l;
    }else if ( format == "shortname"){
        showName = customTypeData[parseInt(id-1)].cname_s;
    }

    return showName ;
}

/**
 * 判断手机号格式
 * @param phone
 * @returns {boolean}
 */
function checkPhone(phone){
    var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    return reg.test(phone);

}
