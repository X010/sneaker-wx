/**
 * @Author: jeffrey
 * @Date:   2016-06-27T18:48:34+08:00
 * @Last modified by:   jeffrey
 * @Last modified time: 2016-06-28T00:13:20+08:00
 */



//URL 路由配置
//var SHOPMODE = 'B2C'; //商城类型：B2B、B2C,默认为B2B
//var PLATFORM = 'pbs'; //平台类型：customer、pbs，默认为customer
var env = "test";

var ROUTE_BASE_URL;
var API_BASE_URL_;
switch (env) {
    case "test":
        ROUTE_BASE_URL = "http://apiwx.test.ms9d.com";
        API_BASE_URL_ = "http://local.api.test.ms9d.com";
        LOGIN_OUT_STATUS = 8001;
        break;
    case "prod":
        ROUTE_BASE_URL = "http://cg.api.ms9d.com";
        API_BASE_URL_ = "http://yc.api.ms9d.com";
        LOGIN_OUT_STATUS = 8001;
        break;
    default:
        ROUTE_BASE_URL = "http://127.0.0.1:8080";
        API_BASE_URL_ = "http://api.test.ms9d.com";
        LOGIN_OUT_STATUS = 8001;
}

//#普通用户使用接口
// var ROUTE_LOGIN_URL = ROUTE_BASE_URL + "/b2/user/login.action"; //登陆接口
// var ROUTE_USER_GET = ROUTE_BASE_URL + "/b2/user/get.action"; //获取登陆用户信息
// var ROUTE_LOGINOUT_URL = ROUTE_BASE_URL + "/b2/user/loginout.action";//退出登陆接口
var ROUTE_VIP_REG = API_BASE_URL_ + "/mall/vip_register"; //会员自注册


//公司信息
var ROUTE_COM_INFO = API_BASE_URL_ + "/wx_user/load"; //根据state参数获取公司信息

var ROUTE_LOGIN_URL = API_BASE_URL_ + "/wx_user/login"; //登陆接口
var ROUTE_USER_GET = API_BASE_URL_ + "/wx_customer/user_get"; //获取登陆用户信息
var ROUTE_LOGINOUT_URL = API_BASE_URL_ + "/login/out";//退出登陆接口


//首页接口
// var ROUTE_HOME_PAGE = ROUTE_BASE_URL + "/b2/column/wechat.action";
var ROUTE_HOME_PAGE = API_BASE_URL_ + "/wx_customer/column_wechat";

//商品信息
// var ROUTE_READ_GTYPE = ROUTE_BASE_URL + "/b2/gtype/forcid.action"; //读取分类信息
// var ROUTE_COLUMN_GET = ROUTE_BASE_URL + "/b2/column/get.action"; //读取栏目信息
// var ROUTE_READ_GOODS_GTYPE = ROUTE_BASE_URL + "/b2/goods/fortype.action";//根据分类读取商品
// var ROUTE_READ_GIVEAWAY = ROUTE_BASE_URL + "/b2/market/getmarketbymgid.action";//获取商品赠品
// var ROUTE_READ_GOODS_COLUMN = ROUTE_BASE_URL + "/b2/goods/forcate.action";//根据栏目读取商品
// var ROUTE_READ_GOODS_INFO = ROUTE_BASE_URL + "/b2/goods/info.action";//根据ID读取商品信息
// var ROUTE_READ_CUSTOMER_GOODS_SEARCH = ROUTE_BASE_URL + "/b2/goods/search.action";//搜索商品信息
// var ROUTE_CUSTOMER_HOT_GOODS = ROUTE_BASE_URL + "/b2/goods/hotgoods.action";//读取热购商品

