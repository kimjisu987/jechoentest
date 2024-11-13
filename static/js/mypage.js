$(document).ready(function(){
    getMyInfO();
    //pc, 마이페이지 내 탭 전환
    $(document).on("click", ".mypage_tab li", function(){
        $(".mypage_tab li").addClass("btn_off");
        $(this).removeClass("btn_off");
        $(".contents").addClass("con_off");
        const tabClass = $(this).attr("class");
        const conClass = ".con_" + tabClass;
        $(conClass).removeClass("con_off");

        let target = $(this).text();
        if(target == "내 정보"){
            getMyInfO();
        }
        if(target == "나의 문의"){
            getMyQna(0);
        }
        if(target == "수강신청 현황"){
            getMyTalent(0);
        }
    });

    //다음API - 주소
    var width = 500;
    var height = 600;
    function execDaumPostcode() {
        new daum.Postcode({
            width : width,
            height : height,
            oncomplete: function(data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var addr = ''; // 주소 변수
                var extraAddr = ''; // 참고항목 변수

                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
                }

                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                if(data.userSelectedType === 'R'){
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if(extraAddr !== ''){
                    extraAddr = ' (' + extraAddr + ')';
                }
                // 조합된 참고항목을 해당 필드에 넣는다.
                document.getElementById("extraAddress").value = extraAddr;
                } else {
                document.getElementById("extraAddress").value = '';
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                document.getElementById('postcode').value = data.zonecode;
                document.getElementById("address").value = addr;
                // 커서를 상세주소 필드로 이동한다.
                document.getElementById("detailAddress").focus();
            }
        }).open({
            left: (window.screen.width / 2) - (width / 2),
            top: (window.screen.height / 2) - (height / 2)
        });
    }
    $(".address_search, #postcode, #address, #extraAddress").click(function(){
        execDaumPostcode();
    });

    //연락처 하이픈(-) 추가
    $(".tel").keyup(function() {
        let val = $(this).val().replace(/[^0-9]/g, ''); // 숫자만 남김
        if (val.length > 3) {
        // 010-XXXX-XXXX 형태로 변환
        let prefix = val.substring(0, 3); // 010
        let firstPart = val.substring(3, 7); // 4자리
        let secondPart = val.substring(7, 11); // 4자리

        if (val.length < 7) {
            $(this).val(prefix + '-' + firstPart);
        } else {
            $(this).val(prefix + '-' + firstPart + (secondPart ? '-' + secondPart : ''));
        }
        } else {
        $(this).val(val); // 3자리 이하일 경우 그대로 표시
        }
    });

    //변경하기 버튼 선택 시 인증번호 인풋 보이기
    $(document).on("click", ".change_number", function(){
        $("#tel_certi").parent().removeClass("off");
        $(".change_number").val("인증번호 발송");
        $("#tel").attr("readonly", false);
    });

    //유효성 검사
    $(document).on("click", "#change_info", function(){
        if(mypage_info_check(".con_info")){
            updateUserInfo();
        } else {
            // 유효성 검사 실패 시 경고 메시지 표시
            alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '형식이 올바르지 않거나, 작성하지 않은 내용을 확인해주세요.');
        }
    });

    $(document).on("click", "#change_pw", function(){
        if(mypage_pw_check(".con_password")){
            alert_modal('modal_ok', '변경 완료', '변경이 성공적으로 완료되었습니다.');
        } else {
            // 유효성 검사 실패 시 경고 메시지 표시
            alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '형식이 올바르지 않거나, 작성하지 않은 내용을 확인해주세요.');
        }
    });

    function mypage_info_check(under) {
        if(checkTel($(under+" .tel")) && emailCheck() && addressCheck()){
            if($("#tel_certi").parent().hasClass("off")){
                return true;
            } else if(tel_certiCheck($(under+" .tel_certi"))){
                return true;
            }
        } else {
            return false;
        }
    }

    function mypage_pw_check(under) {
        if(tel_certiCheck($(under+" .tel_certi")) && pwCheck($(".password")) && pwReCheck()){
            return true;
        } else {
            return false;
        }
    }

    //휴대폰 번호 체크
    function checkTel(value){
        var pattern = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

        if(pattern.test(value.val()) === false){
            showError(value, "올바르지 않은 형식");
            return false;
        } else {
            hideError(value);
            return true;
        }
    }

    //인증번호 체크
    function tel_certiCheck(value){
        if(value.val().length < 1){ 
            showError(value, "인증번호 입력");
            return false;
        } else {
            hideError(value);
            return true;
        }
    }

    //이메일 체크
    function emailCheck(){
        if($('.email').val().indexOf("@") == -1 || $('.email').val().indexOf(".") == -1 || $('.email').val().length <=5){
            showError($('.email'), "올바르지 않은 형식");
            return false;
        } else {
            hideError($('.email'));
            return true;
        }
    }

    //주소 체크
    function addressCheck(){
        if($('.postcode').val().length < 1){
            showError($('.postcode'), "주소 검색을 통해 입력");
            return false;
        } else {
            hideError($('.postcode'));
            return true;
        }
    }

    //비밀번호 체크
    function pwCheck(){
        var pattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

        if(pattern.test($('#password').val()) === false){
            showError($('#password'), "올바르지 않은 형식");
            return false;
        } else {
            hideError($('#password'));
            return true;
        }
    }
    function pwReCheck(){
        if($('#password').val() === $('#password_re').val()){
            hideError($('#password_re'));
            return true;
        } else {
            showError($('#password_re'), "동일하지 않은 비밀번호");
            return false;
        }   
    }

    // 오류 메시지 표시
    function showError(input, msg) {
        let error_msg = input.siblings(".form_check_box").find(".check_error");
        error_msg.text(msg).show();
    }

    // 오류 메시지 숨기기
    function hideError(input) {
        input.siblings(".form_check_box").find(".check_error").hide();
    }

    //수강신청 현황
    //모달 온오프
    //수강 취소 모달
    $(document).on("click", "#apply_cancle_1st", function(){
        $(".mypageModal_wrap").fadeIn(200);
        $(".mypageModal_info_bttm").css("display", "block");
    });
    //수강 상세 모달
    $(document).on("click", "#apply_detail_1st", function(){
        $(".mypageModal_wrap").fadeIn(200);
        $(".mypageModal_info_bttm").css("display", "none");
    });
    $(document).on("click", ".mypageModal_x", function(){
        $(".mypageModal_wrap").fadeOut(200);
    });

    //모달 유효성 검사
    $(document).on("click", ".mypageModal_btn", function(){
        if($("#textarea").val().length < 1){
            showError($("#textarea"), "수강취소 사유 입력");
        } else {
            hideError($("#textarea"));
            alert_modal('modal_confirm', '취소하시겠습니까?', '취소 후에 수강을 원할 경우, 다시 수강신청하셔야합니다.');
            $(".modal_btn").click(function(){
                if ($(this).index() == 0) {
                } else {
                    $(".mypageModal_wrap").fadeOut(200);
                }
            });
        }
    });
})

