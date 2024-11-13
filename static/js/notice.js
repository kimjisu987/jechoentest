$(document).ready(function(){
    getNoticeList(0);

    // 카테고리 검색
    $(".notice_tab_btn").click(function(){
        $(".notice_tab_btn").addClass("btn_off");
        $(this).removeClass("btn_off");
        category = $(this).html();
        getNoticeList(0);
    });

    // 키워드 검색 - 엔터
    $("#search_keyword").on("keydown", function() {
        if (window.event.keyCode === 13) {
            keyword = $(this).val();
            getNoticeList(0);
        }
    });

    // 키워드 검색 - 클릭
    $("#search_btn").on("click", function() {
        keyword = $("#search_keyword").val();
        getNoticeList(0);
    });
})

let category = "전체";
let keyword = "";
let globalTotalPage = 0;

// 공지사항 목록 조회
function getNoticeList(page) {
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/notice/list?category=" + category + "&keyword=" + keyword + "&page=" + page;
    option.TYPE = "GET";
    option.CALLBACK = function(response) {
        if (response.code === 1) {
            generateNoticeList(response.data);
        } else {
            $('html, body').animate({scrollTop: 0}, 300);
            alert_modal('modal_error', '공지사항 목록 조회 실패', '');
        }
    }
    ajaxWrapper.callAjax(option);
}

// 공지사항 목록 출력
function generateNoticeList(data) {
    let idx = data.totalElements - (data.pageable.pageNumber * data.pageable.pageSize);

    // 공지사항 테이블
    let listHtml = ``;
    for (let notice of data.content) {
        listHtml += `<tr>`;
        listHtml += `    <td>${idx--}</td>`;
        listHtml += `    <td>${notice.category}</td>`;
        listHtml += `    <td class="text_short" onclick="location.href='/notice/detail?no=${notice.noticeNo}'">${notice.title}</td>`;
        listHtml += `    <td>관리자</td>`;
        listHtml += `    <td>${notice.createdAt}</td>`;
        listHtml += `</tr>`;
    }
    $("#notice_list").empty().append(listHtml);

    let totalPage = data.totalPages;
    globalTotalPage = totalPage;

    let currentPage = data.number + 1;
    let startPage = currentPage - 4 <= 0 ? 1 : currentPage - 4;
    let endPage = startPage + 9;

    if (endPage >= totalPage) {
        endPage = totalPage;
        if (endPage - startPage < 9) {
            startPage = endPage - 9 <= 0 ? 1 : endPage - 9;
        }
    }

    // 페이지 리스트
    let pageHtml = ``;
    for (let page = startPage; page <= endPage; page++) {
        if (page === currentPage) {
            pageHtml += `<li class="pagenum_on"><a href="#" onclick="getNoticeList(${page - 1})">${page}</a></li>`;
        } else {
            pageHtml += `<li><a href="#" onclick="getNoticeList(${page - 1})">${page}</a></li>`;
        }
    }
    $("#page_list").empty().append(pageHtml);
}

// 페이지 이동
function nextPage(step) {
    let currentPage = $(".pagenum_on a").html() * 1;
    let targetPage = 0;

    if (step === "first") {
        targetPage = 0;
    } else if (step === "prev") {
        targetPage = currentPage - 2;
    } else if (step === "next") {
        targetPage = currentPage;
    } else if (step === "last") {
        targetPage = globalTotalPage - 1;
    }

    if (targetPage < 0) {
        $('html, body').animate({scrollTop: 0}, 300);
        alert_modal('modal_error', '존재하지 않는 페이지', '첫 페이지 입니다.');
        return;
    } else if (targetPage >= globalTotalPage) {
        $('html, body').animate({scrollTop: 0}, 300);
        alert_modal('modal_error', '존재하지 않는 페이지', '마지막 페이지 입니다.');
        return;
    }

    getNoticeList(targetPage);
}