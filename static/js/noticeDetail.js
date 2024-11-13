$(document).ready(function() {
    const param = new URLSearchParams(location.search);
    const noticeNo = param.get("no");

    getNotice(noticeNo);

    // 공지사항 수정
    $(".noticeDetail_edit_btn").on("click", function() {
        location.href = "/notice/registration?no=" + noticeNo;
    });

    // 공지사항 삭제 확인
    $(".noticeDetail_delete_btn").on("click", function() {
        $('html, body').animate({scrollTop: 0}, 300);
        alert_modal('modal_confirm', '공지사항 삭제', '');
        $(".modal_confirm .modal_btn:last-child").attr("onclick", `deleteNotice(${noticeNo})`);
    });
});

// 공지사항 조회
function getNotice(noticeNo) {
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/notice/detail/" + noticeNo;
    option.TYPE = "GET";
    option.CALLBACK = function(response) {
        if (response.code === 1) {
            generateNotice(response.data);
        } else {
            $(".noticeDetail_delete_btn, .noticeDetail_edit_btn").attr("disabled", true);
            $('html, body').animate({scrollTop: 0}, 300);
            alert_modal('modal_error', '공지사항 조회 실패', '');
            $(".modal_error .modal_btn").attr("onclick", "location.replace('/notice')");
        }
    }
    ajaxWrapper.callAjax(option);
}

// 공지사항 출력
function generateNotice(data) {
    $(".noticeDetail_top span").html(data.category);
    $(".noticeDetail_title").html(data.title);
    $(".noticeDetail_userData p:last-child").html(data.createdAt);
    $(".noticeDetail_mid_cont").html(data.content);

    if (data.addfileList.length > 0) {
        let html = ``;
        for (let addfile of data.addfileList) {
            let fileName = addfile.addfile;
            html += `<a href="${fileName}">${fileName.substring(fileName.indexOf("_") + 1)}</a>`;
        }
        $(".noticeDetail_download").empty().append(html);
    } else {
        $(".noticeDetail_bttm").css("display", "none");
        $(".noticeDetail_download").empty();
    }
}

// 공지사항 삭제
function deleteNotice(noticeNo) {
    $(".noticeDetail_delete_btn, .noticeDetail_edit_btn").attr("disabled", true);

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/notice/" + noticeNo;
    option.TYPE = "PUT";
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(response) {
        if (response.code === 1) {
            $('html, body').animate({scrollTop: 0}, 300);
            alert_modal('modal_ok', '공지사항 삭제 성공', '');
            $(".modal_ok .modal_btn").attr("onclick", "location.replace('/notice')");
        } else {
            $('html, body').animate({scrollTop: 0}, 300);
            alert_modal('modal_error', '공지사항 삭제 실패', '');
            $(".noticeDetail_delete_btn, .noticeDetail_edit_btn").attr("disabled", false);
        }
    }
    ajaxWrapper.callAjax(option);
}