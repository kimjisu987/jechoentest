$(document).ready(function(){
	// ----------------------------------------------
	// 문의 등록 js
	$(".qna_submit_btn").click(function(e) {
		e.preventDefault(); // 기본 제출 방지  
		if (registration_check()) {
			saveQna();
		} else {
			// 유효성 검사 실패 시 경고 메시지 표시
			$('html, body').animate({scrollTop: 0}, 300);
			alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '카테고리, 제목, 내용은 필수 입력사항입니다.');
		}

		function registration_check() {
			let inputs = [
				{ input: $('#title'), errorMsg: "제목을 입력하세요" }
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
			// 카테고리 유효성 검사
			// textarea 유효성 검사
			if ($("#category_no").val().length == 0) {
				cate_showError($("#category_no"), "카테고리를 선택하세요");
				input_return = false;
			} else {
				hideError($("#category_no"));
			}
			// textarea 유효성 검사
			if ($("#content").val().length == 0) {
				showError($("#content"), "내용을 입력하세요");
				input_return = false;
			} else {
				hideError($("#content"));
			}
			return input_return;
		}

		// 공통 오류 메시지 표시
		function showError(input, msg) {
			let error_msg = input.siblings(".form_check_box").find(".check_error");
			error_msg.text(msg).show();
		}
		// 카테고리 오류 메세지 표시
		function cate_showError(input, msg) {
			let error_msg = input.closest('.input_fields').find(".check_error");
			error_msg.text(msg).show();
		}
		// 오류 메시지 숨기기
		function hideError(input) {
			input.siblings(".form_check_box").find(".check_error").hide();
		}

		// 포커스 해제 시 유효성 검사
		$('#title, #content').on('blur', function() {
			registration_check();
		});
		// 셀렉트 클릭시 에러메세지 삭제
		$('#category_no').on('click', function() {
			$(this).closest('.input_fields').find(".check_error").text("");
		});
	});
});

function saveQna() {
	$(".qna_submit_btn").attr("disabled", true);

	let param = {
		"category": $("#category_no").val(),
		"title": $("#title").val(),
		"content": $("#content").val()
	}

	let option = deepExtend({}, ajaxOptions);
	option.URL = "/api/v1/qna";
	option.TYPE = "POST";
	option.HEADERS = getCsrfHeader();
	option.PARAM = JSON.stringify(param);
	option.CALLBACK = function(response) {
		$('html, body').animate({scrollTop: 0}, 300);
		if (response.code === 1) {
			alert_modal('modal_ok', '문의 저장 성공', '');
			$(".modal_ok .modal_btn").attr("onclick", `location.replace('/qna/detail?no=${response.data}')`);
		} else {
			alert_modal('modal_error', '문의 저장 실패', '');
			$(".qna_submit_btn").attr("disabled", false);
		}
	}
	ajaxWrapper.callAjax(option);
}