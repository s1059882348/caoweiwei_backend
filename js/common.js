/**
 * date:2022/01/19
 * author:齐格飞
 * version:1.0
 * description:项目公共方法
 */


/**
 * 时间戳转日期格式
 * @param time  时间戳（不带毫秒）
 * @returns {string}  北京时间 "2022-02-11 20:15:05"
 */
function getDateByTime(time, format) {
    if (!time) {
        return '';
    } else {
        time += '000';
        time = parseInt(time);
    }

    var date = new Date(time + 8 * 3600 * 1000); // 增加8小时    Date的‘toJSON’方法返回格林威治时间的JSON格式字符串
    return date.toJSON().substr(0, 19).replace('T', ' ');
}

/**
 * 将日期格式转换成时间戳
 * 不同时区的日期最终会转换为东八区的日期的时间戳
 * @param strtime
 * @returns {number}
 */
function getTimeByDate(strtime) {
    if (!strtime) {
        return 0;
    }
    // // var strtime = '2014-04-23 18:55:49:123';
    let date = new Date(strtime); //传入一个时间格式，如果不传入就是获取现在的时间了
    // // 可以这样做
    // let date = new Date(strtime.replace(/-/g, '/'));

    // 有三种方式获取，在后面会讲到三种方式的区别
    // let time1 = date.getTime();
    // let time2 = date.valueOf();
    let time3 = Date.parse(date);
    //第一、第二种：会精确到毫秒,第三种：只能精确到秒，毫秒将用0来代替

    //当前时区
    let timezone = new Date().getTimezoneOffset() / 60;//东七区是-7
    time3 = parseInt(time3 / 1000) - (timezone + 8) * 3600;

    return time3;
}

/**
 * 时间戳格式化函数
 * @param  {string} format    格式('YMDhms','YMD')
 * @param  {int}    timestamp 要格式化的时间 默认为当前时间
 * @return {string}           格式化的时间字符串
 */
function dateFormat(timestamp, format) {
    var date = new Date(timestamp)
    var res = "";

    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + ' '
    if (format.indexOf("Y") != -1) res += Y;
    if (format.indexOf("M") != -1) res += M;
    if (format.indexOf("D") != -1) res += D;
    if (format.indexOf("h") != -1) res += h;
    if (format.indexOf("m") != -1) res += m;
    if (format.indexOf("s") != -1) res += s;

    return res.substr(0, res.length - 1);
}

/**
 * 字数限制
 * 给输入框绑定输入事件，计算输入字符长度并回显，获取最大长度并设置maxlength
 */
function countInputWords() {
    layui.use(['layer'], function () {
        var $ = layui.$;

        $('body').on('input', 'input,textarea', function () {
            if ($(this).next().hasClass('el-input__words_limit')) {
                var length = $(this).val().length;
                $(this).next().find('span:eq(0)').html(length);
            }
        });
        $('body').on('focus', 'input,textarea', function () {
            if ($(this).next().hasClass('el-input__words_limit')) {
                var limit_length = $(this).next().find('span:eq(1)').text();
                $(this).attr('maxlength', parseInt(limit_length));
            }
        });
    });
}

countInputWords();

/**
 * 计算输入框中已有的字符的长度
 * index.html重写了layer.open
 */
function countInputCount() {
    layui.use(['layer'], function () {
        var $ = layui.$;

        $('.el-input__words_limit').each(function () {
            $(this).find('span:eq(0)').html($(this).prev().val().length);
        });

    });
}


/**
 * 用于表中的的数据格式转换（后台返回的数据通过该方法进行数据格式转换）parseData: tableDataFormat
 * @param res 后台返回的数据
 * @returns {{msg: (function(*=, *=, *=): *), code: *, data: *, count: PaymentItem | number | p.upload.fileLength | p.upload.fileLength}}
 */
function tableDataFormat(res) {
    if (res.code === 0) {
        return {
            code: res.code,
            msg: res.msg,
            count: res.data.total,
            data: res.data.data,
        };
    } else {
        layui.use(['layer'], function () {
            if (res.code === 30001) {
                layer.msg('token失效', {icon: 2});
                window.location = '../login.html';
            } else {
                layer.msg(res.msg, {icon: 2});
            }
        });
        return {
            code: res.code,
            msg: res.msg,
            count: 0,
            data: [],
        };
    }
}

