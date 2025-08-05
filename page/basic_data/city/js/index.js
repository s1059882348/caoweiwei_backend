layui.use(['form', 'table', 'miniPage', 'layer', 'element', 'myAjax'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        myAjax = layui.myAjax,
        miniPage = layui.miniPage;

    //初始加载列表数据
    table.render({
        elem: '#currentTableId',
        url: Requesthttp + 'basic_config/cityList',
        headers: {Authorization: myAjax.getToken()},
        method: 'get', //如果无需自定义HTTP类型，可不加该参数
        request: {pageName: 'page', limitName: 'per_page'}, //如果无需自定义请求参数，可不加该参数
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter'],//导出、打印
        parseData: tableDataFormat,
        limits: [10, 20, 30, 50, 100],
        limit: 30,
        page: true,
        cols: [[
            {field: 'id', width: 100, title: '城市ID', sort: true},
            {field: 'name', minWidth: 100, title: '城市名称', align: "center"},
            {field: 'initial', minWidth: 100, title: '首字母', align: "center"},
        ]],
        done: function (res, curr, count) {

        }
    });

    // 监听搜索操作
    form.on('submit(data-search-btn)', function (data) {
        //执行搜索重载
        data.field.city_ame = $.trim(data.field.city_name);
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
});


