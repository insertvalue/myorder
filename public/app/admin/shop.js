/**
 * Created by Melody on 2014/12/30.
 */
$(function () {
    //监听删除用户的按钮
    $(document).delegate("#deleteShop", 'click', function () {
        var id = $(this).attr("shop-id");
        var that = $(this);
        //管理员确定则执行删除操作
        $(document).delegate(".sure", 'click', function () {
            $("#myModal").hide();
            $.ajax({
                url: '/admin/shop/delete/' + id,
                type: 'GET',
                data: {timeStamp: new Date().getTime()},
                error: function () {
                    alert('网络错误，请联系管理员');
                },
                success: function (data) {
                    that.closest("tr").remove();
                }
            });
        });
    });
});