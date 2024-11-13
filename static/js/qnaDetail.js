$(document).ready(function() {
    const param = new URLSearchParams(location.search);
    const qnaNo = param.get("no");

    getQna(qnaNo);

    // 문의 답변 검사
    $(".qnaDetail_admin_btn").on("click", function() {
        if ($("#textarea").val().trim() !== "") {
            saveQnaReply(qnaNo);
        } else {
            $("#textarea").focus();
            $('html, body').animate({scrollTop: 0}, 300);
            alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '답변 내용은 필수 입력사항입니다.');
        }
    });
});

// 문의 조회
function getQna(qnaNo) {
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/qna/" + qnaNo;
    option.TYPE = "GET";
    option.CALLBACK = function(response) {
        if (response.code === 1) {
            generateQna(response.data);
        } else {
            $('html, body').animate({scrollTop: 0}, 300);
            alert_modal('modal_error', '문의 조회 실패', response.message);
            $(".modal_error .modal_btn").attr("onclick", "location.replace('/qna')");
        }
    }
    ajaxWrapper.callAjax(option);
}

// 문의 출력
function generateQna(data) {
    $(".qnaDetail_q_title p:first-child").html(data.title);
    $(".qnaDetail_q_title p:last-child").html(data.createdAt);
    $(".qnaDetail_q_category p").html(data.category);
    $(".qnaDetail_a_subTitle p").html(data.title);
    $(".qnaDetail_q_bttm p").html(data.content.replace(/\r\n|\r|\n/g, "<br>"));

    if (data.replyNo === null) {
        $(".qnaDetail_a").not(".qnaDetail_admin").css("display", "none");
    } else {
        $(".qnaDetail_a_answer p").html(data.replyContent.replace(/\r\n|\r|\n/g, "<br>"));
        $(".qnaDetail_wait").css("display", "none");
        $(".qnaDetail_admin").css("display", "none");
    }
}

// 문의 답변 저장
function saveQnaReply(qnaNo) {
    $(".qnaDetail_admin_btn").attr("disabled", true);

    let param = {
        "qnaNo": qnaNo,
        "content": $("#textarea").val(),
        "qnaPrivate": $("#checkbox").prop("checked")
    }

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/qna/reply";
    option.TYPE = "POST";
    option.HEADERS = getCsrfHeader();
    option.PARAM = JSON.stringify(param);
    option.CALLBACK = function(response) {
        $('html, body').animate({scrollTop: 0}, 300);
        if (response.code === 1) {
            alert_modal('modal_ok', '문의 답변 저장 성공', '');
            $(".modal_ok .modal_btn").attr("onclick", `location.replace('/qna/detail?no=${qnaNo}')`);
        } else {
            alert_modal('modal_error', '문의 답변 저장 실패', '');
            $(".qnaDetail_admin_btn").attr("disabled", false);
        }
    }
    ajaxWrapper.callAjax(option);
}