layui.use(['table', 'treetable', 'miniPage', 'myAjax'], function () {
    var $ = layui.jquery;
    var table = layui.table;
    var treetable = layui.treetable;
    var miniPage = layui.miniPage;
    var myAjax = layui.myAjax;


    myAjax.authAjax('goods/getCateList', 'get',
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
                {field: 'title', minwidth: 200, title: '名称'},
                {
                    field: 'icon_url', minwidth: 200, title: '图标', align: "center",
                    templet: function (d) {
                        if (d.icon_url) {
                            return "<img src='images/bg.jpg' style='width: 40px;border-radius: 30px;height: 40px;' onclick='showBigImageInList(this)' >";
                        } else {
                            return '';
                        }
                    }
                },
                {field: 'sort', minwidth: 80, align: 'center', title: '排序'},
                {templet: '#auth-state', align: 'center', title: '操作'}
            ]],
            done: function (res, curr, count) {
                layer.closeAll('loading');
                var imgs = arrayColumn(res.data, 'icon_url');
                $('table tbody tr').each(function (index, item) {
                    if (imgs[index]) {
                        getImageBlob($(this).find('td:eq(2) img')[0], imgs[index]);
                    }
                });
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
            layer.confirm('确定删除？', function (index) {
                myAjax.authAjax('goods/cateDel', 'post',
                    true, {id: data.id}, function (response) {
                        obj.del();
                        layer.close(index);
                        layer.msg(response.msg, {icon: 1, time: 1000});
                        sessionStorage.setItem('is_reload',1);
                    });
            });
        } else if (layEvent === 'edit') {

            window[window_goods_cate_pid] = data.pid;
            var content = miniPage.getHrefContent('page/shop/cate/add.html');

            var index = layer.open({
                title: '编辑分类',
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['40%', '70%'],
                offset: ['15%', '35%'],
                content: content,
                success: function (layero, index) {
                    layero.find("input[name='cate_id']").val(data.id);
                    layui.form.val('cate_add', data);
                    if (data.icon_url) {
                        layero.find('#upload1').parent().parent().find('img')[0].src = data.icon_url;
                    }
                },
            });
        }
    });

    $('#menu_index_addmenu').click(function () {
        var content = miniPage.getHrefContent('page/shop/cate/add.html');
        var openWH = miniPage.getOpenWidthHeight();

        var index = layer.open({
            title: '添加分类',
            type: 1,
            shade: [0.8, '#393D49'],
            area: ['40%', '70%'],
            offset: ['15%', '35%'],
            content: content,
        });
    });

});