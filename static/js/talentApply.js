$(document).ready(function(){
	// 연락처 하이픈(-) 추가
	$("#tel").keyup(function() {
		let val = $(this).val().replace(/[^0-9]/g, ''); // 숫자만 남김
		if (val.length > 3) {
			// 010-XXXX-XXXX 형태로 변환
			let prefix = val.substring(0, 3); // 010
			let firstPart = val.substring(3, 7); // 4자리
			let secondPart = val.substring(7, 11); // 4자리
			
			if (val.length < 7) {
				$(this).val(prefix + '-' + firstPart);
			} else {
				$(this).val(prefix + '-' + firstPart + (secondPart ? '-' + secondPart : ''));
			}
		} else {
			$(this).val(val); // 3자리 이하일 경우 그대로 표시
		}
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
            alert_modal("modal_ok", "수강신청 완료", "수강신청이 완료되었습니다. 마이페이지로 이동합니다.");
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