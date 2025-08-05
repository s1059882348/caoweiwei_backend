layui.use(['form', 'table', 'myAjax'], function () {
    var form = layui.form,
        layer = layui.layer,
        myAjax = layui.myAjax,
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
        myAjax.authAjax('question/update', 'post',
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


    ////////////////////wangeditor编辑器///////////////////////
    const {createEditor, createToolbar} = window.wangEditor

    const editorConfig = {
        placeholder: 'Type here...',
        MENU_CONF: {},
        onChange(editor) {
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


    ////////////////////wangeditor编辑器///////////////////////


    //通过edit_one赋值
    if (window[window_edit_one]) {
        let edit_one = JSON.parse(window[window_edit_one]);
        window[window_edit_one] = '';

        editor.setHtml(edit_one.answer);
    }
});