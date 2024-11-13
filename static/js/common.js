"use strict";

/**
 * 공통 스크립트
 */

/*
 * object copy 메소드
 */
let deepExtend = function (out) {
    out = out || {};

    for (let i = 1, len = arguments.length; i < len; ++i) {
        let obj = arguments[i];

        if (!obj) {
            continue;
        }

        for (let key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }

            if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
                out[key] = deepExtend(out[key], obj[key]);
                continue;
            }

            out[key] = obj[key];
        }
    }
    return out;
}

let ajaxWrapper = {
    /**
     * Ajax Wrapper
     *
     * Parameter Option Object
     * 필수) URL - 전송 URL (String)
     * 필수) PARAM - 전송 파라미터 (String or Object)
     * 필수) HEADERS - 전송 헤더 (Json Object)
     * 필수) CALLBACK - 콜백함수 (Function)
     * 필수) TYPE - 전송 방식 (POST, GET, PUT, DELETE)
     * 선택) DATA_TYPE - 응답받을 데이터 타입 (String)
     * 선택) CONTENT_TYPE - 전송할 데이터 타입 (String)
     * 선택) ASYNC - 비동기 여부 (boolean : 미지정시 true)
     * 선택) ERROR_CALLBACK - 전송 실패 시 콜백 함수 (Function)
     * 선택) ERRORMSG - 전송 실패시 메시지 (String)
     * 선택) RETURN_INCLUDE - 요청시 포함시키면 결과에 포함됨 (Object)
     */

    callAjax: function (options) {
        if (options.URL != null) {
            if (options.ASYNC == null) {
                options.ASYNC = true;
            }

            $.ajax({
                type: options.TYPE,
                url: options.URL,
                traditional: true,
                data: options.PARAM,
                headers: options.HEADERS,
                async: options.ASYNC,
                dataType: options.DATA_TYPE,
                contentType: options.CONTENT_TYPE,
                success: function (result) {
                    options.CALLBACK(result, options.RETURN_INCLUDE || {});
                },
                error: function (request, status, error) {
                    if (options.ERROR_CALLBACK != undefined) {
                        options.ERROR_CALLBACK(request, status, error);
                    } else {
                        console.log(request);
                        console.log(status);
                        console.log(error);
                        alert("서버에 요청중 문제가 발생했습니다.\n관리자에게 문의하여 주십시오.");
                    }
                }
            });
        } else {
            alert("올바른 요청이 아닙니다.");
            return false;
        }
    }
}

// 복사해서 사용해야 함.
let ajaxOptions = {
    URL: "",
    PARAM: null, // TYPE get 을 제외하고 JSON.stringify 처리 필요
    HEADERS: null, // CSRF 보안을 위해 필요
    CALLBACK: function (response) {
        if (response.success) {
            console.log(response);
        } else {
            alert(response);
        }
    },
    ERROR_CALLBACK: function (request, status, error) {
        console.log(request);
        console.log(status);
        console.log(error);
        console.log("code : " + status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
    },
    ASYNC: null, // 기본값 true, false 시 중복 요청 X
    TYPE: null, // 설정해줘야 함 (POST, GET, PUT, DELETE)
    DATA_TYPE: "json",
    CONTENT_TYPE: "application/json; charset=utf-8;"
}

// csrf 보안을 위한 ajax 헤더 생성용 함수
function getCsrfHeader() {
    let csrfHeaderName = $("meta[name='_csrf_header']").attr("content");
    let csrfHeaderToken = $("meta[name='_csrf']").attr("content");
    let header = {};
    header[csrfHeaderName] = csrfHeaderToken;
    return header;
}

Date.prototype.yyyymmdd = function(splitter) {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();
    mm = mm >= 10 ? mm : "0" + mm;
    dd = dd >= 10 ? dd : "0" + dd;
    return [this.getFullYear(), mm, dd].join(splitter);
}

Date.prototype.yyyymm = function(splitter) {
    var mm = this.getMonth() + 1;
    mm = mm >= 10 ? mm : "0" + mm;
    return [this.getFullYear(), mm].join(splitter);
}

Date.prototype.yyyy = function() {
    return this.getFullYear();
}

// 커스텀 얼럿 모달
function alert_modal(alert_style, alert_title, alert_msg) {
    let btnArr = ['확인', '확인'];
    if(alert_style === 'modal_confirm'){
        btnArr[0] = '취소';
    }

    let modalHtml = ``;
    modalHtml += `<div class="alert_modal ${alert_style}">`
    modalHtml += `    <div class="modal_inner">`
    modalHtml += `        <p class="alert_icon"></p>`
    modalHtml += `        <dl>`
    modalHtml += `            <dt class="alert_title">${alert_title}</dt>`
    modalHtml += `            <dd class="alert_text">${alert_msg}</dd>`
    modalHtml += `        </dl>`
    modalHtml += `        <div class="btn_box">`
    modalHtml += `            <button class="modal_btn">${btnArr[0]}</button>`
    modalHtml += `            <button class="modal_btn">${btnArr[1]}</button>`
    modalHtml += `        </div>`
    modalHtml += `    </div>`
    modalHtml += `</div>`

    const modal = $(modalHtml);

    $('body').append(modal.hide().fadeIn(200, function() { $(this).addClass('on'); }));

    // 버튼 클릭 시 모달 확인
    modal.find('.modal_btn:last-of-type').on('click', function() {
        alert_close();
    });

    // 버튼 클릭 시 모달 취소 - 컨펌창에서만 사용
    modal.find('.modal_btn:first-of-type').on('click', function() {
        alert_close();
    });

}

// 경고창 모달 제거
function alert_close() {
    $('.alert_modal').removeClass('on').fadeOut(200, function() { $(this).remove(); });
}