/**
 * 初始化本地状态下拉控件的数据
 * @param inputId 控件的ID
 */
function initStateSelect(inputId) {
    layui.use(['layer'], function () {
        var $ = layui.$;
        let state = [{"value": 1, "text": "全部"}, {"value": 2, "text": "启用"}, {"value": 3, "text": "禁用"}];
        $.each(state, function (index, item) {
            let option = new Option(item.text, item.value);
            $("#" + inputId).append(option);
        });
    });
}

/**
 * 初始化动态加载下拉控件的值，
 * @param data 动态获取的数据
 * @param inputId 控件的ID
 */
function initDynamicSelect(data, inputId, defaultOptionName = '全部') {
    layui.use(['layer'], function () {
        var $ = layui.$;
        let option = '';
        if (defaultOptionName != '') {
            option = new Option(defaultOptionName, "0");
        }
        $("#" + inputId).append(option);
        $.each(data, function (index, item) {
            let option = new Option(item.name, item.id);
            $("#" + inputId).append(option);
        });
    });
}

function initDynamicSelect2(data, inputId, defaultOptionName = '全部') {
    layui.use(['layer'], function () {
        var $ = layui.$;
        let option = new Option(defaultOptionName, "");
        $("#" + inputId).append(option);
        $.each(data, function (index, item) {
            let option = new Option(item.name, item.id);
            $("#" + inputId).append(option);
        });
    });
}

/**
 * 获取角色下拉数据
 * @returns {[]}
 */
function getRoleList() {
    var roles = [];
    layui.use(['layer', 'myAjax'], function () {
        var myAjax = layui.myAjax;
        myAjax.authAjax('permission/roleSelect', 'get',
            false, '', function (res) {
                var i = 0;
                var roledata = res.data.data;
                for (var key in roledata) {
                    roles[i] = {
                        id: key,
                        name: roledata[key],
                    };
                    i++;
                }
            });
    });
    return roles;
}

/**
 * 获取管理员信息
 * @returns {any}
 */
function getAdminInfo() {
    var admin_info = sessionStorage.getItem('admin_info');
    return JSON.parse(admin_info);
}

//window上的全局变量，留档避免重复冲突
var window_role_id = 'role_id';
var window_menu_pid = 'menu_pid';
var window_menu_icon = 'menu_icon';
var window_navigate_type = 'navigate_type';
var window_edit_one = 'edit_one';
var window_vid = 'voucher_vid';
var window_goods_cate_pid = 'goods_cate_pid';
var window_goods_cate_icon = 'goods_cate_icon';

/**
 * 类似php中的array_column
 * @param array
 * @param columnName
 * @returns {*}
 */
function arrayColumn(array, columnName) {
    if (!array) {
        return [];
    }
    return array.map(function (value, index) {
        return value[columnName];
    })
}

/**
 * 检查节点权限，控制页面上按钮的显示与隐藏
 * @param permissions
 * @param pid
 */
function checkPermission(permissions, pid, all_permissions) {
    permissions = permissions[pid];
    layui.use(['layer'], function () {
        var $ = layui.$;

        //检查普通按钮
        $('.check-permission').each(function () {
            let permission = $(this).data('permission');
            if ($.inArray(permission, permissions) == -1) {
                $(this).hide();
            }
        });

        //检查状态开关
        $('.check-permission-state').each(function () {
            let permission = $(this).data('permission');
            if ($.inArray(permission, permissions) == -1) {
                $(this).parent().html('');
            }
        });

        //特殊按钮（节点没有挂靠在页面上，比如ResourceClass/synch）
        $('.check-permission-special').each(function () {
            let permission = $(this).data('permission');
            if ($.inArray(permission, all_permissions) == -1) {
                $(this).hide();
            }
        });
    });
}

//解密方法  字符的ASCII值的异或
function xor_enc(str, key) {
    var crytxt = '';
    var k, keylen = key.length;
    for (var i = 0; i < str.length; i++) {
        k = i % keylen;
        crytxt += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(k));
    }
    return crytxt;
}