var ROUTE_COLUMN_GOOD = API_BASE_URL_ + "/wx_customer/column_good"; //读取首页分类商品信息
var ROUTE_READ_GTYPE = API_BASE_URL_ + "/wx_customer/com_forcid"; //读取分类信息
var ROUTE_COLUMN_GET = API_BASE_URL_ + "/wx_customer/column_get"; //读取栏目信息
var ROUTE_READ_GOODS_GTYPE = API_BASE_URL_ + "/wx_customer/good_fortype";//根据分类读取商品
var ROUTE_READ_GIVEAWAY = API_BASE_URL_ + "/wx_customer/market_mgid";//获取商品赠品
var ROUTE_READ_GOODS_COLUMN = API_BASE_URL_ + "/wx_customer/good_forcate";//根据栏目读取商品
var ROUTE_READ_GOODS_INFO = API_BASE_URL_ + "/wx_customer/good_info";//根据ID读取商品信息
var ROUTE_READ_CUSTOMER_GOODS_SEARCH = API_BASE_URL_ + "/wx_customer/good_search";//搜索商品信息
var ROUTE_CUSTOMER_HOT_GOODS = API_BASE_URL_ + "/wx_customer/good_hot";//读取热购商品

//订单
// var ROUTE_ORDER_CUSTOMER = ROUTE_BASE_URL + "/b2/order/order.action"; //按客户读取订单信息
// var ROUTE_ORDER_DETAIL   = ROUTE_BASE_URL + "/b2/order/orderinfobyid.action"; //查看订单详情
// var ROUTE_ORDER_TRACK    = ROUTE_BASE_URL + "/b2/order/traceorder.action"; //订单跟踪
// var ROUTE_ORDER_CANCEL   = ROUTE_BASE_URL + "/b2/order/cancel.action";//取消订单信息
// var ROUTE_ORDER_SUBMIT   = ROUTE_BASE_URL + "/b2/order/createorder.action";//提交订单
// var ROUTE_DELIVERY_ORDER = ROUTE_BASE_URL + "/b2/order/delivery.action";//订单紧急程度

var ROUTE_ORDER_CUSTOMER = API_BASE_URL_ + "/wx_customer/order_list"; //按客户读取订单信息
var ROUTE_ORDER_DETAIL = API_BASE_URL_ + "/wx_customer/order_infoid"; //查看订单详情
var ROUTE_ORDER_TRACK = API_BASE_URL_ + "/wx_customer/order_trace"; //订单跟踪
var ROUTE_ORDER_CANCEL = API_BASE_URL_ + "/wx_customer/order_cancel";//取消订单信息
var ROUTE_ORDER_SUBMIT = API_BASE_URL_ + "/wx_customer/order_create";//提交订单
var ROUTE_DELIVERY_ORDER = API_BASE_URL_ + "/wx_customer/order_delivery";//订单紧急程度

var ROUTE_ORDER_CART_INFO = API_BASE_URL_ + '/wx_customer/order_cart'; //支付方式,送货方式,配送信息

//收货地址
// var ROUTE_ADDRESS_LIST = ROUTE_BASE_URL + "/b2/addressee/customerget.action"; //收货地址列表
// var ROUTE_ADDRESS_ADDNEW = ROUTE_BASE_URL + "/b2/addressee/save.action"; //新增收货地址
// var ROUTE_ADDRESS_DEL = ROUTE_BASE_URL + "/b2/addressee/delete.action"; //删除收货地址
// var ROUTE_ADDRESS_DEFAULT = ROUTE_BASE_URL + "/b2/addressee/setdefault.action"; //设置默认收货地址
// var ROUTE_ADDRESS_GET_DEFAULT = ROUTE_BASE_URL + "/b2/addressee/defaddressee.action"; //获取默认收货地址

var ROUTE_ADDRESS_ADDNEW = API_BASE_URL_ + "/wx_customer/address_save";
var ROUTE_ADDRESS_LIST = API_BASE_URL_ + "/wx_customer/address_customer"; //收货地址列表
var ROUTE_ADDRESS_DEL = API_BASE_URL_ + "/wx_customer/address_del"; //删除收货地址
var ROUTE_ADDRESS_DEFAULT = API_BASE_URL_ + "/wx_customer/address_setdef"; //设置默认收货地址
var ROUTE_ADDRESS_GET_DEFAULT = API_BASE_URL_ + "/wx_customer/address_getdef"; //获取默认收货地址

//意见反馈
// var ROUTE_FEEDBACK_ADD = ROUTE_BASE_URL + "/b2/geo/geo.action";

var ROUTE_FEEDBACK_ADD = API_BASE_URL_ + "/wx_customer/feedback";//意见反馈

