layui.use(['form', 'table', 'myAjax', 'laydate', 'upload', 'element', 'layedit'], function () {
    var form = layui.form,
        layer = layui.layer,
        myAjax = layui.myAjax,
        laydate = layui.laydate,
        upload = layui.upload,
        $ = layui.$;
    var element = layui.element;
    var layedit = layui.layedit;

    /**
     * 初始化表单，要加上，不然刷新部分组件可能会不加载
     */
    form.render();

    // 当前弹出层，防止ID被覆盖
    var parentIndex = layer.index;

    //监听提交
    form.on('submit(saveBtn)', function (data) {

        var params_object = data.field;

        if (params_object.cate_id <= 0) {
            layer.msg('请选择分类', {icon: 5, time: 2000});
            return false;
        }

        myAjax.authAjax('goods/goodsUpdate', 'post',
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


    ////////////官网：https://www.wangeditor.com///////////////
    const { createEditor, createToolbar } = window.wangEditor

    const editorConfig = {
        placeholder: 'Type here...',
        MENU_CONF: {},
        onChange(editor)
        {
            const html = editor.getHtml()
            //console.log('editor content', html)
            // 也可以同步到 <textarea>
            document.getElementById('get_content').value = html;
        },
    }

    // 修改 uploadImage 菜单配置
    editorConfig.MENU_CONF['uploadImage'] = {
        server: Requesthttp + 'index/uploadWangEditor',
        fieldName: 'custom-name',
        // 继续写其他配置...

        //【注意】不需要修改的不用写，wangEditor 会去 merge 当前其他配置
    }


    const editor = createEditor({
        selector: '#editor-container',
        html: '<p><br></p>',
        config: editorConfig,
        mode: 'default', // or 'simple'
    })

    const toolbarConfig = {}
    toolbarConfig.excludeKeys = [
        "group-video"
    ];//排除掉某些菜单
    //console.log(toolbar.getConfig().toolbarKeys);

    const toolbar = createToolbar({
        editor,
        selector: '#toolbar-container',
        config: toolbarConfig,
        mode: 'default', // or 'simple'
    })
   ///////////////////////////////////////////////////////
    //富文本编辑器
    var layedit_index = layedit.build('layedit-demo', {
        tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right',
            '|', 'link', 'unlink', 'face', 'image'],
        uploadImage: {
            url: Requesthttp + 'index/uploadImgLayedit' //上传接口
            , type: 'post'//默认post
        }
    }); //建立编辑器


    //初始化加载搜索信息中的状态
    let spaceList = [];
    myAjax.authAjax("goods/cateList", "get",
        false, '', function (res) {
            if (Object.keys(res.data).length != 0) {
                spaceList = res.data;
            }
        });
    initDynamicSelect(spaceList, "cateid_select", '请选择');


    //上传图片
    uploadImageFun($('#upload1'));


    //一些事件触发
    element.on('tab(spec_desc[])', function (data) {
        console.log(data);
    });


    //上传视频
    uploadVideoFun($('#upload2'));


    //删除视频
    $('body').on('click', '#delete_video', function () {
        var video = $('#upload2').parent().parent().find('video')[0];
        video.src = '';
        $('#upload2').parent().parent().find('input:last').val('');
    });


    //上传图片组
    function uploadImagesHandle(item, res, index) {
        var imgCount = $('#upload_images').parent().parent().find('img').length;
        if (imgCount < index) {
            setTimeout(function () {
                add_image_div(item, res);
            }, imgCount * 300);
        } else {
            add_image_div(item, res);
        }

        function add_image_div(item, res) {
            var html = '<div class="layui-input-block">'
                + '<img style="width:300px;height:100%;margin-top:10px" src="' + res.data.url + '">'
                + '<input type="hidden" name="images[]" value="' + res.data.filename + '">'
                + '<span class="layui-layer-setwin" style="left: 90%;">'
                + '<a class="layui-layer-ico  images_delete_one" href="javascript:;"></a>'
                + '</span>'
                + '</div>';

            item.parent().parent().append(html);
        }
    }

    uploadImagesFun($('#upload_images'), uploadImagesHandle);

    //删除图片
    $('body').on('click', '.images_delete_one', function () {
        $(this).parent().parent().remove();
    });

    //通过edit_one赋值
    if (window[window_edit_one]) {
        let edit_one = JSON.parse(window[window_edit_one]);

        window[window_edit_one] = '';

        $('#cateid_select').val(edit_one.cate_id);//解决第一次打开编辑页面的时候无法赋值的情况
        layedit.setContent(layedit_index, edit_one.intro, false);//解决第二次打开编辑页面的时候无法赋值的情况
        editor.setHtml(edit_one.intro)
    }

    form.render("select");

});