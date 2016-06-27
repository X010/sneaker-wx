(function ($) {
    /**
     * Class cart
     * @param saleman 是否是业务员系统
     * @param customer 客户ID
     * @constructor
     */
    $.Cart = function (saleman, customer) {
        var sman = saleman ? true : false;
        var cusr = customer ? customer : 0;
        this.init(sman, cusr);
        this.createCart();
    };
    $.Cart.prototype = {
        init: function (sman, cusr) {
            // 购物车属性
            this.cartPrefix = "runner_";
            if (sman) {
                this.cartName = this.cartPrefix + "cart_c" + cusr;
                this.totalMoney = this.cartPrefix + "total_money_c" + cusr;
                this.cartNameBuyNow = this.cartPrefix + "cart_buynow_c" + cusr ;
                this.totalMoneyBuyNow = this.cartPrefix + "total_money_buynow_c" + cusr ;
            }
            else {
                this.cartName = this.cartPrefix + "cart";
                this.totalMoney = this.cartPrefix + "total_money";
            }

            this.storage = sessionStorage;
        },

        /** 创建购物车 */
        createCart: function () {
            if (this.storage.getItem(this.cartName) == null) {
                this._createCart();
            }else if(this.storage.getItem(this.cartNameBuyNow) == null){
                this._createCart();
            }
        },
        _createCart: function () {
            var cart = {};
            cart.items = [];
            this.storage.setItem(this.cartName, this._toJSONString(cart));
            this.storage.setItem(this.totalMoney, "0");
            this.storage.setItem(this.cartNameBuyNow, this._toJSONString(cart));
            this.storage.setItem(this.totalMoneyBuyNow, "0");
        },
        /** 获取购物车中商品总数量 */
        getCartTotal: function (mode) {
            var self = this;
            if(mode=='buynow'){
                var cart = self._toJSONObject(self.storage.getItem(self.cartNameBuyNow));
            }else{
                var cart = self._toJSONObject(self.storage.getItem(self.cartName));
            }

            if (cart) {
                var items = cart.items;
                var am = 0;
                for (var i = 0; i < items.length; ++i) {
                    var item = items[i];
                    am = am + self._convertString(item.qty);
                }
                return am;
            }
            else
                return 0;
        },
        /** 获取总金额并更新返回 **/
        getTotalMoney: function (mode) {
            var self = this;
            if(mode=='buynow'){
                var cart = this._toJSONObject(this.storage.getItem(this.cartNameBuyNow));
            }else{
                var cart = this._toJSONObject(this.storage.getItem(this.cartName));
            }

            if (!cart)
                return 0.00;
            var items = cart.items;
            var total = 0.00;
            for (var i = 0; i < items.length; ++i) {
                var t = self._accMul(self._convertString(items[i].price), self._convertString(items[i].qty));
                total = self._accAdd(this._convertString(total), this._convertString(t));
            }
            total = self._decimal(total, 2);
            this.storage.setItem(this.totalMoney, this._toJSONString(total));
            return total;
        },
        /** 删除购物车 */
        removeGoods: function (obj) {
            var cart = this._toJSONObject(this.storage.getItem(this.cartName));
            var cartCopy = cart;
            var items = cartCopy.items;
            var elem = obj;
            var nitems = [];
            for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                if (item.id != elem.data("id")) {
                    nitems.push(item);
                }
            }
            cartCopy.items = nitems;
            this.storage.setItem(this.cartName, this._toJSONString(cartCopy));
        },
        /** 更新商品数量 */
        updateQty: function (obj, n, ol) {
            //var cart = this._toJSONObject(this.storage.getItem(this.cartName));
            //var cartCopy = cart;
            //var items = cartCopy.items;
            var elem = obj;
            //var nitems = [];
            /**for (var i = 0; i < items.length; ++i) {
                var item = items[i];console.log(item.id,elem.data('id'))
                if (item.id == elem.data("id")) {
                    // 直接修改数值
                    if (ol === true) {
                        item.qty = parseInt(n);
                    } else {
                        //if (n < 0 && item.qty === 1) {
                            //item.qty = item.qty + 0;
                        //} else {
                            item.qty = item.qty + parseInt(n);
                        //}
                    }
                }
                nitems.push(item);
            }**/

            var nitems = this.getOne(this._convertString(elem.data('id')));
            if (nitems == null) {
                return this.addToCart(elem);
            } else {
                return this._updateQty(elem, n, ol);
            }
        },
        /**
         * 修改storage中单商品数据
         * @param obj 需要更新对象，需用到obj.id
         * @param n 更新数目
         * @param cov 是否覆盖数量
         * @private
         */
        _updateQty: function (obj, n, cov) {
            var cart = this._toJSONObject(this.storage.getItem(this.cartName));
            var cartCopy = cart;
            var items = cartCopy.items;
            var nitems = [];
            var gid = obj.data('id');

            console.log(n);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                console.log(item.id, gid);
                if (item.id === gid) {
                    if (cov === true) {
                        console.log("---stpm1");
                        var qty = parseInt(n);
                    } else {
                        console.log("---stpm2");
                        var qty = item.qty + parseInt(n);
                    }
                    var res_sty = restrict_strategy(this, obj, qty);
                    if (res_sty) {
                        item.qty = qty;
                    } else
                        return 2;
                }
                nitems.push(item);
            }
            cartCopy.items = nitems;
            console.log(nitems);
            this.storage.setItem(this.cartName, this._toJSONString(cartCopy));
        },
        /** 清空购物车 */
        emptyCart: function (mode) {
            //this.storage.clear();
            if(mode=='buynow'){
                var cart = {};
                cart.items = [];
                this.storage.setItem(this.cartNameBuyNow, this._toJSONString(cart));
                this.storage.setItem(this.totalMoneyBuyNow, "0");
            }else{
                var cart = {};
                cart.items = [];
                this.storage.setItem(this.cartName, this._toJSONString(cart));
                this.storage.setItem(this.totalMoney, "0");
            }

        },
        /** 把一个数字字符串转换为数字 */
        _convertString: function (numStr) {
            var num;
            if (/^[-+]?[0-9]+\.[0-9]+$/.test(numStr)) {
                num = parseFloat(numStr).toFixed(2);
            } else if (/^\d+$/.test(numStr)) {
                num = parseInt(numStr, 10);
            } else {
                num = Number(numStr);
            }

            if (!isNaN(num)) {
                return num;
            } else {
                console.warn(numStr + " cannot be converted into a number");
                return false;
            }
        },

        /** 转化数字为字符串 */
        _convertNumber: function (n) {
            var str = n.toString();
            return str;
        },

        /** 小数位处理 */
        _decimal: function (num, v) {
            var f = parseFloat(num);
            if (isNaN(f)) {
                return false;
            }
            var f = Math.round(num * 100) / 100;
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + v) {
                s += '0';
            }
            return s;
        },

        /** 转化json为js对象 */
        _toJSONObject: function (str) {
            var obj = JSON.parse(str);
            return obj;
        },

        /** 转化js对象为json字符串 */
        _toJSONString: function (obj) {
            var str = JSON.stringify(obj);
            return str;
        },

        /** 加法函数，用来得到精确的加法结果*/
        _accAdd: function (arg1, arg2) {
            var r1, r2, m, c;
            try {
                r1 = arg1.toString().split(".")[1].length;
                var pos_decimal = arg1.indexOf('.');
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            c = Math.abs(r1 - r2);
            m = Math.pow(10, Math.max(r1, r2));
            if (c > 0) {
                var cm = Math.pow(10, c);
                if (r1 > r2) {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", "")) * cm;
                } else {
                    arg1 = Number(arg1.toString().replace(".", "")) * cm;
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
            } else {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", ""));
            }
            return (arg1 + arg2) / m;
        },

        /** 减法函数，用来得到精确的减法结果 */
        _accSub: function (arg1, arg2) {
            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        },

        /** 乘法函数，用来得到精确的乘法结果 */
        _accMul: function (arg1, arg2) {
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length;
            }
            catch (e) {
            }
            try {
                m += s2.split(".")[1].length;
            }
            catch (e) {
            }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        },

        displayCart: function (mode) {
            //console.log(this.cartName);
            if(mode=='buynow'){
                var cart = this._toJSONObject(this.storage.getItem(this.cartNameBuyNow));
            }else{
                var cart = this._toJSONObject(this.storage.getItem(this.cartName));
            }

            return cart;
        },

        /** 获取单个商品信息 */
        getOne: function (id) {
            var cart = this._toJSONObject(this.storage.getItem(this.cartName));
            var self = this;

            if (!cart) {
                return null;
            }

            var cartCopy = cart;
            var items = cartCopy.items;

            for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                if (item.id == parseInt(id)) {
                    return item;
                }
            }
            return null;
        },

        /** 将对象加入到购物车，格式为Json */
        addToCart: function (obj) {
            var self = this;
            var elem = obj;
            var price = self._convertString(elem.data("price"));
            var gid = self._convertString(elem.data("id"));
            var name = elem.data("title");
            var qty = self._convertString(elem.data("qty"));
            var img = elem.data('img');
            var scid = elem.data('scid');
            var barcode = elem.data('barcode');
            var restrict = elem.data('restrict');
            var marketid = elem.data('marketid');
            //var subTotal = qty * price;
            //var total = self._convertString(self.storage.getItem(self.totalMoney));
            //var sTotal = total + subTotal;
            var gitem = this.getOne(gid);
            if (gitem != null) {
                this.updateQty(obj, qty, false);
            } else {
                var res_sty = restrict_strategy(this, elem, qty);
                if (res_sty) {
                    //self.storage.setItem(self.totalMoney, sTotal);
                    self._addToCart({
                        id: gid,
                        product: name,
                        price: parseFloat(price).toFixed(2),
                        qty: qty,
                        img: img,
                        scid: scid,
                        barcode: barcode,
                        restrict: restrict,
                        marketid:marketid
                    });
                } else {
                    return 2;
                }
            }
        },

        _addToCart: function (values) {
            var cart = this._toJSONObject(this.storage.getItem(this.cartName));
            var self = this;

            if (!cart) {
                self._createCart();
                cart = this._toJSONObject(this.storage.getItem(this.cartName));
            }

            var cartCopy = cart;
            //var items = cartCopy.items;
            //var needpush = true;

            /**
             for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                if (item.id == values.id) {
                    item.qty = item.qty + values.qty;
                    needpush = false;
                }
            }


             if (needpush)
             items.push(values);

             this.storage.setItem(this.cartName, this._toJSONString(cartCopy));**/
                //console.log(items.length);
                //if(items.length && items.length >=0 ) {

                //    this.storage.setItem(this.cartName, this._toJSONString(cartCopy));
                //}else{

            cartCopy.items.push(values);
            //console.log(cartCopy);
            this.storage.setItem(this.cartName, this._toJSONString(cartCopy));
        },


        /** 将对象加入到购物车，格式为Json */
        addToCartBuyNow: function (obj) {
            cart.emptyCart('buynow');
            var self = this;
            var elem = obj;
            var price = self._convertString(elem.data("price"));
            var gid = self._convertString(elem.data("id"));
            var name = elem.data("title");
            var qty = self._convertString(elem.data("qty"));
            var img = elem.data('img');
            var scid = elem.data('scid');
            var barcode = elem.data('barcode');
            var restrict = elem.data('restrict');
            var marketid = elem.data('marketid');
            //var subTotal = qty * price;
            //var total = self._convertString(self.storage.getItem(self.totalMoney));
            //var sTotal = total + subTotal;
            //var gitem = this.getOne(gid);
            //if (gitem != null) {
            //    this.updateQty(obj, qty, false);
            //} else {
                var res_sty = restrict_strategy(this, elem, qty);
                if (res_sty) {
                    //self.storage.setItem(self.totalMoney, sTotal);
                    self._addToCartBuyNow({
                        id: gid,
                        product: name,
                        price: parseFloat(price).toFixed(2),
                        qty: qty,
                        img: img,
                        scid: scid,
                        barcode: barcode,
                        restrict: restrict,
                        marketid:marketid
                    });
                } else {
                    return 2;
                }
            //}
        },

        _addToCartBuyNow: function (values) {
            var cart = this._toJSONObject(this.storage.getItem(this.cartNameBuyNow));
            var self = this;

            if (!cart) {
                self._createCart();
                cart = this._toJSONObject(this.storage.getItem(this.cartNameBuyNow));
            }

            var cartCopy = cart;

            cartCopy.items.push(values);
            //console.log(cartCopy);
            this.storage.setItem(this.cartNameBuyNow, this._toJSONString(cartCopy));
        }

    };
})(jQuery);


