$(document).ready(function(){
	const param = new URLSearchParams(location.search);
	noticeNo = param.get("no");
	if (noticeNo !== null) {
		getNotice(noticeNo);
	}

	// 에디터 생성
	contentEditor = new toastui.Editor.factory({
		el: document.querySelector("#content"),
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

	// ----------------------------------------------
	// 공지사항 등록 js
	$(".notice_submit_btn").click(function(e) {
		e.preventDefault(); // 기본 제출 방지  
		if (registration_check()) {
			saveAddfile();
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
			if (contentEditor.getHTML() === '<p><br></p>') {
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
		$('#title, .toastui-editor-contents').on('blur', function() {
			registration_check();
		});
		// 셀렉트 클릭시 에러메세지 삭제
		$('#category_no').on('click', function() {
			$(this).closest('.input_fields').find(".check_error").text("");
		});
	});

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
		if ($(this).hasClass("exist_file_del")) {
			existAddfiles.splice($(this).parent().index(), 1);
		}
		$(this).parent(".input_file_add").remove();
	});
});

let contentEditor = null;

let noticeNo = null;
let existAddfiles = [];

// 공지사항 조회
function getNotice(noticeNo) {
	let option = deepExtend({}, ajaxOptions);
	option.URL = "/api/v1/notice/detail/" + noticeNo;
	option.TYPE = "GET";
	option.CALLBACK = function(response) {
		if (response.code === 1) {
			generationNotice(response.data);
		} else {
			$(".notice_submit_btn").attr("disabled", true);
			$('html, body').animate({scrollTop: 0}, 300);
			alert_modal('modal_error', '공지사항 조회 실패', '');
			$(".modal_error .modal_btn").attr("onclick", "location.replace('/notice')");
		}
	}
	ajaxWrapper.callAjax(option);
}

// 공지사항 출력
function generationNotice(data) {
	$("#category_no option:contains('" + data.category + "')").prop("selected", true);
	$("#title").val(data.title);
	contentEditor.setHTML(data.content);

	existAddfiles = data.addfileList.map(x => x.addfile);
	let html = ``;
	for (let addfile of existAddfiles) {
		html += `<div class="input_file_add">`
		html += `    <input type="text" name="exist_addfile" class="addfile" value="${addfile.substring(addfile.indexOf("_") + 1)}" readonly>`
		html += `    <button type="button" class="file_del exist_file_del">삭제</button>`
		html += `</div>`
	}
	$(".input_file_box").prepend(html);
}

// 첨부파일 저장
function saveAddfile() {
	$(".notice_submit_btn").attr("disabled", true);

	let formData = new FormData();
	$("input[name=addfile]").each(function(idx, item) {
		if ($(item)[0].files.length !== 0) {
			formData.append("file", $(item)[0].files[0]);
		}
	});

	if (formData.get("file") !== null) {
		let fileNames = uploadFile("noticeFile", formData);
		existAddfiles = existAddfiles.concat(fileNames);
	}
	saveNotice();
}

// 공지사항 저장
function saveNotice() {
	let param = {
		"no": noticeNo,
		"category": $("#category_no").val(),
		"title": $("#title").val(),
		"content": contentEditor.getHTML(),
		"addfiles": existAddfiles
	}

	let option = deepExtend({}, ajaxOptions);
	option.URL = "/api/v1/notice";
	option.TYPE = noticeNo === null ? "POST" : "PUT";
	option.HEADERS = getCsrfHeader();
	option.PARAM = JSON.stringify(param);
	option.CALLBACK = function(response) {
		$('html, body').animate({scrollTop: 0}, 300);
		if (response.code === 1) {
			alert_modal('modal_ok', '공지사항 저장 성공', '');
			$(".modal_ok .modal_btn").attr("onclick", `location.replace('/notice/detail?no=${response.data}')`);
			existAddfiles = [];
		} else {
			alert_modal('modal_error', '공지사항 저장 실패', '');
			$(".notice_submit_btn").attr("disabled", false);
		}
	}
	ajaxWrapper.callAjax(option);
}