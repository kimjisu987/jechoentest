$(document).ready(function(){
	// ----------------------------------------------
	// 초기 세팅
	let i = 0;  // 섹션 인덱스 저장
	const section = $(".section_inner"); 
	const step_num = $(".join_step > li > .step_number");
	const step_check = $(".join_step > li > .step_check");

	section.hide().eq(i).show();  // 모든 섹션 숨기고, 현재 섹션 표시
	step_update();

	function step_update() {
		step_num.removeClass("step_on").hide();  // 모든 step_number 숨기고 클래스 제거
		step_check.hide();  // 모든 step_check 숨기기

		for (let j = 0; j < step_num.length; j++) {
			if (j < i) {
				// 이전 단계
				step_check.eq(j).show();  // 체크 표시 보이기
				step_num.eq(j).hide();  // 번호 숨기기
			} else if (j == i) {
				// 현재 단계
				step_num.eq(j).addClass("step_on").show();  // 현재 번호 보이기 + 클래스 추가
				step_check.eq(j).hide();  // 체크 표시 숨기기
			} else {
				// 이후 단계
				step_num.eq(j).show();  // 이후 번호 보이기
				step_check.eq(j).hide();  // 체크 표시 숨기기
			}
		}
	}

	// ----------------------------------------------
	// 1단계 - 약관 더보기
	$(".agree_box > a").click(function(e){
		e.preventDefault();
		$(this).parent().next().slideToggle();
		$(this).toggleClass("terms_act");
	});

	// 1단계 - 체크박스 전체체크, 전체해제 등 서식
	const $all_agree = $("#all_agree");
	const $one_agree = $(".one_agree");
	// 전체 체크박스 상태 업데이트
	function all_checked() {
		$all_agree.prop("checked", $one_agree.length == $one_agree.filter(":checked").length);
	}
	// 전체 체크박스 클릭 이벤트
	$all_agree.on("change", function() {
		$one_agree.prop("checked", $all_agree.is(":checked"));
	});
	// 개별 체크박스 클릭 이벤트
	$one_agree.on("change", all_checked);
	
	// 1단계 - 체크 유효성검사 후 다음단계
	$(".step1_btn").click(function(){
		let check1Checked = document.querySelector('#terms_agree').checked;
		let check2Checked = document.querySelector('#personal_agree').checked;  
		if (!check1Checked || !check2Checked) {
			alert_modal('modal_error', '약관 동의', '이용약관 동의, 개인정보 수집 및 이용동의에 체크해야 합니다.');
			return false;
		} else {
			if (i < section.length - 1) { // next 버튼
				i++;  // 1씩 증가
			} else if (i > 0) { // prev 버튼
				i--;  // 1씩 감소
			}
			section.hide().eq(i).fadeIn();  // 현재 섹션 표시
			step_update();  // 스텝 업데이트
			$('html, body').animate({scrollTop: 0}, 300);
		};
	});

	// ----------------------------------------------
	// 2단계 - 본인 인증
	// 사업자 인증 클릭시 사업자 인증 완료 적용 및 본인 인증 활성화
	$(".step2_btn1").click(function(){
		$(this).addClass("verifi_ok");
		$(".step2_btn2").attr("disabled", false);
		$('html, body').animate({
			// scrollTop: $("#secon_inner2").offset().top + 121
		}, 500); // 500ms 동안 부드럽게 스크롤
	});
	// 본인 인증 클릭시
	$(".step2_btn2").click(function(){
		if (i < section.length - 1) { // next 버튼
			i++;  // 1씩 증가
		} else if (i > 0) { // prev 버튼
			i--;  // 1씩 감소
		}
		section.hide().eq(i).fadeIn();  // 현재 섹션 표시
		step_update();  // 스텝 업데이트
		$('html, body').animate({scrollTop: 0}, 300);
		$("#user_id").focus();
	});
	
	// ----------------------------------------------
	// 3단계 - 다음API - 주소
	function execDaumPostcode() {
		new daum.Postcode({
			oncomplete: function(data) {
				// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
				
				// 각 주소의 노출 규칙에 따라 주소를 조합한다.
				// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
				var addr = ''; // 주소 변수
				var extraAddr = ''; // 참고항목 변수
				
				//사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
				if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
					addr = data.roadAddress;
				} else { // 사용자가 지번 주소를 선택했을 경우(J)
					addr = data.jibunAddress;
				}

				// 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
				if(data.userSelectedType === 'R'){
					// 법정동명이 있을 경우 추가한다. (법정리는 제외)
					// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
					if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
						extraAddr += data.bname;
					}
					// 건물명이 있고, 공동주택일 경우 추가한다.
					if(data.buildingName !== '' && data.apartment === 'Y'){
						extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
					}
					// 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
					if(extraAddr !== ''){
						extraAddr = ' (' + extraAddr + ')';
					}
					// 조합된 참고항목을 해당 필드에 넣는다.
					document.getElementById("extraAddress").value = extraAddr;            
				} else {
					document.getElementById("extraAddress").value = '';
				}

				// 우편번호와 주소 정보를 해당 필드에 넣는다.
				document.getElementById('postcode').value = data.zonecode;
				document.getElementById("address").value = addr;
				// 커서를 상세주소 필드로 이동한다.
				document.getElementById("detailAddress").focus();
			}
		}).open();
	}
	$(".address_search, #postcode, #address, #extraAddress").click(function(){
		execDaumPostcode();
	});
	// 3단계 - 연락처, 팩스번호 하이픈(-) 추가
	$("#tel, #organ_tel, #fax").keyup(function() {
		let val = $(this).val().replace(/[^0-9]/g, ''); // 숫자만 남김
		let format_n = '';	
		try {
			if (val.length == 11) {
				format_n = val.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'); // 010-XXXX-XXXX
			} else if (val.length == 8) {
				format_n = val.replace(/(\d{4})(\d{4})/, '$1-$2'); // XXXX-XXXX
			} else {
				if (val.indexOf('02') == 0) {
					format_n = val.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3'); // 02-XXXX-XXXX
				} else {
					format_n = val.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // XXX-XXX-XXXX
				}
			}
		} catch (e) {
			format_n = val; // 예외 발생 시 원래 값
		}	
		$(this).val(format_n); // 포맷된 값을 입력 필드에 설정
	});
	// 3단계 - 사업자등록번호 하이픈(-) 추가
	$("#license_no").keyup(function() {
		let val = $(this).val().replace(/[^0-9]/g, ''); // 숫자만 남김
		let format_n = '';
		try {
			if (val.length <= 10) {
				format_n = val.replace(/(\d{3})(\d{0,2})(\d{0,5})/, function(match, p1, p2, p3) {
					return p2 ? p1 + '-' + p2 + (p3 ? '-' + p3 : '') : p1;
				}); // 3자리-2자리-5자리 포맷
			} else {
				format_n = val.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3'); // 3-2-5 포맷
			}
		} catch (e) {
			format_n = val; // 예외 발생 시 원래 값
		}
		$(this).val(format_n); // 포맷된 값을 입력 필드에 설정
	});
	// 3단계 - 생년월일 하이픈(-) 추가
	$("#birth").keyup(function() {
		let val = $(this).val().replace(/[^0-9]/g, ''); // 숫자만 남김
		if (val.length > 4) {
			// YYYY/MM/DD 형태로 변환
			let year = val.substring(0, 4); // 4자리 연도
			let month = val.substring(4, 6); // 2자리 월
			let day = val.substring(6, 8); // 2자리 일
			
			if (val.length < 6) {
				$(this).val(year + '-' + month);
			} else {
				$(this).val(year + '-' + month + (day ? '-' + day : ''));
			}
		} else {
			$(this).val(val); // 4자리 이하일 경우 그대로 표시
		}
	});
	// 3단계 - submit
	$(".step3_btn").click(function(e) {
		e.preventDefault(); // 기본 제출 방지  
		if (joinUser_check()) {
			// ★ 나중에 주석 수정
			// $(this).closest("form").submit(); // 유효성 검사 후 폼제출
			if (i < section.length - 1) { // next 버튼
				i++;  // 1씩 증가
			} else if (i > 0) { // prev 버튼
				i--;  // 1씩 감소
			}
			section.hide().eq(i).fadeIn();  // 현재 섹션 표시
			step_update();  // 스텝 업데이트      
			$('html, body').animate({scrollTop: 0}, 300);
		} else {
			// 유효성 검사 실패 시 경고 메시지 표시
			$('html, body').animate({scrollTop: 0}, 300);
			alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '형식이 올바르지 않거나, 작성하지 않은 내용을 확인해주세요.');
		}

		function joinUser_check() {
			let inputs = [
				{ input: $('#user_id'), pattern: /^[a-zA-Z0-9]{6,20}$/, errorMsg: "올바르지 않은 형식" },
				{ input: $('#password'), pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/, errorMsg: "올바르지 않은 형식" },
				{ input: $('#password_re'), pass1: $('#password'), errorMsg: "동일하지 않은 비밀번호" },
				{ input: $('#name'), pattern: /^[가-힣a-zA-Z]{1,20}$/, errorMsg: "한글 또는 영문만 입력" },
				{ input: $('#birth'), pattern: /^\d{4}-\d{2}-\d{2}$/, errorMsg: "숫자만 입력" },
				{ input: $('#tel'), pattern: /^\d{3}-\d{4}-\d{4}$/, errorMsg: "숫자만 입력" },
				{ input: $('#email'), pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, errorMsg: "올바르지 않은 형식" },
				{ input: $('#license_name'), errorMsg: "사업자명 입력" },
				{ input: $('#license_no'), pattern: /^\d{3}-\d{2}-\d{5}$/, errorMsg: "숫자만 입력" },
				{ input: $('#ceo_name'), pattern: /^[가-힣a-zA-Z]{1,20}$/, errorMsg: "한글 또는 영문만 입력" },
				{ input: $('#organ_tel'), pattern: /^[0-9-]*$/, errorMsg: "숫자만 입력" },
				{ input: $('#postcode'), errorMsg: "주소 검색을 통해 입력" },
				{ input: $('#main_item'), errorMsg: "주요 아이템 입력" }
			];
			let input_return = true;
			
			// 유효성 검사
			inputs.forEach(({ input, pattern, pass1, errorMsg }) => {
				if (input.val().length < 1) {
					showError(input, errorMsg);
					input_return = false;
				} else if (pattern && !pattern.test(input.val())) {
					showError(input, errorMsg);
					input_return = false;
				} else if (pass1 && input.val() !== pass1.val()) {
					showError(input, errorMsg);
					input_return = false;
				} else {
					hideError(input);
				}
			});		
			// textarea 유효성 검사
			if ($("#description").val().length == 0) {
				showError($("#description"), "기관/단체 설명 입력");
				input_return = false;
			} else {
				hideError($("#description"));
			}		
			// 첨부파일 유효성 검사
			let fileInputs = $('.addfile'); // 모든 파일 입력 요소 선택
			let fileError = false;		
			fileInputs.each(function() {
				if (this.files.length == 0) {
					file_showError($(this), "파일 첨부 필수");
					fileError = true;
				} else {
					hideError($(this));
				}
			});		
			if (fileError) {
				input_return = false;
			}		
			return input_return;
		}

		// 공통 오류 메시지 표시
		function showError(input, msg) {
			let error_msg = input.siblings(".form_check_box").find(".check_error");
			error_msg.text(msg).show();
		}
		// 첨부파일 오류 메세지 표시
		function file_showError(input, msg) {
			let error_msg = input.parent().siblings(".form_check_box").find(".check_error");
			error_msg.text(msg).show();
		}

		// 오류 메시지 숨기기
		function hideError(input) {
			input.siblings(".form_check_box").find(".check_error").hide();
		}

		// 포커스 해제 시 유효성 검사
		$('#user_id, #password, #password_re, #name, #birth, #tel, #email, #license_name, #license_no, #ceo_name, #organ_tel, #main_item, #description').on('blur', function() {
			joinUser_check();
		});
		// 파일첨부 클릭시 에러메세지 삭제
		$('.addfile, .address_search, #postcode, #address, #extraAddress').on('click', function() {
			$(this).parent().siblings(".form_check_box").find(".check_error").text("");
		});
		// 주소 클릭시 에러메세지 삭제
		$('.address_search, #postcode, #address, #extraAddress').on('click', function() {
			$(this).siblings(".form_check_box").find(".check_error").text("");
		});
	});
	// 첨부파일 추가
	$(".file_add").click(function(){
		let fileHtml = ``;
		fileHtml += `<div class="input_file_add">`
		fileHtml += `    <input type="file" name="addfile" class="addfile" maxlength="13">`
		fileHtml += `    <button type="button" class="file_del">삭제</button>`
		fileHtml += `</div>`
		const fileAdd = $(fileHtml);
		$(".input_file_box").append(fileAdd);
		$(".addfile").focus();
	});

	// 첨부파일 삭제
	$(".input_file_box").on("click", ".file_del", function(){
		$(this).parent(".input_file_add").remove();
	});
});