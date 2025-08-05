layui.use(['form', 'table', 'miniPage', 'element', 'myAjax', 'laydate'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        myAjax = layui.myAjax,
        laydate = layui.laydate,
        miniPage = layui.miniPage;
    var Subject_Name = '退款申请';

    let token = myAjax.getToken();
    let url = Requesthttp + 'order/refundApplyList';
    table.render({
        elem: '#currentTableId',
        url: url,
        parseData: tableDataFormat,
        headers: {Authorization: token},
        where: {}, //如果无需传递额外参数，可不加该参数
        method: 'get', //如果无需自定义HTTP类型，可不加该参数
        request: {
            pageName: 'page' //页码的参数名称，默认：page
            , limitName: 'per_page' //每页数据量的参数名，默认：limit
        },
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter'],
        cols: [[
            {field: 'id', width: 80, title: 'ID', sort: true},
            {field: 'order_no', minWidth: 200, title: '商品订单号', align: "center"},
            {field: 'create_name', minWidth: 100, title: '创建者', align: "center"},
            {field: 'status_name', minWidth: 100, title: '申请状态', align: "center"},
            {field: 'refund_amount', minWidth: 100, title: '申请退款金额', align: "center"},
            {field: 'reason', minWidth: 200, title: '退款原因', align: "center"},
            {
                field: 'create_time', width: 200, title: '申请时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.create_time);
                }
            },
            {title: '操作', minWidth: 150, toolbar: '#currentTableBar', align: "center", fixed: "right"}
        ]],
        limits: [10, 20, 30, 50, 100],
        limit: 10,
        page: true,
        done: function (res, curr, count) {

        }
    });

    // 监听搜索操作
    form.on('submit(data-search-btn)', function (data) {
        //执行搜索重载
        table.reload('currentTableId', {
            page: {curr: 1},
            where: data.field
        }, 'data');
        return false;
    });


    /**
     * toolbar事件监听
     */
    table.on('toolbar(currentTableFilter)', function (obj) {

    });


    table.on('tool(currentTableFilter)', function (obj) {
        var data = obj.data;
        if (obj.event === 'cancle') {
            layer.confirm('与用户沟通后，确定取消申请？', function (index) {
                myAjax.authAjax('order/cancleApply', 'post',
                    true, {apply_id: obj.data.id}, function (response) {
                        layer.close(index);
                        layer.msg(response.msg, {icon: 1, time: 1000});
                        layui.table.reload('currentTableId');
                    });
            });
        } else if (obj.event === 'review') {
            var content = miniPage.getHrefContent('page/order/refund/review.html');

            var index = layer.open({
                title: '审核' + Subject_Name,
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['40%', '70%'],
                btnAlign: 'c',//居中显示
                content: content,
                success: function (layero, index) {
                    layero.find("input[name='apply_id']").val(data.id);
                },
            });

            return false;
        } else if (obj.event === 'refund') {

            var content = miniPage.getHrefContent('page/order/refund/refund.html');

            var index = layer.open({
                title: '打款',
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['40%', '70%'],
                btnAlign: 'c',//居中显示
                content: content,
                success: function (layero, index) {
                    layero.find("input[name='apply_id']").val(data.id);
                    layero.find("input[name='refund_amount']").val(data.refund_amount);
                },
            });

            return false;
        } else if (obj.event === 'mark') {
            myAjax.authAjax('order/markSuccess', 'post',
                true, {apply_id: obj.data.id}, function (response) {
                    layer.close(index);
                    layer.msg(response.msg, {icon: 1, time: 1000});
                    layui.table.reload('currentTableId');
                });
        }
    });


    form.render("select");

});