function getFilename(url) {
    return url.substring(url.lastIndexOf('/') + 1);
}

function getFilenameNoExt(url) {
    var str = url.substring(url.lastIndexOf("/") + 1);
    return str.substring(0, str.lastIndexOf("."));
}

/**
 * 检查对象是否包含某个属性
 * @param object  对象
 * @param p       属性
 * @returns {boolean}
 */
function hasObjectProperty(object, p) {
    return object.hasOwnProperty(p);//return p in object;
}

/**
 * 获取form表单中相同name的值
 * 支持input/select
 * @param element   选择器
 * @returns {[]}  返回值的数组
 */
function getArrayInputValue(element) {
    // console.log(element);
    let value = [];
    for (let i = 0; i < element.length; i++) {
        value.push(element[i].value);
    }
    return value;
}

/**
 * 解密图片
 * @param el
 * @param url
 */
function getImageBlob(el, url) {
    el.src = url;

    //var name = url.substring(url.lastIndexOf('/') + 1);
    //var r = new XMLHttpRequest();
    //r.open("GET", url, true);
    //r.responseType = "arraybuffer";
    //r.onload = function (e) {
    //    if (this.status == 200) {
    //        var buffer = new Uint8Array(this.response);
    //        for (let i = 0; i < buffer.length; i++) {
    //            buffer[i] = buffer[i] ^ name[0].charCodeAt();
    //        }
    //        el.src = URL.createObjectURL(new Blob([buffer]));
    //        el.onload = function () {
    //            URL.revokeObjectURL(this.src);
    //        }
    //    }
    //};
    //r.send(null);
}

/**
 * 下载文件
 * @param url 请求地址/文件地址
 */
function downloadUrl(url) {
    let elink = document.createElement("a"); // 创建一个<a>标签
    elink.style.display = "none"; // 隐藏标签
    elink.href = url; // 配置href，指向本地文件的内存地址
    // elink.download = filename;
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    // document.body.removeChild(elink); // 移除<a>标签
}

//下载文件
function downloadUrl1(url) {
    const a = document.createElement("a");
    a.href = url;
    //a.download = fileName || 'download'; // 如果没有提供文件名，则默认使用'download'作为下载的文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 直接下载  文件地址
function downloadUrl2(url) {
    layui.use(['layer'], function () {
        var $ = layui.$;

        var $form = $('<form method="GET"></form>');
        $form.attr('action', url);
        $form.appendTo($('body'));
        $form.submit();
    });
}

/**
 * 用于查询条件中日期范围转换
 * @param data 数据集
 * @param startDate 要转换成开始日期字段名称字符串
 * @param endData 要转换成结束日期字段名称字符串
 * @param dataString 数据集中要转换的日期字段名称字符串
 *
 * @returns 数据集
 */
function splitDate(data, startDate, endData, dataString) {
    if (data.field[dataString] != '') {
        let create_time = data.field[dataString].split(' - ');
        if (create_time.length == 1) {
            data.field[startDate] = getTimeByDate(create_time[0] + ' 00:00:00');
        } else if (create_time.length == 2) {
            data.field[startDate] = getTimeByDate(create_time[0] + ' 00:00:00');
            data.field[endData] = getTimeByDate(create_time[1] + ' 23:59:59');
        }
    } else {
        data.field[startDate] = '';
        data.field[endData] = '';
    }
    delete data.field[dataString];
    return data;
}


/**
 * 计算两个日期之间的天数
 * @param dateString1  开始日期 yyyy-MM-dd
 * @param dateString2  结束日期 yyyy-MM-dd
 * @returns {number} 如果日期相同 返回一天 开始日期大于结束日期，返回0
 */
function getDaysBetween(dateString1, dateString2) {
    var startDate = Date.parse(dateString1);
    var endDate = Date.parse(dateString2);
    if (startDate > endDate) {
        return 0;
    }
    if (startDate == endDate) {
        return 1;
    }
    var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
    return days;
}


function numberToIp(number) {
    let ip = ''
    if (number <= 0) {
        return ip
    }
    const ip3 = (number << 0) >>> 24
    const ip2 = (number << 8) >>> 24
    const ip1 = (number << 16) >>> 24
    const ip0 = (number << 24) >>> 24
    ip += ip3 + '.' + ip2 + '.' + ip1 + '.' + ip0
    return ip
}


/**
 * 防止按钮重复点击
 */
function preventRepeatedClicks() {
    layui.use(['layer'], function () {
        var $ = layui.$;
        var layer = layui.layer;
        var loadIndex = '';

        var isClick = false;
        $('body').on('click', '.button_prevent_clicks', function () {
            if (isClick) {
                return false;
            }
            isClick = true;
            loadIndex = layer.msg('提交中...', {icon: 16, shade: 0.3, time: 0});

            setTimeout(function () {
                isClick = false;
                layer.close(loadIndex);
            }, 3000);
        });
    });
}

preventRepeatedClicks();


/**
 * 列表点击显示大图
 * @param e
 */
function showBigImageInList(e) {
    layui.use(['layer'], function () {
        var $ = layui.$;
        var layer = layui.layer;
        var src_url = $(e).parent().parent().data('content');

        layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true, //点击阴影关闭
            offset: ['20%', '30%'],
            btnAlign: 'c',//居中显示
            content: "<img src='images/bg.jpg' style='width:100%;max-width:1000px;min-width:100px;' />",
            success: function (layero, index) {
                if (src_url) {
                    //getImageBlob(layero.find('img')[0], src_url);
                    layero.find('img')[0].src = src_url;
                }
            },
        });
    });
}

