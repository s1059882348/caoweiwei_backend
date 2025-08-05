layui.use(['form', 'table', 'miniPage', 'element', 'myAjax'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        myAjax = layui.myAjax,
        miniPage = layui.miniPage;

    let token = myAjax.getToken();
    let url = Requesthttp + 'permission/getRoleList';
    table.render({
        elem: '#currentTableId',
        url: url,
        parseData: tableDataFormat,
        headers: {Authorization: token},
        method: 'get', //如果无需自定义HTTP类型，可不加该参数
        request: {
            pageName: 'page' //页码的参数名称，默认：page
            , limitName: 'per_page' //每页数据量的参数名，默认：limit
        },
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter'],
        cols: [[
            {field: 'id', width: 80, title: 'ID', sort: true},
            {field: 'role_name', width: 200, title: '角色名称', align: "center"},
            {
                field: 'state', width: 150, title: '状态', align: "center", event: 'state',
                templet: '#isShow',
                unresize: false,
                filter: "isShow"
            },
            {
                field: 'update_time', width: 200, title: '编辑时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.update_time);
                }
            },
            {title: '操作', minWidth: 150, toolbar: '#currentTableBar', align: "center"}
        ]],
        limits: [10, 20, 30, 50, 100],
        limit: 10,
        page: true,
    });

    /**
     * toolbar事件监听
     */
    table.on('toolbar(currentTableFilter)', function (obj) {
        if (obj.event === 'add') {   // 监听添加操作
            var content = miniPage.getHrefContent('page/system/role/add.html');
            var openWH = miniPage.getOpenWidthHeight();

            var index = layer.open({
                title: '添加角色',
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['40%', '50%'],
                btnAlign: 'c',//居中显示
                content: content,
                success: function (layero, index) {

                },
            });
            // $(window).on("resize", function () {
            //     layer.full(index);
            // });
        }
    });


    table.on('tool(currentTableFilter)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {

            var content = miniPage.getHrefContent('page/system/role/add.html');
            var openWH = miniPage.getOpenWidthHeight();

            var index = layer.open({
                title: '编辑角色',
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['40%', '50%'],
                btnAlign: 'c',//居中显示
                content: content,
                success: function (layero, index) {
                    layero.find("input[name='role_id']").val(data.id);
                    layero.find("input[name='role_name']").val(data.role_name);
                    layero.find("input[name='state'][value=" + data.state + "]").next().click();
                },
            });

            return false;
        } else if (obj.event === 'delete') {

            layer.confirm('确定删除角色？', function (index) {
                myAjax.authAjax('permission/roleDel', 'post',
                    true, {role_id: obj.data.id}, function (response) {
                        obj.del();
                        layer.close(index);
                        layer.msg(response.msg, {icon: 1,time:1000});
                    });
            });

        } else if (obj.event === 'state') {
            if($(this).find("input[name='state']").length == 0){
                return false;
            }
            myAjax.authAjax("permission/roleStateSwitch", "post",
                true, {role_id: data.id}, function (response) {
                    layer.msg(response.msg, {icon: 1,time:1000});
                    layui.table.reload('currentTableId');
                });

        } else if (obj.event === 'authorize') {

            // window.role_id = data.id;
            window[window_role_id] = data.id;
            var contentAuth = miniPage.getHrefContent('page/system/role/authorize.html');
            var openWH = miniPage.getOpenWidthHeight();

            var index = layer.open({
                title: '角色授权',
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['40%', '70%'],
                offset: ['15%', '35%'],
                content: contentAuth,
                success: function (layero, index) {

                },
            });

            return false;
        }
    });
});