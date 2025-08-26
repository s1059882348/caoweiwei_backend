layui.use(['form', 'table', 'miniPage', 'element', 'myAjax', 'laydate'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        myAjax = layui.myAjax,
        laydate = layui.laydate,
        miniPage = layui.miniPage;
    var Subject_Name = '广告';

    let token = myAjax.getToken();
    let url = Requesthttp + 'activity/advList';
    table.render({
        elem: '#currentTableId',
        url: url,
        parseData: tableDataFormat,
        headers: {Authorization: token},
        where: {"list_state": 1, "space_id": 0}, //如果无需传递额外参数，可不加该参数
        method: 'get', //如果无需自定义HTTP类型，可不加该参数
        request: {
            pageName: 'page' //页码的参数名称，默认：page
            , limitName: 'per_page' //每页数据量的参数名，默认：limit
        },
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter'],
        cols: [[
            {field: 'id', width: 80, title: 'ID', sort: true},
            {field: 'title', minWidth: 200, title: '广告名称', align: "center"},
            {field: 'space_title', minWidth: 200, title: '广告位', align: "center"},
            {
                field: 'image_url', width: 200, title: Subject_Name + '图片', align: "center",
                templet: function (d) {
                    if (d.image_url) {
                        return "<img src='images/bg.jpg' style='width: 100%;' onclick='showBigImageInList(this)' >";
                    } else {
                        return '';
                    }
                }
            },
            {
                field: 'start_time', width: 200, title: '投放时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.start_time);
                }
            },
            {
                field: 'end_time', width: 200, title: '结束时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.end_time);
                }
            },
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
            {title: '操作', minWidth: 150, toolbar: '#currentTableBar', align: "center", fixed: "right"}
        ]],
        limits: [10, 20, 30, 50, 100],
        limit: 10,
        page: true,
        done: function (res, curr, count) {
            var imgs = arrayColumn(res.data, 'image_url');
            $('table tbody tr').each(function (index, item) {
                if (imgs[index]) {
                    getImageBlob($(this).find('td:eq(3) img')[0], imgs[index]);
                }
            });
        }
    });

    // 监听搜索操作
    form.on('submit(data-search-btn)', function (data) {
        //执行搜索重载
        data.field.start_time = '';
        data.field.end_time = '';
        data.field.keyword = $.trim(data.field.keyword);
        let select_date = data.field.select_date;
        if (select_date) {
            let select_date = data.field.select_date.split(' - ');
            data.field.start_time = getTimeByDate(select_date[0] + ' 00:00:00');
            data.field.end_time = getTimeByDate(select_date[1] + ' 23:59:59');
        }

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
            var content = miniPage.getHrefContent('page/activity/adv/add.html');

            var index = layer.open({
                title: '添加' + Subject_Name,
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['40%', '70%'],
                btnAlign: 'c',//居中显示
                content: content,
                success: function (layero, index) {

                },
            });
        } else if (obj.event === 'export') {
            let requestData = $('.layui-form-pane').serialize();
            layer.confirm('确定导出广告数据？', function (index) {
                const url = Requesthttp + 'activity/exportAdvList' + '?' + requestData;
                downloadUrl(url);
                layer.close(index);
            });
        }
    });


    table.on('tool(currentTableFilter)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {

            var edit_data = [];
            myAjax.authAjax("activity/advGetInfo", "get",
                false, {id: data.id}, function (response) {
                    edit_data = response.data;
                    window[window_edit_one] = JSON.stringify(edit_data);
                });

            var content = miniPage.getHrefContent('page/activity/adv/add.html');

            var index = layer.open({
                title: '编辑' + Subject_Name,
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['40%', '70%'],
                btnAlign: 'c',//居中显示
                content: content,
                success: function (layero, index) {
                    if (edit_data.start_time) {
                        edit_data.start_time = getDateByTime(edit_data.start_time);
                    } else {
                        edit_data.start_time = '';
                    }
                    if (edit_data.end_time) {
                        edit_data.end_time = getDateByTime(edit_data.end_time);
                    } else {
                        edit_data.end_time = '';
                    }
                    layui.form.val('edit_add', edit_data);

                    if (edit_data.image_url) {
                        getImageBlob(layero.find('#upload1').parent().parent().find('img')[0], edit_data.image_url);
                    }

                    if(edit_data.jump_type === 2){
                        $('#goods_search_container').show();
                    }
                },
            });

            return false;
        } else if (obj.event === 'state') {
            if ($(this).find("input[name='state']").length == 0) {
                return false;
            }
            myAjax.authAjax("activity/advChangeState", "post",
                true, {id: data.id}, function (response) {
                    layer.msg(response.msg, {icon: 1, time: 1000});
                    layui.table.reload('currentTableId');
                });

        } else if (obj.event === 'delete') {

            layer.confirm('你确认要删除该行数据吗？', function (index) {
                myAjax.authAjax('activity/advDel', 'post',
                    true, {id: obj.data.id}, function (response) {
                        obj.del();
                        layer.close(index);
                        layer.msg(response.msg, {icon: 1, time: 1000});
                    });
            });
        }
    });

    //初始化加载搜索信息中的状态
    initStateSelect("list_state");
    let spaceList = [];
    myAjax.authAjax("activity/spaceList", "get",
        false, '', function (res) {
            if (Object.keys(res.data).length != 0) {
                spaceList = res.data;
            }
        });
    initDynamicSelect(spaceList, "space_id");
    form.render("select");

    laydate.render({
        elem: '#laydate1' //指定元素
        , range: true
    });

    myAjax.authAjax("activity/getIndexAdvId", "get",
        true, '', function (response) {
            $('#index_adv_id').val(response.data.index_adv_id);
        });
});