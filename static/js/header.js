$(document).ready(function() {
  let w_width = window.innerWidth;

  function header_default() {
    w_width = window.innerWidth;

    // 모든 이벤트 핸들러 제거
    $(".gnb").off("mouseenter mouseleave click");
    $(".inner > ul > li").off("mouseenter mouseleave click");

    if (w_width > 768) {
      // PC 모드
      $(".header_nav").css("right", "0");
      $(".gnb").css("height", "60px");
      $(".header_black").stop().hide();
      $(".lnb").stop().show(); // 모든 서브메뉴 열기

      // PC 버전 - GNB 호버시 LNB 슬라이드
      $(".gnb").mouseenter(function() {
        $(this).stop().animate({"height": "340px"}, 300);
      }).mouseleave(function() {
        $(this).stop().animate({"height": "60px"}, 300);
      });

      // PC 버전 - GNB 클릭시 제어
      $(".gnb > li > a").off("click");

      // 서브타이틀 영역
      $(".inner > ul > li").on("mouseenter", function(e) {
        e.preventDefault();
        $(this).css({
            "border": "1px solid",
            "border-image": `linear-gradient(to bottom, transparent 50px, #D9D9D9 50px, #D9D9D9 100%)`,
            "border-image-slice": "1"
        });
        $(this).find(".crumbs").addClass("crumbs_act");
        $(this).find("a").addClass("crumbs_act_icon");
      });
      $(".inner > ul > li").on("mouseleave", function(e) {
        e.preventDefault();
        $(this).css({
            "border": "1px solid transparent",
            "border-image": "none"
        });
        $(this).find(".crumbs").removeClass("crumbs_act");
        $(this).find("a").removeClass("crumbs_act_icon");
      });
    } else {
      // 모바일 모드
      $(".header_nav").css("right", "-100%");
      $(".gnb").css("height", "max-content");
      $(".header_black").stop().hide();
      $(".lnb").stop().hide(); // 모든 서브메뉴 닫기

      // 모바일 버전 - 토글 버튼
      $(".header_toggle").off("click").click(function(e) {
        e.preventDefault();
        $(".header_nav").stop().animate({"right": "0"}, 300);
        $(".header_black").fadeIn(300);
        $("body").css("overflow","hidden");
      });
      $(".toggle_close").off("click").click(function(e) {
        e.preventDefault();
        $(".header_nav").stop().animate({"right": "-100%"}, 300);
        $(".header_black").fadeOut(300);
        $("body").css("overflow","auto");
      });

      // 모바일 버전 - GNB 클릭 시 LNB 슬라이드
      $(".gnb > li > a").off("click").click(function() {
        let $lnb = $(this).next();

        // 모든 서브메뉴를 접고 클래스 제거
        $(".gnb > li > ul").slideUp();
        $(".gnb > li > a").removeClass("lnb_act");

        // 현재 서브메뉴가 이미 열려있다면 닫기
        if ($lnb.is(":visible")) {
          $lnb.slideUp();
          $(this).removeClass("lnb_act");
        } else {
          // 아니면 열기
          $lnb.slideDown();
          $(this).addClass("lnb_act");
        }
      });

      // 서브타이틀 영역
      $(".inner > ul > li").off("click").click(function(e) {
        e.preventDefault();
        if ($(this).find(".crumbs").hasClass("crumbs_act")) {
          $(".inner > ul > li").css({
                "border": "1px solid transparent",
                "border-image": "none"
            });
            $(this).find(".crumbs").removeClass("crumbs_act");
            $(this).find("a").removeClass("crumbs_act_icon");
        } else {
          $(".inner > ul > li").find(".crumbs").removeClass("crumbs_act");
          $(".inner > ul > li").find("a").removeClass("crumbs_act_icon");
          $(".inner > ul > li").css({
                "border": "1px solid transparent",
                "border-image": "none"
            });
            $(this).css({
                "border": "1px solid",
                "border-image": `linear-gradient(to bottom, transparent 50px, #D9D9D9 50px, #D9D9D9 100%)`,
                "border-image-slice": "1"
            });
            $(this).find(".crumbs").addClass("crumbs_act");
            $(this).find("a").addClass("crumbs_act_icon");
        }
      });
    }
  }

  // 창 크기 업데이트
  $(window).resize(function() {
    header_default();
  });

  // 초기 메뉴 상태 조정
  header_default();
});