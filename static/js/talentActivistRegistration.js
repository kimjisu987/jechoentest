$(document).ready(function(){
	// 에디터 생성
	contentEditor = new toastui.Editor.factory({
		el: document.querySelector("#detail"),
		height: '300px',
		previewStyle: 'vertical',
		initialEditType: 'wysiwyg',
		hideModeSwitch: true,
		usageStatistics: false,
		language: 'ko',
		toolbarItems: [
			['heading', 'bold', 'italic', 'strike'],
			['hr', 'quote'],
			['ul', 'ol', 'task', 'indent', 'outdent'],
			['table', 'image', 'link']
		],
		hooks: {
			async addImageBlobHook(blob, callback) {
				try {
					let formData = new FormData();
					formData.append("file", blob);

					let fileNames = uploadFile("editorFile", formData);
					callback(fileNames[0], "image alt attribute");
				} catch(error) {
					console.error('업로드 실패 : ' + error);
				}
			}
		}
	});
	$("#profile").on("change", function(e){
		profileName = null;
		let file = e.target.files[0];

		let reader = new FileReader();
		reader.onload = function(ev) {
			$(".main_photo").css("background-image", 'url(' + ev.target.result + ')');
		}
		reader.readAsDataURL(file);
	});

	const urlParams = new URLSearchParams(window.location.search);
	const activistNo = urlParams.get('no');

	if(activistNo != null){
		$(".talent_comple_btn").text("수정");
	}

	// 재능활동가 권한자 리스트 가져오는 함수(activisNo 가 있을경우 해당 재능활동가 선택되어 있음)
	getUserList(activistNo);

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
			let userList = userListJson.filter(x => x.no == userId);

			// 유저리스트에서 주소를 가져와서 formmat대로 자르는 코드
			const addressPattern = /^(.*?)\s\((.*?)\)$/;
			const match = userList[0].address.match(addressPattern);

			let address1 = '';
			let address2 = '';
			let address3 = '';

			if (match) {
				const addressParts = match[1].split(/\s(?=\d)/);
				address1 = addressParts.slice(0, -1).join(" ").trim();
				address2 = addressParts[addressParts.length - 1];
				address3 = `(${match[2]})`;
			} else {
				console.log("주소 형식이 일치하지 않습니다.");
			}

			//재능활동가 선택 시 해당 유저의 상세 정보
			$("#user_id").val(userList[0].userId);
			$("#name").val(userList[0].name);
			$("#birth").val(userList[0].birth);
			$("#tel").val(userList[0].tel);
			$("#postcode").val(userList[0].zipCode);
			$("#address").val(address1);
			$("#detailAddress").val(address2);
			$("#extraAddress").val(address3);
			$("#email").val(userList[0].email);
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
			<div class="input_day_add" data-index="${yoilCount}">
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
			<div class="career_box" data-index="${careerCount}">
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
						<img src="../icon/icon_check.svg" alt="체크 아이콘">
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
			<div class="valid_box" data-index="${validCount}">
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
					<label for="valid_alltime${validCount}"><img src="../icon/icon_check.svg" alt="체크 아이콘"></label>
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
	$(".career_from, .career_to, .valid_from, .valid_to").on("blur", function() {
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
			registration(activistNo);
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
				// { input: $('#detail'), errorMsg: "내용을 입력하세요" }
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
			// // textarea 유효성 검사
			if (contentEditor.getHTML() === '<p><br></p>') {
				showError($("#content"), "내용을 입력하세요");
				input_return = false;
			} else {
				hideError($("#content"));
			}
			// // 대표사진등록 유효성 검사
			// if ($("#profile").val().length < 1) {
			// 	fileshowError($("#profile"), "대표사진을 등록하세요");
			// 	input_return = false;
			// } else {
			// 	filehideError($("#profile"));
			// }
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

let userListJson = {};
let userId = 0;
let contentEditor = null;
let profileName = null;

// 재능활동가 권한자 리스트 가져오는 함수
function getUserList(activistNo){

	let search = $("#authority_search").val();

	let option = deepExtend({}, ajaxOptions);
	option.URL = "/api/v1/user/list?search=" + search;
	option.TYPE = "GET";
	option.ASYNC = true;
	option.HEADERS = getCsrfHeader();
	option.CALLBACK = function(res) {
		userListJson = res.data;

		let html = ``;
		for(let i = 0; i < userListJson.length; i++){
			html += `<li id="${userListJson[i].no}">${userListJson[i].name}(${userListJson[i].userId})<input type="button" class="member_result" value="등록"></li>`
		}
		$(".member_list").empty().append(html);

		if ($(".add_member_result").text() !== '') {
			$(".member_list").find("input").addClass("member_disabled").attr("disabled", true);
		}

		// 권한자 등록 버튼
		$(".member_result").click(function() {
			const member_result = $(this).closest("li").text().trim();
			userId = $(this).closest("li").attr('id');
			const member_del_btn = `<button class="member_del"></button>`;

			// 등록된 권한자 추가
			$(".add_member").find("p").text(member_result).addClass("add_member_result");
			$(".add_member").find("div").append(member_del_btn);

			// 등록 버튼 비활성화
			$(".member_list").find("input").addClass("member_disabled").attr("disabled", true);
		});
		if(activistNo != null){
			getDetail(activistNo);
		}
	}
	ajaxWrapper.callAjax(option);
}

// 재능활동가 등록/수정 함수
function registration(activistNo){
	// 대표사진 저장
	if(profileName == null){
		let formData = new FormData();
		formData.append("file", $("#profile")[0].files[0]);
		profileName = uploadFile("talentFile", formData)[0];
	}

	let title = $("#title").val();
	let activity_field = $("#activity_field").val() == "기타" ? $("#activity_field_text").val() : $("#activity_field").val();
	// let detail = $("#detail").val();
	let detail = contentEditor.getHTML()
	let motive = $("#background").val();
	let activityType = $(".activity_type:checked").map((index, checkbox) => checkbox.value).get().join(", ");
	let target = $(".target:checked").map((index, checkbox) => checkbox.value).get().join(", ");
	let location = $("#location").val();
	let price = $("#price").val().replace(/,/g, '');
	let startDate = $("#start_date").val();
	let endDate = $("#end_date").val();
	let scheduleList = [];
	let careerList = [];
	let qualificationList = [];

	$(".input_day_add").each(function() {
		let i = $(this).data("index");
		if($(`#date_yoil${i}`).val() != '') {
			scheduleList.push({
				day: $(`#date_yoil${i}`).val(),
				startTime: $(`#start_time${i}`).val(),
				endTime: $(`#end_time${i}`).val()
			});
		}
	});

	$(".career_box").each(function(){
		let i = $(this).data("index");
		if($(`#career_field${i}`).val() != '') {
			careerList.push({
				careerField: $(`#career_field${i}`).val(),
				content: $(`#career_content${i}`).val(),
				careerFrom: $(`#career_from${i}`).val(),
				careerTo: $(`#career_to${i}`).val()
			});
		}
	});

	$(".valid_box").each(function(){
		let i = $(this).data("index");
		if($(`#valid_field${i}`).val() != '') {
			qualificationList.push({
				name: $(`#valid_field${i}`).val(),
				qualificationField: $(`#valid_content${i}`).val(),
				validFrom: $(`#valid_from${i}`).val(),
				validTo: $(`#valid_to${i}`).val()
			});
		}
	});

	let param = {
		"no" : activistNo,
		"userNo" : userId,
		"title" : title,
		"activityField" : activity_field,
		"detail" : detail,
		"motive" : motive,
		"activityType" : activityType,
		"target" : target,
		"location" : location,
		"price" : price,
		"startDate" : startDate,
		"endDate" : endDate,
		"scheduleList" : scheduleList,
		"careerList" : careerList,
		"profile" : profileName,
		"qualificationList" : qualificationList
	}

	let option = deepExtend({}, ajaxOptions);
	option.URL = "/api/v1/talent/registration";
	option.TYPE = activistNo === null ?"POST":"PUT";
	option.PARAM = JSON.stringify(param);
	option.ASYNC = true;
	option.HEADERS = getCsrfHeader();
	option.CALLBACK = function(res) {
		if(res.code == 49) {
			alert_modal("modal_ok", "재능활동가 등록되었습니다.", "재능활동 목록 페이지로 이동합니다.", function() {
				window.location.replace("/talent");
			});
		}
	}
	ajaxWrapper.callAjax(option);
}

let detailJSON = [];

// 재능활동 수정 시 해당 재능활동의 상세 정보
function getDetail(activityNo){

	let option = deepExtend({}, ajaxOptions);
	option.URL = "/api/v1/talent/detail/"+ activityNo;
	option.TYPE = "GET";
	option.ASYNC = false;
	option.HEADERS = getCsrfHeader();
	option.CALLBACK = function(res) {
		detailJSON = res.data;
		console.log(detailJSON[0].scheduleList[0].no);

		const member_del_btn = `<button class="member_del"></button>`;

		// 등록된 권한자 추가
		$(".add_member").find("p").text($(`#${detailJSON[0].userNo}`).text()).addClass("add_member_result");
		$(".add_member").find("div").append(member_del_btn);

		// 등록 버튼 비활성화
		$(".member_list").find("input").addClass("member_disabled").attr("disabled", true);

		$("body").css("overflow", "auto");
		$(".search_result").css("display","flex");
		let userList = userListJson.filter(x => x.no == detailJSON[0].userNo);
		userId = userList[0].no;

		const addressPattern = /^(.*?)\s\((.*?)\)$/;
		const match = userList[0].address.match(addressPattern);

		let address1 = '';
		let address2 = '';
		let address3 = '';

		if (match) {
			const addressParts = match[1].split(/\s(?=\d)/);
			address1 = addressParts.slice(0, -1).join(" ").trim();
			address2 = addressParts[addressParts.length - 1];
			address3 = `(${match[2]})`;
		} else {
			console.log("주소 형식이 일치하지 않습니다.");
		}

		$("#user_id").val(userList[0].userId);
		$("#name").val(userList[0].name);
		$("#birth").val(userList[0].birth);
		$("#tel").val(userList[0].tel);
		$("#postcode").val(userList[0].zipCode);
		$("#address").val(address1);
		$("#detailAddress").val(address2);
		$("#extraAddress").val(address3);
		$("#email").val(userList[0].email);
		setTimeout(function() {
			$("#title_search").val($(".add_member_result").text()).addClass("search_compl");
		}, 0);

		$("#title").val(detailJSON[0].title);
		let options = Array.from(document.querySelectorAll('#activity_field option')).map(option => option.value);

		if (options.includes(detailJSON[0].activityField)) {
			$('#activity_field').val(detailJSON[0].activityField);
			$('#activity_field_text').prop('disabled', true).val('');
		} else {
			$('#activity_field').val('기타');
			$('#activity_field_text').prop('disabled', false).val(detailJSON[0].activityField);
		}
		contentEditor.setHTML(detailJSON[0].detail);
		$("#background").val(detailJSON[0].motive);
		detailJSON[0].activityType.split(", ").forEach(x => {
			$(`input[type="checkbox"][value="${x}"]`).prop("checked", true);
		})
		detailJSON[0].target.split(", ").forEach(x => {
			$(`input[type="checkbox"][value="${x}"]`).prop("checked", true);
		});
		$("#location").val(detailJSON[0].location);
		$("#price").val(detailJSON[0].price)
		$("#start_date").val(detailJSON[0].startDate);
		$("#end_date").val(detailJSON[0].endDate);
		let yoilCount = 1; // 박스 카운터 초기화

		let yoil_html = ``;
		for(let i = 0 ; i < detailJSON[0].scheduleList.length; i++){
			yoil_html += `<div class="input_day_add" data-index="${i+9}">`;
			yoil_html += `  <input type="text" name="activity_field" class="date_yoil" id="date_yoil${i+9}" value="${detailJSON[0].scheduleList[i].day}" readonly>`;
			yoil_html += `	<input type="time" name="start_time" class="start_time" id="start_time${i+9}"value="${detailJSON[0].scheduleList[i].startTime}" readonly>`;
			yoil_html += `	<p class="day_line">~</p>`;
			yoil_html += `	<input type="time" name="end_time" class="end_time" id="end_time${i+9}" value="${detailJSON[0].scheduleList[i].endTime}" readonly>`;
			yoil_html += `	<button type="button" class="day_del" onclick="deleteSchedule(${detailJSON[0].scheduleList[i].no})">삭제</button>`;
			yoil_html += `</div>`;

		}
		yoil_html += `<div class="input_day_add" data-index="${yoilCount}">
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
			</div>`;
		$(".input_day_box").empty().append(yoil_html);
		let careerCount = 1; // 박스 카운터 초기화

		let career_html = ``;
		for(let i = 0; i < detailJSON[0].careerList.length; i++){
			career_html += `<div class="career_box" data-index="${i+9}">`;
			career_html += `    <div class="career_inner">`;
			career_html += `        <div class="input_fields">`;
			career_html += `            <label for="career_field${i+9}">활동 분야</label>`;
			career_html += `            <input type="text" name="career_field" class="career_field" id="career_field${i+9}" value="${detailJSON[0].careerList[i].careerField}" placeholder="활동 분야 입력" readonly>`;
			career_html += `            <div class="form_check_box">`;
			career_html += `                <p class="check_error"></p>`;
			career_html += `            </div>`;
			career_html += `        </div>`;
			career_html += `        <div class="input_fields">`;
			career_html += `            <label for="career_content${i+9}">활동 내용</label>`;
			career_html += `            <input type="text" name="career_content" class="career_content" id="career_content${i+9}" value="${detailJSON[0].careerList[i].content}" placeholder="활동 내용 입력" readonly>`;
			career_html += `            <div class="form_check_box">`;
			career_html += `                <p class="check_error"></p>`;
			career_html += `            </div>`;
			career_html += `        </div>`;
			career_html += `        <div class="input_fields">`;
			career_html += `            <label for="career_from${i+9}">활동경력 시작일</label>`;
			career_html += `            <input type="date" name="career_from" class="career_from" id="career_from${i+9}" value="${detailJSON[0].careerList[i].careerFrom}" readonly>`;
			career_html += `            <div class="form_check_box">`;
			career_html += `                <p class="check_error"></p>`;
			career_html += `            </div>`;
			career_html += `        </div>`;
			career_html += `        <div class="input_fields">`;
			career_html += `            <label for="career_to${i+9}">활동경력 종료일</label>`;
			career_html += `            <input type="date" name="career_to" class="career_to" id="career_to${i+9}" value="${detailJSON[0].careerList[i].careerTo}" readonly>`;
			career_html += `            <div class="form_check_box">`;
			career_html += `                <p class="check_error"></p>`;
			career_html += `            </div>`;
			career_html += `        </div>`;
			career_html += `        <button type="button" class="career_del" onclick="deleteCareer(${detailJSON[0].careerList[i].no})">삭제</button>`;
			career_html += `    </div>`;
			career_html += `    <div class="alltime_box">`;
			career_html += `        <input type="checkbox" name="career_alltime" class="career_alltime" id="career_alltime${i+9}" disabled>`;
			career_html += `        <label for="career_alltime${i+9}">`;
			career_html += `            <img src="../icon/icon_check.svg" alt="체크 아이콘">`;
			career_html += `        </label>`;
			career_html += `        <label for="career_alltime${i+9}">활동 진행중</label>`;
			career_html += `    </div>`;
			career_html += `</div>`;
		}
		$(".career_add_box").prepend(career_html);

		let valid_html = ``;
		for(let i = 0; i < detailJSON[0].qualificationList.length; i++){
			valid_html += `<div class="valid_box" data-index="${i+9}">`;
			valid_html += `    <div class="valid_inner">`;
			valid_html += `        <div class="input_fields">`;
			valid_html += `            <label for="valid_field${i+9}">자격증 분야</label>`;
			valid_html += `            <input type="text" name="valid_field" class="valid_field" id="valid_field${i+9}" value="${detailJSON[0].qualificationList[i].qualificationField}" placeholder="자격증 분야 입력" readonly>`;
			valid_html += `            <div class="form_check_box">`;
			valid_html += `                <p class="check_error"></p>`;
			valid_html += `            </div>`;
			valid_html += `        </div>`;
			valid_html += `        <div class="input_fields">`;
			valid_html += `            <label for="valid_content${i+9}">자격증 내용</label>`;
			valid_html += `            <input type="text" name="valid_content" class="valid_content" id="valid_content${i+9}" value="${detailJSON[0].qualificationList[i].name}"  placeholder="자격증 내용 입력" readonly>`;
			valid_html += `            <div class="form_check_box">`;
			valid_html += `                <p class="check_error"></p>`;
			valid_html += `            </div>`;
			valid_html += `        </div>`;
			valid_html += `        <div class="input_fields">`;
			valid_html += `            <label for="valid_from${i+9}">자격증 취득일</label>`;
			valid_html += `            <input type="date" name="valid_from" class="valid_from" id="valid_from${i+9}" value="${detailJSON[0].qualificationList[i].validFrom}" readonly>`;
			valid_html += `            <div class="form_check_box">`;
			valid_html += `                <p class="check_error"></p>`;
			valid_html += `            </div>`;
			valid_html += `        </div>`;
			valid_html += `        <div class="input_fields">`;
			valid_html += `            <label for="valid_to${i+9}">자격증 만료일</label>`;
			valid_html += `            <input type="date" name="valid_to" class="valid_to" id="valid_to${i+9}" value="${detailJSON[0].qualificationList[i].validTo}" readonly>`;
			valid_html += `            <div class="form_check_box">`;
			valid_html += `                <p class="check_error"></p>`;
			valid_html += `            </div>`;
			valid_html += `        </div>`;
			valid_html += `        <button type="button" class="valid_del" onclick="deleteQualification(${detailJSON[0].qualificationList[0].no})">삭제</button>`;
			valid_html += `    </div>`;
			valid_html += `    <div class="alltime_box">`;
			if(detailJSON[0].qualificationList[i].validTo == '' || detailJSON[0].qualificationList[i].validTo == null){
				valid_html += `        <input type="checkbox" name="valid_alltime" class="valid_alltime" id="valid_alltime${i+9}" checked disabled>`;
			}
			else {
				valid_html += `        <input type="checkbox" name="valid_alltime" class="valid_alltime" id="valid_alltime${i+9}" disabled>`;
			}
			valid_html += `        <label for="valid_alltime${i+9}"><img src="../icon/icon_check.svg" alt="체크 아이콘"></label>`;
			valid_html += `        <label for="valid_alltime${i+9}">만료일 없음</label>`;
			valid_html += `    </div>`;
			valid_html += `</div>`;
		}
		$(".valid_add_box").prepend(valid_html);
	}
	ajaxWrapper.callAjax(option);
	yoil_disabled();

	$("input[name='career_alltime']").off("change").on("change", function() {
		if ($(this).is(":checked")) {
			$(this).closest(".alltime_box").siblings(".career_inner").find(".career_to").val("").attr("disabled", true);
		} else {
			$(this).closest(".alltime_box").siblings(".career_inner").find(".career_to").attr("disabled", false);
		}
	});

}

// 스케쥴 삭제
function deleteSchedule(no){
	let option = deepExtend({}, ajaxOptions);
	option.URL = "/api/v1/talent/schedule/"+ no;
	option.TYPE = "PUT";
	option.ASYNC = false;
	option.HEADERS = getCsrfHeader();
	option.CALLBACK = function(res) {
		console.log(res);
	}
	ajaxWrapper.callAjax(option);
}

// 경력 삭제
function deleteCareer(no){
	let option = deepExtend({}, ajaxOptions);
	option.URL = "/api/v1/talent/career/"+ no;
	option.TYPE = "PUT";
	option.ASYNC = false;
	option.HEADERS = getCsrfHeader();
	option.CALLBACK = function(res) {
		console.log(res);
	}
	ajaxWrapper.callAjax(option);
}

// 자격증 삭제
function deleteQualification(no){
	let option = deepExtend({}, ajaxOptions);
	option.URL = "/api/v1/talent/qualification/"+ no;
	option.TYPE = "PUT";
	option.ASYNC = false;
	option.HEADERS = getCsrfHeader();
	option.CALLBACK = function(res) {
		console.log(res);
	}
	ajaxWrapper.callAjax(option);
}

