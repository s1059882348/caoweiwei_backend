layui.use(['form', 'table', 'layer', 'iconPickerFa', 'myAjax', 'layCascader'], function () {
    var form = layui.form,
        layer = layui.layer,
        table = layui.table,
        iconPickerFa = layui.iconPickerFa,
        myAjax = layui.myAjax,
        layCascader = layui.layCascader,
        $ = layui.$;

    /**
     * 初始化表单，要加上，不然刷新部分组件可能会不加载
     */
    form.render();

    // 当前弹出层，防止ID被覆盖
    var parentIndex = layer.index;

    //监听提交
    form.on('submit(saveBtn)', function (data) {

        var params_object = data.field;
        if (params_object.menu_id) {
            myAjax.authAjax('permission/menuUpdate  ', 'post',
                false, params_object, saveHandle);
        } else {
            myAjax.authAjax('permission/menuAdd', 'post',
                false, params_object, saveHandle);
        }

        return false;
    });

    function saveHandle(response) {
        layer.msg(response.msg, {icon: 1, time: 1000});
        // 关闭弹出层
        layer.close(parentIndex);
    }

    //图标插件
    var iconPickerFa = iconPickerFa.render({
        // 选择器，推荐使用input
        elem: '#iconPicker',
        // fa 图标接口
        url: "lib/font-awesome-4.7.0/less/variables.less",
        // 是否开启搜索：true/false，默认true
        search: true,
        // 是否开启分页：true/false，默认true
        page: true,
        // 每页显示数量，默认12
        limit: 100,
        // 点击回调
        click: function (data) {
            // console.log(data);
        },
        // 渲染成功后的回调
        success: function (d) {

        }
    });

    //获取菜单-树下拉
    let options = [];
    myAjax.authAjax('permission/getMenuSelect', 'get',
        false, '', function (res) {
            if(Object.keys(res.data).length != 0){
                options = res.data;
            }
        });

    var demo1_1 = layCascader({
        elem: '#demo7',
        clearable: true,
        options: options,
        props: {
            checkStrictly: true,
            value: 'id',
            label: 'title',
            children: 'children',
        }
    });

    demo1_1.changeEvent(function (value, node) {
        // layer.msg('value:' + value + ',Node:' + JSON.stringify(node.data));

        $('#demo7').parent().parent().find("input[name='pid']").val(node.data.id);
    });

    if (window.menu_pid >= 0) {
        demo1_1.setValue(window.menu_pid);
        window.menu_pid = null;
    }
    if (window.menu_icon) {
        iconPickerFa.checkIcon('iconPicker', window.menu_icon);
        window.menu_icon = null;
    }
});