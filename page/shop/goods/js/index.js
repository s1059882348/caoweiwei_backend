layui.use(['form', 'table', 'miniPage', 'element', 'myAjax', 'laydate'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        myAjax = layui.myAjax,
        laydate = layui.laydate,
        miniPage = layui.miniPage;
    var Subject_Name = '商品';

    let token = myAjax.getToken();
    let url = Requesthttp + 'goods/goodsList';
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
            {field: 'title', minWidth: 200, title: '名称', align: "center"},
            {field: 'cate_title', minWidth: 200, title: '分类', align: "center"},
            {
                field: 'cover_image_url', width: 200, title: '封面图', align: "center",
                templet: function (d) {
                    if (d.cover_image_url) {
                        return "<img src='images/bg.jpg' style='width: 100%;' onclick='showBigImageInList(this)' >";
                    } else {
                        return '';
                    }
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
            var imgs = arrayColumn(res.data, 'cover_image_url');
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
            var content = miniPage.getHrefContent('page/shop/goods/add.html');

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
        }
    });


    table.on('tool(currentTableFilter)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {

            let edit_data = [];
            myAjax.authAjax("goods/goodsGetInfo", "get",
                false, {id: data.id}, function (response) {
                    edit_data = response.data;
                    window[window_edit_one] = JSON.stringify(edit_data);
                });

            var content = miniPage.getHrefContent('page/shop/goods/add.html');

            var index = layer.open({
                title: '编辑' + Subject_Name,
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['50%', '80%'],
                btnAlign: 'c',//居中显示
                content: content,
                success: function (layero, index) {

                    layui.form.val('edit_add', edit_data);
                    if (edit_data.cover_image_url) {
                        getImageBlob(layero.find('#upload1').parent().parent().find('img')[0], edit_data.cover_image_url);
                    }
                    if (edit_data.video_url) {
                        getImageBlob(layero.find('#upload2').parent().parent().find('video')[0], edit_data.video_url);
                    }

                    if (edit_data.images) {
                        $.each(edit_data.images, function (ki, kv) {
                            var html = '<div class="layui-input-block">'
                                + '<img style="width:300px;height:100%;margin-top:10px" src="' + kv.url + '">'
                                + '<input type="hidden" name="images[]" value="' + kv.filename + '">'
                                + '<span class="layui-layer-setwin" style="left: 90%;">'
                                + '<a class="layui-layer-ico images_delete_one" href="javascript:;"></a>'
                                + '</span>'
                                + '</div>';

                            $('#upload_images').parent().parent().append(html);
                        });
                    }

                    //规格信息
                    $.each(edit_data.spec_desc, function (kk, vv) {
                        $('input[name="spec_desc[' + kk + ']"]').val(edit_data.spec_desc[kk]);
                        $('input[name="inventory[' + kk + ']"]').val(edit_data.inventory[kk]);
                        $('input[name="sales_volume[' + kk + ']"]').val(edit_data.sales_volume[kk]);
                        $('input[name="price[' + kk + ']"]').val(edit_data.price[kk]);
                        $('input[name="original_price[' + kk + ']"]').val(edit_data.original_price[kk]);
                        $('input[name="discount_price[' + kk + ']"]').val(edit_data.discount_price[kk]);
                    });
                },
            });

            return false;
        } else if (obj.event === 'state') {
            if ($(this).find("input[name='state']").length == 0) {
                return false;
            }
            myAjax.authAjax("goods/goodsChangeState", "post",
                true, {id: data.id}, function (response) {
                    layer.msg(response.msg, {icon: 1, time: 1000});
                    layui.table.reload('currentTableId');
                });

        } else if (obj.event === 'delete') {

            layer.confirm('你确认要删除该行数据吗？', function (index) {
                myAjax.authAjax('goods/goodsDel', 'post',
                    true, {id: obj.data.id}, function (response) {
                        obj.del();
                        layer.close(index);
                        layer.msg(response.msg, {icon: 1, time: 1000});
                    });
            });
        }
    });

    //初始化加载搜索信息中的状态
    let spaceList = [];
    myAjax.authAjax("goods/cateList", "get",
        false, '', function (res) {
            if (Object.keys(res.data).length != 0) {
                spaceList = res.data;
            }
        });
    initDynamicSelect(spaceList, "cate_id");
    form.render("select");

});