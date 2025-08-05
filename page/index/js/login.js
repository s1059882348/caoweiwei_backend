layui.use(['form', 'jquery','miniPage', 'myAjax'], function () {
    var $ = layui.jquery,
        form = layui.form,
        myAjax = layui.myAjax,
        miniPage = layui.miniPage,
        layer = layui.layer;

    // 登录过期的时候，跳出ifram框架
    if (top.location != self.location) top.location = self.location;

    $('.bind-password').on('click', function () {
        if ($(this).hasClass('icon-5')) {
            $(this).removeClass('icon-5');
            $("input[name='password']").attr('type', 'password');
        } else {
            $(this).addClass('icon-5');
            $("input[name='password']").attr('type', 'text');
        }
    });

    $('.icon-nocheck').on('click', function () {
        if ($(this).hasClass('icon-check')) {
            $(this).removeClass('icon-check');
        } else {
            $(this).addClass('icon-check');
        }
    });

    // 进行登录操作
    form.on('submit(login)', function (data) {
        data = data.field;
        if (data.username == '') {
            layer.msg('用户名不能为空');
            return false;
        }
        if (data.password == '') {
            layer.msg('密码不能为空');
            return false;
        }

        var requestData = {
            username: data.username,
            pwd: data.password,
        };
        myAjax.normal('admin/login', 'post', requestData, function (response) {
            if (response.code == 0) {
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('admin_info', JSON.stringify(response.data));
                window.location = '/';
            } else if (response.code === 30002) {
                layer.msg(response.msg, {icon: 5});
            } else {
                layer.msg(response.msg, {icon: 5});
            }
        });

        return false;
    });




});