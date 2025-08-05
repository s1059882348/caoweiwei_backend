layui.use(['form', 'table', 'miniPage', 'element', 'myAjax', 'laydate'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        myAjax = layui.myAjax,
        laydate = layui.laydate,
        miniPage = layui.miniPage;
    var Subject_Name = '新品需求';

    let token = myAjax.getToken();
    let url = Requesthttp + 'member/demandList';
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
            {field: 'uid', width: 100, title: '用户id', align: "center"},
            {field: 'nickname', width: 150, title: '用户昵称', align: "center"},
            {field: 'goods_name', width: 200, title: '商品名称', align: "center"},
            {field: 'weight', width: 200, title: '克重（g）', align: "center"},
            {field: 'spec_num', width: 200, title: '规格（串/包）', align: "center"},
            {field: 'taste_type_name', width: 200, title: '味型', align: "center"},
            {field: 'monthly_usage', width: 200, title: '每月用量(包)', align: "center"},
            {
                field: 'create_time', width: 200, title: '创建时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.create_time);
                }
            },
            {title: '操作', minWidth: 50, toolbar: '#currentTableBar', align: "center", fixed: "right"}
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
        data.field.keyword = $.trim(data.field.keyword);

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
        if (obj.event === 'detail') {

            var content = miniPage.getHrefContent('page/member/demand/add.html');

            var index = layer.open({
                title: '查看' + Subject_Name,
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['40%', '70%'],
                btnAlign: 'c',//居中显示
                content: content,
                success: function (layero, index) {

                    layui.form.val('edit_add', data);

                    if (data.images) {
                        $.each(data.images, function (ki, kv) {
                            var html = '<div class="layui-input-block">'
                                + '<img style="width:300px;height:100%;margin-top:10px" src="' + kv.url + '">'
                                + '<input type="hidden" name="images[]" value="' + kv.filename + '">'
                                + '</div>';

                            $('#demand_images').parent().append(html);
                        });
                    }
                },
            });

            return false;
        }
    });
});