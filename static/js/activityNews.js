$(document).ready(function(){
    function actionAll(){
        if($(".activity_top_major button").html() === "전체"){
            $(".activity_top_minor").css("display", "none");
        } else {
            $(".activity_top_minor").css("display", "block");
        }
    };
    actionAll();
    $(".activity_top_major li").click(function(){
        let select_sub =  $(this).children("button").html();
        $(".activity_top_major .select_main").text(select_sub);
        actionAll();
    });
    $(".activity_top_minor li").click(function(){
        let select_sub =  $(this).children("button").html();
        $(".activity_top_minor .select_main").text(select_sub);
    });
})