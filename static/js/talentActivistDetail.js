$(document).ready(function(){

    getActivistDetail();

    // 특정 높이 이하 텍스트의 경우 펼쳐보기 보이지않음
    function moreHide(minH){
            let view_more = $(".talentDetail_txt_detail").height() > minH;
             $(".talentDetail_txt_more").toggle(view_more);
            $(".talentDetail_txt_detail").css("max-height", view_more ? minH : "max-content");
        }

    moreHide(160);

    $(document).on("click", ".talentDetail_txt_more", function(){
        const text_hide_show = $(this).text() == "설명 닫기";
        $(this).text(text_hide_show ? "설명 펼쳐보기" : "설명 닫기");
        $(".talentDetail_txt_detail").css("max-height", text_hide_show ? "160px" : "max-content");
        $(".talentDetail_txt_more").toggleClass("show");
    });
})

let detailJSON = [];

function getActivistDetail(){
    const urlParams = new URLSearchParams(window.location.search);
    const activistNo = urlParams.get('no');

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/talent/detail/"+ activistNo;
    option.TYPE = "GET";
    option.ASYNC = false;
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(res) {
        detailJSON = res.data;
        $("#title").text(detailJSON[0].title);
        $(".talentDetail_txt_detail").html(detailJSON[0].detail);
        if(detailJSON[0].profile != null && detailJSON[0].profile !== ""){
            $("#profileImg").attr("src", detailJSON[0].profile );
        }
        if(detailJSON[0].auth != 1){
            $(".talentDetail_edit_wrap").prepend(`<a href="#" id="listBtn" onclick="goToList()" title="목록" class="talentDetail_list_btn">목록</a>`)
        }

        let html = ``;
        for(let detail of detailJSON){
            html += `  <tr>`;
            html += `      <th>활동가명</th>`;
            html += `      <td>${detail.name}</td>`;
            html += `  </tr>`;
            html += `  <tr>`;
            html += `      <th>연락처</th>`;
            html += `      <td>${detail.tel}</td>`;
            html += `  </tr>`;
            html += `  <tr>`;
            html += `      <th>경력</th>`;
            html += `      <td>`;
            for(let i = 0; i < detail.careerList.length; i++){
                html += `          <ul class="talentDetail_cont_career">`;
                html += `              <li>${detail.careerList[i].careerField}</li>`;
                html += `              <li>${detail.careerList[i].content}</li>`;
                html += `              <li>${detail.careerList[i].careerFrom} - ${detail.careerList[i].careerTo}</li>`;
                html += `          </ul>`;
            }
            html += `      </td>`;
            html += `  </tr>`;
            html += `  <tr>`;
            html += `      <th>자격증</th>`;
            html += `      <td>`;
            for(let i = 0; i < detail.qualificationList.length; i++){
                html += `          <ul class="talentDetail_cont_license">`;
                html += `              <li>${detail.qualificationList[i].qualificationField}</li>`;
                html += `              <li>${detail.qualificationList[i].validFrom}</li>`;
                html += `          </ul>`;
            }
            html += `      </td>`;
            html += `  </tr>`;
        }
        $("#masterInfo").empty().append(html);

        let activityHtml = ``;
        for(let detail of detailJSON){
            activityHtml += `<tr>`;
            activityHtml += `  <th>동기</th>`;
            activityHtml += `  <td>${detail.motive}</td>`;
            activityHtml += `</tr>`;
            activityHtml += `<tr>`;
            activityHtml += `  <th>분야</th>`;
            activityHtml += `  <td>`;
            activityHtml += `      <ul class="talentDetail_cont_field">`;
            activityHtml += `          <li class="item_hash">${detail.activityField}</li>`;
            activityHtml += `      </ul>`;
            activityHtml += `  </td>`;
            activityHtml += `</tr>`;
            activityHtml += `<tr>`;
            activityHtml += `  <th>형식</th>`;
            activityHtml += `  <td>${detail.activityType}</td>`;
            activityHtml += `</tr>`;
            activityHtml += `<tr>`;
            activityHtml += `  <th>대상자</th>`;
            activityHtml += `  <td>${detail.target}</td>`;
            activityHtml += `</tr>`;
            activityHtml += `<tr>`;
            activityHtml += `  <th>가격</th>`;
            activityHtml += `  <td>${detail.price.toLocaleString()}원</td>`;
            activityHtml += `</tr>`;
            activityHtml += `<tr>`;
            activityHtml += `  <th>장소</th>`;
            activityHtml += `  <td>${detail.location}</td>`;
            activityHtml += `</tr>`;
            activityHtml += `<tr>`;
            activityHtml += `  <th>기간</th>`;
            activityHtml += `  <td>${detail.startDate} - ${detail.endDate}</td>`;
            activityHtml += `</tr>`;
            activityHtml += `<tr>`;
            activityHtml += `  <th>시간</th>`;
            activityHtml += `  <td>`;
            for(let i = 0 ; i < detail.scheduleList.length; i++){
                activityHtml += `      <ul class="talentDetail_cont_time">`;
                activityHtml += `          <li>${detail.scheduleList[i].day}</li>`;
                activityHtml += `          <li>${detail.scheduleList[i].startTime} - ${detail.scheduleList[i].endTime}</li>`;
                activityHtml += `      </ul>`;
            }
            activityHtml += `  </td>`;
            activityHtml += `</tr>`;
        }
        $("#activityInfo").empty().append(activityHtml);
    }
    ajaxWrapper.callAjax(option);
}

function updateActivity(){
    const urlParams = new URLSearchParams(window.location.search);
    const activistNo = urlParams.get('no');

    location.replace(`/talent/registration?no=${activistNo}`);
}

function deleteActivity() {
    const urlParams = new URLSearchParams(window.location.search);
    const activistNo = urlParams.get('no');

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/talent/"+ activistNo;
    option.TYPE = "PUT";
    option.ASYNC = false;
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(res) {
        console.log(res);
        if(res.code == 49) {
            alert_modal("modal_ok", "재능활동가 삭제되었습니다.", "재능활동 목록 페이지로 이동합니다.", function() {
                window.location.replace("/talent");
            });
        }
    }
    ajaxWrapper.callAjax(option);
}

function applyActivity(){
    const urlParams = new URLSearchParams(window.location.search);
    const activistNo = urlParams.get('no');

    location.replace(`/talent/apply?no=${activistNo}`);
}

function goToList(){
    const urlParams = new URLSearchParams(window.location.search);
    const activistNo = urlParams.get('no');

    location.replace(`/talent/applyList?no=${activistNo}`);
}