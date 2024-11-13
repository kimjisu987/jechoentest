$(document).ready(function() {
    // 라디오버튼에 따른 상태 변화
    function check_popup() {
        const check_status = $("input[name='popup_select']:checked");
        if (check_status.hasClass("main_check")) {
            $("input").val("");
            $(".popup_regi_input, .popup_list").hide();
            $(".mainimg_regi_input, .mainimg_list").show();
        } else {
            $("input").val("");
            $(".mainimg_regi_input, .mainimg_list").hide();
            $(".popup_regi_input, .popup_list").show();
        }
    }
    check_popup();
    $("input[name='popup_select']").change(function() {
        check_popup();
    });
	// -------------------------------------------------------------------------------------
	// 노출기간 - enddate 오류
	$(".start_date, .end_date").on("change", function() {
		const start_date = $(".start_date").val();
		const end_date = $(".end_date").val();

		if (start_date && end_date) {
			if (end_date <= start_date) {
				alert_modal("modal_error", "노출기간 오류", "종료시간은 시작시간 이후로 입력해주세요.");
				$(".end_date").val("");
			}
		}
	});
    // -------------------------------------------------------------------------------------
    // 리스트 클릭시 이벤트
    function list_click(list_selected, input) {
        $(list_selected).on("click", "> li > a", function(e) {
            e.preventDefault();

            // 등록 버튼 클릭 시
            if ($(this).hasClass("mainimg_add") || $(this).hasClass("popup_add")) {
                $(input).val("");
                $("input").val("");
                $("#exposure_off").prop('checked', true);
                $(".mainimg_list > li > a, .popup_list > li > a").removeClass("list_act");
                $(this).addClass("list_act");
                return;
            };

            // 제목 입력
            let list_title = $(this).find(".list_title").text();
            $(input).val(list_title);
            
            // 노출 여부 선택
            if ($(this).find(".list_status").hasClass("list_on")) {
                $("#exposure_on, #mainimg_exposure_on").prop('checked', true);
            } else {
                $("#exposure_off, #mainimg_exposure_off").prop('checked', true);
            }

            // 클릭된 리스트의 활성화 상태 조정
            $(list_selected + " > li > a").removeClass("list_act");
            $(this).addClass("list_act");
        });
    }

    // 메인이미지 리스트 클릭 이벤트
    list_click(".mainimg_list", ".mainimg_regi_input #mainimg_title");
    // 팝업 리스트 클릭 이벤트
    list_click(".popup_list", ".popup_regi_input #popup_title");
    // -------------------------------------------------------------------------------------
    // 메인이미지 추가
    $(".mainimg_regi_btn").click(function(e) {
        e.preventDefault();
        if (mainimg_check()) {
            function mainimg_add() {
                const list_title = $(".mainimg_regi_input #mainimg_title").val();
                const list_added = $("input[name='mainimg_exposure']:checked").hasClass("mainimg_exposure_on") ? "list_on" : "";
                const list_count = $(".mainimg_list .list_status.list_on").length;
                if (list_added == "list_on" && list_count >= 10) {
                    alert_modal('modal_error', '메인이미지 등록 오류', '최대 10개까지 노출 가능합니다.');
                    return;
                };

                const main_img_html = `            
                    <li>
                        <a href="#" title="수정하기" class="mainimg_modify">
                            <p class="list_title">${list_title}</p>
                            <div class="list_status_box">
                                <span class="list_status ${list_added}">&nbsp;</span>
                                <button type="button" class="mainimg_modify_btn">수정</button>
                            </div>
                        </a>
                    </li>
                `;
                $(".mainimg_list").append(main_img_html);
            };
            alert_modal("modal_ok", "등록 완료", "메인이미지 등록이 완료되었습니다.<br>등록하신 이미지는 메인페이지에서 확인 가능합니다.");
            mainimg_add();
            $("input").val("");
        } else {
            $('html, body').animate({scrollTop: 0}, 300);
            alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '제목, 이미지 첨부는 필수 사항입니다.');
        };

        function mainimg_check() {
            let inputs = [
                { input: $('#mainimg_title'), errorMsg: "제목을 입력하세요" },
                { input: $('#mainimg_img'), errorMsg: "이미지를 첨부하세요" }
            ];
            let input_return = true;
            
            // 유효성 검사
            inputs.forEach(({ input, errorMsg }) => {
                if (input.val().length < 1) {
                    showError(input, errorMsg);
                    input_return = false;
                } else {
                    hideError(input);
                }
            });
            return input_return;
        }

        // 공통 오류 메시지 표시
        function showError(input, msg) {
            let error_msg = input.parents(".input_fields").find(".check_error");
            error_msg.text(msg).show();
        }
        // 오류 메시지 숨기기
        function hideError(input) {
            input.parents(".input_fields").find(".check_error").hide();
        }
        // 포커스 해제 시 유효성 검사
        $('#mainimg_title, #mainimg_img').on('blur', function() {
            mainimg_check();
        });
    });
    // -------------------------------------------------------------------------------------
    // 팝업 추가
    $(".popup_regi_btn").click(function(e) {
        e.preventDefault();

        if (popup_check()) {
            const list_title = $(".popup_regi_input #popup_title").val();
            const list_added = $("input[name='exposure']:checked").hasClass("exposure_on") ? "list_on" : "";
            const list_count = $(".popup_list .list_status.list_on").length;
            if (list_added == "list_on" && list_count >= 3) {
                alert_modal('modal_error', '팝업 등록 오류', '최대 3개까지 노출 가능합니다.');
                return;
            };

            function popup_add() {
                const popup_html = `
                    <li>
                        <a href="#" title="수정하기" class="popup_modify">
                            <p class="list_title">${list_title}</p>
                            <div class="list_status_box">
                                <span class="list_status ${list_added}">&nbsp;</span>
                                <button type="button" class="popup_modify_btn">수정</button>
                            </div>
                        </a>
                    </li>
                `;
                $(".popup_list").append(popup_html);
            };
            alert_modal("modal_ok", "등록 완료", "팝업 등록이 완료되었습니다.<br>등록하신 팝업은 메인페이지에서 확인 가능합니다.");
            popup_add();
            $("input").val("");
        } else {
            $('html, body').animate({scrollTop: 0}, 300);
            alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '링크 제외 모두 필수 입력 사항입니다.');
        };

        // 유효성 검사
        function popup_check() {
            let inputs = [
                { input: $('#popup_title'), errorMsg: "제목을 입력하세요" },
                { input: $('#popup_img'), errorMsg: "이미지를 첨부하세요" },
                { input: $('#start_date'), errorMsg: "노출시작을 선택하세요" },
                { input: $('#end_date'), errorMsg: "노출종료를 선택하세요" }
            ];
            let input_return = true;
            
            inputs.forEach(({ input, errorMsg }) => {
                if (input.val().length < 1) {
                    showError(input, errorMsg);
                    input_return = false;
                } else {
                    hideError(input);
                }
            });
            return input_return;
        }
        // 공통 오류 메시지 표시
        function showError(input, msg) {
            let error_msg = input.parents(".input_fields").find(".check_error");
            error_msg.text(msg).show();
        }
        // 오류 메시지 숨기기
        function hideError(input) {
            input.parents(".input_fields").find(".check_error").hide();
        }
        // 포커스 해제 시 유효성 검사
        $('#popup_title, #popup_img, #start_date, #end_date').on('blur', function() {
            popup_check();
        });
    });
    // -------------------------------------------------------------------------------------
    // 미리보기 모달 스와이퍼    
    var swiper = new Swiper(".preview_swiper", {
        slidesPerView: 1,
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
    // -------------------------------------------------------------------------------------
    // 팝업 모달
    $(".popup_preview_btn").click(function(){
        $(".preview_modal").fadeIn();
    });
    $(".preview_24, .preview_close").click(function(){
        $(".preview_modal").fadeOut();
    });
});