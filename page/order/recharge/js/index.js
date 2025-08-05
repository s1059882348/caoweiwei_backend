layui.use(['form', 'table', 'miniPage', 'element', 'myAjax', 'laydate'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        myAjax = layui.myAjax,
        laydate = layui.laydate,
        miniPage = layui.miniPage;
    var Subject_Name = '充值订单';

    let token = myAjax.getToken();
    let url = Requesthttp + 'order/rechargeOrderList';
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
            {field: 'order_no', minWidth: 200, title: '订单号', align: "center"},
            {field: 'create_name', minWidth: 100, title: '创建者', align: "center"},
            {field: 'pay_name', minWidth: 100, title: '支付者', align: "center"},
            {field: 'pay_type_name', minWidth: 100, title: '支付方式', align: "center"},
            {
                field: 'create_time', width: 200, title: '下单时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.create_time);
                }
            },
            {field: 'status_name', minWidth: 100, title: '订单状态', align: "center"},
            {field: 'order_amount', minWidth: 100, title: '订单金额', align: "center"},
            {field: 'payment_amount', minWidth: 100, title: '支付金额', align: "center"},
            {
                field: 'pay_time', width: 200, title: '支付时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.pay_time);
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
        if (obj.event === 'export') {
            let requestData = $('.layui-form-pane').serialize();
            layer.confirm('确定导出？', function (index) {
                const url = Requesthttp + 'order/exportRechargeOrderList' + '?' + requestData;
                downloadUrl(url);
                layer.close(index);
            });
        }
    });


    table.on('tool(currentTableFilter)', function (obj) {
        var data = obj.data;
    });


    form.render("select");

});