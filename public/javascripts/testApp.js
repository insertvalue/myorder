$(function () {
    $("#btnCreateEmp").click(function () {



        var name = $("#inptName").val();
        var age = $("#inptAge").val();
        $.post("../test/02", {
            id: "2008",
            name: name,
            age: Number(age),
            email: "12333@12.cn"
        }, function (data) {
            var th = "<tr><td>姓名</td><td>年龄</td><td>操作</td></tr>";
            $("#tbEmps").empty().append(th);
            $.each(data, function (i, e) {
                var tr = '<tr><td>' + e.name + '</td><td>' + e.age + '</td><td><a href="#" class="delEmp" id="' + e._id + '">删除</a></td></tr>';
                $("#tbEmps").append(tr);
            });
        });
    });

    $(".delEmp").click(function(){
        var id = $(this).attr("id");
        $.post("../test/delEmp", {
            id: id
        }, function (data) {
            var th = "<tr><td>姓名</td><td>年龄</td><td>操作</td></tr>";
            $("#tbEmps").empty().append(th);
            $.each(data, function (i, e) {
                var tr = '<tr><td>' + e.name + '</td><td>' + e.age + '</td><td><a href="#" class="delEmp" id="' + e._id + '">删除</a></td></tr>';
                $("#tbEmps").append(tr);
            });
        });
    });
});