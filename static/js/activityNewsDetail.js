$(document).ready(function(){
    getActivityInfo();
    getActionInfo();
})

let actionNo = 0;
let globalActivityNo = 0;

function getActivityInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const activityNo = urlParams.get('no');

    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/activity/detail/" + activityNo;
    option.TYPE = "GET";
    option.ASYNC = false;
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(response) {
        if(response.code == 0){
            alert_modal('modal_error', '접근 불가', response.message);
            $(".modal_error .modal_btn").attr("onclick", "location.replace('/activity')");
        }
        else{
            let data = response.data;
            globalActivityNo = data.no;
            actionNo = data.actionNo;
            if(data.profile != null && data.profile != ""){
                $("#profileImg").attr("src", data.profile);
            }
            $("#activityName").text(data.title);
            $("#actionName").text(data.actionName);
            $("#generation").text(data.generation + "기");
            $("#actionType").text(data.type);
            $("#subject").text(data.subject);
            $("#activityDate").text(data.startDate + " ~ " + data.endDate);
            $("#leaderName").text(data.leaderName);
            $(".actionNewsDetail_actContent_text").html(data.description);
        }
    }
    ajaxWrapper.callAjax(option);
}

function getActionInfo(){
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
            $("#activityModify").attr("href", "/activity/registration?actionNo=" + data.no + "&activityNo=" + globalActivityNo);
            $("#activityDelete").attr("onclick", 'deleteActivity(' + globalActivityNo + ')');

            if(data.loginUserNo != null){
                if(data.loginUserRole == 'ROLE_ADMIN'){
                    $("#btnGroup").css("display", "flex");
                }
                else{
                    let authUser = data.memberList.filter(x => (x.leader == 'Y' || x.memberRole == 'Y') && x.userNo == data.loginUserNo);
                    if(authUser.length > 0){
                        $("#btnGroup").css("display", "flex");
                    }
                }
            }
        }
    }
    ajaxWrapper.callAjax(option);
}

function deleteActivity(no){
    let option = deepExtend({}, ajaxOptions);
    option.URL = "/api/v1/activity/" + no;
    option.TYPE = "DELETE";
    option.ASYNC = false;
    option.HEADERS = getCsrfHeader();
    option.CALLBACK = function(response) {
        alert_modal('modal_ok', '활동내역 삭제', response.message);
        $(".modal_ok .modal_btn").attr("onclick", "location.replace('/action')");
    }
    ajaxWrapper.callAjax(option);
}