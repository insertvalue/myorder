/**
 * Created by Melody on 2014/12/30.
 */
$(function () {
    $(document).delegate("form span.btn", 'click', function () {

        var _this = $(this);
        $('#amount').text($(this).parent().find('[name="amount"]').val());

        $('#myModal').modal({
            keyboard: true,
            show: true,
            backdrop: true
        });
        //管理员取消
        $(document).delegate(".cancel", 'click', function () {
            return;
        })
        //管理员确定则执行删除操作
        $(document).delegate(".sure", 'click', function () {
            _this.parent('form').submit();
        })
    });
});