//微信相关
var ROUTE_WX_OPENID = API_BASE_URL_ + "/login/get_openid"; //获取微信OPENID
// var ROUTE_WX_OPENID_LOGIN = ROUTE_BASE_URL + "/b2/user/wxlogin.action";  //使用OPENID登录
var ROUTE_SEND_SMS = API_BASE_URL_ + "/login/verify";   //发送填写用户名发送短信验证码到对应的手机
var ROUTE_SEND_SMS_USE_PHONE = API_BASE_URL_ + "/mall/verify"; //通过填写手机号发送短信验证码
// var ROUTE_WX_BIND = ROUTE_BASE_URL + "/b2/user/bind.action"; //绑定OPENID和账号
var ROUTE_WX_UNBIND = API_BASE_URL_ + "/login/unbind_third"; //解绑OPENID和账号

var ROUTE_WX_BIND = API_BASE_URL_ + "/wx_user/bind"; //绑定OPENID和账号
var ROUTE_WX_OPENID_LOGIN = API_BASE_URL_ + "/wx_user/wxlogin";  //使用OPENID登录

//会销绑定接口
//var ROUTE_HUIXIAO_BIND = API_BASE_URL_ + "/login/bind_third2" //会销绑定接口
var ROUTE_HUIXIAO_BIND = API_BASE_URL_ + "/wx_user/hxbind"

var ROUTE_PAY_BANK = API_BASE_URL_ + "/wx_pay/bank"; //银行汇款账号

//未结金额统计
var ROUTE_SALEMAN_UNPAY = API_BASE_URL_ + "/a_salesman/debit";

//读取客户的供应商列表
// var ROUTE_CUSTOMER_SUPPLIER = ROUTE_BASE_URL + "/b2/com/supplier.action"; //读取供应商
// var ROUTE_CUSTOMER_SUPPLIER_DETAIL = ROUTE_BASE_URL + "/b2/com/supplierdetail.action"; //读取供应商详情

var ROUTE_CUSTOMER_SUPPLIER = API_BASE_URL_ + "/wx_customer/com_supplier"; //读取供应商
var ROUTE_CUSTOMER_SUPPLIER_DETAIL = API_BASE_URL_ + "/wx_customer/com_supplierdetail"; //读取供应商详情

//营销信息
// var ROUTE_MARKET_GETBYMGID = ROUTE_BASE_URL + "/b2/market/getmarketbymgid.action";//根据商品信息获取营销信息 跟 获取商品赠品接口一样

//网关支付
var ROUTE_PAY_TYPE_URL = API_BASE_URL_ + '/wx_pay/type'; //支付方式
var ROUTE_PAY_INFO_URL = API_BASE_URL_ + '/wx_pay/order_info'; //订单支付信息支付方式
var ROUTE_PAY_RESULT_URL = API_BASE_URL_ + '/wx_pay/ispaid'; //是否已支付

//会员产品购买
var ROUTE_VIP_PRODUCT = API_BASE_URL_ + "/app/pbs/product_list"; //获取产品列表
var ROUTE_VIP_GET_PRICE = API_BASE_URL_ + "/app/pbs/get_price"; //会员产品批价
var ROUTE_VIP_ORDER_CHECK = API_BASE_URL_ + "/mall/vip_order_check"; //下单前监测是否允许下单
var ROUTE_VIP_STORE = API_BASE_URL_ + "/mall/vip_store_list"; //获取PBS项目仓库
var ROUTE_VIP_ORDER = API_BASE_URL_ + "/wx_customer/vip_create"; //购买服务下单
var ROUTE_VIP_ORDER_LIST = API_BASE_URL_ + "/wx_customer/viporder_list"; //会员产品购买订单列表

//优惠劵
var ROUTE_COUPON_LIST = API_BASE_URL_ + "/wx_coupon/list"; //优惠劵列表
var ROUTE_COUPON_CHECK = API_BASE_URL_ + "/wx_coupon/check"; //检查是否可以使用该优惠劵

//物流信息接口
var ROUTE_EXPRESS_LIST = API_BASE_URL_ + "/wx_express/express_get";// 获取接物流公司信息
var ROUTE_EXPRESS_ORDER_PRICE = API_BASE_URL_ + "/wx_express/express_order_price";//获取该订单的物流费用