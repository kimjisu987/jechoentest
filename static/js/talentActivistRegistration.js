$(document).ready(function(){
    // 재능활동가 등록 js
	// -------------------------------------------------------------------------------------
	// 섹션 별 닫기 토글
	// $(".talent_activities, .career_add_box, .valid_add_box").hide();
	$(".sub_title").click(function(){
		$(this).next().slideToggle();
	});
	// -------------------------------------------------------------------------------------
	// 재능활동가 권한자 찾기 모달
	function toggleSearchResult() {
		if ($("#title_search").val().length == 0) {
			$(".search_result").hide();
		} else {
			$(".search_result").show();
		}
	}
	toggleSearchResult();
	$("#title_search").on("change", toggleSearchResult);

	// 찾기 클릭시 모달 오픈
	$(".title_search, .activist_search").click(function() {
		$(".authority_modal").fadeIn();
		$("body").css("overflow", "hidden");
	});

	// 권한자 등록 버튼
	$(".member_result").click(function() {
		const member_result = $(this).closest("li").text().trim();
		const member_del_btn = `<button class="member_del"></button>`;
		
		// 등록된 권한자 추가
		$(".add_member").find("p").text(member_result).addClass("add_member_result");
		$(".add_member").find("div").append(member_del_btn);

		// 등록 버튼 비활성화
		$(".member_list").find("input").addClass("member_disabled").attr("disabled", true);
	});

	// 삭제 버튼 클릭 시 동작
	$(".add_member").on("click", ".member_del", function() {
		$(".add_member").find("p").text("권한자를 등록해주세요.").removeClass("add_member_result");
		$(this).remove();
		$(".member_list").find("input").removeClass("member_disabled").attr("disabled", false);
		$("#title_search").removeClass("search_compl");
	});
	// 모달 완료, 닫기 버튼
	$(".authority_result, .modal_close").click(function() {
		if ($(".add_member").find("p").hasClass("add_member_result") == true) {
			$(".authority_modal").fadeOut();
			$("body").css("overflow", "auto");
			$(".search_result").css("display","flex");
			// $("#title_search").val($(".add_member_result").text());
			setTimeout(function() {
				$("#title_search").val($(".add_member_result").text()).addClass("search_compl");
			}, 0);
		} else {
			alert_modal("modal_confirm", "재능활동가 권한자 미등록", "재능활동가 권한자를 등록하지 않으셨습니다. 이대로 완료하시겠습니까?");
			// 모달이 열린 후 버튼 클릭 이벤트를 설정
			$(document).off('click', '.modal_btn').on('click', '.modal_btn', function() {
				if ($(this).index() === 0) {
					$(".search_result").hide();
				} else {
					// 확인 버튼 클릭
					$(".authority_modal").fadeOut();
					$("body").css("overflow", "auto");
					$(".search_result").css("display","flex");
					$(".search_result").hide();
					setTimeout(function() {
						$("#title_search").val($(".add_member_result").text());
					}, 0);
				}
			});
			$(".search_result").hide();
		}
	});
	// -------------------------------------------------------------------------------------
	// 수강 요금 천단위 표시
	$("#price").keyup(function() {
		let val = $(this).val().replace(/[^0-9]/g, ""); // 숫자만 남김	
		// 콤마 추가 함수
		function add_comma(num) {
			return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}	
		if (val.length > 0) {
			// 콤마를 추가한 값을 설정
			$(this).val(add_comma(val));
		} else {
			$(this).val(""); // 빈 값일 경우
		}
	});
	// -------------------------------------------------------------------------------------
	// 신청분야 직접 입력
	$("#activity_field").on("change", function() {
		if ($(this).val() == "기타") {
			$(".activity_field_text").attr("disabled", false);
			$(".activity_field_text").focus();
		} else {
			$(".activity_field_text").attr("disabled", true).val("");
		}
	});
	// -------------------------------------------------------------------------------------
	// 활동시작일, 종료일
	$(".start_date, .end_date").on("change", function() {
		const start_date = $(".start_date").val();
		const end_date = $(".end_date").val();

		if (start_date && end_date) {
			if (end_date <= start_date) {
				alert_modal("modal_error", "활동일 오류", "종료일은 시작일 이후로 입력해주세요.");
				$(".end_date").val("");
			}
		}
	});
	// -------------------------------------------------------------------------------------
	// 활동요일 추가
	const $yoil_box = $(".input_day_box");
	let yoilCount = 1; // 박스 카운터 초기화

	// 초기 박스 추가
	function add_yoil_box() {
		const yoil_html = `
			<div class="input_day_add">
				<div class="select_con_default">
					<select name="activity_field" class="date_yoil" id="date_yoil${yoilCount}">
						<option value="">요일 선택</option>
						<option value="월">월</option>
						<option value="화">화</option>
						<option value="수">수</option>
						<option value="목">목</option>
						<option value="금">금</option>
						<option value="토">토</option>
						<option value="일">일</option>
					</select>
				</div>
				<input type="time" name="start_time" class="start_time" id="start_time${yoilCount}">
				<p class="day_line">~</p>
				<input type="time" name="end_time" class="end_time" id="end_time${yoilCount}">
				<button type="button" class="day_result">등록</button>
			</div>
		`;
		$yoil_box.append(yoil_html);
		yoilCount++; // 카운터 증가
	}

	// 초기 박스 추가
	add_yoil_box();

	// 활동요일 등록버튼 클릭시
	$yoil_box.on("click", ".day_result", function() {
		const $yoil_box = $(this).closest('.input_day_add');
		const date_yoil = $yoil_box.find(".date_yoil").val();
		const start_time = $yoil_box.find(".start_time").val();
		const end_time = $yoil_box.find(".end_time").val();

		// 입력값 검사
		if (date_yoil.length == 0) {
			alert_modal("modal_error", "활동 요일 입력 확인", "요일을 선택해주세요.");
		} else if (start_time.length == 0) {
			alert_modal("modal_error", "활동 요일 입력 확인", "활동 시작 시간을 입력해주세요.");
		} else if (end_time.length == 0) {
			alert_modal("modal_error", "활동 요일 입력 확인", "활동 종료 시간을 입력해주세요.");
		} else {            
			yoil_result($yoil_box);
		}
	});

	function yoil_result($yoil_box) {
		$yoil_box.find(".day_result").text("삭제").removeClass("day_result").addClass("day_del");
		$yoil_box.find(".date_yoil").attr("disabled", true);
		$yoil_box.find(".start_time").attr("readonly", true);
		$yoil_box.find(".end_time").attr("readonly", true);

		// 새로운 박스 추가
		const count = $(".input_day_add").length;
		if (count < 7) {
			add_yoil_box();
			yoil_disabled(); // 옵션 disabled 상태 업데이트
		}
	}

	// 선택된 옵션이 변경될 때마다 disabled 처리
	$yoil_box.on("change", ".date_yoil", function() {
		yoil_disabled();
	});

	// 현재 선택된 모든 date_yoil 클래스를 가진 select 요소의 값을 배열로 다시 생성
	function yoil_disabled() {
		const select_values = $(".date_yoil").map(function() {
			return $(this).val();
		}).get();

		$(".date_yoil").each(function() {
			const $select = $(this);
			const select_value = $select.val();

			// 모든 date_yoil 셀렉트 요소 순회
			$select.find("option").each(function() {
				const $option = $(this);
				// 현재 옵션의 disabled 속성 설정
				$option.prop("disabled", select_values.includes($option.val()) && $option.val() !== select_value);
			});
		});
	}

	// 활동요일 삭제버튼 클릭시
	$yoil_box.on("click", ".day_del", function() {
		$(this).closest('.input_day_add').remove(); // 해당 박스 삭제
		yoil_disabled(); // 옵션 disabled 상태 업데이트
	});
	// -------------------------------------------------------------------------------------
	// 활동요일 - 활동시간
	$(".start_time, .end_time").on("change", function() {
		const start_time = $(".start_time").val();
		const end_time = $(".end_time").val();

		if (start_time && end_time) {
			if (end_time <= start_time) {
				alert_modal("modal_error", "활동 종료 시간 오류", "종료시간은 시작시간 이후로 입력해주세요.");
				$(".end_time").val("");
			}
		}
	});
	// -------------------------------------------------------------------------------------
	// 활동경력 추가
	const $career_box = $(".career_add_box");
	let careerCount = 1; // 박스 카운터 초기화

	function add_career_box() {
		const career_html = `
			<div class="career_box">
				<div class="career_inner">
					<div class="input_fields">
						<label for="career_field${careerCount}">활동 분야</label>
						<input type="text" name="career_field" class="career_field" id="career_field${careerCount}" placeholder="활동 분야 입력">
						<div class="form_check_box">
							<p class="check_error"></p>
						</div>
					</div>
					<div class="input_fields">
						<label for="career_content${careerCount}">활동 내용</label>
						<input type="text" name="career_content" class="career_content" id="career_content${careerCount}" placeholder="활동 내용 입력">
						<div class="form_check_box">
							<p class="check_error"></p>
						</div>
					</div>
					<div class="input_fields">
						<label for="career_from${careerCount}">활동경력 시작일</label>
						<input type="date" name="career_from" class="career_from" id="career_from${careerCount}">
						<div class="form_check_box">
							<p class="check_error"></p>
						</div>
					</div>
					<div class="input_fields">
						<label for="career_to${careerCount}">활동경력 종료일</label>
						<input type="date" name="career_to" class="career_to" id="career_to${careerCount}">
						<div class="form_check_box">
							<p class="check_error"></p>
						</div>
					</div>
					<button type="button" class="career_result">등록</button>
				</div>
				<div class="alltime_box">
					<input type="checkbox" name="career_alltime" class="career_alltime" id="career_alltime${careerCount}">
					<label for="career_alltime${careerCount}">
						<img src="../../static/icon/icon_check.svg" alt="체크 아이콘">
					</label>
					<label for="career_alltime${careerCount}">활동 진행중</label>
				</div>
			</div>
		`;
		$career_box.append(career_html);
		careerCount++; // 카운터 증가

		// 활동경력사항 진행중 체크시 종료일 선택 불가
		$("input[name='career_alltime']").off("change").on("change", function() {
			if ($(this).is(":checked")) {
				$(this).closest(".alltime_box").siblings(".career_inner").find(".career_to").val("").attr("disabled", true);
			} else {
				$(this).closest(".alltime_box").siblings(".career_inner").find(".career_to").attr("disabled", false);
			}
		});
	}

	// 초기 박스 추가
	add_career_box();

	// 활동경력 등록버튼 클릭시
	$career_box.on("click", ".career_result", function() {
		const $career_box = $(this).closest('.career_box');
		const career_field = $career_box.find(".career_field").val();
		const career_content = $career_box.find(".career_content").val();
		const career_from = $career_box.find(".career_from").val();
		const career_to = $career_box.find(".career_to").val();

		// 입력값 검사
		if (career_field.length == 0) {
			alert_modal("modal_error", "활동 경력 사항 입력 확인", "활동 분야를 입력해주세요.");
		} else if (career_content.length == 0) {
			alert_modal("modal_error", "활동 경력 사항 입력 확인", "활동 내용을 입력해주세요.");
		} else if (career_from.length == 0) {
			alert_modal("modal_error", "활동 경력 사항 입력 확인", "활동 시작일을 입력해주세요.");
		} else {
			if ($career_box.find(".career_to").attr("disabled") == "disabled") {
				career_result($career_box);
			} else if (career_to.length == 0) {
				alert_modal("modal_error", "활동 경력 사항 입력 확인", "활동 종료일을 입력해주세요.");
			} else {
				career_result($career_box);
			}
		}
	});

	function career_result($career_box) {
		$career_box.find(".career_result").text("삭제").removeClass("career_result").addClass("career_del");
		$career_box.find(".career_field").attr("readonly", true);
		$career_box.find(".career_content").attr("readonly", true);
		$career_box.find(".career_from").attr("readonly", true);
		$career_box.find(".career_to").attr("readonly", true);
		$career_box.find(".career_alltime").attr("onclick", "return false;");
		add_career_box();
	}

	// 활동경력 삭제버튼 클릭시
	$career_box.on("click", ".career_del", function() {
		$(this).closest('.career_box').remove(); // 해당 박스 삭제
	});
	// -------------------------------------------------------------------------------------
	// 자격증 추가
	const $valid_box = $(".valid_add_box");
	let validCount = 1; // 박스 카운터 초기화

	function add_valid_box() {
		const valid_html = `
			<div class="valid_box">
				<div class="valid_inner">
					<div class="input_fields">
						<label for="valid_field${validCount}">자격증 분야</label>
						<input type="text" name="valid_field" class="valid_field" id="valid_field${validCount}" placeholder="자격증 분야 입력">
						<div class="form_check_box">
							<p class="check_error"></p>
						</div>
					</div>
					<div class="input_fields">
						<label for="valid_content${validCount}">자격증 내용</label>
						<input type="text" name="valid_content" class="valid_content" id="valid_content${validCount}"  placeholder="자격증 내용 입력">
						<div class="form_check_box">
							<p class="check_error"></p>
						</div>
					</div>
					<div class="input_fields">
						<label for="valid_from${validCount}">자격증 취득일</label>
						<input type="date" name="valid_from" class="valid_from" id="valid_from${validCount}">
						<div class="form_check_box">
							<p class="check_error"></p>
						</div>
					</div>
					<div class="input_fields">
						<label for="valid_to${validCount}">자격증 만료일</label>
						<input type="date" name="valid_to" class="valid_to" id="valid_to${validCount}">
						<div class="form_check_box">
							<p class="check_error"></p>
						</div>
					</div>
					<button type="button" class="valid_result">등록</button>
				</div>
				<div class="alltime_box">
					<input type="checkbox" name="valid_alltime" class="valid_alltime" id="valid_alltime${validCount}">
					<label for="valid_alltime${validCount}"><img src="../../static/icon/icon_check.svg" alt="체크 아이콘"></label>
					<label for="valid_alltime${validCount}">만료일 없음</label>
				</div>
			</div>
		`;

		$valid_box.append(valid_html);
		validCount++; // 카운터 증가

		// 자격증 진행중 체크시 종료일 선택 불가
		$("input[name='valid_alltime']").off("change").on("change", function() {
			if ($(this).is(":checked")) {
				$(this).closest(".alltime_box").siblings(".valid_inner").find(".valid_to").val("").attr("disabled", true);
			} else {
				$(this).closest(".alltime_box").siblings(".valid_inner").find(".valid_to").attr("disabled", false);
			}
		});
	}

	// 초기 박스 추가
	add_valid_box();

	// 자격증 등록버튼 클릭시
	$valid_box.on("click", ".valid_result", function() {
		const $valid_box = $(this).closest('.valid_box');
		const valid_field = $valid_box.find(".valid_field").val();
		const valid_content = $valid_box.find(".valid_content").val();
		const valid_from = $valid_box.find(".valid_from").val();
		const valid_to = $valid_box.find(".valid_to").val();

		// 입력값 검사
		if (valid_field.length == 0) {
			alert_modal("modal_error", "자격증 사항 입력 확인", "자격증 분야를 입력해주세요.");
		} else if (valid_content.length == 0) {
			alert_modal("modal_error", "자격증 사항 입력 확인", "자격증 내용을 입력해주세요.");
		} else if (valid_from.length == 0) {
			alert_modal("modal_error", "자격증 사항 입력 확인", "자격증 취득일을 입력해주세요.");
		} else {
			if ($valid_box.find(".valid_to").attr("disabled") == "disabled") {
				valid_result($valid_box);
			} else if (valid_to.length == 0) {
				alert_modal("modal_error", "자격증 사항 입력 확인", "자격증 만료일을 입력해주세요.");
			} else {
				valid_result($valid_box);
			}
		}
	});

	function valid_result($valid_box) {
		$valid_box.find(".valid_result").text("삭제").removeClass("valid_result").addClass("valid_del");
		$valid_box.find(".valid_field").attr("readonly", true);
		$valid_box.find(".valid_content").attr("readonly", true);
		$valid_box.find(".valid_from").attr("readonly", true);
		$valid_box.find(".valid_to").attr("readonly", true);
		$valid_box.find(".valid_alltime").attr("onclick", "return false;");
		add_valid_box();
	}

	// 자격증 삭제버튼 클릭시
	$valid_box.on("click", ".valid_del", function() {
		$(this).closest('.valid_box').remove(); // 해당 박스 삭제
	});
	// -------------------------------------------------------------------------------------
	// 활동경력사항, 자격증 - endtime 오류
	$(".career_from, .career_to, .valid_from, .valid_to").on("change", function() {
		const career_from = $(".career_from").val();
		const career_to = $(".career_to").val();
		const valid_from = $(".valid_from").val();
		const valid_to = $(".valid_to").val();

		if (career_from && career_to) {
			if (career_to <= career_from) {
				alert_modal("modal_error", "활동 경력 시간 오류", "종료일은 시작일 이후로 입력해주세요.");
				$(".career_to").val("");
			}
		}
		if (valid_from && valid_to) {
			if (valid_to <= valid_from) {
				alert_modal("modal_error", "자격증 시간 오류", "만료일은 취득일 이후로 입력해주세요.");
				$(".valid_to").val("");
			}
		}
	});
	// -------------------------------------------------------------------------------------
	// 전체 유효성검사
	$(".talent_comple_btn").click(function(e) {
		e.preventDefault(); // 기본 제출 방지  
		if (talentActivist_check()) {
			
		} else {
			// 유효성 검사 실패 시 경고 메시지 표시
			$('html, body').animate({scrollTop: 0}, 300);
			alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '활동 경력 사항과 자격증 사항을 제외한 나머지는 모두 필수 입력 사항입니다.');
		}

		function talentActivist_check() {
			let inputs = [
				{ input: $('#title_search'), errorMsg: "권한자를 등록하세요" },
				{ input: $('#title'), errorMsg: "재능활동명을 입력하세요" },
				{ input: $('#background'), errorMsg: "참여 동기를 입력하세요" },
				{ input: $('#location'), errorMsg: "활동 장소을 입력하세요" },
				{ input: $('#price'), errorMsg: "수강 요금을 입력하세요" },
				{ input: $('#start_date'), errorMsg: "활동 시작일을 선택하세요" },
				{ input: $('#end_date'), errorMsg: "활동 종료일을 선택하세요" },
				{ input: $('#activity_field'), errorMsg: "신청분야를 선택하세요" },
				{ input: $('#detail'), errorMsg: "내용을 입력하세요" }
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
			// 활동요일 선택 유효성 검사
			if ($(".input_day_add").find("button").hasClass("day_del")) {
				hideError($(".input_day_add"));
			} else {
				showError($(".input_day_add"), "활동요일을 등록하세요");
				input_return = false;
			}
			// 수강대상자 선택 유효성 검사
			if ($("input[name='target']").is(":checked")) {
				hideError($(".target_select"));
			} else {
				showError($(".target_select"), "수강대상자를 선택하세요");
				input_return = false;
			}
			// 활동형식 선택 유효성 검사
			if ($("input[name='activity_type']").is(":checked")) {
				hideError($(".activity_select"));
			} else {
				showError($(".activity_select"), "활동 형식을 선택하세요");
				input_return = false;
			}
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
		$('#title, #background, #location, #price, #start_date, #end_date, #detail, input[name="target"], input[name="activity_type"]').on('blur', function() {
			talentActivist_check();
		});
		// 클릭시 에러메세지 삭제
		$('#title_search, .activist_search, #activity_field, .day_result').on('click', function() {
			$(this).parents(".input_fields").find(".check_error").text("");
		});
		// 체크박스 클릭시 에러메세지 삭제
		$("input[name='target'], input[name='activity_type']").on('click', function() {
			talentActivist_check();
		});
		// 대표사진등록 에러메세지 삭제
		$('#profile').on('click', function() {
			$(this).parents(".main_photo").find(".check_error").text("");
		});
	});
});