/**
 * 点击显示大图
 * @param e
 */
function showBigImage(e) {
    layui.use(['layer'], function () {
        var $ = layui.$;
        var layer = layui.layer;
        var src_url = $(e).attr('_src');

        layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true, //点击阴影关闭
            offset: ['20%', '30%'],
            btnAlign: 'c',//居中显示
            content: "<img src='images/bg.jpg' width='100%' />",
            success: function (layero, index) {
                if (src_url) {
                    //getImageBlob(layero.find('img')[0], src_url);
                    layero.find('img')[0].src = src_url;
                }
            },
        });
    });
}


/**
 * json转url参数
 * @param {*} params  表单数据集
 * @param {*} dateName  表单中的日期字段，需要日期格式转换的值
 * @param {*} newDataName 日期字段转换成的新字段名称数组，如：['start_time','end_time']
 * @returns 返回字符串：?aa=aa&bb=bb
 */
function jsonToURLString(params, dateName, newDataName) {
    var paramStr = "";
    if (params != null) {
        for (var index in params) {
            let key = params[index]['name'];
            let value = params[index]['value'];
            if (index == 0) {
                if (key == dateName && newDataName != null) {
                    if (value != '' && value != '  ') {
                        let createTime = value.split(" - ");
                        paramStr += "?" + newDataName[0] + "=" + getTimeByDate(createTime[0] + ' 00:00:00');
                        paramStr += "&" + newDataName[1] + "=" + getTimeByDate(createTime[1] + ' 00:00:00');
                    } else {
                        paramStr += "?" + newDataName[0] + "=";
                        paramStr += "&" + newDataName[1] + "=";
                    }
                } else {
                    paramStr += "?" + key + "=" + value;
                }
            } else {
                if (key == dateName && newDataName != null) {
                    if (value != '' && value != '  ') {
                        let createTime = value.split(" - ");
                        paramStr += "&" + newDataName[0] + "=" + getTimeByDate(createTime[0] + ' 00:00:00');
                        paramStr += "&" + newDataName[1] + "=" + getTimeByDate(createTime[1] + ' 00:00:00');
                    } else {
                        paramStr += "&" + newDataName[0] + "=";
                        paramStr += "&" + newDataName[1] + "=";
                    }
                } else {
                    paramStr += "&" + key + "=" + value;
                }
            }
        }
    }
    return paramStr;
}

/**
 * 上传图片
 * @param element
 * @param single
 */
