/**
 * @Author: jeffrey
 * @Date:   2016-06-27T18:48:34+08:00
 * @Last modified by:   jeffrey
 * @Last modified time: 2016-07-01T00:34:19+08:00
 */



var bt = baidu.template;
var orderPages = 0;
var currentOrderPages = 0;
//var touchPage = new PageTouch();

function trim(str) {
    if (str == null || str.length <= 0 || str == 'null') return "";
    //删除左右两端的空格
    return str.replace(/(^s*)|(s*$)/g, "");
}

jQuery.extend({
    base_login: function (errMsg) {
        //rsa登录
        var username = $("#username").val();
        var password = $("#password").val();

        if (username == null || username == 'undefined' || username.length <= 0) {
            alert("用户名不能为空");
            return false;
        }

        if (password == null || password == 'undefined' || password.length <= 0) {
            alert("密码不能为空");
            return false;
        }

        enpassword = encryptWithRSA(password);
        password = enpassword.replace(/\+/g, "_");

        //开始调用登陆接口
        $.ajax({
            url: ROUTE_LOGIN_URL,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                username: username,
                password: password,
                platform: getLocalCache('PLATFORM'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200) {
                    var user = data.data;
                    if (user.id > 0) {
                        //登陆成功，则将用户名和密码记在本地的location里面
                        setLocalCache("username", username);
                        setLocalCache("password", password);
                        setLocalCache("uid", user.id);
                        setLocalCache("ticket", user.ticket);
                        setLocalCache("ccid", user.cid);
                        setLocalCache('scid', 3329);

                        window.location.href = "supplier.html";
                        /*
                         var ccid = user.cid;
                         if (ccid == null || ccid == 'undefined') {
                         window.location.href = "supplier.html";
                         } else {
                         window.location.href = "home.html";
                         }
                         */
                    } else {
                        alert("用户名或密码错误");
                    }
                } else if (data != null && data.status == 300) {
                    alert("用户名或密码错误");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
        });
    },

    //获取用户信息
    getUserInfo: function (container) {
        $.ajax({
            url: ROUTE_USER_GET,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                ticket: getLocalCache('ticket'),
                scid: getLocalCache('scid'),
            },
            success: function (data, textStatus) {
                if (data.status == 200) {
                    var data = data.data;
                    if (data != null) {
                        $("#" + container).html(data.name);
                    }
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //退出登陆
    logout: function () {
        $.ajax({
            url: ROUTE_LOGINOUT_URL,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                if (data != null && (data.status == 200 || data.status == "0000")) {
                    //清空本地存储
                    clearLocalCache("username");
                    clearLocalCache("password");
                    clearLocalCache("ticket");
                    clearLocalCache("ccid");
                    clearLocalCache("scid");
                    clearLocalCache("uid");
                    //window.location.href = "msg_fail.html?msg=登录失败?relogin=1";
                    window.location.href = "index.html";
                } else if (data != null && data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //显示供应商
    showSupplierByCustomer: function (btid, container, callback) {
        $.ajax({
            url: ROUTE_CUSTOMER_SUPPLIER,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                //console.log(data);
                if (data != null && data.status == 200 && data.data != null) {
                    var html = bt(btid, data);
                    $("#" + container).append(html);
                    if (typeof(callback) == 'function') {
                        callback();
                    }
                } else if (data.status == 200 && data.data == null) {
                    $(".mui-empty").show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //显示供应商详情
    showSupplierDetail: function () {
        $.ajax({
            url: ROUTE_CUSTOMER_SUPPLIER_DETAIL,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: getLocalCache("scid"),
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                //console.log(data);
                if (data != null && data.status == 200 && data.data != null) {
                    //var html = bt(btid, data);
                    //$("#" + container).append(html);
                    //if (typeof(callback) == 'function'){
                    //    callback();
                    //}
                } else if (data.status == 200 && data.data == null) {
                    $(".mui-empty").show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //显示订单列表
    showOrder: function (btid, container, status, page, limit) {
        $.showLoading("正在加载...");
        var ticket = getLocalCache('ticket');
        $.ajax({
            url: ROUTE_ORDER_CUSTOMER,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                status: status ? status : -1,
                page: page ? page : 1,
                limit: limit ? limit : 25,
                ticket: ticket,
            },
            success: function (data, textStatus) {
                $.hideLoading();
                //console.log("xxx"+data.data.length);
                if (data != null && data.status == 200 && data.data != null && data.data.length !== 0) {
                    var html = bt(btid, data);
                    $("#" + container).empty().append(html);
                    $(".mui-empty").hide();
                } else if (data.data == null || data.data.length === 0) {
                    $("#" + container).empty();
                    $(".mui-empty").show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //显示订单详情
    showOrderDetail: function (btid, container, id) {
        $.ajax({
            url: ROUTE_ORDER_DETAIL,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                id: id,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                console.log(data);
                if (data != null && data.status == 200 && data.data != null) {
                    order_id = data.order_id;
                    var html = bt(btid, data);
                    $("#" + container).empty().append(html);

                    //显示银行汇款账号信息
                    $.payBank(data.data.scid, data.data.pt, 'tempBankForPay', 'bankForPay');
                } else if (data.data == null) {
                    $(".ui-empty").show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //订单跟踪
    showOrderTrack: function (btid, container, orderid, id) {
        $.ajax({
            url: ROUTE_ORDER_TRACK,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                orderno: orderid,
                id: id,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200 && data.data != null) {
                    var html = bt(btid, data);
                    $("#" + container).empty().append(html);
                } else if (data.data == null) {
                    $(".ui-empty").show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //取消订单
    cancelOrder: function (id, btn) {
        $.ajax({
            url: ROUTE_ORDER_CANCEL,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                id: id,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200) {
                    $(btn).parent().prev().find('li').eq(1).html('<label>订单状态：</label>已取消');
                    $(btn).remove();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //显示送货紧急度select
    showDeliveryGoods: function (btid) {
        $.ajax({
            url: ROUTE_DELIVERY_ORDER,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                ticket: getLocalCache('ticket')
            },
            success: function (data, textStatus) {
                if (data.status == 200) {
                    var data = data.data;
                    if (data != null && data.length > 0) {
                        $("#" + btid).empty();
                        for (var i = 0; i < data.length; i++) {
                            $("#" + btid).append("<option  value=" + data[i].value + ">" + data[i].memo + "</option>");
                        }
                        var sc = getUrlParam("sc");
                        if (sc != null && sc != "undefined") {
                            $("#" + btid).val(sc);
                        }
                    }
                }
            }
        });
    },

    //提交订单
    submitOrder: function (mode) {
        var cartOrderItem = cart.displayCart(mode);
        console.log(cartOrderItem);

        //获取卡密列表
        var card_list=$("#card_no_list li");
        var card_list_str='';
        if(card_list!=null&&card_list.length>0)
        {
            for(var ji=0;ji<card_list.length;ji++){
                console.log(card_list[ji]);
                card_list_str+=card_list[ji].innerHTML+",";
            }
        }

        console.log(card_list_str);

        var card_ceck=$("#card_no").val();
        if(card_ceck!=null&&card_ceck.length>0)
        {
            $.alert("请先添加卡密");
            return;
        }

        var orderItem = [];
        if (cartOrderItem == null || cartOrderItem.items == null || cartOrderItem.items.length <= 0) {
            $.alert("请先选购商品");
            return false;
        } else {
            cartOrderItem = cartOrderItem.items;
        }
        for (var i = 0; i < cartOrderItem.length; i++) {
            orderItem[i] = {
                "total": cartOrderItem[i].qty,
                "mgid": cartOrderItem[i].id,
                "scid": cartOrderItem[i].scid
            }
        }
        //收货地址
        var addresseddId = $("#addressId").val();
        if (addresseddId == null || addresseddId == "undefined" || addresseddId.length <= 0) {
            $.alert("请选择收货地址");
            return false;
        }
        //商品Item
        if (orderItem == null || orderItem.length <= 0) {
            $.alert("购物车没有商品,请选购商品");
            return false;
        }

        var delivery = $("#delivery").val();

        if (delivery == null || delivery == 'undefined') {
            $.alert("请选送货紧急程度!");
            return false;
        }

        var express_detail_id = $("#logistics").val();
        if (express_detail_id == null || delivery == 'undefined' || parseInt(express_detail_id) <= 0) {
            $.alert("请选择物流公司!");
            return false;
        }



        //如果选择了红包需要验证红包是否可以使用
        var coupon_id = $("#coupon").val();

        $.showLoading("正在提交...");

        //showLoading("<i class='fa rsicon-loading fa-spin'></i>订单提交中…");
        var scid = getLocalCache("scid");


        var post_logistics_money = $("#logistics_money").val();

        var postData = {
            "delivery": delivery,
            "addresseeId": addresseddId,
            "memo": $("#memo").val(),
            "orderItem": JSON.stringify(orderItem),
            "ccid": getLocalCache("ccid"),
            "pt": $("#payType").val(),
            "scid": scid,
            "ticket": getLocalCache('ticket'),
            "couid": coupon_id,
            "express_detail_id": express_detail_id,
            "use_express_money": post_logistics_money,
            "card_list_str":card_list_str,
        };
        var paymoenry_time=parseFloat($("#confirm-total").html());
        var payType = parseInt($('#payType').val());
        var scid = getLocalCache("scid");
        var openid = getLocalCache("openid");
        var ticket = getLocalCache("ticket");

        $.ajax({
            url: ROUTE_ORDER_SUBMIT,
            data: postData,
            type: 'GET',
            cache: false,
            dataType: "jsonp",
            jsonp: 'callback',
            success: function (data) {
                var superOrderId = data.data;
                console.log(data);
                if (superOrderId != null && superOrderId.length > 0) {
                    cart.emptyCart(mode);
                    //window.location.href = "order.html?soid=" + superOrderId;
                    if (payType == 2&&paymoenry_time>0) {
                        window.location.href = "pay.php?soid=" + superOrderId + "&scid=" + scid + "&openid=" + openid + "&ticket=" + ticket + "&env=" + env;
                    } else {
                        window.location.href = "msg_success.html?";
                    }
                } else if (data.status == 400) {
                    $.alert(data.msg);
                    $("#submitOrderBtn").attr("disabled", false);
                } else {
                    $("#submitOrderBtn").attr("disabled", false);
                    $.alert("提交订单失败");
                }
                $.hideLoading();
            },
            error: function () {

            }
        });
    },

    //显示首页
    showHomeBySupplier: function (btid, container, scid) {

        $.showLoading("正在加载...");

        $.ajax({
            url: ROUTE_HOME_PAGE,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: scid,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                //console.log(data);
                $.hideLoading();
                if (data != null && data.status == 200 && data.data != null) {
                    var items = data.data;
                    for (var i = 0; i < items.length; i++) {
                        //焦点图
                        if (items[i].type == 1) {

                            var rdata = {
                                data: eval(items[i].description)
                            };

                            var desc = items[i].description;
                            var c = '';
                            if (desc != null && desc != 'undefined') {
                                //将数据转为JSON格式
                                var imgData = JSON.parse(desc);
                                for (var j = 0; j < imgData.length; j++) {
                                    c += '<div class="touchslider-item"><a href="' + imgData[j].href + '"><img src="' + imgData[j].c + '@0o_0l_640w_90q" class="img-responsive"></a></div>';
                                }
                            }
                            $("#containerFocus").append(c);
                        }
                        //入口
                        if (items[i].type == 2) {
                            var rdata = {
                                data: eval(items[i].description)
                            };
                            var html = bt("temp-quick-default", rdata);
                            $("#" + container).append(html);
                        }
                        //快报
                        if (items[i].type == 3) {

                            var rdata = {
                                data: eval(items[i].description)
                            };
                            var html = bt("temp-broadcast-default", rdata);
                            $("#" + container).append(html);
                            //2条以上才触发滚动
                            //console.log(items[i].description);
                            if (items[i].description.length > 1) {
                                $(function () {
                                    setInterval('autoScroll("#broadcast")', 3000)
                                })
                            }
                        }
                        //橱窗
                        if (items[i].type == 4) {

                            var rdata = {
                                data: eval(items[i].description)
                            };
                            var html = bt("temp-showcase-default", rdata);
                            $("#" + container).append(html);
                        }
                    }


                    // new PageSlide(document.getElementById("containerFocus"), 'X');
                    $(".img-responsive").height(getScreenInfo().width / 2.1 - 5).width(getScreenInfo().width);
                    $(".mui-focus").height(getScreenInfo().width / 2.1 - 5);

                    $(".touchslider").touchSlider({
                        container: this,
                        duration: 350,
                        delay: 3000,
                        margin: 0,
                        mouseTouch: true,
                        namespace: "touchslider",
                        autoplay: true,
                        viewport: ".touchslider-viewport"
                    });

                } else if (data.status == 200 && data.data == null) {
                    $(".data-empty").show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //显示分类
    showCateList: function (btid, container, code) {
        var currentCode = getUrlParam('code');

        $.ajax({
            url: ROUTE_READ_GTYPE,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: getLocalCache("scid"),
                code: code,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                //console.log(data);
                if (data != null && data.status == 200 && data.data != null) {

                    for (var i = 0; i < data.data.length; i++) {
                        if (currentCode && data.data[i].code == currentCode.substr(0, 4)) {
                            data.data[i].active = 'active';
                        } else {
                            data.data[i].active = '';
                        }
                    }

                    var html = bt(btid, data);

                    $("#" + container).empty().append(html);

                    //分类高亮定位补丁
                    if (currentCode) {
                        $(".goods-cate-group li:first").removeClass("active");
                    }

                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //显示栏目列表
    showColumnList: function (btid, container) {
        var currentColumn = getUrlParam('column');

        $.ajax({
            url: ROUTE_COLUMN_GET,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: getLocalCache("scid"),
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                //console.log(data);
                if (data != null && data.status == 200 && data.data != null) {

                    for (var i = 0; i < data.data.length; i++) {
                        if (currentColumn && data.data[i].id == currentColumn) {
                            data.data[i].active = 'active';
                        } else {
                            data.data[i].active = '';
                        }
                    }

                    var html = bt(btid, data);
                    $("#" + container).append(html);

                    //分类高亮定位补丁

                    if (currentColumn > 0) {
                        setTimeout(function () {
                            $(".goods-cate-group li:first").removeClass("active");
                        }, 100);

                    }

                } else if (data.status == 200 && data.data == null) {
                    $(".data-empty").show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //全部商品和分类商品显示
    showGoodsList: function (btid, container, scid, code, page, limit) {
        $.showLoading("正在加载...");
        $.ajax({
            url: ROUTE_READ_GOODS_GTYPE,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: getLocalCache("scid"),
                code: code,
                page: page ? page : 1,
                limit: limit ? limit : 20,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                //console.log(data);
                $.hideLoading();
                if (data != null && data.status == 200 && data.data != null) {

                    var items = data.data;

                    for (var i = 0; i < items.length; i++) {
                        var mgid = items[i].id;
                        var marketId = items[i].marketid;
                        if (marketId != null && marketId != "undefined" && marketId.length > 0) {
                            $.showItemMarketList(mgid, marketId);
                        }
                    }

                    var html = bt(btid, data);
                    $(".mui-empty").hide();

                    //第一页清空后加载，否则累加加载
                    if (page === 1) {
                        $("#" + container).empty().append(html);
                    } else {
                        $("#" + container).append(html);
                    }

                    // console.log(items.length + "|"+limit);

                    if (items.length < limit) {
                        $(".items-more").hide();
                    } else {
                        $(".items-more").show();
                    }

                } else if (data.status == 200 && data.data == null) {
                    if (page == 1) {
                        $("#" + container).empty()
                        $(".mui-empty").show();
                        $(".items-more").hide();
                    } else {
                        $(".items-more").hide();
                    }
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //按栏目显示商品
    showGoodsListByColumn: function (btid, container, scid, columnid, page, limit) {
        $.ajax({
            url: ROUTE_READ_GOODS_COLUMN,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: scid,
                cateid: columnid,
                page: page ? page : 1,
                limit: limit ? limit : 25,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200 && data.data != null) {

                    var items = data.data;
                    for (var i = 0; i < items.length; i++) {
                        var mgid = items[i].id;
                        var marketId = items[i].marketid;
                        if (marketId != null && marketId != "undefined" && marketId.length > 0) {
                            $.showItemMarketList(mgid, marketId);
                        }
                    }
                    // console.log(data);
                    var html = bt(btid, data);
                    $(".mui-empty").hide();
                    //$("#" + container).empty().append(html);

                    //第一页清空后加载，否则累加加载
                    if (page === 1) {
                        $("#" + container).empty().append(html);
                    } else {
                        $("#" + container).append(html);
                    }

                    if (items.length < limit) {
                        $(".items-more").hide();
                    } else {
                        $(".items-more").show();
                    }

                } else if (data.status == 200 && data.data == null) {
                    $("#" + container).empty()
                    $(".mui-empty").show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //显示热购商品
    showHotGoods: function (btid, container, scid, limit) {
        $.ajax({
            url: ROUTE_CUSTOMER_HOT_GOODS,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: scid,
                limit: limit ? limit : 6,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                //console.log(data);
                if (data != null && data.status == 200 && data.data != null) {

                    var items = data.data;
                    for (var i = 0; i < items.length; i++) {
                        var mgid = items[i].id;
                        var marketId = items[i].marketid;
                        if (marketId != null && marketId != "undefined" && marketId.length > 0) {
                            $.showItemMarketList(mgid, marketId);
                        }
                    }

                    var html = bt(btid, data);
                    $(".mui-empty").hide();
                    $("#" + container).empty().append(html);

                } else if (data.status == 200 && data.data == null) {
                    $("#" + container).empty()
                    $(".mui-empty").show();
                }
                // else if (data.status == LOGIN_OUT_STATUS) {
                //     window.location.href = "/msg_fail.html?msg=登录失败";
                // }
            }
        });
    },
    //显示首页栏目的商品
    showHomeColumnGoods: function (btid, container, scid) {
        $.ajax({
            url: ROUTE_COLUMN_GOOD,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: scid,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                // console.log(container);
                if (data != null && data.status == 200 && data.data.length) {
                    var items = data.data;
                    for (var i = 0; i < items.length; i++) {
                        var mgid = items[i].id;
                        var marketId = items[i].marketid;
                        if (marketId != null && marketId != "undefined" && marketId.length > 0) {
                            $.showItemMarketList(mgid, marketId);
                        }
                    }

                    var html = bt(btid, data);
                    $(".mui-empty").hide();
                    $("#" + container).empty().append(html);

                } else if (data.status == 200 && data.data.length <= 0) {
                    $("#" + container).empty();
                    $.showHomeGoods("tempGoodsGrid", "containerHotGoods", scid, "", 1, 20);

                    // $(".mui-empty").show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },
    //显示所有商品
    showHomeGoods: function (btid, container, scid, code, page, limit) {
        $.ajax({
            url: ROUTE_READ_GOODS_GTYPE,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: scid,
                code: code,
                page: page ? page : 1,
                limit: limit ? limit : 25,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                //console.log(data);
                if (data != null && data.status == 200 && data.data != null) {

                    var items = data.data;
                    for (var i = 0; i < items.length; i++) {
                        var mgid = items[i].id;
                        var marketId = items[i].marketid;
                        if (marketId != null && marketId != "undefined" && marketId.length > 0) {
                            $.showItemMarketList(mgid, marketId);
                        }
                    }

                    var html = bt(btid, data);
                    $(".mui-empty").hide();
                    $("#" + container).empty().append(html);


                    $("img.lazy").lazyload({threshold: 100, effect: "fadeIn", event: "sporty"});

                    var timeout = setTimeout(function () {
                        $("img.lazy").trigger("sporty")
                    }, 2000);

                } else if (data.status == 200 && data.data == null) {
                    $("#" + container).empty()
                    $(".mui-empty").show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },
    //显示营销信息
    showItemMarketList: function (mgid, marketid) {
        //console.log("mgid:"+mgid+",marketid:"+marketid);
        $.ajax({
            url: ROUTE_READ_GIVEAWAY,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                mgid: mgid,
                mids: marketid,
                scid: getLocalCache('scid'),
                ccid: getLocalCache("ccid"),
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                var obj = $("#market_" + mgid);
                obj.empty();
                if (data != null && data.status == 200) {
                    var items = data.data;
                    //console.log(items);
                    if (items != null && data.status == 200) {
                        var tmp = "<ul>";
                        for (var i = 0; i < items.length; i++) {
                            tmp = tmp +
                                "<li>" +
                                "<span class='item-flag'>" + items[i].iconName + "</span> " +
                                items[i].title +
                                "</li>";

                        }
                        tmp = tmp + "</ul>"
                        obj.append(tmp);
                        obj.show();
                    }

                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //显示商品详情
    showGoodsItem: function (btid, container, mgid) {
        var scid = getLocalCache("scid");
        $.ajax({
            url: ROUTE_READ_GOODS_INFO,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: scid,
                id: mgid,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200 && data.data != null) {
                    var item = data.data;
                    var mgid = item.id;
                    var marketId = item.marketid;
                    if (marketId != null && marketId != "undefined" && marketId.length > 0) {
                        $.showItemMarketList(mgid, marketId);
                    }
                    data.SHOPMODE = getLocalCache('SHOPMODE');
                    var html = bt(btid, data);
                    $("#" + container).append(html);

                    var total = cart.getCartTotal();
                    $("#mainTabCartGoodsItem i").text(total);

                    new PageSlide(document.getElementById("containerGoodsThumb"), 'X');

                    //超宽图片处理
                    var imgs = $(".mui-goods-content img");

                    var screen_width = $(window).width();

                    for(var i=0; i < imgs.length; i++){
                        console.log($(imgs[i]).width());
                        //if($(imgs[i]).width() > screen_width){
                            $(imgs[i]).attr('style','width: '+(screen_width -20)+'px;');
                            $(imgs[i]).attr('width',screen_width -20);
                            $(imgs[i]).removeAttr('height');
                        //}
                    }

                } else if (data.status == 200 && data.data == null) {
                    //$(".data-empty").show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //加载用户个人信息
    showUserInfo: function (btid, container) {
        $.ajax({
            url: ROUTE_USER_GET,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                ticket: getLocalCache('ticket'),
                scid: getLocalCache('scid')
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200) {
                    console.log(data);
                    data.data['mode'] = getLocalCache('SHOPMODE');

                    var html = bt(btid, data);
                    $("#" + container).append(html);
                    if (getLocalCache('SHOPMODE') == 'B2C') {
                        if (data.data.vip_level == '1') {
                            $(".item-des").hide();
                        }
                    }
                } else if (data != null && data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "msg_fail.html?msg=登录失败";
                }
            }
        });
    },


    //显示收货地址列表
    showAddressList: function (btid, container, mode) {
        $.showLoading("正在加载...");
        $.ajax({
            url: ROUTE_ADDRESS_LIST,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                ccid: getLocalCache("ccid"),
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].mode = mode;
                    }
                    var html = bt(btid, data);
                    $("#" + container).append(html);
                    $.hideLoading();
                } else if (data.data == null || data.data.length < 0) {
                    $(".mui-empty").show();
                } else if (data != null && data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //保存收货地址信息
    saveAddress: function (contacts, phone, province, city, county, street, url) {
        //showLoading("<i class='fa rsicon-loading fa-spin'></i>信息提交中…");
        $.ajax({
            url: ROUTE_ADDRESS_ADDNEW,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                province: province,
                city: city,
                county: county,
                street: street,
                contacts: contacts,
                phone: phone,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200) {
                    window.location.href = url;
                } else if (data != null && data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //删除收货地址
    delAddress: function (id, url) {
        //showLoading("<i class='fa rsicon-loading fa-spin'></i>信息提交中…");
        $.ajax({
            url: ROUTE_ADDRESS_DEL,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                id: id,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200) {
                    window.location.href = url;
                } else if (data != null && data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //设置默认收货地址
    setDefAddress: function (id, url) {
        $.ajax({
            url: ROUTE_ADDRESS_DEFAULT,
            dataType: "jsonp",
            jsonp: 'callback',
            async: false,
            data: {
                id: id,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200) {
                    window.location.href = url;
                } else if (data != null && data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //加载默认收货地址
    showDefAddress: function (btid, container, ccid, hiddenId) {
        $.ajax({
            url: ROUTE_ADDRESS_GET_DEFAULT,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                ccid: ccid,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200) {
                    var html = bt(btid, data);
                    $("#" + container).html(html);
                    if (hiddenId != null) {
                        if (data.data != null) {
                            $("#" + hiddenId).val(data.data.id);
                        }
                    }

                    //获取地址则,并检测可用物流
                    var province = trim(data.data.province);
                    var city = trim(data.data.city);
                    var county = trim(data.data.county);
                    var street = trim(data.data.street);

                    var wl_province = "";
                    if (province != null && province.length > 0) {
                        wl_province = province;
                    } else {
                        if (city != null && city.length > 0) {
                            wl_province = city;
                        } else {
                            if (county != null && county.length > 0) {
                                wl_province = county;
                            } else {
                                if (street != null && street.length > 0) {
                                    var m_street = street.split(" ");
                                    if (m_street != null && m_street.length > 0) {
                                        wl_province = trim(m_street[0]);
                                    }
                                }
                            }
                        }
                    }

                    //为省份
                    if (wl_province != null && wl_province != "") {
                        $.ajax({
                            url: ROUTE_EXPRESS_LIST,
                            dataType: 'jsonp',
                            jsonp: 'callback',
                            data: {
                                province: wl_province,
                                ticket: getLocalCache('ticket'),
                            },
                            success: function (data, textStatus) {
                                if (data != null && data.status == 200 && data.data.length > 0) {
                                    var express_data = data.data;
                                    $("#logistics").append("<option value='0'>请选择物流公司</option>")
                                    for (var i = 0; i < express_data.length; i++) {
                                        $("#logistics").append("<option value='" + express_data[i].id + "'>" + express_data[i].express + "</option>")
                                    }
                                }
                            }
                        });
                    }
                } else if (data != null && data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //提交意见反馈
    saveFeedback: function (ccid, memo, url) {
        //showLoading("<i class='fa rsicon-loading fa-spin'></i>信息提交中…");
        $.ajax({
            url: ROUTE_FEEDBACK_ADD,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                ccid: ccid,
                memo: memo,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200) {
                    window.location.href = url;
                } else if (data != null && data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //获取微信OPENID
    getWeixinOpenid: function (code, state) {

        //PBS fix
        if (state == 'pbs') {
            setLocalCache('SHOPMODE', 'B2C');
            setLocalCache('PLATFORM', 'pbs');
        } else {
            setLocalCache('SHOPMODE', 'B2B');
            setLocalCache('PLATFORM', 'customer');
        }

        $.ajax({
            url: ROUTE_WX_OPENID,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                code: code,
                state: state,
            },
            success: function (data, textStatus) {
                console.log(data);
                if (data != null && data.status == "0000") {
                    // $("#debug-openid").html("index OPENID:" + data.msg.openid);
                    var openid = data.msg.openid;
                    setLocalCache("openid", openid);
                    $.wxOpenidLogin(openid);
                }
            }
        });
    },

    //获取微信OPENID,会销专用
    getWeixinOpenid2: function (code, state) {

        //PBS fix
        if (state == 'pbs') {
            setLocalCache('SHOPMODE', 'B2C');
            setLocalCache('PLATFORM', 'pbs');
        } else {
            setLocalCache('SHOPMODE', 'B2B');
            setLocalCache('PLATFORM', 'customer');
        }

        $.ajax({
            url: ROUTE_WX_OPENID,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                code: code,
                state: state,
            },
            success: function (data, textStatus) {
                //console.log('getWeixinOpenid:' + data);
                if (data != null && data.status == "0000") {
                    // $("#debug-openid").html("index OPENID:" + data.msg.openid);
                    var openid = data.msg.openid;
                    setLocalCache("openid", openid);
                    $.wxOpenidLogin2(openid);
                }
            }
        });
    },

    //使用微信OPENID尝试自动登录
    wxOpenidLogin: function (openid) {
        $.ajax({
            url: ROUTE_WX_OPENID_LOGIN,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                openid: openid,
                platform: getLocalCache('PLATFORM'),
            },
            success: function (data, textStatus) {

                console.log(data);
                if (data != null && data.status == '200') {
                    if (data.data != null) {
                        // $("#debug-user").html("USERINFO:" + JSON.stringify(data));
                        var user = data.data;
                        if (user.id > 0) {
                            setLocalCache("username", user.username);
                            setLocalCache("uid", user.id);
                            setLocalCache("ticket", user.ticket);
                            setLocalCache("ccid", user.cid);
                            setLocalCache("scid", user.scid);
                            setLocalCache("shopName", user.mall_name);
                            setLocalCache("cs_phone", user.cs_phone);
                        }
                        //console.log('wxOpenidLogin', data);
                        //自动登录
                        // $("#debug-user").html("USERINFO:" + JSON.stringify(data));
                        window.location.href = "supplier.html";
                    } else {
                        //执行绑定流程
                        if (getLocalCache('SHOPMODE') === 'B2C') {
                            window.location.href = "vip_reg.html?openid=" + openid;
                        } else {
                            window.location.href = "account_bind.html?openid=" + openid;
                            //window.location.href='pay.html?id=958&soid=920160511185442638490&openid='+openid;
                        }
                    }
                } else if (data != null && data.status == 300) {
                    if (getLocalCache('SHOPMODE') === 'B2C') {
                        window.location.href = "vip_reg.html?openid=" + openid;
                    } else {
                        window.location.href = "account_bind.html?openid=" + openid;
                    }
                }
            }
        });
    },

    //使用微信OPENID尝试自动登录，会销处理流程
    wxOpenidLogin2: function (openid) {
        $.ajax({
            url: ROUTE_WX_OPENID_LOGIN,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                openid: openid,
                platform: getLocalCache('PLATFORM'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200) {

                    if (data.data != null) {
                        // $("#debug-user").html("USERINFO:" + JSON.stringify(data));
                        var user = data.data;
                        if (user.id > 0) {
                            setLocalCache("username", user.username);
                            setLocalCache("uid", user.id);
                            setLocalCache("ticket", user.ticket);
                            setLocalCache("ccid", user.cid);
                            setLocalCache("scid", user.scid);
                            setLocalCache("cs_phone", user.cs_phone);
                        }
                        //console.log('wxOpenidLogin', data);
                        //自动登录
                        // $("#debug-user").html("USERINFO:" + JSON.stringify(data));
                        window.location.href = "supplier.html";
                    } else {
                        //执行绑定流程
                        window.location.href = "huixiao_bind.html?openid=" + openid;
                    }
                } else if (data != null && data.status == 300) {
                    window.location.href = "huixiao_bind.html?openid=" + openid;
                }
            }
        });
    },

    //发送短信验证码，填写用户名
    sendSMS: function (username) {

        $.ajax({
            url: ROUTE_SEND_SMS,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                username: username,
                platform: getLocalCache('PLATFORM'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == "0000") {
                    $.alert('验证码已发送到尾号' + data.msg.phone.substr(7, 4) + '的手机');
                    //$("#debug-sms").html("SMS:" + JSON.stringify(data));
                } else {
                    $.alert(data.msg);
                }
            }
        });
    },

    //发送短信验证码，填写手机号
    sendSMSusePhone: function (phone) {

        $.ajax({
            url: ROUTE_SEND_SMS_USE_PHONE,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                phone: phone,
                platform: getLocalCache('PLATFORM'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == "0000") {
                    $.alert('验证码已发送到尾号' + phone.substr(7, 4) + '的手机');
                    //$("#debug-sms").html("SMS:" + JSON.stringify(data));
                } else {
                    $.alert(data.msg);
                }
            }
        });
    },

    //绑定账号
    bindAccount: function (phone, openid, sms) {

        $.ajax({
            url: ROUTE_WX_BIND,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                username: phone,
                openid: openid,
                verify: sms,
                platform: getLocalCache('PLATFORM'),
            },
            success: function (data, textStatus) {
                if (data == null) {
                    $.alert("网络异常，请稍后再试");
                } else {
                    if (data.status == 200) {
                        var user = data.data;
                        if (user.id > 0) {
                            setLocalCache("username", user.username);
                            setLocalCache("uid", user.id);
                            setLocalCache("ticket", user.ticket);
                            setLocalCache("ccid", user.cid);
                            setLocalCache("scid", user.scid);
                            setLocalCache("openid", openid);
                            setLocalCache("cs_phone", user.cs_phone);
                            //console.log('bindAccount', data);
                            window.location.href = "supplier.html";
                        } else {
                            $.alert("用户名错误");
                        }
                    } else if (data.status == "LOGIN_OUT_STATUS") {
                        $.alert(data.msg);
                    } else if (data.status == "300") {
                        $.alert(data.msg);
                    } else {
                        $.alert(data.msg);
                    }
                }

            }
        });
    },

    //绑定账号,会销专用
    bindAccountForHuixiao: function (phone, openid, sms, pcode) {

        $.ajax({
            url: ROUTE_HUIXIAO_BIND,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                username: phone,
                openid: openid,
                verify: sms,
                platform: getLocalCache('PLATFORM'),
                pcode: pcode
            },
            success: function (data, textStatus) {
                console.log(data);
                if (data == null) {
                    $.alert("网络异常，请稍后再试");
                } else {
                    if (data.status == '200') {
                        var user = data.data;
                        if (user.id > 0) {
                            setLocalCache("username", user.username);
                            setLocalCache("uid", user.id);
                            setLocalCache("ticket", user.ticket);
                            setLocalCache("ccid", user.cid);
                            setLocalCache("scid", user.scid);
                            setLocalCache("openid", openid);
                            setLocalCache("cs_phone", user.cs_phone);
                            //console.log('bindAccount', data);
                            window.location.href = "supplier.html";
                        } else {
                            $.alert("用户名错误");
                        }
                    } else if (data.status == LOGIN_OUT_STATUS) {
                        $.alert(data.msg);
                    }
                }

            }
        });
    },

    //会员注册和绑定微信
    vipRegAndBind: function (contactor, phone, openid, sid, sms) {
        $.ajax({
            url: ROUTE_VIP_REG,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                contactor: contactor,
                username: phone,
                openid: openid,
                verify: sms,
                my_sid: sid,
                platform: getLocalCache('PLATFORM'),
            },
            success: function (data, textStatus) {
                if (data == null) {
                    $.alert("网络异常，请稍后再试");
                } else {
                    if (data.status == '0000') {
                        var user = data.msg;
                        if (user.id > 0) {
                            setLocalCache("username", user.username);
                            setLocalCache("uid", user.id);
                            setLocalCache("ticket", user.ticket);
                            setLocalCache("ccid", user.cid);
                            setLocalCache("scid", user.scid);
                            setLocalCache("openid", openid);
                            //console.log('bindAccount', data);
                            window.location.href = "supplier.html";
                        } else {
                            $.alert("用户名错误");
                        }
                    } else if (data.err == 1) {
                        $.alert(data.msg);
                    }
                }

            }
        });
    },

    //解绑账号
    unbindAccount: function () {
        $.ajax({
            url: ROUTE_WX_UNBIND,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                openid: getLocalCache("openid"),
                platform: getLocalCache('PLATFORM'),
            },
            success: function (data, textStatus) {
                if (data == null) {
                    $.alert("网络异常，请稍后再试");
                } else {
                    if (data.err == 0) {
                        clearLocalCache("username");
                        clearLocalCache("uid");
                        clearLocalCache("ticket");
                        clearLocalCache("ccid");
                        clearLocalCache("scid");
                        clearLocalCache("openid");
                        if (getLocalCache('SHOPMODE') == 'B2C') {
                            window.location.href = "vip_reg.html";
                        } else {
                            window.location.href = "account_bind.html";
                        }

                    } else {
                        $.alert('解绑出错:' + data.msg);
                    }
                }

            }
        });
    },

    // 搜索页列表
    showSearchGList: function (keyword, btid, container) {
        $.ajax({
            url: ROUTE_READ_CUSTOMER_GOODS_SEARCH,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                ccid: getLocalCache("ccid"),
                k: keyword,
                scid: getLocalCache("scid"),
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                //$("#countNumber").text(data.count);
                $("#" + container).empty();
                if (data.status == 200) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].price = parseFloat(data.data[i].price).toFixed(2);
                        //$.showMarketInfo(data.data[i].id, data.data[i].marketid);
                    }
                    var html = bt(btid, data);
                    $("#" + container).append(html);
                    //fixGoodsThumb(".item-thumb");
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //显示营销信息
    showMarketInfo: function (mgid, marketid) {
        $.ajax({
            url: ROUTE_MARKET_GETBYMGID,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                mgid: mgid,
                mids: marketid,
                ccid: getLocalCache("ccid"),
            },
            success: function (data, textStatus) {
                var obj = $("#market_" + mgid);
                obj.empty();
                if (data != null && data.status == 200) {
                    var data = data.data;
                    for (var i = 0; i < data.length; i++) {
                        var tmp = "<li>" +
                            "<span class='flag'>" + data[i].iconName + "</span> " +
                            data[i].title +
                            "</li>";
                        obj.append(tmp);
                    }
                    obj.parent().show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "msg_fail.html?msg=登录失败";
                }
            }
        });
    },
    //是否已经支付
    paidSucc: function (scid, soid, ticket) {
        $.ajax({
            url: ROUTE_PAY_RESULT_URL,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: scid,
                soid: soid,
                ticket: ticket
            },
            success: function (data, textStatus) {
                $('#loadingToast').hide();
                if (data != null && data.status == 200 && data.data != null) {
                    if (data.data.result == 'success') {
                        $('#icon_msg').removeClass('weui_icon_waiting').addClass("weui_icon_success").show();
                        $('.weui_msg_title').html('支付成功');
                        $('.weui_text_area').show();
                        $('.weui_icon_area').show();
                    }
                } else if (data.data == null) {
                    $('.weui_icon_area').show();
                    $('.weui_text_area').show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //支付方式
    payType: function (scid, ticket, bid, container) {
        $.ajax({
            url: ROUTE_PAY_TYPE_URL,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: scid,
                ticket: ticket
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200 && data.data != null) {
                    var html = bt(bid, data);
                    $("#" + container).append(html);

                    //补丁，页面初始化时触发
                    var payType = $("#payType").val();
                    if (payType == 3 || payType == 4) {
                        $.payBank(scid, payType, 'tempBankForPay', 'bankForPay');
                    } else {
                        $("#bankForPay").empty();
                    }
                } else if (data.data == null) {

                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //用于接收转账的银行账号
    payBank: function (scid, payType, bid, container) {
        if (payType == null) {
            payType = 3;
        }
        $.ajax({
            url: ROUTE_PAY_BANK,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: scid,
                type: payType,
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200 && data.data != null) {
                    console.log(data);
                    var html = bt(bid, data);
                    $("#" + container).empty().append(html);
                } else if (data.data == null) {

                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },
    //获取 发货方式、支付方式、配送信息
    getCartInfo: function (scid, deliverybid, paycontainer, infocontainer) {
        $.ajax({
            url: ROUTE_ORDER_CART_INFO,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                scid: scid,
                ticket: getLocalCache('ticket'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200 && data.data != null) {
                    //发货方式
                    if (data.data.delivery.length) {
                        $("#" + deliverybid).empty();
                        for (var i = 0; i < data.data.delivery.length; i++) {
                            $("#" + deliverybid).append("<option  value=" + data.data.delivery[i].value + ">" + data.data.delivery[i].memo + "</option>");
                        }
                        var sc = getUrlParam("sc");
                        if (sc != null && sc != "undefined") {
                            $("#" + deliverybid).val(sc);
                        }
                    }
                    //支付方式
                    if (data.data.paytype.length) {
                        for (var i = 0; i < data.data.paytype.length; i++) {
                            $("#" + paycontainer).append("<option  value=" + data.data.paytype[i].key + ">" + data.data.paytype[i].value + "</option>");
                        }

                        //补丁，页面初始化时触发
                        var payType = $("#payType").val();
                        if (payType == 3 || payType == 4) {
                            $.payBank(scid, payType, 'tempBankForPay', 'bankForPay');
                        } else {
                            $("#bankForPay").empty();
                        }
                    } else {
                        $("#" + paycontainer).append('<option selected value="1">货到付款</option>');
                    }
                    //配送信息
                    if (data.data.info != null) {
                        $('#' + infocontainer).html('配送时间：' + data.data.info.time + '<br>配送价格：' + data.data.info.fee);
                    }
                } else if (data.data == null) {

                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },
    //获取企业信息
    getCompanyInfo: function (state, bid, container) {

        //PBS fix
        if (state == 'pbs') {
            setLocalCache('SHOPMODE', 'B2C');
            setLocalCache('PLATFORM', 'pbs');
        } else {
            setLocalCache('SHOPMODE', 'B2B');
            setLocalCache('PLATFORM', 'customer');
        }

        $.ajax({
            url: ROUTE_COM_INFO,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                state: state,
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200 && data.data != null) {
                    console.log(data);
                    setLocalCache("shop-logo", data.data.logo);
                    setLocalCache("shopName", data.data.name);
                    $('title').text(data.data.name);
                    var html = bt(bid, data);
                    $("#" + container).append(html);
                } else if (data.data == null) {

                } else if (data.status == 306) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //获取小区物业信息
    getVipStore: function (bid, container) {
        $.ajax({
            url: ROUTE_VIP_STORE,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                platform: getLocalCache('PLATFORM'),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == '0000' && data.msg != null) {
                    console.log(data);
                    var html = bt(bid, data.msg);
                    $("#" + container).append(html);
                } else if (data.status == 306) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //获取会员产品列表
    getVipProduct: function (bid, container) {
        $.ajax({
            url: ROUTE_VIP_PRODUCT,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                platform: getLocalCache('PLATFORM'),
                ticket: getLocalCache("ticket"),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == '0000' && data.msg != null) {

                    var type = parseInt(data.msg.cctype);
                    for (var i = 0; i < data.msg.data.length; i++) {
                        if (type > parseInt(data.msg.data[i].cctype)) {
                            data.msg.data[i].disabled = true;
                        } else {
                            data.msg.data[i].disabled = false;
                        }
                    }
                    var html = bt(bid, data.msg);
                    $("#" + container).append(html);
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },
    //批价
    orderPrice: function (product_id) {
        $('.weui_dialog_confirm').hide();
        $.ajax({
            url: ROUTE_VIP_GET_PRICE,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                platform: getLocalCache('PLATFORM'),
                ticket: getLocalCache("ticket"),
                product_id: product_id,
            },
            success: function (data, textStatus) {
                if (data != null && data.err == 0 && data.msg != null) {
                    $('.weui_dialog_title').html('付费提示');
                    if (data.msg.type == 2) {
                        $('.weui_dialog_bd').html('需要支付的金额为' + data.msg.price + '元。是否继续？');
                        $('.cancel').html('下次再买');
                        $('.sure').html('立即支付');
                        $('.sure').on('click', function () {
                            $.orderVip(product_id);
                        });
                    } else {
                        $('.weui_dialog_bd').html('可直接升级，需要支付的金额为0元。是否升级？');
                        $('.cancel').html('取消升级');
                        $('.sure').html('立即升级');
                        $('.sure').on('click', function () {
                            // $.changeVip(product_id);
                            $.orderVip(product_id);
                        });
                    }
                    $('.weui_dialog_confirm').css('transform', 'none');
                    $('.weui_dialog_confirm').show();
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                } else {
                    window.location.href = "/msg_fail.html?msg=支付失败";
                }
            },
        });
    },
    //购买vip下单
    orderVip: function (product_id) {
        $('.weui_dialog_confirm').hide();
        $('.weui_loading_toast').css('transform', 'none');
        $('.weui_loading_toast').show();
        $.ajax({
            url: ROUTE_VIP_ORDER,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                platform: getLocalCache('PLATFORM'),
                ticket: getLocalCache("ticket"),
                ccid: getLocalCache('ccid'),
                scid: getLocalCache('scid'),
                productid: product_id,
            },
            success: function (data, textStatus) {
                if (data != null && data.status == 200 && data.data != null) {
                    if (data.data == 'success') {
                        window.location.href = "/success.html?type=change";
                    } else {
                        var soid = data.data;
                        var url = "/pay.php?env=" + env + "&openid=" + getLocalCache('openid') + "&ticket=" + getLocalCache('ticket') + "&scid=" + getLocalCache('scid');
                        url = url + "&productid=" + product_id + "&soid=" + soid;
                        window.location.href = url;
                    }

                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                } else {
                    window.location.href = "/msg_fail.html?msg=下单失败";
                }
            },
        });
    },

    //会员购买列表
    getVipOrderList: function (bid, container) {
        $.ajax({
            url: ROUTE_VIP_ORDER_LIST,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                platform: getLocalCache('PLATFORM'),
                scid: getLocalCache("scid"),
                ticket: getLocalCache("ticket"),
            },
            success: function (data, textStatus) {
                if (data != null && data.status == '200' && data.data != null) {
                    if (data.data.length > 0) {
                        var html = bt(bid, data);
                        $("#" + container).append(html);
                    } else {
                        $('.mui-empty').show();
                    }
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },

    //读取用户的优惠劵
    getCouponList: function (bid, container, c_status, isclear, islist) {
        $.showLoading("正在加载...");
        $.ajax({
            url: ROUTE_COUPON_LIST,
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                platform: getLocalCache('PLATFORM'),
                scid: getLocalCache("scid"),
                ticket: getLocalCache("ticket"),
                ccid: getLocalCache("ccid"),
                status: c_status,
            },
            success: function (data, textStatus) {
                $.hideLoading();
                if (data != null && data.status == '200' && data.data != null) {
                    if (islist) {
                        if (isclear) {
                            $("#" + container).empty();
                        }
                        if (data.data.length > 0) {
                            var html = bt(bid, data);
                            $("#" + container).append(html);
                            $('.mui-empty').hide();
                        } else {
                            $('.mui-empty').show();
                        }
                    } else {
                        //将数据添加到下拉列表
                        if (data.data.length > 0) {
                            $("#" + container).append("<option value='-1'>暂不使用红包</option>");
                            for (var i = 0; i < data.data.length; i++) {
                                $("#" + container).append("<option value='" + data.data[i].id + "'>" + data.data[i].coupon_name + "</option>");
                            }
                        } else {
                            $("#" + container).append("<option value='-1'>暂无红包</option>");
                        }
                    }
                } else if (data.status == LOGIN_OUT_STATUS) {
                    window.location.href = "/msg_fail.html?msg=登录失败";
                }
            }
        });
    },
});
