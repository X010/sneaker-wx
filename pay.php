<?php
error_reporting(0);
ini_set('display_errors', 0);

$soid     = isset($_GET['soid']) ? trim($_GET['soid']) : '';
$scid   = $_GET['scid'];
$openid = isset($_GET['openid']) ? trim($_GET['openid']) : '';
$ticket = isset($_GET['ticket']) ? trim($_GET['ticket']) : '';
$env    = isset($_GET['env']) ? trim($_GET['env']) : '';
$productid = isset($_GET['productid']) ? trim($_GET['productid']) : '';
if ($env == 'prod') {
    define('ROUTE_PAY_INFO_URL','http://yc.api.ms9d.com');
} else {
    define('ROUTE_PAY_INFO_URL','http://api.test.ms9d.com');
}
//身份类字段必须传
if (empty($soid) || empty($scid) || empty($openid) || empty($ticket)) {
echo "<script>window.location.href='msg_fail.html?msg=系统异常';</script>";
exit;
}

function curl($url, $formdata = null, $method = 'GET', $time_out = 5, $retry_times = 1, $httpHeader=array())
{
    if (empty($url)) {
        return null;
    }
    try {
        while ($retry_times-- > 0){
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_TIMEOUT, $time_out);
            curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);
            if (!empty($formdata)) {
                if ($method === 'GET') {
                    $url .= http_build_query($formdata);
                } else {
                    if (is_array($formdata)) {
                        $formdata = http_build_query($formdata);
                    }
                    curl_setopt($ch, CURLOPT_POST, 1);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $formdata);
                }
            }
            if (!empty($httpHeader) && is_array($httpHeader)) {
                curl_setopt($ch, CURLOPT_HTTPHEADER,$httpHeader);
            }

            curl_setopt($ch, CURLOPT_URL, $url);
            $ret = curl_exec($ch);
            if (curl_errno($ch)) {
                $err_no  = curl_errno($ch);
                $err_msg = curl_error($ch);
            }
            $info = curl_getinfo($ch);
            curl_close($ch);

            if ($ret != false){
                break;
            }
        }
        return $ret === false ? null : $ret;
    } catch (Exception $e) {
        return null;
    }
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="format-detection" content="telephone=no"/>
    <meta name="keywords" content="">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="favicon.ico">
    <title>99云商</title>
    <link rel="stylesheet" href="lib/ratchet/css/ratchet.css" type="text/css">
    <link rel="stylesheet" href="lib/weui.css" type="text/css">
    <link rel="stylesheet" href="css/app.css" type="text/css">

    <script src="lib/jquery-2.1.4.js"></script>
    <script src="lib/jquery-weui.js"></script>
    <script src="js/apiroute.js"></script>
    <script src="js/util.js"></script>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
</head>
<body>

<header class="bar bar-nav">
    <a class="icon icon-left-nav pull-left" id="navBackBtn"></a>
    <h1 class="title">支付订单</h1>
</header>

<!--TAB BAR-->
<nav class="bar bar-tab" id="mainTab">
    <a class="tab-item" id="mainTabHome" href="home.html">
        <span class="icon micon-home"></span>
        <span class="tab-label">首页</span>
    </a>
    <a class="tab-item" id="mainTabCate" href="goods.html">
        <span class="icon micon-cate"></span>
        <span class="tab-label">分类</span>
    </a>
    <a class="tab-item" id="mainTabCart" href="cart.html">
        <span class="icon micon-cart">
            <i class="badge badge-positive">0</i>
        </span>
        <span class="tab-label">购物车</span>
    </a>
    <a class="tab-item" id="mainTabUC" href="uc.html">
        <span class="icon micon-person"></span>
        <span class="tab-label">我的</span>
    </a>
</nav>
<!--TAB BAR END-->

<div id="loadingToast" class="weui_loading_toast" >
    <div class="weui_mask_transparent"></div>
    <div class="weui_toast">
        <div class="weui_loading">            
            <div class="weui_loading_leaf weui_loading_leaf_0"></div>
            <div class="weui_loading_leaf weui_loading_leaf_1"></div>
            <div class="weui_loading_leaf weui_loading_leaf_2"></div>
            <div class="weui_loading_leaf weui_loading_leaf_3"></div>
            <div class="weui_loading_leaf weui_loading_leaf_4"></div>
            <div class="weui_loading_leaf weui_loading_leaf_5"></div>
            <div class="weui_loading_leaf weui_loading_leaf_6"></div>
            <div class="weui_loading_leaf weui_loading_leaf_7"></div>
            <div class="weui_loading_leaf weui_loading_leaf_8"></div>
            <div class="weui_loading_leaf weui_loading_leaf_9"></div>
            <div class="weui_loading_leaf weui_loading_leaf_10"></div>
            <div class="weui_loading_leaf weui_loading_leaf_11"></div>
        </div>
        <p class="weui_toast_content">数据加载中</p>
    </div>