// 购物车飞入效果
function fly(dname, image, delay, offsetx, offsety, thumb) {

    var carts = $("#" + dname + " .icon");
    var delay = delay ? delay : 800;
    var offsetx = offsetx ? offsetx : -10;
    var offsety = offsety ? offsety : -10;
    var thumb = thumb ? thumb : 30;
    if (image) {
        var imgclone = image.clone()
            .offset({
                top: (typeof(image.offset())=='undefined' ? 0 : image.offset().top) - offsety,
                left: (typeof(image.offset())=='undefined' ? 0 : image.offset().left) - offsetx
            })
            .css({
                'opacity': '0.8',
                'position': 'absolute',
                'height': thumb + 'px',
                'width': thumb + 'px',
                'z-index': '1000',
                'border': '2px solid #f1f1f1'
            })
            .appendTo($('body'))
            .animate({
                'top': carts.offset().top + 10,
                'left': carts.offset().left + 17,
                'width': 30,
                'height': 30
            }, delay, 'easeInOutQuad');
        imgclone.animate({
            'width': 0,
            'height': 0
        }, function () {
            $(this).detach()
        });
    }
};

/**
 * 限购策略
 * @param cart 此处用到购物车方法，不用实例化
 * @param obj
 * @param qty
 * @returns {boolean}
 */
function restrict_strategy(cart, obj, qty) {
    var self = obj;
    var q = qty;
    var id = cart._convertString(self.data("id"));
    var gd = cart.getOne(id);

    if (gd == null) {
        if (parseInt(self.data('restrict')) != 0 && parseInt(self.data('qty')) > parseInt(self.data('restrict')))
            return false;
    } else {
        if ( gd.restrict != 0 && qty > gd.restrict) {
            return false;
        }
    }
    return true;
}

