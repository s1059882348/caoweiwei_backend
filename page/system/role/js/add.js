layui.use(['form', 'table', 'myAjax'], function () {
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

    //监听提交
    form.on('submit(saveBtn)', function (data) {

        var params_object = data.field;

        if (params_object.role_id) {
            myAjax.authAjax('permission/roleUpdate', 'post',
                false, params_object, saveHandle);
        } else {
            myAjax.authAjax('permission/roleAdd', 'post',
                false, params_object, saveHandle);
        }

        return false;
    });

    function saveHandle(response) {
        layer.msg(response.msg, {icon: 1, time: 1000});
        // 关闭弹出层
        layer.close(parentIndex);
        //更新列表
        layui.table.reload('currentTableId');
    }
});