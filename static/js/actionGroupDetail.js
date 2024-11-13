$(document).ready(function(){
    // 현재페이지 액션그룹 상세 정보
    getActionDetail();

    // 현재페이지 활동내역 정보
    getActionActivityList(0);

    // 더보기 버튼 선택 시 구성원 더 나타남 + 닫기로 변경
    $(document).on("click", ".people_more", function(){
        $(".actionDetail_cont_people li").toggleClass("show")
        if($(".actionDetail_cont_people li").hasClass("show")){
            $(this).text("닫기");
        } else {
            $(this).text("더보기");
        }
    })

    // 특정 높이 이하 액션그룹 설명의 경우 펼쳐보기 보이지않음
    function moreHide(minH){
        const view_more = $(".actionDetail_detail_needs_detail").height() > minH;
        $(".actionDetail_more").toggle(view_more);
        $(".actionDetail_detail_needs_detail").css("max-height", view_more ? minH : "max-content");
    }
    moreHide(160);

    // 설명 펼쳐보기 선택 시 설명 펼쳐짐 + 버튼 텍스트 변경
    $(".actionDetail_more").click(function(){
        const text_hide_show = $(this).text() == "설명 닫기";
        $(this).text(text_hide_show ? "설명 펼쳐보기" : "설명 닫기");
        $(".actionDetail_detail_needs_detail").css("max-height", text_hide_show ? "160" : "max-content");
        $(".actionDetail_more").toggleClass("show");
    });

    //활동내역 더보기 선택 시 하단 이동
    $(".actionDetail_down_wrap").click(function(){
        $("html, body").animate({
            scrollTop : $(".actionDetail_bttm_cardList").offset().top + $("header").height()
        }, 300)
    });

    //활동내역 도달시 플로팅 버튼 보이기/숨기기
        function downScroll(n){
            $(window).on('scroll', function(){
                if($(window).scrollTop() > ($(".actionGroup_bttm").offset().top)/n) {
                    $(".actionDetail_down_btn").fadeOut(300);
                } else {
                    $(".actionDetail_down_btn").fadeIn(300);
                }
            });
        }

        if($(".actionDetail_more").hasClass("show")){
            downScroll(1);
        } else {
            downScroll(3);
        }
})

let globalTotalPage = 0;

function getActionDetail(){
    const urlParams = new URLSearchParams(window.location.search);
    const actionNo = urlParams.get('no');

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/action/detail/" + actionNo;
    option.TYPE = "GET";
    option.ASYNC = false;
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(response) {
        if(response.code == 0){
            alert_modal('modal_error', '접근 불가', response.message);
            $(".modal_error .modal_btn").attr("onclick", "location.replace('/action')");
        }
        else{
            let data = response.data;
            if(data.profile != null && data.profile != ""){
                $("#profileImg").attr("src", data.profile);
            }
            $("#actionName").text(data.name);
            $("#actionGeneration").text(data.generation + "기");
            $("#actionStage").text(data.stage);
            $("#actionType").text(data.type);
            $("#actionStartEnd").text(data.startDate + " ~ " + data.endDate);
            $("#actionMainItem").empty().append(`<li>${data.item}</li>`);
            $("#actionBackground").text(data.background);
            $("#actionDescription").html(data.description);
            let memberList = ``;
            for(let i in data.memberList){
                if(data.memberList[i].leader == 'Y'){
                    $("#actionLeader").text(data.memberList[i].userName);
                }
                else{
                    memberList += `<li class="item_hash">${data.memberList[i].userName}</li>`;
                }
            }
            memberList += `<li class="item_hash people_more">더보기</li>`;
            $("#actionMembers").empty().append(memberList);

            // 구성원 5명 초과 시 더보기 버튼 생김
            if($(".actionDetail_cont_people li").length > 6){
                $(".people_more").css("display", "block");
            } else {
                $(".people_more").css("display", "none");
            }

            $("#addActivity").attr("href", "/activity/registration?actionNo=" + data.no + "&activityNo=");
            $("#actionModify").attr("href", "/action/registration?no=" + data.no);
            $("#actionDelete").attr("onclick", 'deleteAction(' + data.no + ')');

            if(data.loginUserNo != null){
                if(data.loginUserRole == 'ROLE_ADMIN'){
                    $("#addActivity").css("display", "block");
                }
                else{
                    let authUser = data.memberList.filter(x => (x.leader == 'Y' || x.memberRole == 'Y') && x.userNo == data.loginUserNo);
                    if(authUser.length > 0){
                        $("#addActivity").css("display", "block");
                    }
                }
            }
        }
    }
    ajaxWrapper.callAjax(option);
}

