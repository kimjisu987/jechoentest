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
	const actionNo = urlParams.get('actionNo');
	const activityNo = urlParams.get('activityNo');
	if(actionNo != null && (activityNo == null || activityNo == '')){
		getActionInfo(actionNo);
		$(".save_btn").hide();
	}
	else if(activityNo != null){
		getActionInfo(actionNo);
		getActivityInfo(activityNo);
		$(".submit_btn").hide();
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

	// -------------------------------------------------------------------------------------
	// 활동기간 - endtime 오류
	$(".start_time, .end_time").on("blur", function() {
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
	$(".submit_btn, .save_btn").click(function(e) {
		e.preventDefault(); // 기본 제출 방지  
		if (action_check()) {
			// 대표사진 저장
			if(profileName == null){
				let formData = new FormData();
				formData.append("file", $("#profile")[0].files[0]);
				profileName = uploadFile("activityFile", formData)[0];
			}

			let param = {
				"actionNo" : currentActionNo,
				"startDate" : $("#start_time").val(),
				"endDate" : $("#end_time").val(),
				"description" : contentEditor.getHTML(),
				"release" : $("#status option:selected").val(),
				"profile" : profileName,
				"title" : $("#title").val()
			}

			let option = deepExtend({}, ajaxOptions);
			if(e.target.className == 'save_btn'){
				param.activityNo = currentActivityNo;
				option.TYPE = "PUT";
			}
			else{
				option.TYPE = "POST";
			}
			option.URL = "/api/v1/activity";
			option.HEADERS = getCsrfHeader();
			option.PARAM = JSON.stringify(param);
			option.CALLBACK = function(response) {
				if(response.code == 1){
					alert_modal("modal_ok", "활동 소식 등록 완료", "활동 소식 등록이 완료되었습니다. 등록하신 활동 소식의 상세페이지로 이동합니다.");
					$(".modal_ok .modal_btn").attr("onclick", "location.replace('/activity/detail?no=" + response.data + "')");
				}
				else{
					alert_modal('modal_error', '활동내역 등록 실패', response.message);
					$(".modal_error .modal_btn").attr("onclick", "location.replace('/action')");
				}
			}
			ajaxWrapper.callAjax(option);
		}
		else {
			// 유효성 검사 실패 시 경고 메시지 표시
			$('html, body').animate({scrollTop: 0}, 300);
			alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '활동기간, 활동내용, 공개여부는 필수 입력 사항입니다.');
		}

		function action_check() {
			let inputs = [
				{ input: $('#start_time'), errorMsg: "활동기간 시작일을 선택하세요" },
				{ input: $('#end_time'), errorMsg: "활동기간 종료일을 선택하세요" },
				{ input: $('#status'), errorMsg: "공개 여부를 선택하세요" },
				{ input: $('#title'), errorMsg: "활동명을 입력하세요" }
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
		$('#start_time, #end_time, #description, #status').on('blur', function() {
			action_check();
		});
		// 대표사진등록 에러메세지 삭제
		$('#profile').on('click', function() {
			$(this).parents(".main_photo").find(".check_error").text("");
		});
	});
});

let currentActionNo = 0;
let currentActivityNo = 0;
let contentEditor = null;
let profileName = null;

function getActionInfo(actionNo){
	let option = deepExtend({}, ajaxOptions);
	option.URL = "/api/v1/action/detail/" + actionNo;
	option.TYPE = "GET";
	option.ASYNC = false;
	option.HEADERS = getCsrfHeader();
	option.CALLBACK = function(response) {
		if(response.code == 0){
			alert_modal('modal_error', '액션그룹 정보 조회 실패', response.message);
			$(".modal_error .modal_btn").attr("onclick", "location.replace('/action')");
		}
		else{
			let data = response.data;
			currentActionNo = data.no;
			$("#name").val(data.name);
			$("#stage").val(data.stage).prop("selected", true);
			$("#generation").val(data.generation);
			$("#group_type").val(data.type).prop("selected", true);
			$("#subject").val(data.subject);
		}
	}
	ajaxWrapper.callAjax(option);
}

function getActivityInfo(no){
	let option = deepExtend({}, ajaxOptions);
	option.URL = "/api/v1/activity/detail/" + no;
	option.TYPE = "GET";
	option.ASYNC = false;
	option.HEADERS = getCsrfHeader();
	option.CALLBACK = function(response) {
		if(response.code == 0){
			alert_modal('modal_error', '접근 불가', response.message);
			$(".modal_error .modal_btn").attr("onclick", "location.replace('/activity')");
		}
		else{
			let data = response.data;
			currentActivityNo = data.no;
			$("#start_time").val(data.startDate);
			$("#end_time").val(data.endDate);
			contentEditor.setHTML(data.description);
			$("#status").val(data.release).prop("selected", true);
			$(".main_photo").css("background-image", 'url(' + data.profile + ')');
			profileName = data.profile;
			$("#title").val(data.title);
		}
	}
	ajaxWrapper.callAjax(option);
}