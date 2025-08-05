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


        if (Number(params_object.amount) < 0) {
            layer.msg('输入的退款金额不能小于0', {icon: 2, time: 2000});
            return false;
        }
        if (Number(params_object.amount) > Number(params_object.refund_amount)) {
            layer.msg('输入的退款金额不能大于用户申请退款金额', {icon: 2, time: 2000});
            return false;
        }

        layer.confirm('与用户沟通清楚了，确定发起退款？', function (index) {
            myAjax.authAjax('order/refund', 'post',
                false, params_object, saveHandle);

            return false;
        });
    });

    function saveHandle(response) {
        layer.msg(response.msg, {icon: 1, time: 1000});
        // 关闭弹出层
        layer.close(parentIndex);
        //更新列表
        layui.table.reload('currentTableId');
    }


    $('body').on('blur', '.amount_input', function () {
        $(this).val(Math.round($(this).val() * 100) / 100);
    });
});