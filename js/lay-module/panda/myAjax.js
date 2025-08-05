/**
 * date:2022/01/18
 * author:齐格飞
 * version:1.0
 * description:潘达项目接口类扩展
 */
layui.define(["jquery"], function (exports) {
    var $ = layui.jquery,
        form = layui.form,
        layer = layui.layer;

    var myAjax = {

        /**
         * 普通请求
         * @param url  接口地址后半截
         * @param method  请求方式  get/post
         * @param requestData    请求数据
         * @param sucessHandle   请求成功后的回调方法
         */
        normal: function (url, method, requestData, sucessHandle) {
            $.ajax({
                url: Requesthttp + url,
                type: method,
                dataType: "json",
                data: requestData,
                success: function (response) {
                    sucessHandle(response);
                }
            })
        },

        /**
         * 带token的接口请求
         * @param url  接口地址后半截
         * @param method  请求方式  get/post
         * @param async   同步false,异步true，默认异步true
         * @param requestData     请求数据
         * @param sucessHandle    请求成功后的回调方法
         */
        authAjax: function (url, method, async, requestData, sucessHandle) {
            var token = myAjax.getToken();
            $.ajax({
                url: Requesthttp + url,
                type: method,
                headers: {Authorization: token},
                async: async,
                dataType: "json",
                data: requestData,
                success: function (response) {
                    if (response.code === 0) {
                        sucessHandle(response);
                    } else if (response.code === 30001) {
                        layer.msg('token失效', {icon: 2});
                        window.location = '../../../login.html';
                    } else {
                        layer.msg(response.msg, {icon: 2});
                    }
                }
            })
        },

        /**
         * 获取页面缓存的token
         * @returns {string|boolean}
         */
        getToken: function () {
            var token = sessionStorage.getItem('token');
            if (!token) {
                window.location = '../../../login.html';
                return false;
            }
            return token;
        },

        /**
         * 带token的接口请求
         * 成功后的处理
         * @param url  接口地址后半截
         * @param method  请求方式  get/post
         * @param async   异步false,同步true，默认true
         * @param requestData     请求数据
         * @param handle          回调方法
         */
        authAjaxHandle: function (url, method, async, requestData, handle) {
            var token = myAjax.getToken();
            $.ajax({
                url: Requesthttp + url,
                type: method,
                headers: {Authorization: token},
                async: async,
                dataType: "json",
                data: requestData,
                success: function (response) {
                    handle(response);
                }
            })
        },
    };

    exports("myAjax", myAjax);
});