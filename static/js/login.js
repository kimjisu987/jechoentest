function goLogin(){

    let param = {
        "userId": $("input[name=userId]").val(),
        "password": $("input[name=password]").val()
    };

    $.ajax({
        url: "/login",
        method: "POST",
        contentType: "application/x-www-form-urlencoded; charset=utf-8;",
        data: param,
        headers: getCsrfHeader(),
        cache: false,
        success: function(data, status, req) {
            console.log(data);
            console.log(status);
            console.log(req);
            location.replace("/");
        },
        error: function(req, status, error) {
            console.log(req);
            console.log(status);
            console.log(error);
        }
    });

}