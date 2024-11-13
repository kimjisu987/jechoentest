$(document).ready(function(){
    getTalentList(0);
    //모달 여닫기
    $(".applyModal_modal_x").on("click",function(){
        if($(".apply_btns_submit").hasClass("off")){
            $(".applyModal").fadeOut(200);
        } else {
            alert_modal("modal_confirm", "정말 창을 닫으시겠습니까?", "완료 버튼으로 제출해야 내용이 반영됩니다.");
            modal_check();
        }
    });

    //제출 컨펌
    $(".btn_submit").on("click", function(){
        if($(".applyModal_btns_reject").hasClass("on")){
            reason_check();
            if(($(".reason_error").hasClass("off"))){
                submit_check();
            } else {
                alert_modal("modal_error", "사유 미입력", "사유를 입력해주세요.");
            }
        } else {
            submit_check();
        }
    });

    // 승인 컨펌
    $(".applyModal_btns_approve").on("click", function(){
        $(".applyModal_btns_approve").toggleClass("on");
        $(".apply_btns_mid_wrap button").removeClass("on disabled");
        if($(this).hasClass("on")){
            $(".applyModal_btns_deny").removeClass("off");
            $(".applyModal_btns_reject").addClass("off");
        } else {
            $(".applyModal_btns_deny").addClass("off");
            $(".applyModal_btns_reject").removeClass("off");
        }
    });

    //진행 현황
    $(".apply_btns_mid_wrap button").on("click", function(){
        if($(".applyModal_btns_approve").hasClass("on")){
            $(".apply_btns_mid_wrap button").removeClass("on");
            $(this).toggleClass("on");
        } else {
        }
    });

    //거부, 승인 취소 컨펌
    $(".applyModal_btns_reject, .applyModal_btns_deny").on("click", function(){
        let e = $(this).html();
        alert_modal("modal_confirm", e, e + "하시겠습니까? " + e + " 시 취소는 불가능합니다.");

        $(".modal_btn").click(() => {
            if ($(this).index() !== 0) {  // 확인 버튼 클릭 시에만 실행
                // 클릭한 버튼에만 `on` 클래스를 토글하고 다른 버튼의 `on` 클래스는 제거
                $(this).toggleClass("on");
                $(this).siblings(".applyModal_btns_reject, .applyModal_btns_deny").removeClass("on");

                // 승인 버튼은 `disabled` 클래스를 토글
                $(".applyModal_btns_approve").toggleClass("disabled");

                // 중간 버튼 영역의 `off` 클래스 토글
                $(".apply_btns_mid").toggleClass("off");

                // 중간 버튼 랩의 모든 버튼에서 `on` 클래스 제거
                $(".apply_btns_mid_wrap button").removeClass("on");

                // classNo 함수 호출
                classNo(e);
            }
        });
    });


    //유효성 검사
    //사유 입력 체크
    function reason_check(){
        let reason = $("#reason");

        if(reason.val().length < 1){
            $(".reason_error").removeClass("off");
        } else {
            $(".reason_error").addClass("off");
        }
    }

    $(document).on("click", "button", function(){
        if(!($(this).siblings().hasClass("on"))){
        } else {
            make_btnDefault();
        }
    });

    //제출 체크
    function submit_check(){
        if(!($(".applyModal_btns_top button").hasClass("on"))){
                //승인이나 거부 여부 미선택 후 제출 시
                alert_modal("modal_confirm", "승인 여부 미선택", "승인 여부를 선택하지 않았습니다. 이대로 창을 종료하시겠습니까?");
                modal_check();
            } else {
                //뭐라도 선택 후에 제출 시
                alert_modal("modal_confirm", "제출하시겠습니까?", "제출 시 수정이 어렵습니다. 한번 더 확인해주세요.",function(){
                    updateApplyList();
                    getTalentList(0);
                });
                modal_check();
            }
    }
    $("#search").keyup(function(e){
        if(e.keyCode == 13)  getTalentList(0);
    });
})

//모달 여닫기
function modal_check() {
    $(".modal_btn").click(function(){
        if ($(this).index() !== 0) {
            $(".applyModal").fadeOut(200, function() {
                $(".class_no").empty();
                make_btnDefault();
            });
        }
    });
}

//버튼 초기화
function make_btnDefault(){
    $(".applyModal_btns_approve").removeClass("on disabled");
    $(".applyModal_btns_deny").removeClass("on");
    $(".applyModal_btns_reject").removeClass("on");
    $(".applyModal_btns_before").removeClass("on");
    $(".apply_btns_mid").removeClass("off");
    $(".class_no").addClass("off");
    $(".class_no").html("<div lass='class_no off'></div>");
    $(".apply_btns_mid_wrap button").removeClass("on");
}

function classNo(btnName){
    let no =
        `<div class="input_fields">
            <label for="textarea" class="required">${btnName}사유</label>
             <textarea name="textarea" id="reason" placeholder="사유 입력" required></textarea>
            <p class="reason_error off">사유를 입력하세요.</p>
            </div>`;
    $(".class_no").removeClass("off");
    $(".class_no").append(no);
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
    getTalentList(targetPage);
}

let applyList = [];

