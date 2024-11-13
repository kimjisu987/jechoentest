$(document).ready(function(){
    const urlParams = new URLSearchParams(window.location.search);
    const activistNo = urlParams.get('no');
    getApplyDetail(activistNo);

    function formatTelNumber(tel) {
        let val = tel.replace(/[^0-9]/g, ''); // 숫자만 남김
        if (val.length > 3) {
            let prefix = val.substring(0, 3);
            let firstPart = val.substring(3, 7);
            let secondPart = val.substring(7, 11);

            if (val.length < 7) {
                return prefix + '-' + firstPart;
            } else {
                return prefix + '-' + firstPart + (secondPart ? '-' + secondPart : '');
            }
        }
        return val;
    }

    let tel = $("#tel").val();
    $("#tel").val(formatTelNumber(tel));

    $("#tel").keyup(function() {
        $(this).val(formatTelNumber($(this).val()));
    });

	// 전체 유효성검사
    $(".submit_btn").click(function(e) {
        e.preventDefault(); // 기본 제출 방지  

        let agree = $("#agree").is(':checked'); // 체크박스 확인
        if (!agree) {
            alert_modal('modal_error', '유의사항 동의', '유의사항을 확인하시고, 동의에 체크해야 합니다.');
            return false;
        }

        if (talentApply_check()) {
            applyActivity();
            alert_modal("modal_ok", "수강신청 완료", "수강신청이 완료되었습니다. 재능활동가 페이지로 이동합니다.",function() {
                window.location.replace("/talent");
            });
        } else {
            $("#tel").focus();
            alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '휴대폰번호, 이메일 주소는 필수 입력 사항입니다.');
        }

        function talentApply_check() {
            let inputs = [
                { input: $('#tel'), pattern: /^\d{3}-\d{4}-\d{4}$/, errorMsg: "휴대폰번호를 올바르게 입력하세요" },
                { input: $('#email'), pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, errorMsg: "이메일 주소를 올바르게 입력하세요" }
            ];
            let input_return = true;
            
            // 유효성 검사
            inputs.forEach(({ input, pattern, errorMsg }) => {
                if (input.val().length < 1) {
                    showError(input, errorMsg);
                    input_return = false;
                } else if (pattern && !pattern.test(input.val())) {
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
        $('#tel, #email').on('blur', function() {
            talentApply_check();
        });
    });
});

function getApplyDetail(no){

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/apply/detail/"+ no;
    option.TYPE = "GET";
    option.ASYNC = false;
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(res) {
        detailJSON = res.data[0];
        let price = detailJSON.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        $("#mobileTag").html(detailJSON.activityField);
        $("#profileImg").attr("src",detailJSON.profile);


        let html = ``;
        html += `<li class="activity_title">`;
        html += `  <p class="talent_title">${detailJSON.title}</p>`;
        html += `  <p class="talent_name">${detailJSON.name}</p>`;
        html += `</li>`;
        html += `<li class="activity_field"><p class="item_hash">${detailJSON.activityField}</p></li>`;
        html += `<li class="activity_yoil">${detailJSON.days}</li>`;
        html += `<li class="activity_date">${detailJSON.startDate} ~ ${detailJSON.endDate}</li>`;
        html += `<li class="activity_price">${price}원</li>`;
        $(".activity_info").empty().append(html);
    }
    ajaxWrapper.callAjax(option);
}

function backToDetail(){
    const urlParams = new URLSearchParams(window.location.search);
    const no = urlParams.get('no');
    location.replace(`/talent/detail?no=${no}`);
}

function applyActivity(){
    const userNo = $("#userNo").val();
    const tel = $("#tel").val().replace(/-/g,"");
    const email = $("#email").val();
    const urlParams = new URLSearchParams(window.location.search);
    const no = urlParams.get('no');

    let param = {
        "activistNo" : no,
        "userNo" : userNo,
        "tel" : tel,
        "email" : email
    }

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/talent/apply"
    option.TYPE = "POST";
    option.PARAM = JSON.stringify(param);
    option.ASYNC = true;
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(res) {
        console.log(res);
    }
    ajaxWrapper.callAjax(option);
}