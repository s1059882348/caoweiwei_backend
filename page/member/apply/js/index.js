layui.use(['form', 'table', 'miniPage', 'element', 'myAjax', 'laydate'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        myAjax = layui.myAjax,
        laydate = layui.laydate,
        miniPage = layui.miniPage;
    var Subject_Name = '用户';

    //日期范围
    laydate.render({
        elem: '#create_time'
        , range: true
    });

    let token = myAjax.getToken();
    let url = Requesthttp + 'member/applyList';
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
        // $field = "a.id,a.apply_time,a.status,
        //    c.nickname,c.contact_name,c.phone,c.address,c.has_shop,c.shop_type,
        //a.update_time,ifnull(b.nickname,'') as admin_name";
        cols: [[
            {field: 'id', width: 80, title: 'ID', sort: true},
            {
                field: 'apply_time', width: 200, title: '申请时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.apply_time);
                }
            },
            {
                field: 'status', width: 100, title: '审核状态', align: "center",
                templet: function (d) {
                    switch (d.status) {
                        case 1 :
                            return "待审核";
                        case 2 :
                            return "审核通过";
                        case 3 :
                            return "审核拒绝";
                        default:
                            return "";
                    }
                }
            },
            {field: 'nickname', width: 150, title: '昵称', align: "center"},
            {field: 'phone', width: 200, title: '手机号', align: "center"},
            {field: 'contact_name', width: 100, title: '联系人', align: "center"},
            {field: 'address', width: 200, title: '详细地址', align: "center"},
            {
                field: 'has_shop', width: 100, title: '门店', align: "center",
                templet: function (d) {
                    switch (d.has_shop) {
                        case 1 :
                            return "有";
                        case 0 :
                            return "没有";
                        default:
                            return "";
                    }
                }
            },
            {field: 'admin_name', width: 100, title: '编辑人', align: "center"},
            {
                field: 'update_time', width: 200, title: '编辑时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.update_time);
                }
            },
            {title: '操作', minWidth: 200, toolbar: '#currentTableBar', align: "center", fixed: "right"}
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
        if (obj.event === 'examine_pass') {
            myAjax.authAjax("member/applyExamine", "post",
                true, {id: data.id,status:2}, function (response) {
                    layer.msg(response.msg, {icon: 1, time: 1000});
                    layui.table.reload('currentTableId');
                });
        }else if (obj.event === 'examine_refuse') {
            myAjax.authAjax("member/applyExamine", "post",
                true, {id: data.id,status:3}, function (response) {
                    layer.msg(response.msg, {icon: 1, time: 1000});
                    layui.table.reload('currentTableId');
                });
        }
    });

    laydate.render({
        elem: '#create_time' //指定元素
        , range: true
    });

    form.render("select");
});