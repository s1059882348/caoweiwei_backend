layui.use(['form', 'treetable', 'layer', 'myAjax', 'layCascader'], function () {
    var form = layui.form,
        layer = layui.layer,
        myAjax = layui.myAjax,
        $ = layui.$;

    /**
     * 初始化表单，要加上，不然刷新部分组件可能会不加载
     */
    form.render();

    // 当前弹出层，防止ID被覆盖
    var parentIndex = layer.index;

    form.verify({
        // value：表单的值、item：表单的DOM对象
        icon: function (value, item) {
            if (value <= 0 || value == '') {
                return "请上传图标";
            }
        }
    });

    //监听提交
    form.on('submit(saveBtn)', function (data) {

        var params_object = data.field;
        if (params_object.cate_id) {
            myAjax.authAjax('goods/cateUpdate  ', 'post',
                false, params_object, saveHandle);
        } else {
            myAjax.authAjax('goods/cateAdd', 'post',
                false, params_object, saveHandle);
        }

        return false;
    });

    function saveHandle(response) {
        layer.msg(response.msg, {icon: 1, time: 1000});
        // 关闭弹出层
        layer.close(parentIndex);
    }


    //获取菜单-树下拉
    let options = [];
    myAjax.authAjax('goods/getCateSelect', 'get',
        false, '', function (res) {
            if (Object.keys(res.data).length != 0) {
                options = res.data;
            }
        });


    //上传图片
    uploadImageFun($('#upload1'));
});