function getMyInfO(){
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/user/my";
    option.TYPE = "GET";
    option.CALLBACK = function(response) {
        let data = response.data;
        $("#user_no").val(data.no);
        $("#user_id").val(data.userId);
        $("#name").val(data.name);
        $("#birth").val(data.birth);
        $("#tel").val(data.tel);
        $("#email").val(data.email);
        $("#postcode").val(data.zipCode);
        let addr = data.address.split(",")[0];
        let detail = data.address.split(",")[1];
        let extra = data.address.split(",")[2];
        $("#address").val(addr);
        $("#detailAddress").val(detail);
        $("#extraAddress").val(extra);
    }
    ajaxWrapper.callAjax(option);
}

function updateUserInfo(){
    alert_modal('modal_ok', '변경 완료', '변경이 성공적으로 완료되었습니다.');
    let param = {
        "no" : $("#user_no").val(),
        "userId" : $("#user_id").val(),
        "name" : $("#name").val(),
        "birth" : $("#birth").val(),
        "tel" : $("#tel").val(),
        "email" : $("#email").val(),
        "zipCode" : $("#postcode").val(),
        "address" : $("#address").val() + ',' + $("#detailAddress").val() + ',' + $("#extraAddress").val()
    }

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/user/my";
    option.TYPE = "PUT";
    option.HEADERS = getCsrfHeader();
    option.PARAM = JSON.stringify(param);
    option.CALLBACK = function(response) {
        let data = response.data;
        $("#user_no").val(data.no);
        $("#user_id").val(data.userId);
        $("#name").val(data.name);
        $("#birth").val(data.birth);
        $("#tel").val(data.tel);
        $("#email").val(data.email);
        $("#postcode").val(data.zipCode);
        let addr = data.address.split(",")[0];
        let detail = data.address.split(",")[1];
        let extra = data.address.split(",")[2];
        $("#address").val(addr);
        $("#detailAddress").val(detail);
        $("#extraAddress").val(extra);
    }
    ajaxWrapper.callAjax(option);
}

