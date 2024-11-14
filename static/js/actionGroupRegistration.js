$(document).ready(function(){
    // 기수 input
    $(".minus").click(function() {
        $("#generation").val(function(i, val) {
            return Math.max(1, val - 1); // 최소값 1 유지
        });
    });
    $(".plus").click(function() {
        $("#generation").val(function(i, val) {
            return Math.min(9999, parseInt(val) + 1); // 최대값 9999 유지
        });
    });
    $("#generation").on("change", function() {
        if ($(this).val() < 1 || $(this).val() > 9999) {
            alert_modal("modal_error", "기수 입력 오류", "1 이상의 값만 입력할 수 있습니다.");  
            $(this).val(1); // 값 초기화
        }
    });
	// -------------------------------------------------------------------------------------
	// 수행기간 - endtime 오류
	$(".start_date, .end_date").on("blur", function() {
		const start_date = $(".start_date").val();
		const end_date = $(".end_date").val();

		if (start_date && end_date) {
			if (end_date <= start_date) {
				alert_modal("modal_error", "수행기간 시간 오류", "종료일은 시작일 이후로 입력해주세요.");
				$(".end_date").val("");
			}
		}
	});
	// -------------------------------------------------------------------------------------
	// 첨부파일 추가
	$(".file_add").click(function(){
		let fileHtml = ``;
		fileHtml += `<div class="input_file_add">`
		fileHtml += `    <input type="file" name="addfile" class="addfile">`
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
    // -------------------------------------------------------------------------------------
	// 대표자, 구성원, 등록 권한자 찾기 모달
	// 찾기 클릭 시 모달 오픈
	$("#leader, #activity, #member, .action_search_btn").click(function() {
		$(".action_modal").fadeIn();
		$("body").css("overflow", "hidden");
	});

	// 체크된 멤버 목록
	function check_mem() {
		return $("input.member_check:checked").filter(function() {
			return !$(this).hasClass("member_disabled") && !$(this).attr("disabled");
		}).map(function() {
			return $(this).closest('li').find('label').last().text().trim();
		}).get();
	}

	// 체크 해제
	function check_clear() {
		$("input.member_check").filter(function() {
			return !$(this).attr("disabled");
		}).prop('checked', false);
	}

	// 멤버 추가
	function add_members(member_box, checked_mems) {
		// $(member_box).find(".none_text").parent("div").hide();
		checked_mems.forEach(function(member) {
			const memberDiv = `<div>
								<p>${member}</p>
								<button class="member_del"></button>
							</div>`;
			$(member_box).append(memberDiv);

			// 리스트에서 일치하는 텍스트 찾아서 disabled 하기
			$(".member_list label").each(function() {
				if ($(this).text().trim() == member) {
					$(this).siblings("input").addClass("member_disabled").attr("disabled", true);
				}
			});
		});
	}

	// 대표자 등록 버튼
	$(".leader_result").click(function() {
		if ($(".add_leader > div").length > 0) {
			alert_modal("modal_error", "구성원 등록 오류", "대표자는 최대 1인까지만 등록 가능합니다.");
			check_clear();
		} else {
			const checked_mems = check_mem();
			add_members(".add_leader", checked_mems);
		}
	});

	// 활동내역 등록 권한자 등록 버튼
	$(".member_result").click(function() {
		if ($(".add_member > div").length > 1) {
			alert_modal("modal_error", "구성원 등록 오류", "권한자는 최대 2인까지만 등록 가능합니다.");
			check_clear();
		} else {
			const checked_mems = check_mem();
			add_members(".add_member", checked_mems);
		}
	});

	// 구성원 등록 버튼
	$(".activity_result").click(function() {
		const checked_mems = check_mem();
		add_members(".add_activity", checked_mems);
	});

	// 등록 멤버 삭제
	$(".add_leader, .add_activity, .add_member").on("click", ".member_del", function() {
		const user_info = $(this).siblings("p").text().trim();
		$(".member_list label").each(function() {
			const list_text = $(this).text().trim();
			if (user_info == list_text) {
				$(this).siblings("input").removeClass("member_disabled").attr("disabled", false).prop("checked", false);
			}
		});
		$(this).parent("div").remove();
	});

	// 모달 완료, 닫기 버튼
	$(".action_result, .modal_close").click(function() {
		const leader = $(".add_leader > div:visible p").text().trim();
		const activity = $(".add_member > div:visible").map(function() {
			return $(this).find("p").text().trim();
		}).get().join(", ");
		const member = $(".add_activity > div:visible").map(function() {
			return $(this).find("p").text().trim();
		}).get().join(", ");

		$("#leader").val(leader);
		$("#activity").val(activity);
		$("#member").val(member);
		$(".action_search").find(".check_error").hide();

		if (!leader) {
			alert_modal("modal_confirm", "대표자 미등록", "대표자를 등록하지 않으셨습니다. 이대로 완료하시겠습니까?");
			$(document).off('click', '.modal_confirm .modal_btn').on('click', '.modal_btn', function() {
				if ($(this).index() == 0) {
				} else {
					// 확인 버튼 클릭
					$(".action_modal").fadeOut();
					$("body").css("overflow", "auto");
				}
			});
		} else {
			$(".action_modal").fadeOut();
			$("body").css("overflow", "auto");
		}
	});

	// -------------------------------------------------------------------------------------
	// 전체 유효성검사
	$(".submit_btn").click(function(e) {
		e.preventDefault(); // 기본 제출 방지  
		if (action_check()) {
			alert_modal("modal_ok", "액션 그룹 등록 완료", "액션 그룹 등록이 완료되었습니다. 등록하신 액션 그룹의 상세페이지로 이동합니다.");
		} else {
			// 유효성 검사 실패 시 경고 메시지 표시
			$('html, body').animate({scrollTop: 0}, 300);
			alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '활동내용 등록 권한자, 구성원, 첨부파일 항목을 제외한 나머지는 모두 필수 입력 사항입니다.');
		}

		function action_check() {
			let inputs = [
				{ input: $('#name'), errorMsg: "액션그룹명을 입력하세요" },
				{ input: $('#subject'), errorMsg: "사업주제를 입력하세요" },
				{ input: $('#start_date'), errorMsg: "수행기간 시작일을 선택하세요" },
				{ input: $('#end_date'), errorMsg: "수행기간 종료일을 선택하세요" },
				{ input: $('#major_item'), errorMsg: "주요 아이템을 입력하세요" },
				{ input: $('#leader'), errorMsg: "대표자를 등록하세요" },
				{ input: $('#background'), errorMsg: "신청배경 및 필요성을 입력하세요" },
				{ input: $('#description'), errorMsg: "액션그룹 설명을 입력하세요" },
				{ input: $('#stage'), errorMsg: "단계를 선택하세요" },
				{ input: $('#group_type'), errorMsg: "유형을 선택하세요" },
				{ input: $('#status'), errorMsg: "진행상황을 선택하세요" },
				{ input: $('#private'), errorMsg: "공개 여부를 선택하세요" }
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
		$('#name, #subject, #start_date, #end_date, #major_item, #leader, #background, #description').on('blur', function() {
			action_check();
		});
		// 클릭시 에러메세지 삭제
		$('#stage, #group_type, #status, #private, #leader, #activity, #member, .action_search_btn').on('click', function() {
			$(this).parents(".input_fields").find(".check_error").text("");
		});
		// 대표사진등록 에러메세지 삭제
		$('#profile').on('click', function() {
			$(this).parents(".main_photo").find(".check_error").text("");
		});
	});
});