</div>

<?php 
$params = [
    'openid'  => $openid,
    'soid'    => $soid,
    'scid'    => $scid,
    'ticket'  => $ticket,
    'url'    => 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'],
];
$uri = '/wx_pay/order_info';
if ($productid) {
    $params['productid'] = $productid;
    $uri = '/wx_pay/order';
}
$res  = curl(ROUTE_PAY_INFO_URL.$uri, $params, 'post');
$data = json_decode($res, true);
if (!$data) {
echo "<script>window.location.href='msg_fail.html?msg=系统异常';</script>";
    exit;
}
//返回错误了
if($data['err']) {
    if ($data['status'] == 501) {
        $err_msg = '此供应商暂未开通在线支付, 请购买商品。';
    } elseif ($data['status'] == 404) {
        $err_msg = '系统未找到对应订单，请稍后再试。';
    } elseif ($data['status'] == 500) {
        $err_msg = '参数：订单号错误，请联系管理员';
    }
echo "<script>$.alert('".$err_msg."');setTimeout('window.location.href=\"goods.html\"', 3000);</script>";
    exit;
}

$js_data = $data['data']['config'];
$order   = $data['data']['order'];
$is_paid = ($order['status'] == 9) ? true : false;
$package = json_decode($data['data']['pay']['package'], true);
?>
<div class="content">
    <div class="mui-order-item" id="containerOrderDetail">
        <div class="mui-panel">
        <h2 class="mui-panel-title">基本信息</h2>
        <div class="mui-spec">
                <ul>
                    <li class='order_no'><label>订单号：</label><?php echo $order['order_id'];?></li>
                    <li class='order_time'><label>下单时间：</label><?php echo $order['create_time'];?></li>
                    <?php 
                    if (isset($order['gname'])) {
                    ?>
                    <li class='order_gname'><label>商品名称：</label><?php echo $order['gname'];?></li>
                    <?php
                    } elseif (isset($order['service_name'])) {
                    ?>
                    <li class='order_gname'><label>产品名称：</label><?php echo $order['service_name'];?></li>
                    <?php 
                    } else {
                    ?>
                    <li class='order_receipt'><label>收货地址：</label><?php echo $order['receipt'];?></li>
                    <li class='order_supplier'><label>供应商：</label><?php echo $order['supplier_company_name'];?></li>
                    <?php
                    }
                    ?>
                    <li class='order_amount'><label>订单金额：</label><?php echo $order['total_amount'];?>元</li>
                </ul>
            </div>
        </div>
        <div class="mui-panel-content">
            <a href="javascript:;" class="weui_btn weui_btn_primary" id="pay">微信支付</a>
        </div>
    </div>
    <div style="padding-top:20px;" id="package"></div>
</div>

<script type="text/javascript">
<?php  
if ($is_paid) {
?>
$.alert("此订单已成功支付，请勿重复支付。");
window.location.href="order.html";
<?php
}
if (empty($package)) {
?>
$.alert("请勿重复支付。");
window.location.href="order.html";   
<?php
}
?>

wx.config({
    debug: false, 
    appId: '<?php echo $js_data['appid'];?>', 
    timestamp: '<?php echo $js_data['timestamp'];?>', 
    nonceStr: '<?php echo $js_data['noncestr'];?>', 
    signature: '<?php echo $js_data['signature'];?>',
    jsApiList: ['chooseWXPay'] 
});
$('#loadingToast').hide();
wx.error(function(res){
    // alert(res.err_msg);
});

document.getElementById('pay').onclick = function(){
    wx.chooseWXPay({
        timestamp: '<?php echo $package['timeStamp'];?>', 
        nonceStr: '<?php echo $package['nonceStr'];?>', 
        package: '<?php echo $package['package'];?>', 
        signType: '<?php echo $package['signType'];?>', 
        paySign: '<?php echo $package['paySign'];?>', 
        success: function (res) {
             if(res.errMsg == "chooseWXPay:ok" ) {
                <?php if (isset($order['service_name'])) {?> 
                    window.location.href='success.html?soid=<?php echo $soid;?>&scid=<?php echo $scid;?>&type=change';
                <?php } else { ?>
                    window.location.href='success.html?soid=<?php echo $soid;?>&scid=<?php echo $scid;?>';
                <?php } ?>
             } else if(res.errMsg == "chooseWXPay:fail") {
                $.alert("支付异常，请联系管理员");
             } 
        }
    });
};
</script>

</body>
</html>