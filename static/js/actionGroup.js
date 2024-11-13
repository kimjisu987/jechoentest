$(document).ready(function(){
    actionAll();
    getActionList(0);
    $(".actionGroup_top_major li").click(function(){
        let select_sub =  $(this).children("button").html();
        $(".actionGroup_top_major .select_main").text(select_sub);
        actionAll();
        if($(".actionGroup_top_major .select_main").text() == '전체'){
            getActionList(0);
        }
    });

    $(document).on("click", ".actionGroup_top_minor li", function() {
        let select_sub = $(this).children("button").html();
        $(".actionGroup_top_minor .select_main").text(select_sub);
        getActionList(0);
    });

    $("#searchString").keyup(function(e){
        if(e.keyCode == 13)  getActionList(0);
    });
})

let globalTotalPage = 0;

function actionAll(){
    let btnName = $(".actionGroup_top_major button").html();
    if(btnName === "전체"){
        $(".actionGroup_top_minor").css("display", "none");
    }
    else {
        $(".actionGroup_top_minor").css("display", "block");
        let html = ``;
        if(btnName === "유형"){
            $(".actionGroup_top_minor .select_main").text('생산가공');
            html += `<li><button>생산가공</button></li>`;
            html += `<li><button>유통소비</button></li>`;
            html += `<li><button>공동체</button></li>`;
            html += `<li><button>체험프로그램</button></li>`;
        }
        if(btnName === "단계"){
            $(".actionGroup_top_minor .select_main").text('스타트업');
            html += `<li><button>스타트업</button></li>`;
            html += `<li><button>스텝업</button></li>`;
            html += `<li><button>점프업</button></li>`;
        }
        if(btnName === "진행"){
            $(".actionGroup_top_minor .select_main").text('사업진행');
            html += `<li><button>사업진행</button></li>`;
            html += `<li><button>사업완료</button></li>`;
        }
        $(".actionGroup_top_minor .select_sub").empty().append(html);
    }
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
    getActionList(targetPage);
}

function getActionList(page){
    let searchString = $("#searchString").val();
    let status = '';
    let stage = '';
    let type = '';

    let mainSelect = $(".actionGroup_top_major .select_main").text();
    let subSelect = $(".actionGroup_top_minor .select_main").text();
    if(mainSelect == '유형'){
        type = subSelect;
    }
    if(mainSelect == '단계'){
        stage = subSelect;
    }
    if(mainSelect == '진행'){
        status = subSelect;
    }

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/actions?name=" + searchString + "&status=" + status + "&stage=" + stage + "&type=" + type + "&page=" + page;
    option.TYPE = "GET";
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(response) {
        let data = response.data;
        if(data.content.length == 0){
            alert_modal("modal_error", "데이터가 없습니다.", "검색 결과가 존재하지 않습니다.");
        }

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

        if(endPage >= totalPage){
            endPage = totalPage;
            if(endPage - startPage < 9){
                startPage = endPage - 9 <= 0 ? 1 : endPage - 9;
            }
        }

        // 페이지네이션 버튼 처리
        let pageHtml = ``;
        for(let i = startPage; i <= endPage; i++){
            if(i == currentPage){
                pageHtml += `<li class="pagenum_on"><a href="#" onclick="getActionList(${i-1})">${i}</a></li>`;
            }
            else{
                pageHtml += `<li><a href="#" onclick="getActionList(${i-1})">${i}</a></li>`;
            }
        }
        $("#pageable").empty().append(pageHtml);

        // 컨텐츠 목록
        let contents = data.content;
        let contentHtml = ``;
        contentHtml += `<ul class="item_list">`;
        for(let i in contents) {
            contentHtml += `<li>`;
            contentHtml += `    <a href="#">`;
            contentHtml += `        <div class="item_photo">`;
            if(contents[i].profile != null && contents[i].profile != ""){
                contentHtml += `            <img src="${contents[i].profile}" alt="대표사진"/>`;
            }
            else{
                contentHtml += `            <img src="/images/dummy1.png" alt="더미이미지"/>`;
            }
            contentHtml += `            <div class="item_imgtag">`;
            if (contents[i].status == '사업진행') {
                contentHtml += `                <span class="tag_green">진행</span>`;
            } else {
                contentHtml += `                <span class="tag_black">완료</span>`;
            }
            contentHtml += `                <span class="tag_blue">${contents[i].type}</span>`;
            contentHtml += `            </div>`;
            contentHtml += `        </div>`;
            contentHtml += `        <div class="item_text">`;
            contentHtml += `            <ul>`;
            contentHtml += `                <li class="item_hash">${contents[i].stage}</li>`;
            contentHtml += `                <li class="item_hash">1기</li>`;
            contentHtml += `            </ul>`;
            contentHtml += `            <p class="list_title text_short">${contents[i].name}</p>`;
            contentHtml += `            <div>`;
            contentHtml += `                <p class="list_name text_short2">${contents[i].userName}</p>`;
            contentHtml += `                <p class="list_userId">(${contents[i].userId})</p>`;
            contentHtml += `            </div>`;
            contentHtml += `        </div>`;
            contentHtml += `        <button onclick="location.href = '/action/detail?no=${contents[i].no}'">더보기</button>`;
            contentHtml += `    </a>`;
            contentHtml += `</li>`;
        }
        contentHtml += `</ul>`;
        $(".actionGroup_mid").empty().append(contentHtml);
    }
    ajaxWrapper.callAjax(option);
}