function getTalentList(page){
    const urlParams = new URLSearchParams(window.location.search);
    let no = urlParams.get('no');
    if(no == null){
        no = 0;
    }

    let search = $("#search").val();
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/talent/applyList?&no="+ no +"&search=" + search + "&page=" + page;
    option.TYPE = "GET";
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(res) {
        if(res.code == 1){
            applyList = res.data;
            let idx = applyList.totalElements - (applyList.pageable.pageNumber * applyList.pageable.pageSize);

            let html = ``;
            for(let list of applyList.content) {
                let statusClass = "";
                let progressStatis = "";

                if (list.status === "승인 완료") {
                    statusClass = "applyList_abled";
                } else if (list.status === "승인 거부") {
                    statusClass = "applyList_reject";
                } else if (list.status === "승인 전") {
                    statusClass = "applyList_ready";
                } else {
                    statusClass = "applyList_disabled";
                }

                if (list.activityStatus === "진행 중") {
                    progressStatis = "applyList_abled";
                } else if (list.activityStatus === "진행 전") {
                    progressStatis = "applyList_ready";
                } else {
                    progressStatis = "applyList_disabled";
                }


                html += `<tr onclick="showModal(${list.no})">`;
                html += `<td>${idx--}</td>`;
                html += `<td><span class="text_short">${list.activityTitle}</span></td>`;
                html += `<td class="text_short2">${list.name}</td>`;
                html += `<td>${list.tel}</td>`;
                html += `<td>${list.createdAt}</td>`;
                html += `<td><button class="${statusClass}">${list.status}</button></td>`;
                html += `<td><button class="${progressStatis}">${list.activityStatus}</button></td>`;
                html += `</tr>`;
            }
            $("#applyList").empty().append(html);

            // 현재 페이지
            let currentPage = applyList.number + 1;
            // 토탈 페이지
            let totalPage = applyList.totalPages;
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
        else{
            alert_modal('modal_error', '권한 없음', '해당 페이지에 접근하실 권한이 없습니다.',function() {
                window.location.replace("/talent");
            });
        }

    }
    ajaxWrapper.callAjax(option);

}

function showModal(no){
    $("#applyNo").val(no);

    const list = applyList.content.find(x => x.no == no);

    $(".applyModal").fadeIn(200);

    $("#profile").attr('src',list.profile);
    $("#title").html(list.activityTitle);
    $("#studentName").html(list.name);
    $("#tel").html(list.tel);
    $("#email").html(list.email);
    $("#price").html(list.price.toLocaleString() + "원");

    $(".applyModal_btns_approve").removeClass("on");
    $(".applyModal_btns_deny").addClass("off");

    if (list.status === "승인 완료") {
        $(".applyModal_btns_approve").addClass("on");
        $(".applyModal_btns_deny").removeClass("off");
        $(".applyModal_btns_reject").addClass("off")
    } else if (list.status === "거부") {
        $(".applyModal_btns_reject").removeClass("off");
        $(".applyModal_btns_reject").addClass("on");
        $(".apply_btns_mid").toggleClass("off");
        $(".apply_btns_mid_wrap button").removeClass("on");
        classNo(list.status);
        $("#reason").html(list.reason);
    } else if (list.status === "승인 전") {
        $(".applyModal_btns_approve").removeClass("on");
        $(".applyModal_btns_deny").addClass("off");
    } else {
        $(".applyModal_btns_deny").removeClass("off");
        $(".applyModal_btns_deny").addClass("on");
        $(".applyModal_btns_reject").addClass("off");
        $(".apply_btns_mid").toggleClass("off");
        $(".apply_btns_mid_wrap button").removeClass("on");
        classNo(list.status);
        $("#reason").html(list.reason);
    }

    if (list.activityStatus === "진행 전") {
        $(".applyModal_btns_before").addClass("on");
    } else if (list.activityStatus === "진행 중") {
        $(".applyModal_btns_ing").addClass("on");
    } else {
        $(".applyModal_btns_done").addClass("on");
    }

}

function updateApplyList() {
    let applyNo = $("#applyNo").val();
    const list = applyList.content.find(x => x.no == applyNo);
    const no = list.activityNo;

    // 상단 버튼 중 on 클래스가 있는 버튼 찾기 (승인, 거부, 취소 상태 확인)
    const topButton = document.querySelector('.applyModal_btns_top_wrap .on');
    let status = topButton ? topButton.innerHTML : null;
    if(status === "승인"){
        status = "승인 완료"
    }

    // 중단 버튼 중 on 클래스가 있는 버튼 찾기 (진행 전, 중, 완료 상태 확인)
    const midButton = document.querySelector('.apply_btns_mid_wrap .on');
    const progressStatus = midButton ? midButton.innerHTML.trim() : null;

   let reason = $("#reason").val();

   param = {
       "no" : applyNo,
       "activistNo" : no,
       "userNo" : list.userNo,
       "status" : status,
       "progressStatus" : progressStatus,
       "reason" : reason
   }

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/talent/apply/update";
    option.TYPE = "PUT";
    option.PARAM = JSON.stringify(param);
    option.ASYNC = true;
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(res) {
        if(res.code == 1){
            getTalentList(0);
        }
    }
    ajaxWrapper.callAjax(option);
}
