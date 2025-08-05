layui.use(['form', 'table', 'miniPage', 'element', 'myAjax'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        myAjax = layui.myAjax,
        miniPage = layui.miniPage;

    var token = myAjax.getToken();
    var url = Requesthttp + 'admin/list';
    table.render({
        elem: '#currentTableId',
        url: url,
        parseData: tableDataFormat,
        headers: {Authorization: token},
        method: 'get',
        request: {
            pageName: 'page' //页码的参数名称，默认：page
            , limitName: 'per_page' //每页数据量的参数名，默认：limit
        },
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter'],
        cols: [[
            {field: 'id', width: 80, title: 'ID', sort: true},
            {field: 'username', width: 150, title: '账号'},
            {field: 'nickname', width: 150, title: '昵称'},
            {
                field: 'avatar_url', width: 200, title: '头像', align: "center",
                templet: function (d) {
                    if (d.avatar_url) {
                        return "<img src='images/bg.jpg' style='width: 60px;border-radius: 30px;height: 60px;' onclick='showBigImageInList(this)'>";
                    } else {
                        return '';
                    }
                }
            },
            {
                field: 'role_name', width: 100, title: '角色', align: "center",
                templet: function (d) {
                    if(d.role == null){
                        return '';
                    }
                    return d.role.role_name;
                }
            },
            {field: 'login_ip', width: 150, title: '用户ip'},
            {
                field: 'login_time', width: 200, title: '登录时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.login_time);
                }
            },
            {
                field: 'state', width: 150, title: '状态', align: "center", event: 'state',
                templet: '#isShow',
                unresize: false,
                filter: "isShow"
            },
            {
                field: 'create_time', width: 200, title: '创建时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.create_time);
                }
            },
            {title: '操作', minWidth: 200, toolbar: '#currentTableBar', align: "center",fixed:"right"}
        ]],
        limits: [10, 15, 20, 25, 50, 100],
        limit: 15,
        page: true,
        done: function (res, curr, count) {
            var imgs = arrayColumn(res.data, 'avatar_url');
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
        table.reload('currentTableId', {
            page: {
                curr: 1
            }
            , where: {
                username: $.trim(data.field.username)
            }
        }, 'data');

        return false;
    });

    /**
     * toolbar事件监听
     */
    table.on('toolbar(currentTableFilter)', function (obj) {
        if (obj.event === 'add') {   // 监听添加操作
            var content = miniPage.getHrefContent('page/system/admin/add.html');
            var openWH = miniPage.getOpenWidthHeight();

            var index = layer.open({
                title: '添加管理员',
                type: 1,
                shade: [0.8, '#393D49'],
                //area: [openWH[0] * 0.5 + 'px', openWH[1] * 0.5 + 'px'],
                //offset: [openWH[2] + 'px', openWH[3] + 'px'],
                area: ['30%', '70%'],
                offset: ['15%', '35%'],
                content: content,
                success: function (layero, index) {

                    //获取角色下拉列表
                    let roles = getRoleList();
                    initDynamicSelect(roles,"add_role_id",'请选择');
                    form.render("select");

                },
            });
            // $(window).on("resize", function () {
            //     layer.full(index);
            // });
        }
    });

    //监听表格复选框选择
    table.on('checkbox(currentTableFilter)', function (obj) {
        console.log(obj)
    });

    table.on('tool(currentTableFilter)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {

            let edit_data = [];
            myAjax.authAjax("admin/info", "get",
                false, {id: data.id}, function (response) {
                    edit_data = response.data;
                });

            var content = miniPage.getHrefContent('page/system/admin/add.html');

            var index = layer.open({
                title: '编辑管理员',
                type: 1,
                shade: [0.8, '#393D49'],
                area: ['30%', '70%'],
                offset: ['15%', '35%'],
                content: content,
                success: function (layero, index) {

                    //获取角色下拉列表
                    let roles = getRoleList();
                    initDynamicSelect(roles,"add_role_id",'请选择');
                    form.render("select");

                    layui.form.val('admin_add', edit_data);
                    layero.find("input[name='username']").attr('readonly', 'readonly');
                    layero.find("input[name='pwd']").parent().parent().remove();
                    layero.find("input[name='cfm_pwd']").parent().parent().remove();
                    if(data.id == getAdminInfo().id){//如果是当前用户，不可对自己进行角色修改
                        $("#add_role_id").attr('disabled','true')
                    }
                    layui.form.render("select");
                    if (edit_data.avatar_url) {
                        getImageBlob(layero.find('#upload1').parent().parent().find('img')[0], edit_data.avatar_url);

                    }
                },
            });

            return false;
        } else if (obj.event === 'delete') {
            layer.confirm('确定删除管理员？', function (index) {
                myAjax.authAjax('admin/del', 'post',
                    true, {id: obj.data.id}, function (response) {
                        layer.close(index);
                        layui.table.reload('currentTableId');
                        layer.msg(response.msg, {icon: 1,time:1000});
                    });
            });
        } else if (obj.event === 'resetPwd') {
            if(data.id == getAdminInfo().id){//如果是当前用户，不可对自己进行角色修改
                layer.msg('不能重置自己帐号的密码！', {icon: 5});
                return ;
            }
            layer.confirm('确定重置管理员的登录密码为：123456？', function (index) {
                myAjax.authAjax('admin/resetPwd', 'post',
                    true, {id: obj.data.id}, function (response) {
                        layer.close(index);
                        layer.msg(response.msg, {icon: 1,time:1000});
                    });
            });
        } else if (obj.event === 'state') {
            if($(this).find("input[name='state']").length == 0){
                return false;
            }
            myAjax.authAjax('admin/userStateSwitch', 'post',
                true, {id: obj.data.id}, function (response) {
                    layer.msg(response.msg, {icon: 1,time:1000});
                });
        }
    });
});