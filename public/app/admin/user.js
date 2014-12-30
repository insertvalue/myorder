/**
 * Created by Melody on 2014/12/30.
 */
$(function(){
    //监听超级管理员按钮
    $(document).delegate(".Admin", 'click',function(){
        var id = $(this).closest("tr").attr("id");
        var that = $(this);
        $.ajax({
            url: '/admin/user/isAdmin/' + id,
            type: 'GET',
            data: { timeStamp:new Date().getTime() },//解决ie不能兼容问题
            error: function(){
                alert('网络错误，请联系管理员');
            },
            success: function(data){
                if(data){
                    that.removeClass('btn-primary').addClass('btn-warning').text("撤销超级管理");
                }else{
                    that.removeClass('btn-warning').addClass('btn-primary').text("授予超级管理");
                }
            }
        })
    })
    //监听店铺管理员按钮
    $(document).delegate(".Shoper", 'click',function(){
        var id = $(this).closest("tr").attr("id");
        var that = $(this);
        $.ajax({
            url: '/admin/user/canOperateShop/' + id,
            type: 'GET',
            data: {timeStamp:new Date().getTime()},//解决ie不能兼容问题
            error: function(){
                alert('网络错误，请联系管理员');
            },
            success: function(data){
                if(data){
                    that.removeClass('btn-primary').addClass('btn-warning').text("撤销店铺管理");
                }else{
                    that.removeClass('btn-warning').addClass('btn-primary').text("授予店铺管理");
                }
            }
        })
    });
    //监听删除用户的按钮
    $(document).delegate("#deleteUser", 'click', function(){
        var id = $(this).closest("tr").attr("id");
        var that = $(this);
        //管理员确定则执行删除操作
        $(document).delegate(".sure", 'click',function(){
            $("#myModal").hide();
            $.ajax({
                url: '/admin/user/delete/' + id,
                type: 'GET',
                data: {timeStamp:new Date().getTime()},
                error: function(){
                    alert('网络错误，请联系管理员');
                },
                success: function(data){
                    that.closest("tr").remove();
                }
            })
        })
    })

})