function uploadImageFun(element, single = true) {
    layui.use(['myAjax', 'upload'], function () {
        var myAjax = layui.myAjax,
            layer = layui.layer,
            upload = layui.upload;
        var loadIndex = '';

        var token = myAjax.getToken();
        var request_url = Requesthttp + 'index/uploadFile';//上传接口地址
        upload.render({
            elem: element //绑定元素
            , url: request_url //上传接口
            , headers: {Authorization: token}
            , accept: 'images'
            , exts: 'jpg|png|gif|bmp|jpeg'
            , field: 'upload_file'
            , size: 10 * 1024
            , before: function (obj) {
                loadIndex = layer.msg('图片上传中...', {icon: 16, shade: 0.3, time: 0});
            }
            , done: function (res) {
                //上传完毕回调
                if (single) {
                    var item = this.elem;
                } else {
                    if (!this.item) {
                        layer.msg('按钮不支持首次拖拽上传', {time: 5000});
                        return false;
                    }
                    var item = this.item;
                }
                if (res.code == 0) {
                    item.parent().parent().find('input:last').val(res.data.filename);
                    getImageBlob(item.parent().parent().find('img')[0], res.data.url);
                } else {
                    layer.msg(res.msg, {icon: 2, time: 1000});
                }

                //关闭遮罩
                layer.close(loadIndex);
            }
            , error: function (res) {
                //请求异常回调
                layer.close(loadIndex);
            }
        });
    });
}

/**
 * 上传视频
 * @param element
 */
function uploadVideoFun(element) {
    layui.use(['myAjax', 'upload'], function () {
        var myAjax = layui.myAjax,
            layer = layui.layer,
            upload = layui.upload;
        var loadIndex = '';

        var token = myAjax.getToken();
        var request_url = Requesthttp + 'index/uploadFile';//上传接口地址
        upload.render({
            elem: element //绑定元素
            , url: request_url //上传接口
            , headers: {Authorization: token}
            , accept: 'video'
            , exts: 'mp4|avi|mov'
            , field: 'upload_file'
            , size: 10 * 1024
            , before: function (obj) {
                loadIndex = layer.msg('上传中...', {icon: 16, shade: 0.3, time: 0});
            }
            , done: function (res) {
                //上传完毕回调
                var item = this.elem;
                if (res.code == 0) {
                    item.parent().parent().find('input:last').val(res.data.filename);

                    var video = item.parent().parent().find('video')[0];
                    video.src = res.data.url; // 更新视频源

                    //video.load(); // 重新加载视频

                } else {
                    layer.msg(res.msg, {icon: 2, time: 1000});
                }

                //关闭遮罩
                layer.close(loadIndex);
            }
            , error: function (res) {
                //请求异常回调
                layer.close(loadIndex);
            }
        });
    });
}

/**
 * 上传图片组
 * @param element
 * @param sucessHandle
 */
function uploadImagesFun(element, sucessHandle) {
    layui.use(['myAjax', 'upload'], function () {
        var myAjax = layui.myAjax,
            layer = layui.layer,
            upload = layui.upload;
        var loadIndex = '';

        var token = myAjax.getToken();
        var request_url = Requesthttp + 'index/uploadFile';//上传接口地址
        upload.render({
            elem: element //绑定元素
            , url: request_url //上传接口
            , headers: {Authorization: token}
            , accept: 'images'
            , exts: 'jpg|png|gif|bmp|jpeg'
            , field: 'upload_file'
            , size: 10 * 1024
            , multiple: true
            , number: 5
            , before: function (obj) {
                loadIndex = layer.msg('图片上传中...', {icon: 16, shade: 0.3, time: 0});
            }
            , done: function (res, index, upload) {
                //console.log(res, index, upload);
                //上传完毕回调
                var item = this.elem;
                if (res.code == 0) {
                    var m_index = index.split("-")[1];
                    sucessHandle(item, res, m_index);
                } else {
                    layer.msg(res.msg, {icon: 2, time: 1000});
                }

                //关闭遮罩
                setTimeout(function () {
                    layer.close(loadIndex);
                }, 2000);

            }
            , error: function (res) {
                //请求异常回调
                layer.close(loadIndex);
            }
        });
    });
}