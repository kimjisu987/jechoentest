$(document).ready(function(){
	// -------------------------------------------------------------------------------------
	// 활동기간 - endtime 오류
	$(".start_time, .end_time").on("change", function() {
		const start_time = $(".start_time").val();
		const end_time = $(".end_time").val();

		if (start_time && end_time) {
			if (end_time <= start_time) {
				alert_modal("modal_error", "활동기간 시간 오류", "종료일은 시작일 이후로 입력해주세요.");
				$(".end_time").val("");
			}
		}
	});
    // -------------------------------------------------------------------------------------
	// 전체 유효성검사
	$(".submit_btn").click(function(e) {
		e.preventDefault(); // 기본 제출 방지  
		if (action_check()) {
			alert_modal("modal_ok", "활동 소식 등록 완료", "활동 소식 등록이 완료되었습니다. 등록하신 활동 소식의 상세페이지로 이동합니다.");
		} else {
			// 유효성 검사 실패 시 경고 메시지 표시
            // $("#start_time").focus();
			$('html, body').animate({scrollTop: 0}, 300);
			alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '활동기간, 활동내용, 공개여부는 필수 입력 사항입니다.');
		}

		function action_check() {
			let inputs = [
				{ input: $('#start_time'), errorMsg: "활동기간 시작일을 선택하세요" },
				{ input: $('#end_time'), errorMsg: "활동기간 종료일을 선택하세요" },
				{ input: $('#description'), errorMsg: "활동내용을 입력하세요" },
				{ input: $('#status'), errorMsg: "공개 여부를 선택하세요" }
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
			// 대표사진등록 유효성 검사
			if ($("#profile").val().length < 1) {
				fileshowError($("#profile"), "대표사진을 등록하세요");
				input_return = false;
			} else {
				filehideError($("#profile"));
			}
			return input_return;
		}

		// 공통 오류 메시지 표시
		function showError(input, msg) {
			let error_msg = input.parents(".input_fields").find(".check_error");
			error_msg.text(msg).show();
		}
		// 대표사진등록 오류 메시지 표시
		function fileshowError(input, msg) {
			let error_msg = input.parents(".main_photo").find(".check_error");
			error_msg.text(msg).show();
		}
		// 오류 메시지 숨기기
		function hideError(input) {
			input.parents(".input_fields").find(".check_error").hide();
		}
		// 대표사진등록 오류 메시지 숨기기
		function filehideError(input, msg) {
			input.parents(".main_photo").find(".check_error").hide();
		}

		// 포커스 해제 시 유효성 검사
		$('#start_time, #end_time, #description, #status').on('blur', function() {
			action_check();
		});
		// 대표사진등록 에러메세지 삭제
		$('#profile').on('click', function() {
			$(this).parents(".main_photo").find(".check_error").text("");
		});
	});
});