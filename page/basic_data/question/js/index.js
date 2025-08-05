layui.use(['form', 'table', 'miniPage', 'element', 'myAjax'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        myAjax = layui.myAjax,
        miniPage = layui.miniPage;

    let token = myAjax.getToken();
    let url = Requesthttp + 'question/index';
    table.render({
        elem: '#currentTableId',
        url: url,
        parseData: tableDataFormat,
        headers: {Authorization: token},
        where: {"list_state":1}, //如果无需传递额外参数，可不加该参数
        method: 'get', //如果无需自定义HTTP类型，可不加该参数
        request: {
            pageName: 'page' //页码的参数名称，默认：page
            , limitName: 'per_page' //每页数据量的参数名，默认：limit
        },
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter'],
        cols: [[
            {field: 'id', width: 80, title: 'ID', sort: true},
            {field: 'title', minwidth: 100, title: '标题', align: "center"},
            {field: 'answer', minwidth:200,title: '回答', align: "center"},
            {
                field: 'state', width: 150, title: '状态', align: "center", event: 'state',
                templet: '#isShow',
                unresize: false,
                filter: "isShow"
            },
            {field: 'admin_name', width: 100, title: '编辑人', align: "center"},
            {
                field: 'update_time', width: 200, title: '编辑时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.update_time);
                }
            },
            {title: '操作', minWidth: 150, toolbar: '#currentTableBar', align: "center",fixed:"right"}
        ]],
        limits: [10, 20, 30, 50, 100],
        limit: 10,
        page: true,
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
        if (obj.event === 'add') {   // 监听添加操作
            var content = miniPage.getHrefContent('page/basic_data/question/add.html');

            var index = layer.open({
                title: '添加问答',
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['35%', '50%'],
                btnAlign: 'c',//居中显示
                content: content,
                success: function (layero, index) {

                },
            });
        }
    });


    table.on('tool(currentTableFilter)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {

            var edit_data = [];
            myAjax.authAjax("question/getInfo", "get",
                false, {id: data.id}, function (response) {
                    edit_data = response.data;
                });

            var content = miniPage.getHrefContent('page/basic_data/question/add.html');

            var index = layer.open({
                title: '编辑问答',
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['35%', '50%'],
                btnAlign: 'c',//居中显示
                content: content,
                success: function (layero, index) {
                    layui.form.val('question_add', edit_data);
                },
            });

            return false;
        } else if (obj.event === 'delete') {

            layer.confirm('你确认要删除该行数据吗？', function (index) {
                myAjax.authAjax('question/del', 'post',
                    true, {id: obj.data.id}, function (response) {
                        obj.del();
                        layer.close(index);
                        layer.msg(response.msg, {icon: 1,time:1000});
                    });
            });

        } else if (obj.event === 'state') {
            if($(this).find("input[name='state']").length == 0){
                return false;
            }
            myAjax.authAjax("question/changeState", "post",
                true, {id: data.id}, function (response) {
                    layer.msg(response.msg, {icon: 1,time:1000});
                    layui.table.reload('currentTableId');
                });

        }
    });

    //初始化加载搜索信息中的状态
    initStateSelect("list_state");
    form.render("select");
});