function deleteAction(no){
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/action/" + no;
    option.TYPE = "DELETE";
    option.ASYNC = false;
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(response) {
        alert_modal('modal_ok', '액션그룹 삭제', response.message);
        $(".modal_ok .modal_btn").attr("onclick", "location.replace('/action')");
    }
    ajaxWrapper.callAjax(option);
}

function nextPage(step){
    let currentPage = $($(".pagenum_on > a")[0]).text();
    let targetPage = 0;
    if(step == 'next'){
        targetPage = Number(currentPage);
    }
    if(step == 'prev'){
        targetPage = Number(currentPage) - 2;
    }
    if(step == 'first'){
        targetPage = 0;
    }
    if(step == 'last'){
        targetPage = globalTotalPage -1;
    }
    if(targetPage < 0){
        alert_modal("modal_error", "존재하지 않는 페이지", "첫 페이지 입니다.");
        return;
    }
    if(targetPage >= globalTotalPage){
        alert_modal("modal_error", "존재하지 않는 페이지", "마지막 페이지 입니다.");
        return;
    }
    getActionActivityList(targetPage);
}

function getActionActivityList(page){
    const urlParams = new URLSearchParams(window.location.search);
    const actionNo = urlParams.get('no');

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/activities?actionNo=" + actionNo + "&page=" + page + "&size=4";
    option.TYPE = "GET";
    option.ASYNC = false;
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(response) {
        let data = response.data;
        if(data.content.length > 0) {
            // 현재 페이지
            let currentPage = data.number + 1;
            // 토탈 페이지
            let totalPage = data.totalPages;
            // 전역 토탈 페이지 설정
            globalTotalPage = totalPage;
            // 페이지네이션 시작 페이지
            let startPage = currentPage - 4 <= 0 ? 1 : currentPage - 4;
            // 페이지네이션 마지막 페이지
            let endPage = startPage + 9;

            if (endPage >= totalPage) {
                endPage = totalPage;
                if (endPage - startPage < 9) {
                    startPage = endPage - 9 <= 0 ? 1 : endPage - 9;
                }
            }

            // 페이지네이션 버튼 처리
            let pageHtml = ``;
            for (let i = startPage; i <= endPage; i++) {
                if (i == currentPage) {
                    pageHtml += `<li class="pagenum_on"><a href="#" onclick="getActionActivityList(${i - 1})">${i}</a></li>`;
                } else {
                    pageHtml += `<li><a href="#" onclick="getActionActivityList(${i - 1})">${i}</a></li>`;
                }
            }
            $("#pageable").empty().append(pageHtml);

            // 컨텐츠 목록
            let contents = data.content;
            let contentHtml = ``;

            contentHtml += `<ul class="item_list">`;
            for(let i in contents) {
                contentHtml += `    <li>`;
                contentHtml += `        <a href="#">`;
                contentHtml += `            <div class="item_photo">`;
                if(contents[i].profile != null && contents[i].profile != ""){
                    contentHtml += `            <img src="${contents[i].profile}" alt="대표사진"/>`;
                }
                else{
                    contentHtml += `            <img src="/images/dummy1.png" alt="더미이미지"/>`;
                }
                contentHtml += `            </div>`;
                contentHtml += `            <div class="item_text">`;
                contentHtml += `                <p class="list_title text_short">${contents[i].title}</p>`;
                contentHtml += `                <div class="list_contents">`;
                contentHtml += `                    <p class="list_period">${contents[i].startDate} ~ ${contents[i].endDate}</p>`;
                contentHtml += `                </div>`;
                contentHtml += `            </div>`;
                contentHtml += `            <button onclick="location.href = '/activity/detail?no=${contents[i].no}'">더보기</button>`;
                contentHtml += `        </a>`;
                contentHtml += `    </li>`;
            }
            contentHtml += `</ul>`;

            $(".actionDetail_bttm_cardList").empty().append(contentHtml);
        }
    }
    ajaxWrapper.callAjax(option);
}