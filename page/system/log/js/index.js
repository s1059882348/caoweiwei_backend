layui.use(['form', 'table','laydate', 'miniPage', 'element', 'myAjax'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        myAjax = layui.myAjax,
        laydate = layui.laydate,
        miniPage = layui.miniPage;

    //日期时间范围
    laydate.render({
        elem: '#create_time'
        ,min: '2021-1-1'
        ,type: 'date'
        ,max: '2025-12-31'
        ,range: true
    });

    table.render({
        elem: '#currentTableId',
        url: Requesthttp + 'adminLog/findList',
        headers: {Authorization: myAjax.getToken()},
        where: {'admin_id':'','t_start':'','t_end':''}, //渠道名称
        method: 'get', //如果无需自定义HTTP类型，可不加该参数
        request: {pageName: 'page', limitName: 'per_page' }, //如果无需自定义请求参数，可不加该参数
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter'],
        parseData: tableDataFormat,
        limits: [10, 20, 30, 50, 100],
        limit: 10,
        page: true,
        cols: [[
            {field: 'id', width: 100, title: 'ID', sort: true},
            {field: 'nickname', width: 150, title: '操作员名称', align: "center"},
            {field: 'route', width: 300, title: '路由', align: "center"},
            {
                field: 'title', minwidth: 300, title: '功能名称', align: "center",
                templet: function (d) {
                    return d.p_title+"->"+d.title;
                }
            },
            {field: 'param', width: 500, title: '操作内容', align: "center"},
            {
                field: 'ip', minwidth: 200, title: '访问IP', align: "center",
                templet: function (d) {
                    return numberToIp(d.ip);
                }
            },
            {
                field: 'create_time', minwidth: 200, title: '操作时间', align: "center",
                templet: function (d) {
                    return getDateByTime(d.create_time);
                }
            }
        ]]
    });

    // 监听搜索操作
    form.on('submit(data-search-btn)', function (data) {
        //执行搜索重载
        splitDate(data,'t_start','t_end','create_time') ;

        table.reload('currentTableId', {
            page: {curr: 1},
            where: data.field
        }, 'data');
        return false;
    });

    table.on('tool(currentTableFilter)', function (obj) {

    });

    loadAdmin();
    function loadAdmin(){
        myAjax.authAjax('admin/list',"get",false,{'per_page':100},function(res){
            if(res.code == 0){
                var data = res.data.data;
                for(let a = 0 ; a < data.length ;a++){
                    data[a].name=data[a].nickname ;
                }
                initDynamicSelect2(data,'admin_id');
            }
        });
        form.render("select");
    }

});