let globalQNATotalPage = 0;
function getMyQna(page){
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/qna?category=전체&target=my&&page=" + page;
    option.TYPE = "GET";
    option.CALLBACK = function(response) {
        let data = response.data;
        let qnaHtml = ``;
        if(data.content.length == 0){
            qnaHtml += `<tr>`;
            qnaHtml += `    <td colspan="5">문의 내역이 존재하지 않습니다.</td>`;
            qnaHtml += `</tr>`;
            $("#board_table_tbody").empty().append(qnaHtml);
            $("#qna_page_list").empty();
        }
        else{
            let idx = data.totalElements - (data.pageable.pageNumber * data.pageable.pageSize);
            for(let qna of data.content){
                qnaHtml += `<tr>`;
                qnaHtml += `    <td>${idx--}</td>`;
                qnaHtml += `    <td>${qna.category}</td>`;
                qnaHtml += `    <td class=${qna.replyNo === null ? "" : "off"}>답변 대기</td>`;
                qnaHtml += `    <td class=${qna.replyNo === null ? "off" : ""}>답변 완료</td>`;
                qnaHtml += `    <td><a class="text_short" href="/qna/detail?no=${qna.qnaNo}">${qna.status === "ACTIVE" ? qna.title : "비공개 문의글입니다."}</a></td>`;
                qnaHtml += `    <td>${qna.createdAt}</td>`;
                qnaHtml += `</tr>`;
            }
            $("#board_table_tbody").empty().append(qnaHtml);

            let totalPage = data.totalPages;
            globalQNATotalPage = totalPage;

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
                    pageHtml += `<li class="pagenum_on"><a href="#" onclick="getMyQna(${page - 1})">${page}</a></li>`;
                } else {
                    pageHtml += `<li><a href="#" onclick="getMyQna(${page - 1})">${page}</a></li>`;
                }
            }
            $("#qna_page_list").empty().append(pageHtml);
        }
    }
    ajaxWrapper.callAjax(option);
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
        targetPage = globalQNATotalPage - 1;
    }

    if (targetPage < 0) {
        $('html, body').animate({scrollTop: 0}, 300);
        alert_modal('modal_error', '존재하지 않는 페이지', '첫 페이지 입니다.');
        return;
    } else if (targetPage >= globalQNATotalPage) {
        $('html, body').animate({scrollTop: 0}, 300);
        alert_modal('modal_error', '존재하지 않는 페이지', '마지막 페이지 입니다.');
        return;
    }

    getMyQna(targetPage);
}

