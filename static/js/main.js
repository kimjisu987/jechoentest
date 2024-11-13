$(document).ready(function(){
    // 기본 마을
    getVillageInfo('봉양읍');
    $(".village_map").css("background-position","-400px 0px");

    // 비주얼 영역 스와이퍼
    var swiper = new Swiper(".visual_swiper", {
        spaceBetween: 0,
        centeredSlides: true,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".visual_button_next",
            prevEl: ".visual_button_prev",
        },
    });    
    // 액션그룹, 재능활동가, 공동체마켓 스와이퍼
    contentsSwiper = new Swiper(".tab_swiper", {
        slidesPerView: "1.2",
        spaceBetween: 16,
        loop: true,
        navigation: {
            nextEl: ".tab_button_next",
            prevEl: ".tab_button_prev",
        },
        breakpoints: {
            // 428 이상에만 적용
            428: {
                slidesPerView: "2"
            },
            // 768 이상에만 적용
            768: {
                slidesPerView: "3"
            }
        }
    });
    // 미리보기 모달 스와이퍼
    var swiper = new Swiper(".preview_swiper", {
        slidesPerView: 1,
        loop: true,
        pagination: {
            el: ".preview_pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".preview_button_next",
            prevEl: ".preview_button_prev",
        },
    });
    $(".preview_close").click(function(){
        $(".preview_modal").fadeOut(100);
    })
    // 마을현황 탭
    $(".village_tab > li > a").click(function(e){
        e.preventDefault();
        $(".village_tab > li > a").removeClass("village_act");
        $(this).addClass("village_act");
        // 이미지 위치
        let villages = [
            { village: $(".baegun"), image: "0px 0px"},
            { village: $(".bongyang"), image: "-400px 0px"},
            { village: $(".songhak"), image: "-800px 0px"},
            { village: $(".uirimji"), image: "-1200px 0px"},
            { village: $(".yongdu"), image: "-1600px 0px"},
            { village: $(".cheongjeon"), image: "0px -500px"},
            { village: $(".gyo"), image: "-400px -500px"},
            { village: $(".jungang"), image: "-800px -500px"},
            { village: $(".yeongseo"), image: "-1200px -500px"},
            { village: $(".namhyeon"), image: "-1600px -500px"},
            { village: $(".hwasan"), image: "0px -1000px"},
            { village: $(".sinbaek"), image: "-400px -1000px"},
            { village: $(".geumseong"), image: "-800px -1000px"},
            { village: $(".cheongpung"), image: "-1200px -1000px"},
            { village: $(".susan"), image: "-1600px -1000px"},
            { village: $(".hansu"), image: "0px -1500px"},
            { village: $(".deoksan"), image: "-400px -1500px"}
        ];
        villages.forEach(({village, image}) => {
            if(village.hasClass("village_act")) {
                $(".village_map").css("background-position",image);
            } else {
            }
        });
        // 선택한 마을정보로 데이터 업데이트
        getVillageInfo($(this).text());
    });
    // 액션그룹 ~ 마켓 탭
    $(".sec_tab_list > li > a").click(function(e){
        e.preventDefault();
        $(".sec_tab_list > li > a").removeClass("tab_list_act");
        $(this).addClass("tab_list_act");
        getSwiperContents(this.title);
    });
    getSwiperContents("액션그룹");
    // 알림 마당 - 공지사항 목록
    getNotice();
    // 알림 마당 - 묻고 답하기 목록
    getQna();
});

let contentsSwiper = null;

function getVillageInfo(villageName){
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/village?villageName=" + villageName;
    option.TYPE = "GET";
    option.ASYNC = false;
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(res) {
        let data = res.data;
        $("#villageName").text(data.villageName);
        $("#villageDescription").text(data.description);
        let html = ``;
        if(data.localSpecialty.length != 0){
            html += `<dt>지역특산품</dt><dd>${data.localSpecialty}</dd>`;
        }
        if(data.villageCharacter.length != 0){
            html += `<dt>지역특성</dt>`;
            html += `<dd>`;
            for(let i = data.villageCharacter.length - 1; i >= 0; i--){
                html += `${data.villageCharacter[i].contents}`;
                if(i != 0){
                    html += `<br>`;
                }
            }
            html += `</dd>`;
        }
        $("#infos").empty().append(html);
        $(".village_btn").attr("onclick", `location.href='/village?villageName=${data.villageName}'`);
    }
    ajaxWrapper.callAjax(option);
}

// 알림 마당 - 공지사항 목록
function getNotice() {
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/notice/list?category=전체&keyword=&size=5&page=0";
    option.TYPE = "GET";
    option.CALLBACK = function(response) {
        let html = ``;
        for (let i = 0; i < response.data.numberOfElements; i++) {
            let notice = response.data.content[i];
            html += `<li>`;
            html += `    <a href="/notice/detail?no=${notice.noticeNo}" title="내용 더보기">`;
            html += `        <span class="notice_category">${notice.category}</span>`;
            html += `        <span class="notice_title">${notice.title}</span>`;
            html += `        <span class="notice_date">${notice.createdAt.slice(0, 10)}</span>`;
            html += `    </a>`;
            html += `</li>`;
        }
        $(".notice_list").empty().append(html);
    }
    ajaxWrapper.callAjax(option);
}

