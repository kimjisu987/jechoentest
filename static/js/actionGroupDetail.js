$(document).ready(function(){

    // 설명 펼쳐보기 선택 시 설명 펼쳐짐 + 버튼 텍스트 변경
    $(".actionDetail_more").click(function() {
        const text_hide_show = $(this).text() == "설명 닫기";
        $(this).text(text_hide_show ? "설명 펼쳐보기" : "설명 닫기");
        $(".actionDetail_cont_needs_detail").css("max-height", text_hide_show ? "160px" : "max-content");
    });

    // 활동내역 영역 진입 시 버튼 사라짐
    $(window).on('scroll', function() {
        $(".actionDetail_down_btn").toggle($(document).height() - $(window).height() - $(window).scrollTop() < $('.actionGroup_bttm').offset().top);
    });
    console.log($('.actionGroup_bttm').offset().top);
    console.log($(document).scrollTop());
});