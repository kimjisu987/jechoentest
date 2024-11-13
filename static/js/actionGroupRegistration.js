$(document).ready(function(){
	// 에디터 생성
	contentEditor = new toastui.Editor.factory({
		el: document.querySelector("#description"),
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

	const urlParams = new URLSearchParams(window.location.search);
	const actionNo = urlParams.get('no');
	if(actionNo != null){
		getActionDetail(actionNo);
		$(".submit_btn").hide();
	}
	else{
		$(".save_btn").hide();
	}

	$("#profile").on("change", function(e){
		profileName = null;
		let file = e.target.files[0];

		let reader = new FileReader();
		reader.onload = function(ev) {
			$(".main_photo").css("background-image", 'url(' + ev.target.result + ')');
		}
		reader.readAsDataURL(file);
	});

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
	/*
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
	 */
    // -------------------------------------------------------------------------------------
	// 대표자, 구성원, 등록 권한자 찾기 모달
	// 찾기 클릭 시 모달 오픈
	$("#leader, #activity, #member, .action_search_btn").click(function() {
		$(".action_modal").fadeIn();
		$("body").css("overflow", "hidden");
	});
	// 구성원 찾기
	$("#actionAuthUser").click(function() {
		let searchUser = $("#action_search").val();
		let option = deepExtend({}, ajaxOptions);
		option.URL = "/api/v1/action/auth/user?param=" + searchUser;
		option.TYPE = "GET";
		option.HEADERS = getCsrfHeader();
		option.CALLBACK = function(response) {
			let data = response.data;
			if(data.length == 0){
				alert_modal("modal_error", "구성원 등록 오류", "검색 결과가 없습니다.");
			}
			else{
				let html = ``;
				for(let i in data){
					html += `<li>`;
					html += `	<input type="checkbox" class="member_check" id="${data[i].userId}" value="${data[i].userNo}"/>`;
					html += `	<label for="${data[i].userId}"><img src="/icon/icon_check.svg" alt="체크 아이콘"/></label>`;
					html += `	<label for="${data[i].userId}">${data[i].userName}(${data[i].userId})</label>`;
					html += `</li>`;
				}
				$(".member_list").empty().append(html);
			}
		}
		ajaxWrapper.callAjax(option);
	});

	// 체크된 멤버 목록
	function check_mem() {
		return $("input.member_check:checked").filter(function() {
			return !$(this).hasClass("member_disabled") && !$(this).attr("disabled");
		}).map(function() {
			return {
				"userNo" : Number($(this).val()),
				"label" : $(this).closest('li').find('label').last().text().trim()
			};
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
		checked_mems.forEach(function(member) {
			const memberDiv = `<div>
								<p id="${member_box.replace('.', '')}-${member.userNo}">${member.label}</p>
								<button class="member_del"></button>
							</div>`;
			$(member_box).append(memberDiv);

			// 리스트에서 일치하는 텍스트 찾아서 disabled 하기
			$(".member_list label").each(function() {
				if ($(this).text().trim() == member.label) {
					$(this).siblings("input").addClass("member_disabled").attr("disabled", true);
				}
			});

			if(member_box == ".add_leader"){
				userList.push(
					{
						"userNo" : member.userNo,
						"leader" : 'Y',
						"memberRole" : 'Y'
					}
				)
			}
			if(member_box == '.add_member'){
				userList.push(
					{
						"userNo" : member.userNo,
						"leader" : 'N',
						"memberRole" : 'Y'
					}
				)
			}
			if(member_box == '.add_activity'){
				userList.push(
					{
						"userNo" : member.userNo,
						"leader" : 'N',
						"memberRole" : 'N'
					}
				)
			}
		});
	}

	// 대표자 등록 버튼
	$(".leader_result").click(function() {
		if ($(".add_leader > div").length > 0) {
			alert_modal("modal_error", "구성원 등록 오류", "대표자는 최대 1인까지만 등록 가능합니다.");
			check_clear();
		} else {
			const checked_mems = check_mem();
			if(checked_mems.length > 1){
				alert_modal("modal_error", "구성원 등록 오류", "대표자는 최대 1인까지만 등록 가능합니다.");
				check_clear();
			}
			else{
				add_members(".add_leader", checked_mems);
			}
		}
	});

	// 활동내역 등록 권한자 등록 버튼
	$(".member_result").click(function() {
		if ($(".add_member > div").length > 1) {
			alert_modal("modal_error", "구성원 등록 오류", "권한자는 최대 2인까지만 등록 가능합니다.");
			check_clear();
		} else {
			const checked_mems = check_mem();
			if(checked_mems.length > 2){
				alert_modal("modal_error", "구성원 등록 오류", "권한자는 최대 2인까지만 등록 가능합니다.");
				check_clear();
			}
			else{
				add_members(".add_member", checked_mems);
			}
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
		const user_no = Number($(this).siblings("p").attr('id').split('-')[1]);
		$(".member_list label").each(function() {
			const list_text = $(this).text().trim();
			if (user_info == list_text) {
				$(this).siblings("input").removeClass("member_disabled").attr("disabled", false).prop("checked", false);
			}
		});
		userList = userList.filter(x => x.userNo != user_no);
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
	$(".submit_btn, .save_btn").click(function(e) {
		e.preventDefault(); // 기본 제출 방지
		if (action_check()) {
			// 대표사진 저장
			if(profileName == null){
				let formData = new FormData();
				formData.append("file", $("#profile")[0].files[0]);
				profileName = uploadFile("actionFile", formData)[0];
			}

			let param = {
				"name" : $("#name").val(),
				"generation" : $("#generation").val(),
				"stage" : $("#stage option:selected").val(),
				"type" : $("#group_type option:selected").val(),
				"subject" : $("#subject").val(),
				"status" : $("#status option:selected").val(),
				"startDate" : $("#start_date").val(),
				"endDate" : $("#end_date").val(),
				"item" : $("#major_item").val(),
				"background" : $("#background").val(),
				"description" : contentEditor.getHTML(),
				"release" : $("#private option:selected").val(),
				"profile" : profileName,
				"actionUserList" : userList
			}

			let option = deepExtend({}, ajaxOptions);
			if(e.target.className == 'save_btn'){
				param.no = currentActionNo;
				option.TYPE = "PUT";
			}
			else{
				option.TYPE = "POST";
			}
			option.URL = "/api/v1/action";
			option.HEADERS = getCsrfHeader();
			option.PARAM = JSON.stringify(param);
			option.CALLBACK = function(response) {
				alert_modal("modal_ok", "액션 그룹 등록 완료", "액션 그룹 등록이 완료되었습니다. 등록하신 액션 그룹의 상세페이지로 이동합니다.");
				$(document).on("click", ".modal_btn", function(){
					location.href = "/action/detail?no=" + response.data;
				})
			}
			ajaxWrapper.callAjax(option);

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

			// textarea 유효성 검사
			if (contentEditor.getHTML() === '<p><br></p>') {
				showError($("#content"), "내용을 입력하세요");
				input_return = false;
			} else {
				hideError($("#content"));
			}

			// 대표사진등록 유효성 검사
			if ($("#profile").val().length < 1) {
				if(profileName == null){
					fileshowError($("#profile"), "대표사진을 등록하세요");
					input_return = false;
				}
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

let userList = [];
let currentActionNo = 0;
let contentEditor = null;
let profileName = null;

function getActionDetail(no){
	let option = deepExtend({}, ajaxOptions);
	option.URL = "/api/v1/action/detail/" + no;
	option.TYPE = "GET";
	option.ASYNC = false;
	option.HEADERS = getCsrfHeader();
	option.CALLBACK = function(response) {
		if(response.code == 0){
			alert_modal('modal_error', '액션그룹 조회 실패', response.message);
			$(".modal_error .modal_btn").attr("onclick", "location.replace('/action')");
		}
		else{
			let data = response.data;
			currentActionNo = data.no;
			$("#name").val(data.name);
			$("#generation").val(data.generation);
			$("#stage").val(data.stage).prop("selected", true);
			$("#group_type").val(data.type).prop("selected", true);
			$("#subject").val(data.subject);
			$("#status").val(data.status).prop("selected", true);
			$("#start_date").val(data.startDate);
			$("#end_date").val(data.endDate);
			$("#major_item").val(data.item);
			$("#background").val(data.background);
			contentEditor.setHTML(data.description);
			$("#private").val(data.release).prop("selected", true);
			$(".main_photo").css("background-image", 'url(' + data.profile + ')');
			profileName = data.profile;
			let members = data.memberList;
			for(let i in members){
				if(members[i].leader == 'Y'){
					$("#leader").val(members[i].userName + "(" + members[i].userId + ")");
					let memberDiv = `<div>
										<p id="add_leader-${members[i].userNo}">${members[i].userName}(${members[i].userId})</p>
										<button class="member_del"></button>
									</div>`;
					$(".add_leader").append(memberDiv);
				}
				if(members[i].memberRole == 'Y' && members[i].leader == 'N'){
					if($("#activity").val() != ""){
						$("#activity").val($("#activity").val() + ", " + members[i].userName + "(" + members[i].userId + ")");
					}
					else{
						$("#activity").val(members[i].userName + "(" + members[i].userId + ")");
					}
					let memberDiv = `<div>
										<p id="add_leader-${members[i].userNo}">${members[i].userName}(${members[i].userId})</p>
										<button class="member_del"></button>
									</div>`;
					$(".add_member").append(memberDiv);
				}
				else if (members[i].memberRole == 'N' && members[i].leader == 'N'){
					if($("#member").val() != ""){
						$("#member").val($("#member").val() + ", " + members[i].userName + "(" + members[i].userId + ")");
					}
					else{
						$("#member").val(members[i].userName + "(" + members[i].userId + ")");
					}
					let memberDiv = `<div>
										<p id="add_leader-${members[i].userNo}">${members[i].userName}(${members[i].userId})</p>
										<button class="member_del"></button>
									</div>`;
					$(".add_activity").append(memberDiv);
				}
				userList.push({
					"userNo" : members[i].userNo,
					"leader" : members[i].leader,
					"memberRole" : members[i].memberRole
				});
			}
		}
	}
	ajaxWrapper.callAjax(option);
}