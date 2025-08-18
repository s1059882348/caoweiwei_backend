layui.use(['form', 'table', 'miniPage', 'element', 'myAjax', 'laydate'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        myAjax = layui.myAjax,
        laydate = layui.laydate,
        miniPage = layui.miniPage;
    var Subject_Name = '商品订单';

    let token = myAjax.getToken();
    let url = Requesthttp + 'order/goodsOrderList';
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
            {field: 'goods_amount', minWidth: 100, title: '商品总金额', align: "center"},
            {field: 'delivery_fee', minWidth: 100, title: '快递费', align: "center"},
            {field: 'coupon_amount', minWidth: 100, title: '优惠券金额', align: "center"},
            {field: 'pay_amount', minWidth: 100, title: '实际支付金额', align: "center"},
            {
                field: 'send_time', width: 200, title: '发货时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.send_time);
                }
            },
            {
                field: 'complete_time', width: 200, title: '完成时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.complete_time);
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
                const url = Requesthttp + 'order/exportGoodsOrderList' + '?' + requestData;
                downloadUrl(url);
                layer.close(index);
            });
        }
    });


    table.on('tool(currentTableFilter)', function (obj) {
        var data = obj.data;

        if (obj.event === 'send') {
            var content = miniPage.getHrefContent('page/order/goods/send.html');
            var index = layer.open({
                title: '发货',
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['40%', '70%'],
                btnAlign: 'c',//居中显示
                content: content,
                success: function (layero, index) {
                    layero.find("input[name='order_id']").val(data.id);
                },
            });
        } else if(obj.event === 'finance'){
            let requestData = $('.layui-form-pane').serialize();
            layer.confirm('确定导出？', function (index) {
                const url = Requesthttp + 'order/exportGoodsOrderFinance' + '?' + requestData;
                downloadUrl(url);
                layer.close(index);
            });
        }
    });


    form.render("select");

});