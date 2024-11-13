$(document).ready(function(){
    getVillageInfo();

    let swiper = new Swiper(".village_swiper", {
        pagination: {
            el: ".swiper-pagination",
            type: "fraction",
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        autoplay: {delay: 3000},
        loop: true
    });
});

let VillageJson = {};

function getVillageInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const villageName = urlParams.get('villageName');

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/village?villageName=" + villageName;
    option.TYPE = "GET";
    option.ASYNC = false;
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(res) {
        VillageJson = res.data;
        let localSpecialty = VillageJson.localSpecialty.split(',');
        let imgHtml = ``;
        for(let i = 0; i < VillageJson.addfiles.length; i++ ) {
            imgHtml += `            <div class="village_slide_items swiper-slide">`;
            imgHtml += `                <img src="${VillageJson.addfiles[i].addfile}" alt="village_img">`;
            imgHtml += `            </div>`;
        }
        $(".swiper-wrapper").empty().append(imgHtml);
        let html = ``;
        html += `        <div class="village_cont_title">`;
        html += `            <span>${VillageJson.shortDescription}</span>`;
        html += `            <h2>${VillageJson.villageName}</h2>`;
        html += `            <p>${VillageJson.description}</p>`;
        html += `        </div>`;
        html += `        <div class="village_cont_txt">`;
        html += `            <div class="village_txt_top">`;
        html += `                <div class="sub_title title_under">`;
        html += `                    <p>주요기관단체</p>`;
        html += `                </div>`;
        html += `                <table class="village_txt_top_cont">`;
        for(let i = VillageJson.institutions.length - 1; i >= 0; i-- ){
            html += `                  <tr>`;
            html += `                      <th>${VillageJson.institutions[i].name}</th>`;
            html += `                      <td>${VillageJson.institutions[i].contents}</td>`;
            html += `                  </tr>`;
        }
        html += `                </table>`;
        html += `            </div>`;
        if(VillageJson.localSpecialty.length != 0){
            html += `            <div class="village_txt_mid">`;
            html += `                <div class="sub_title title_under">`;
            html += `                    <p>지역특산품</p>`;
            html += `                </div>`;
            html += `                <ul class="village_txt_mid_cont">`;
            for (let i = 0; i < localSpecialty.length; i++){
                html += `                  <li class="item_hash">${localSpecialty[i]}</li>`;
            }
            html += `                </ul>`;
            html += `            </div>`;
        }
        if(VillageJson.villageCharacter.length != 0) {
            html += `            <div class="village_txt_bttm">`;
            html += `                <div class="sub_title title_under">`;
            html += `                    <p>지역 특성</p>`;
            html += `                </div>`;
            html += `                <ul class="village_txt_bttm_cont">`;
            for (let i = VillageJson.villageCharacter.length - 1; i >= 0; i--) {
                html += `                  <li>${VillageJson.villageCharacter[i].contents}</li>`;
            }
            html += `                </ul>`;
            html += `            </div>`;
        }
        html += `            <a href="${VillageJson.website}" title="웹사이트 바로가기" class="village_btn" target="_blank">웹사이트 바로가기</a>`;
        html += `        </div>`;
        $(".village_cont").empty().append(html);
    }
    ajaxWrapper.callAjax(option);
}
