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
	$(".start_date, .end_date").on("change", function() {
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
	// 찾기 클릭시 모달 오픈
	$("#leader, #activity, #member, .action_search_btn").click(function() {
		$(".action_modal").fadeIn();
		$("body").css("overflow", "hidden");
	});

    // 리스트 선택
    $("input.member_check").on("change", function() {
        const checked_members = $("input.member_check:checked").map(function() {
            return $(this).closest('li').find('label').last().text();
        }).get();
        console.log(checked_members);
    });

    // 버튼 공통
	$(".leader_result, .activity_result, .member_result").click(function() {
        if ($("input.member_check:checked").length < 1) {
            alert_modal("modal_error", "등록 오류", "목록에서 1명 이상 체크 후 등록 가능합니다.");
        } else {

        }
	});

	// 대표자 등록 버튼
	$(".leader_result").click(function() {
        if ($(".add_leader > div").length > 1) {
            alert_modal("modal_error", "구성원 등록 오류", "대표자는 최대 1인까지만 등록 가능합니다.");
            $("input.member_check").filter(function() {
                return !$(this).attr("disabled");
            }).prop('checked', false);
        } else {
            const checked_members = $("input.member_check:checked").filter(function() {
                return !$(this).hasClass("member_disabled") && !$(this).attr("disabled");
            }).map(function() {
                return $(this).closest('li').find('label').last().text().trim();
            }).get();
            
            $(".add_leader").find(".none_text").parent("div").hide();

            // 체크된 멤버 추가
            checked_members.forEach(function(member) {
                const memberDiv = `<div>
                                    <p>${member}</p>
                                    <button class="member_del"><img src="../../static/icon/icon_x_w.svg" alt="삭제 아이콘"></button>
                                </div>`;
                $(".add_leader").append(memberDiv);
            });
            
            $("input.member_check:checked").each(function() {
                $(this).attr("disabled", true);
            });
        }
    });
    // 구성원 등록 버튼
    $(".activity_result").click(function() {
        if ($(".add_activity > div").length > 2) {
            alert_modal("modal_error", "구성원 등록 오류", "구성원은 최대 2인까지만 등록 가능합니다.");
            $("input.member_check").filter(function() {
                return !$(this).attr("disabled");
            }).prop('checked', false);
        } else if ($("input.member_check:checked").length == 1 && $(".add_activity > div").length > 1) {
            alert_modal("modal_error", "구성원 등록 오류", "구성원은 최대 2인까지만 등록 가능합니다.");
            $("input.member_check").filter(function() {
                return !$(this).attr("disabled");
            }).prop('checked', false);
        } else {
            const checked_members = $("input.member_check:checked").filter(function() {
                return !$(this).hasClass("member_disabled") && !$(this).attr("disabled");
            }).map(function() {
                return $(this).closest('li').find('label').last().text().trim();
            }).get();
            
            $(".add_activity").find(".none_text").parent("div").hide();

            // 체크된 멤버 추가
            checked_members.forEach(function(member) {
                const memberDiv = `<div>
                                    <p>${member}</p>
                                    <button class="member_del"><img src="../../static/icon/icon_x_w.svg" alt="삭제 아이콘"></button>
                                </div>`;
                $(".add_activity").append(memberDiv);
            });
            
            $("input.member_check:checked").each(function() {
                $(this).attr("disabled", true);
            });
        }
    });

	// 활동내역 등록 권한자 등록 버튼
	$(".member_result").click(function() {
        const checked_members = $("input.member_check:checked").filter(function() {
            return !$(this).hasClass("member_disabled") && !$(this).attr("disabled");
        }).map(function() {
            return $(this).closest('li').find('label').last().text().trim();
        }).get();
        $(".add_member").find(".none_text").parent("div").hide();
    
        // 체크된 멤버 추가
        checked_members.forEach(function(member) {
            const memberDiv = `<div>
                                <p>${member}</p>
                                <button class="member_del"><img src="../../static/icon/icon_x_w.svg" alt="삭제 아이콘"></button>
                            </div>`;
            $(".add_member").append(memberDiv);
        });
        $("input.member_check:checked").each(function() {
            $(this).attr("disabled", true);
        });
	});

    // 등록 멤버 삭제
    $(".add_leader, .add_activity, .add_member").on("click", ".member_del", function() {
        const user_info = $(this).siblings("p").text().trim();
        $(".member_list label").each(function() {
            const list_text = $(this).text().trim();
            if (user_info === list_text) {
                $(this).siblings("input").attr("disabled", false).prop("checked", false);
            }
        });
        $(this).parent("div").remove();
    });

	// 모달 완료, 닫기 버튼
	$(".action_result, .modal_close").click(function() {
		if ($(".leader").hasClass("add_member_result") == true) {
			$(".action_modal").fadeOut();
			$("body").css("overflow", "auto");
		} else {
			alert_modal("modal_confirm", "대표자 미등록", "대표자를 등록하지 않으셨습니다. 이대로 완료하시겠습니까?");
			$(document).off('click', '.modal_btn').on('click', '.modal_btn', function() {
				if ($(this).index() === 0) {
					$(".search_result").hide();
				} else {
					// 확인 버튼 클릭
                    $(".action_modal").fadeOut();
                    $("body").css("overflow", "auto");
				}
			});
		}
	});
});