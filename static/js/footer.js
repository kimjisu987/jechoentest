$(document).ready(function(){

    $(window).scroll(function(){
        let sct=$(window).scrollTop();
        if(sct>100){
            $(".top_btn").fadeIn(300);
        }else{
            $(".top_btn").fadeOut(300);
        }
    });
    $(".top_btn").click(function(){
        $("html, body").animate({
            scrollTop:0
        },600)
        return false;
    });

    $(".family_cont").animate({height:0},0);

    function family(){
        let cnt = 1;
        $(".family_title").click(function(){ 
            if(cnt==1){
                $(this).siblings(".family_cont").stop().animate({height:160},500);
                $(this).siblings(".family_cont").addClass("on");
                $(this).addClass("on");
                cnt = 0;
            }else{
                $(this).siblings(".family_cont").stop().animate({height:0},200);
                $(this).siblings(".family_cont").removeClass("on");
                $(this).removeClass("on");
                cnt = 1;
            }
            return false;
        });
    };

    $(".family_title").on("mouseenter",function(){
        $(this).siblings(".family_cont").stop().animate({height:160},500);
        $(this).siblings(".family_cont").addClass("on");
        $(this).addClass("on");
    })
    $(".foot_family>ul>li").on("mouseleave", function(){
        $(this).children(".family_cont").stop().animate({height:0},200);
        $(this).children(".family_cont").removeClass("on");
        $(this).children(".family_title").removeClass("on");
    });

    family();
   
})