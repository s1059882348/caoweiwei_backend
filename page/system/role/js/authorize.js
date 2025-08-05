layui.use(['tree', 'util', 'myAjax', 'form'], function () {
    var tree = layui.tree
        , form = layui.form
        , layer = layui.layer
        , util = layui.util;
    var myAjax = layui.myAjax;


    let role_id = window.role_id;
    var menutree = '';
    myAjax.authAjax('permission/roleMenu', 'get',
        false, {role_id: role_id}, function (res) {
            menutree = res.data;
        });

    //树形组件
    sessionStorage.setItem('checkChild', "false");//初始化去掉全选功能
    var trrr = tree.render({
        elem: '#test12'
        , data: menutree
        , showCheckbox: true  //是否显示复选框
        , id: 'demoId1'
        , click: function (obj) {
            // var data = obj.data;  //获取当前点击的节点数据
            // layer.msg('状态：'+ obj.state + '<br>节点数据：' + JSON.stringify(data));

            // var checkData = trrr.getChecked('demoId');//返回选中的节点数据
        }
    });
    sessionStorage.setItem('checkChild', "true");//初始化页面完成后恢复全选功能


    // 当前弹出层，防止ID被覆盖
    var parentIndex = layer.index;

    //监听提交
    form.on('submit(saveBtn)', function (data) {

        let menu_ids = typeConversion.objectToArray(data.field).toString();
        myAjax.authAjax('permission/assignMenuToRole', 'post',
            true, {
                role_id: role_id,
                menu_ids: menu_ids,
            }, saveHandle);

        return false;
    });

    function saveHandle(response) {
        layer.msg(response.msg, {icon: 1,time:1000});
        // 关闭弹出层
        layer.close(parentIndex);
        //刷新页面
        sessionStorage.setItem('is_reload',1);
    }

    //js中的类型转换
    var typeConversion = {

        //对象转数组
        objectToArray: function (obj) {
            var arr = [];
            for (let i in obj) {
                arr.push(obj[i]);
            }
            return arr;
        },
        objectToArray1: function (obj) {
            // var obj = { foo: 'bar', baz: 42 };
            return Object.keys(obj);
        },
        objectToArray2: function (obj) {
            var arr = [];
            for (let i in obj) {
                arr[i] = obj[i];
            }
            return arr;
        },

        //数组转对象
        arrayToObject: function (arr) {
            let obj = {};
            arr.forEach((val, key) => function () {

                if (Array.isArray(val)) {
                    obj.key = typeConversion.arrayToObject;
                } else {
                    obj.key = val;
                }
            });
            return obj;
        },

        //数组转字符串
        arrayToString: function (arr) {
            return arr.toString();
        },
        arrayToString1: function (arr) {
            return arr.join(',');
        },

        //字符串转数组  string.split(',')
        //对象转字符串JSON.stringify()
        //json字符串转对象 JSON.parse
    };
});