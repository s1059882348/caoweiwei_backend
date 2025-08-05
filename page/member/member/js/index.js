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
    let url = Requesthttp + 'member/getList';
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
        //id,nickname,avatar,phone,id_type,finance,integral,reg_time,regip
        cols: [[
            {field: 'id', width: 80, title: 'ID', sort: true},
            {field: 'nickname', width: 150, title: '昵称', align: "center"},
            {
                field: 'avatar_url', width: 200, title: '头像', align: "center",
                templet: function (d) {
                    if (d.avatar_url) {
                        return "<img src='images/bg.jpg' style='width: 100%;' onclick='showBigImageInList(this)' >";
                    } else {
                        return '';
                    }
                }
            },
            {
                field: 'id_type', width: 100, title: '类型', align: "center",
                templet: function (d) {
                    switch (d.id_type) {
                        case 1 :
                            return "普通用户";
                        case 2 :
                            return "批发商";
                        default:
                            return "";
                    }
                }
            },
            {field: 'finance', width: 100, title: '账户余额', align: "center"},
            {field: 'integral', width: 100, title: '积分余额', align: "center"},
            {
                field: 'reg_time', width: 200, title: '注册时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.reg_time);
                }
            },
            {field: 'regip', width: 200, title: '注册IP', align: "center"},
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
            {title: '操作', minWidth: 50, toolbar: '#currentTableBar', align: "center", fixed: "right"}
        ]],
        limits: [10, 20, 30, 50, 100],
        limit: 10,
        page: true,
        done: function (res, curr, count) {
            var imgs = arrayColumn(res.data, 'avatar_url');
            $('table tbody tr').each(function (index, item) {
                if (imgs[index]) {
                    getImageBlob($(this).find('td:eq(2) img')[0], imgs[index]);
                }
            });
        }
    });

    // 监听搜索操作
    form.on('submit(data-search-btn)', function (data) {
        //执行搜索重载
        data.field.keyword = $.trim(data.field.keyword);

        data.field.t_start = '';
        data.field.t_end = '';

        if (data.field.create_time != '') {
            let create_time = data.field.create_time.split(' - ');
            if (create_time.length == 1) {
                data.field.t_start = getTimeByDate(create_time[0] + ' 00:00:00');
            } else if (create_time.length == 2) {
                data.field.t_start = getTimeByDate(create_time[0] + ' 00:00:00');
                data.field.t_end = getTimeByDate(create_time[1] + ' 23:59:59');
            }
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

    });


    table.on('tool(currentTableFilter)', function (obj) {

    });

    laydate.render({
        elem: '#create_time' //指定元素
        , range: true
    });

    form.render("select");
});