$(document).ready(function(){
    function talentAll(){
        if($(".talent_top_major button").html() === "전체"){
            $(".talent_top_minor").css("display", "none");
            getTalentList(0);
        } else {
            $(".talent_top_minor").css("display", "block");
            let html = ``;
            if($(".talent_top_major button").html() === "대상"){
                html += `<button class="select_main">세부 분류</button>`
                html += `<ul class="select_sub" id="target">`
                html += `    <li><button class="option1">성인</button></li>`;
                html += `    <li><button class="option1">청소년</button></li>`;
                html += `    <li><button class="option1">아동</button></li>`;
                html += `</ul>`
            }
            else if($(".talent_top_major button").html() === "분야"){
                html += `<button class="select_main">세부 분류</button>`
                html += `<ul class="select_sub" id="activityType">`
                html += `    <li><button class="option1">목공</button></li>`;
                html += `    <li><button class="option1">공예</button></li>`;
                html += `    <li><button class="option1">커피</button></li>`;
                html += `    <li><button class="option1">원예</button></li>`;
                html += `    <li><button class="option1">음악</button></li>`;
                html += `    <li><button class="option1">댄스</button></li>`;
                html += `    <li><button class="option1">푸드</button></li>`;
                html += `    <li><button class="option1">사진</button></li>`;
                html += `    <li><button class="option1">기타</button></li>`;
                html += `</ul>`
            }
            else {
                html += `<button class="select_main">세부 분류</button>`
                html += `<ul class="select_sub" id="day">`
                html += `    <li><button class="option1">월</button></li>`;
                html += `    <li><button class="option1">화</button></li>`;
                html += `    <li><button class="option1">수</button></li>`;
                html += `    <li><button class="option1">목</button></li>`;
                html += `    <li><button class="option1">금</button></li>`;
                html += `    <li><button class="option1">토</button></li>`;
                html += `    <li><button class="option1">일</button></li>`;
                html += `</ul>`
            }
            $(".talent_top_minor").empty().append(html);
        }
    }
    talentAll();
    $(".talent_top_major li").click(function(){
        let select_sub =  $(this).children("button").html();
        $(".talent_top_major .select_main").text(select_sub);
        talentAll();
    });
    $(".talent_top_minor").on("click", "li", function() {
        let select_sub = $(this).children("button").html();
        $(".talent_top_minor .select_main").text(select_sub);
        getTalentList(0);
    });

    $("#searchString").keyup(function(e){
        if(e.keyCode == 13)  getTalentList(0);
    });
})

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
    getTalentList(targetPage);
}

let talentList = [];

function getTalentList(page){
    let target = '';
    let day = '';
    let activityType = '';

    let mainSelect = $(".talent_top_major .select_main").text();
    let subSelect = $(".talent_top_minor .select_main").text();
    if(mainSelect == '대상'){
        target = subSelect;
    }
    if(mainSelect == '요일'){
        day = subSelect;
    }
    if(mainSelect == '분야'){
        activityType = subSelect;
    }

    let search = $(".search").val();
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/talent?target=" + target + "&activityType=" + activityType + "&day=" + day + "&title=" + search + "&page=" + page;
    option.TYPE = "GET";
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(res) {
        talentList = res.data;

        let totalPages = talentList.totalPages;

        let pageNumber = talentList.pageable.pageNumber;

        let html = ``;
        for(let talent of talentList.content){
            html += `<li>`;
            html += `    <a href="/talent/detail?no=${talent.no}" title="재능활동 목록 컨텐츠">`;
            html += `        <div class="item_photo">`;
            if(talent.profile != null && talent.profile !== ""){
                html += `            <img src="${talent.profile}" alt="대표사진">`;
            }
            else{
                html += `            <img src="/images/dummy1.png" alt="dummy">`;
            }
            html += `            <div class="item_imgtag">`;
            html += `                <span class="tag_green">${talent.target}</span>`;
            html += `            </div>`;
            html += `        </div>`;
            html += `        <div class="item_text">`;
            html += `            <ul>`;
            html += `                <li class="item_hash">${talent.activityField}</li>`;
            html += `                <li class="item_hash">${talent.days}</li>`;
            html += `            </ul>`;
            html += `            <p class="list_title text_short">${talent.title}</p>`;
            html += `            <div class="list_text_cont">`;
            html += `                <p class="list_date">${talent.startDate}</p>`;
            html += `                <p class="list_price">${talent.price.toLocaleString()}원</p>`;
            html += `            </div>`;
            html += `            <p class="list_name text_short2">${talent.name}</p>`;
            html += `        </div>`;
            html += `        <button>더보기</button>`;
            html += `    </a>`;
            html += `</li>`;
        }
        $(".item_list").empty().append(html);

        // 현재 페이지
        let currentPage = talentList.number + 1;
        // 토탈 페이지
        let totalPage = talentList.totalPages;
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
                pageHtml += `<li class="pagenum_on"><a href="#" onclick="getTalentList(${i-1})">${i}</a></li>`;
            }
            else{
                pageHtml += `<li><a href="#" onclick="getTalentList(${i-1})">${i}</a></li>`;
            }
        }
        $("#pageable").empty().append(pageHtml);
    }
    ajaxWrapper.callAjax(option);

}