layui.use(['table', 'treetable', 'miniPage', 'myAjax'], function () {
    var $ = layui.jquery;
    var table = layui.table;
    var treetable = layui.treetable;
    var miniPage = layui.miniPage;
    var myAjax = layui.myAjax;


    myAjax.authAjax('permission/getMenuList', 'get',
        true, '', function (res) {
            renderTable(res.data.data);
        });

    // 渲染表格
    var renderTable = function (data) {
        layer.load(2);
        treetable.render({
            data: data,
            treeColIndex: 1,
            treeSpid: 0,
            treeIdName: 'id',
            treePidName: 'pid',
            elem: '#munu-table',
            page: false,
            cols: [[
                {type: 'numbers'},
                {field: 'title', minWidth: 200, title: '权限名称'},
                {field: 'icon', title: '菜单图标'},
                {field: 'permission', title: '权限路由'},
                {field: 'href', title: '前端路由'},
                {field: 'sort', width: 80, align: 'center', title: '排序'},
                {
                    field: 'type', width: 80, align: 'center', templet: function (d) {
                        if (d.type == 2) {
                            return '<span class="layui-badge layui-bg-gray">按钮</span>';
                        }
                        if (d.type == 1) {
                            return '<span class="layui-badge-rim">菜单</span>';
                        } else {
                            return '<span class="layui-badge layui-bg-blue">目录</span>';
                        }
                    }, title: '类型'
                },
                {templet: '#auth-state', align: 'center', title: '操作'}
            ]],
            done: function () {
                layer.closeAll('loading');
            }
        });
    }


    $('#btn-expand').click(function () {
        treetable.expandAll('#munu-table');
    });

    $('#btn-fold').click(function () {
        treetable.foldAll('#munu-table');
    });

    //监听工具条
    table.on('tool(munu-table)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;

        if (layEvent === 'del') {
            layer.confirm('确定删除菜单？', function (index) {
                myAjax.authAjax('permission/menuDel', 'post',
                    true, {menu_id: data.id}, function (response) {
                        obj.del();
                        layer.close(index);
                        layer.msg(response.msg, {icon: 1, time: 1000});
                        sessionStorage.setItem('is_reload',1);
                    });
            });
        } else if (layEvent === 'edit') {

            window[window_menu_pid] = data.pid;
            window[window_menu_icon] = data.icon;
            var content = miniPage.getHrefContent('page/system/menu/add.html');

            var index = layer.open({
                title: '编辑菜单',
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['40%', '70%'],
                offset: ['15%', '35%'],
                content: content,
                success: function (layero, index) {
                    layero.find("input[name='menu_id']").val(data.id);
                    layui.form.val('menu_add', data);
                },
            });
        }
    });

    $('#menu_index_addmenu').click(function () {
        var content = miniPage.getHrefContent('page/system/menu/add.html');
        var openWH = miniPage.getOpenWidthHeight();

        var index = layer.open({
            title: '添加菜单',
            type: 1,
            shade: [0.8, '#393D49'],
            area: ['40%', '70%'],
            offset: ['15%', '35%'],
            content: content,
        });
    });

});