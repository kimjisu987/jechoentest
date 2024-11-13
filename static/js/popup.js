$(document).ready(function() {
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
    // 이미지 미리보기
    $("#img").on("change", function(e){
        imgName = null;
        let file = e.target.files[0];

        let reader = new FileReader();
        reader.onload = function(ev) {
            $(".main_photo").attr("src",   ev.target.result);
        }
        reader.readAsDataURL(file);
    });
    // -------------------------------------------------------------------------------------
    // 메인이미지 추가

    $(".regi_btn").click(function(e) {
        let type = document.querySelector('input[name="popup_select"]:checked').id === 'main_check' ? 'mainImg' : 'popup';
        e.preventDefault();
        if (check(type)) {
            if($("#popupNo").val() != 0){
                if(imgName == null){
                    let formData = new FormData();
                    formData.append("file", $("#img")[0].files[0]);
                    imgName = uploadFile("popupFile", formData)[0];
                }
            }

            if(type === 'mainImg'){
                const list_added = $("input[name='mainimg_exposure']:checked").hasClass("mainimg_exposure_on") ? "list_on" : "";
                const list_count = $(".mainimg_list .list_status.list_on").length;
                if (list_added === "list_on" && list_count >= 10) {
                    alert_modal('modal_error', '메인이미지 등록 오류', '최대 10개까지 노출 가능합니다.');
                    return;
                }
            }
            else{
                const list_added = $("input[name='exposure']:checked").hasClass("exposure_on") ? "list_on" : "";
                const list_count = $(".mainimg_list .list_status.list_on").length;
                if (list_added == "list_on" && list_count >= 3) {
                    alert_modal('modal_error', '팝업 등록 오류', '최대 3개까지 노출 가능합니다.');
                    return;
                }
            }
            popupRegi();
            $("input").not("#popupNo").val("");
        } else {
            if(type === 'mainImg') {
                $('html, body').animate({scrollTop: 0}, 300);
                alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '제목, 이미지 첨부는 필수 사항입니다.');
            }
            else{
                $('html, body').animate({scrollTop: 0}, 300);
                alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '링크 제외 모두 필수 입력 사항입니다.');
            }
        }

        function check(type) {
            let inputs = [];
            let input_return = false;
            if(type === 'mainImg') {
                inputs = [
                    {input: $('#title'), errorMsg: "제목을 입력하세요"},
                ];
                input_return = true;
            }
            else{
                inputs = [
                    { input: $('#title'), errorMsg: "제목을 입력하세요" },
                    { input: $('#start_date'), errorMsg: "노출시작을 선택하세요" },
                    { input: $('#end_date'), errorMsg: "노출종료를 선택하세요" }
                ];
                input_return = true;
            }
            // 유효성 검사
            inputs.forEach(({ input, errorMsg }) => {
                if (input.val().length < 1) {
                    showError(input, errorMsg);
                    input_return = false;
                } else {
                    hideError(input);
                }
            });
            // 이미지 유효성 검사
            if ($("#img").val().length < 1) {
                if(imgName == null){
                    showError($("#img"), "이미지를 첨부하세요");
                    input_return = false;
                }
            } else {
                hideError($("#img"));
            }
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
        $('#title, #img').on('blur', function() {
            check();
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

let imgName = null;
let popupJSON = [];

// 라디오버튼에 따른 상태 변화
function check_popup() {
    const checkStatus = $("input[name='popup_select']:checked");
    const isMainCheck = checkStatus.hasClass("main_check");

    // 공통 처리
    $("input").not("#popupNo").val("");
    $("#popupNo").val(0);
    $("#exposure_off").prop('checked', true);
    $(".regi_btn").text("등록");
    $(".main_photo").attr('src', '/images/dummy2.png');

    // 조건별 처리
    if (isMainCheck) {
        togglePopupElements(false);
        updatePopupSettings("mainImg", "최대 10개까지 노출이 가능하며, 해상도 1920픽셀 x 1080픽셀 이상의 가로 방향 이미지를 권장합니다.", "mainimg_preview");
    } else {
        togglePopupElements(true);
        updatePopupSettings("popup", "최대 3개까지 노출이 가능하며, 정사각형 비율의 슬라이드 형식으로 표시됩니다.", "popup_preview");
    }
}

// 조건에 따라 표시할 요소들을 제어하는 함수
function togglePopupElements(isPopup) {
    $(".popup_regi_input").toggle(isPopup);
    $(".mainimg_regi_input").toggle(!isPopup);
    $(".popup_preview_btn").toggle(isPopup);
}

// 조건에 따라 설정을 업데이트하는 함수
function updatePopupSettings(type, referenceText, previewClass) {
    $(".reference > li").text(referenceText);
    $("#preview_img").attr('class', previewClass);
    getPopupList(type);
}

function popupRegi(){
    let no = $("#popupNo").val();
    let title = $("#title").val();
    let type = document.querySelector('input[name="popup_select"]:checked').id == 'main_check' ? 'mainImg' : 'popup';
    let exposure = document.querySelector('input[name="exposure"]:checked').id == 'exposure_on' ? 1 : 0;
    if(imgName == null){
        let formData = new FormData();
        formData.append("file", $("#img")[0].files[0]);
        imgName = uploadFile("popupFile", formData)[0];
    }
    let startDate = $("#start_date").val();
    let endDate = $("#end_date").val();
    let popupLink = $("#popup_link").val();
    let bigTitleTop = $("#mainimg_imgtitle1").val();
    let bigTitleBottom = $("#mainimg_imgtitle2").val();
    let subTitle = $("#mainimg_imgsub").val();

    let param = {
        "no" : no,
        "title" : title,
        "exposure" : exposure,
        "img" : imgName,
        "startDate" : startDate,
        "endDate" : endDate,
        "popupLink" : popupLink,
        "type" : type,
        "bigTitleTop" : bigTitleTop,
        "bigTitleBottom" : bigTitleBottom,
        "subTitle" : subTitle
    }

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/popup";
    option.TYPE = no == 0 ? "POST" : "PUT";
    option.HEADERS = getCsrfHeader();
    option.PARAM = JSON.stringify(param);
    option.CALLBACK = function(res) {
        if(res.code === 1){
            if(type === 'mainImg'){
                if(no == 0){
                    alert_modal("modal_ok", "등록 완료", "메인이미지 등록이 완료되었습니다.<br>등록하신 이미지는 메인페이지에서 확인 가능합니다.");
                    getPopupList(type);
                    check_popup();
                }
                else{
                    alert_modal("modal_ok", "수정 완료", "메인이미지 수정이 완료되었습니다.<br>수정하신 이미지는 메인페이지에서 확인 가능합니다.");
                    getPopupList(type);
                    check_popup();
                }

            }
            else{
                if(no == 0){
                    alert_modal("modal_ok", "등록 완료", "팝업 등록이 완료되었습니다.<br>등록하신 팝업은 메인페이지에서 확인 가능합니다.");
                    getPopupList(type);
                    check_popup();
                }
                else{
                    alert_modal("modal_ok", "수정 완료", "팝업 수정이 완료되었습니다.<br>등록하신 수정은 메인페이지에서 확인 가능합니다.");
                    getPopupList(type);
                    check_popup();
                }

            }
        }
        else{
            alert_modal("modal_error","등록 실패",res.message,function(){
                window.location.replace("/");
            });
        }
    }
    ajaxWrapper.callAjax(option);
}

function getPopupList(type) {

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/popup?type=" + type;
    option.TYPE = "GET";
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(res) {
        if(res.code === 1){
            popupJSON = res.data

            let main_img_html = ``;

            main_img_html += `<li>`;
            main_img_html += `  <a href="javacsript:void(0);" id="0" title="추가하기" class="${type}_add list_act" onclick="selectList(this.id)">`;
            if(type === 'mainImg'){
                main_img_html += `      <p class="list_title">메인이미지 등록</p>`;
            }
            else {
                main_img_html += `      <p class="list_title">팝업 등록</p>`;
            }
            main_img_html += `      <button type="button" class="${type}_add_btn">추가</button>`;
            main_img_html += `  </a>`;
            main_img_html += `</li>`;
            for (let list of popupJSON) {
                main_img_html += `<li>`;
                main_img_html += `    <a href="javacsript:void(0);" id="${list.no}" title="수정하기" class="${type}_modify" onclick="selectList(this.id)">`;
                main_img_html += `        <p class="list_title">${list.title}</p>`;
                main_img_html += `        <div class="list_status_box">`;
                if(list.exposure != 0){
                    main_img_html += `            <span class="list_status list_on">&nbsp;</span>`;
                }
                else{
                    main_img_html += `            <span class="list_status">&nbsp;</span>`;
                }
                main_img_html += `            <button type="button" class="${type}_modify_btn">수정</button>`;
                main_img_html += `        </div>`;
                main_img_html += `    </a>`;
                main_img_html += `</li>`;
            }
            $(".mainimg_list").empty().append(main_img_html);
        }
        else{
            alert_modal("modal_error","접근 불가",res.message,function(){
                window.location.replace("/");
            });
        }
    }
    ajaxWrapper.callAjax(option);
}

function selectList(lineNo){
    const type = $(`#${lineNo}`).attr('class').split('_')[0];
    const list = popupJSON.find(x => x.no == lineNo);

    // 모든 `a` 태그에서 `list_act` 클래스 제거
    $(".mainimg_list li a").removeClass("list_act");

    // 클릭한 `a` 태그에만 `list_act` 클래스 추가
    $(`#${lineNo}`).addClass("list_act");

    if(type == 'mainImg'){
        if(lineNo == 0){
            $("#popupNo").val(0);
            $("input").not("#popupNo").val("");
            $("#exposure_off").prop('checked', true);
            $(".regi_btn").text("등록");
            $(".main_photo").attr('src', '/images/dummy2.png');
            imgName = null;
        }
        else{
            $("#popupNo").val(lineNo);
            $("#title").val(list.title);
            list.exposure == 1 ? $("#exposure_on").prop('checked', true) : $("#exposure_off").prop('checked', true);
            $(".main_photo").attr("src", list.popupImg);
            $("#mainimg_imgtitle1").val(list.bigTitleTop);
            $("#mainimg_imgtitle2").val(list.bigTitleBottom);
            $("#mainimg_imgsub").val(list.subTitle);
            $(".regi_btn").text("수정");
            imgName = list.popupImg;
        }
    }
    else{
        if(lineNo == 0){
            $("#popupNo").val(0);
            $("input").not("#popupNo").val("");
            $("#exposure_off").prop('checked', true);
            $(".regi_btn").text("등록");
            $(".main_photo").attr('src', '/images/dummy2.png');
            imgName = null;
        }
        else{
            $("#popupNo").val(lineNo);
            $("#title").val(list.title);
            list.exposure == 1 ? $("#exposure_on").prop('checked', true) : $("#exposure_off").prop('checked', true);
            $(".main_photo").attr("src", list.popupImg);
            $("#start_date").val(list.startDate);
            $("#end_date").val(list.endDate);
            $("#popup_link").val(list.popupLink);
            $(".regi_btn").text("수정");
            imgName = list.popupImg;
        }
    }
}