let globalTalentTotalPage = 0;
function getMyTalent(page) {
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/talent/my/applyList?page=" + page;
    option.TYPE = "GET";
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(res) {
        let data = res.data;
        let tHtml = ``;
        if(data.content.length == 0){
            tHtml += `<tr class="noClassApply">`;
            tHtml += `    <td colspan="6">수강 신청 내역이 존재하지 않습니다.</td>`;
            tHtml += `</tr>`;
            $("#talent_table_tbody").empty().append(tHtml);
            $("#talent_page_list").empty();
        }
        else{
            for(let target of data.content){
                console.log(target);
                let isOn = false;
                tHtml += `<tr>`;
                tHtml += `    <td>`;
                tHtml += `        <div class="item_photo">`;
                tHtml += `            <img th:src="@{/images/dummy1.png}" alt="재능활동 대표 이미지">`;
                tHtml += `                <div class="item_imgtag">`;
                if(target.status == '승인 완료'){
                    tHtml += `                    <span class="tag_green">승인완료</span>`;
                    isOn = true;
                }
                else if(target.status == '거부'){
                    tHtml += `                    <span class="tag_gray approve_deny">승인거절</span>`;
                }
                else if(target.status == '승인 취소'){
                    tHtml += `                    <span class="tag_gray approve_deny">승인거절</span>`;
                }
                else if(target.status == '승인 전'){
                    tHtml += `                    <span class="tag_green">승인대기</span>`;
                    isOn = true;
                }
                else if(target.status == '수강 취소'){
                    tHtml += `                    <span class="tag_gray class_cancle">취소완료</span>`;
                }
                tHtml += `                </div>`;
                tHtml += `        </div>`;
                tHtml += `    </td>`;
                if(isOn){
                    tHtml += `    <td>`;
                    tHtml += `        <ul class="mypage_table_info">`;
                    tHtml += `            <li class="item_name text_short">${target.activityTitle}</li>`;
                    tHtml += `        </ul>`;
                    tHtml += `    </td>`;
                    tHtml += `    <td><span class="item_hash on">${target.activityStatus}</span></td>`;
                    tHtml += `    <td>`;
                    tHtml += `        <ul class="mypage_table_date">`;
                    tHtml += `            <li>${target.createdAt}</li>`;
                    tHtml += `        </ul>`;
                    tHtml += `    </td>`;
                    tHtml += `    <td class="mypage_item_price">${target.price.toLocaleString()}원</td>`;
                    tHtml += `    <td>`;
                    tHtml += `        <ul class="mypage_table_btn">`;
                    tHtml += `            <li><a href="#" id="apply_cancle_1st" class="apply_cancle">수강 취소</a></li>`;
                    tHtml += `        </ul>`;
                    tHtml += `    </td>`;
                }
                else{
                    tHtml += `    <td>`;
                    tHtml += `        <ul class="mypage_table_info disabled">`;
                    tHtml += `            <li class="item_name text_short">${target.activityTitle}</li>`;
                    tHtml += `        </ul>`;
                    tHtml += `    </td>`;
                    tHtml += `    <td><span class="item_hash disabled">${target.activityStatus}</span></td>`;
                    tHtml += `    <td>`;
                    tHtml += `        <ul class="mypage_table_date disabled">`;
                    tHtml += `            <li>${target.createdAt}</li>`;
                    tHtml += `        </ul>`;
                    tHtml += `    </td>`;
                    tHtml += `    <td class="mypage_item_price disabled">${target.price.toLocaleString()}원</td>`;
                    tHtml += `    <td>`;
                    tHtml += `        <ul class="mypage_table_btn">`;
                    tHtml += `            <li><a href="#" id="apply_cancle_1st" class="apply_cancle">수강 취소</a></li>`;
                    tHtml += `        </ul>`;
                    tHtml += `    </td>`;
                }
                tHtml += `</tr>`;
            }
            $("#talent_table_tbody").empty().append(tHtml);

            // 페이징
            let totalPage = data.totalPages;
            globalTalentTotalPage = totalPage;

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
                    pageHtml += `<li class="pagenum_on"><a href="#" onclick="getMyTalent(${page - 1})">${page}</a></li>`;
                } else {
                    pageHtml += `<li><a href="#" onclick="getMyTalent(${page - 1})">${page}</a></li>`;
                }
            }
            $("#talent_page_list").empty().append(pageHtml);
        }
    }
    ajaxWrapper.callAjax(option);
}
