layui.use(['form', 'table', 'myAjax', 'laydate', 'upload'], function () {
    var form = layui.form,
        layer = layui.layer,
        myAjax = layui.myAjax,
        laydate = layui.laydate,
        upload = layui.upload,
        $ = layui.$;

    /**
     * 初始化表单，要加上，不然刷新部分组件可能会不加载
     */
    form.render();

    // 当前弹出层，防止ID被覆盖
    var parentIndex = layer.index;

    //监听提交
    form.on('submit(saveBtn)', function (data) {

        var params_object = data.field;

        if (params_object.type == 2 && !params_object.content) {
            layer.msg('文字类型公告请填写公告内容', {icon: 2, time: 2000});
            return false;
        }
        if (params_object.start_time) {
            params_object.start_time = getTimeByDate(params_object.start_time);
        } else {
            params_object.start_time = 0;
        }
        if (params_object.end_time) {
            params_object.end_time = getTimeByDate(params_object.end_time);
        } else {
            params_object.end_time = 0;
        }
        if(params_object.start_time && params_object.end_time){
            if(params_object.start_time >= params_object.end_time){
                layer.msg('投放时间必须小于结束时间', {icon: 2, time: 3000});
                return false;
            }
        }

        myAjax.authAjax('activity/annUpdate', 'post',
            false, params_object, saveHandle);

        return false;
    });

    function saveHandle(response) {
        layer.msg(response.msg, {icon: 1, time: 1000});
        // 关闭弹出层
        layer.close(parentIndex);
        //更新列表
        layui.table.reload('currentTableId');
    }


    //日期时间
    laydate.render({
        elem: '#laydate2' //指定元素
        , format: 'yyyy-MM-dd HH:mm:ss'
        , type: 'datetime'
    });
    laydate.render({
        elem: '#laydate3' //指定元素
        , format: 'yyyy-MM-dd HH:mm:ss'
        , type: 'datetime'
    });


    //上传图片
    uploadImageFun($('#upload1'));
});