// 알림 마당 - 묻고 답하기 목록
function getQna() {
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/qna?category=전체&target=&size=5&page=0";
    option.TYPE = "GET";
    option.CALLBACK = function(response) {
        let html = ``;
        for (let i = 0; i < response.data.numberOfElements; i++) {
            let qna = response.data.content[i];
            html += `<li>`;
            html += `    <a href="/qna/detail?no=${qna.qnaNo}" title="내용 더보기">`;
            html += `        <span class="qna_category">${qna.category}</span>`;
            html += `        <span class="qna_title">${qna.title}</span>`;
            html += `        <span class="qna_date">${qna.createdAt.slice(0, 10)}</span>`;
            html += `    </a>`;
            html += `</li>`;
        }
        $(".qna_list").empty().append(html);
    }
    ajaxWrapper.callAjax(option);
}

// 액션그룹, 재능활동가, 마켓 스와이퍼 데이터 가져오기
function getSwiperContents(target){
    let url = "";
    let tag = "";
    if(target.includes("액션그룹")){
        url = "/api/v1/actions?name=&status=&stage=&type=&page=0&size=5";
        tag = "액션그룹";
    }
    if(target.includes("재능활동가")){
        url = "/api/v1/talent?target=&activityType=&day=&title=&page=0&size=5";
        tag = "재능활동가";
    }
    if(target.includes("공동체마켓")){
        url = "";
    }

    if(url != ""){
        let option = deepExtend({}, ajaxOptions);
        option.URL = url;
        option.TYPE = "GET";
        option.CALLBACK = function(response) {
            console.log(response);
            let swiperHtml = ``;
            let contents = response.data.content;
            if(tag == "액션그룹"){
                for(let i in contents){
                    swiperHtml += `<div class="swiper-slide">`;
                    swiperHtml += `    <a href="/action/detail?no=${contents[i].no}" title="내용 더보기">`;
                    swiperHtml += `        <div class="list_photo">`;
                    if(contents[i].profile != null && contents[i].profile != ""){
                        swiperHtml += `            <img src="${contents[i].profile}" alt=""/>`;
                    }
                    else{
                        swiperHtml += `            <img src="/images/dummy1.png" alt=""/>`;
                    }
                    swiperHtml += `            <div class="item_imgtag">`;
                    swiperHtml += `                <span class="tag_action">액션그룹</span>`;
                    swiperHtml += `            </div>`;
                    swiperHtml += `        </div>`;
                    swiperHtml += `        <div class="item_text">`;
                    swiperHtml += `            <ul>`;
                    swiperHtml += `                <li class="item_hash hash_yg">${contents[i].type}</li>`;
                    swiperHtml += `                <li class="item_hash hash_black">${contents[i].status}</li>`;
                    swiperHtml += `                <li class="item_hash hash_yg">${contents[i].stage}</li>`;
                    swiperHtml += `                <li class="item_hash hash_black">${contents[i].generation}기</li>`;
                    swiperHtml += `            </ul>`;
                    swiperHtml += `            <p class="list_title">${contents[i].name}</p>`;
                    swiperHtml += `            <p class="list_detail"></p>`;
                    swiperHtml += `            <p class="list_date">${contents[i].userName}(${contents[i].userId})</p>`;
                    swiperHtml += `        </div>`;
                    swiperHtml += `        <button type="button" class="swiper_view_btn" onclick="location.href = '/action/detail?no=${contents[i].no}'">더보기</button>`;
                    swiperHtml += `    </a>`;
                    swiperHtml += `</div>`;
                }
                $(".tab_list_btn").attr("onclick", "location.href='/action'");
            }
            if(tag == "재능활동가"){
                for(let i in contents){
                    swiperHtml += `<div class="swiper-slide">`;
                    swiperHtml += `    <a href="/talent/detail?no=${contents[i].no}" title="내용 더보기">`;
                    swiperHtml += `        <div class="list_photo">`;
                    if(contents[i].profile != null && contents[i].profile != ""){
                        swiperHtml += `            <img src="${contents[i].profile}" alt=""/>`;
                    }
                    else{
                        swiperHtml += `            <img src="/images/dummy1.png" alt=""/>`;
                    }
                    swiperHtml += `                <div class="item_imgtag">`;
                    swiperHtml += `                    <span class="tag_talent">재능활동가</span>`;
                    swiperHtml += `                </div>`;
                    swiperHtml += `        </div>`;
                    swiperHtml += `        <div class="item_text">`;
                    swiperHtml += `            <ul>`;
                    swiperHtml += `                <li class="item_hash hash_yg">${contents[i].activityField}</li>`;
                    swiperHtml += `                <li class="item_hash hash_black">${contents[i].target}</li>`;
                    swiperHtml += `                <li class="item_hash hash_yg">${contents[i].days}</li>`;
                    swiperHtml += `                <li class="item_hash hash_black">${contents[i].price}원</li>`;
                    swiperHtml += `            </ul>`;
                    swiperHtml += `            <p class="list_title">${contents[i].title}</p>`;
                    swiperHtml += `            <p class="list_detail"></p>`;
                    swiperHtml += `            <p class="list_date">${contents[i].startDate}</p>`;
                    swiperHtml += `        </div>`;
                    swiperHtml += `        <button type="button" class="swiper_view_btn" onclick="location.href = '/talent/detail?no=${contents[i].no}'">더보기</button>`;
                    swiperHtml += `    </a>`;
                    swiperHtml += `</div>`;
                }
                $(".tab_list_btn").attr("onclick", "location.href='/talent'");
            }
            $("#contentsSwiper").empty().append(swiperHtml);
            contentsSwiper.init();
        }
        ajaxWrapper.callAjax(option);
    }
}
