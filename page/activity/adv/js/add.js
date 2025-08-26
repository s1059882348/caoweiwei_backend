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

        if (params_object.sid <= 0) {
            layer.msg('请选择广告位', {icon: 5, time: 2000});
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
        if (params_object.start_time && params_object.end_time) {
            if (params_object.start_time >= params_object.end_time) {
                layer.msg('投放时间必须小于结束时间', {icon: 2, time: 3000});
                return false;
            }
        }

        myAjax.authAjax('activity/advUpdate', 'post',
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

    //初始化加载搜索信息中的状态
    let spaceList = [];
    myAjax.authAjax("activity/spaceList", "get",
        false, '', function (res) {
            if (Object.keys(res.data).length != 0) {
                spaceList = res.data;
            }
        });
    initDynamicSelect(spaceList, "sid_select", '请选择');

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



    //通过edit_one赋值
    if (window[window_edit_one]) {
        let edit_one = JSON.parse(window[window_edit_one]);
        window[window_edit_one] = '';

        $('#sid_select').val(edit_one.sid);
    }

    form.render("select");
    
    // 重新渲染表单，确保radio按钮事件监听器生效
    form.render();

    // 监听跳转类型变化，控制商品搜索功能显示
    form.on('radio(jump_type)', function(data) {
        console.log('radio事件触发:', data.value);
        if (data.value == '2') {
            // 选择内链-商品详情时显示商品搜索
            $('#goods_search_container').show();
        } else {
            // 其他选项时隐藏商品搜索
            $('#goods_search_container').hide();
            $('#goods_search_results').hide();
        }
    });

    // 商品搜索功能
    $('#search_goods_btn').on('click', function() {
        var keyword = $('#goods_keyword').val().trim();
        if (!keyword) {
            layer.msg('请输入搜索关键词', {icon: 2, time: 2000});
            return;
        }
        searchGoods(keyword);
    });

    // 回车搜索
    $('#goods_keyword').on('keypress', function(e) {
        if (e.which === 13) {
            $('#search_goods_btn').click();
        }
    });

    // 搜索商品函数
    function searchGoods(keyword) {
        layer.load(1, {shade: [0.1, '#fff']});
        
        myAjax.authAjax('goods/searchGoodsList', 'get', 
            false, {keyword: keyword}, function(response) {
                layer.closeAll('loading');
                
                if (response.code === 0 && response.data && response.data.length > 0) {
                    displayGoodsResults(response.data);
                } else {
                    layer.msg('未找到相关商品', {icon: 2, time: 2000});
                    $('#goods_search_results').hide();
                }
            }, function() {
                layer.closeAll('loading');
                layer.msg('搜索失败，请重试', {icon: 2, time: 2000});
            }
        );
    }

    // 显示商品搜索结果
    function displayGoodsResults(goodsList) {
        var html = '';
        goodsList.forEach(function(goods, index) {
            html += '<div class="layui-row" style="margin-bottom: 10px; padding: 10px; border: 1px solid #e6e6e6; border-radius: 4px;">';
            html += '<div class="layui-col-md8">';
            html += '<div style="font-weight: bold; color: #333;">' + (goods.title || '商品名称') + '</div>';
            html += '<div style="color: #666; font-size: 12px; margin-top: 5px;">商品ID: ' + goods.goods_info_id + '</div>';
            html += '</div>';
            html += '<div class="layui-col-md4" style="text-align: right;">';
            html += '<button type="button" class="layui-btn layui-btn-xs layui-btn-normal select-goods-btn" data-id="' + goods.goods_info_id + '" data-name="' + (goods.title || '') + '">选择</button>';
            html += '</div>';
            html += '</div>';
        });
        
        $('#goods_list_container').html(html);
        $('#goods_search_results').show();
        
        // 绑定选择按钮事件
        $('.select-goods-btn').on('click', function() {
            var goodsId = $(this).data('id');
            var goodsName = $(this).data('name');
            selectGoods(goodsId, goodsName);
        });
    }

    // 选择商品
    function selectGoods(goodsId, goodsName) {
        var jumpUrl = '/pages/pages_product/detail/index?id=' + goodsId;
        $('input[name="jump_url"]').val(jumpUrl);
        
        // 隐藏搜索结果
        $('#goods_search_results').hide();
        $('#goods_keyword').val('');
        
        layer.msg('已选择商品：' + goodsName, {icon: 1, time: 2000});
    }
});