function goLogin(){

    let param = {
        "userId": $("input[name=userId]").val(),
        "password": $("input[name=password]").val()
    };

    $.ajax({
        url: "/login/auth",
        method: "POST",
        contentType: "application/x-www-form-urlencoded; charset=utf-8;",
        data: param,
        headers: getCsrfHeader(),
        cache: false,
        success: function() {
            location.replace("/");
        },
        error: function(req) {
            console.log(req);
            alert_modal('modal_error', req.responseJSON.body.status, req.responseJSON.body.message);
        }
    });

}

$(document).ready(function(){
    $('#password_show').on('change', function() {
        if ($(this).is(':checked')) {
          $('#password').prop('type', 'text');
          $('label[for="password_show"]').prop('class', '');
        } else {
          $('#password').prop('type', 'password');
          $('label[for="password_show"]').prop('class', 'hide');
        }
      });

      $(".join_btn").click(function(){
          $(".join_modal").fadeIn(200);
      });
      $(".join_modal_x").click(function(){
          $(".join_modal").fadeOut(200);
      });

    $(document).mouseup(function(e){
        if($(".join_modal").has(e.target).length === 0){
            $(".join_modal").fadeOut(200);
        } else {
            $(".join_modal").fadeIn(200);
        }
    })

})