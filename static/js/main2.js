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
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});
// -------------------------------------------------------------------------------------
// 액션그룹, 재능활동가, 공동체마켓 스와이퍼
var swiper = new Swiper(".tab_swiper", {
    slidesPerView: "1.2",
    spaceBetween: 16,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        428: {
            slidesPerView: "2"
        },
        768: {
            slidesPerView: "3"
        }
    }
});
// -------------------------------------------------------------------------------------
// 마을현황 탭
$(".village_tab > li > a").click(function(e){
    e.preventDefault();
    $(".village_tab > li > a").removeClass("village_act");
    $(this).addClass("village_act");
    
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
            $(".village_map").css("background-position", image);
        }
    });
});
// -------------------------------------------------------------------------------------
// 액션그룹~마켓 탭
$(".sec_tab_list > li > a").click(function(e){
    e.preventDefault();
    $(".sec_tab_list > li > a").removeClass("tab_list_act");
    $(this).addClass("tab_list_act");
});
// -------------------------------------------------------------------------------------
// 일정 등록 모달
function schedule_modal_open() {
    $(".schedule_modal").fadeIn();
    $("body").css("overflow", "hidden");
};
function schedule_modal_close() {
    $(".schedule_modal").fadeOut();
    $("body").css("overflow", "auto");
};
$(".day_add_btn").click(function(e) {
    e.preventDefault();
    schedule_modal_open();
});
$(".schedule_add_close").click(function(e) {
    e.preventDefault();
    schedule_modal_close();
});
// -------------------------------------------------------------------------------------
// 단일 일정, 다일 일정 체크
schedule_check();
$("input[name='schedule_check']").off("change").on("change", function() {
    schedule_check();
});

function schedule_check() {
    if ($("input[name='schedule_check']:checked").hasClass("single_schedule")) {
        $("input:not(#title)").val(""); // 제목 제외 인풋 비우기
        $(".input_fields:has(input#start_time), .input_fields:has(input#end_time)").show();
        $("#start_time, #end_time").attr("disabled", false);
        $("#end_date").attr("disabled", true);
        
        $("#start_date").change(function(){
            $("#end_date").val($("#start_date").val());
        });
        $("#start_time, #end_time").on("change", function() {
            const start_time = $("#start_time").val();
            const end_time = $("#end_time").val();
    
            if (start_time && end_time) {
                if (end_time <= start_time) {
                    alert_modal("modal_error", "일정 시간 오류", "종료시간은 시작시간 이후로 입력해주세요.");
                    $("#end_time").val("");
                }
            }
        });
    } else {
        $("input:not(#title)").val("");
        $(".input_fields:has(input#start_time), .input_fields:has(input#end_time)").hide();
        $("#start_time, #end_time").attr("disabled", true);
        $("#end_date").attr("disabled", false);
        
        // 시작일+1 변경 함수
        function setEndDate() {
            const start_date = new Date($("#start_date").val());
            start_date.setDate(start_date.getDate() + 1);
    
            const year = start_date.getFullYear();
            const month = String(start_date.getMonth() + 1).padStart(2, '0');
            const day = String(start_date.getDate()).padStart(2, '0');
            const end_date = `${year}-${month}-${day}`;
            $("#end_date").val(end_date);
        }
    
        $("#start_date").change(setEndDate); // 시작일 변경 시 종료일 설정
        $(".start_date, .end_date").on("change", function() {
            const start_val = $(".start_date").val();
            const end_val = $(".end_date").val();
            if (start_val && end_val) {
                if (end_val <= start_val) {
                    alert_modal("modal_error", "일정 시간 오류", "종료일은 시작일 이후로 입력해주세요.");
                    setEndDate();
                }
            }
        });
    }
}
// -------------------------------------------------------------------------------------
// 이벤트 추가
const events = [
    // 단일 일정 예시
    { title: "일정1", start_date: "2024-11-04", end_date: "2024-11-04", start_time: "09:00", end_time: "13:00" },
    { title: "일정1", start_date: "2024-11-04", end_date: "2024-11-04", start_time: "09:00", end_time: "13:00" },
    // 다일 일정 예시
    { title: "일정2", start_date: "2024-11-06", end_date: "2024-11-08", start_time: "00:00", end_time: "00:00" }
];

// 일정 등록 버튼
$(".schedule_submit_btn").click(function (e) {
    e.preventDefault();

    // 유효성 검사
    if (schedule_form_check()) {
        // input 입력값 가져오기
        const title = $('#title').val();
        const start_date = $('#start_date').val();
        const end_date = $('#end_date').val();
        const start_time = $('#start_time').val();
        const end_time = $('#end_time').val();

        // 새로운 이벤트 저장
        const add_event = {
            title: title,
            start_date: start_date,
            end_date: end_date,
            start_time: start_time,
            end_time: end_time,
        };
        
        events.push(add_event); // 이벤트 배열에 추가
        add_circle(start_date, end_date); // 일정 동그라미 추가
        schedule_modal_close(); // 모달 닫기
        $("input").val(""); // 폼 초기화
        alert_modal("modal_ok", "일정 등록 완료", "일정 등록이 완료되었습니다. 등록하신 일정은 메인페이지에 표시됩니다.");
    } else {
        alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '모든 내용은 필수 입력 사항입니다.');
    }
});

// 등록 날짜에 일정 동그라미 추가
function add_circle(start_date, end_date) {
    // 단일일정 : 다일일정
    const date_num_check = (start_date == end_date) ? [start_date] : getdate_num_check(start_date, end_date);

    // 날짜 범위 내의 각 날짜 td에 동그라미 추가
    date_num_check.forEach(date => {
        const calendar_td = $("#calendar td").filter(function() {
            return $(this).data('date') === date;
        });

        // 해당 날짜에 circle 추가
        calendar_td.find('.event_day').append('<span class="circle">&nbsp;</span>');
    });
}

// 날짜 범위 (시작일~종료일)를 배열로 반환
function getdate_num_check(start_date, end_date) {
    const date_array = [];
    let first_date = new Date(start_date);
    const last_date = new Date(end_date);

    // 종료일보다 크거나 같을 때까지 반복
    while (first_date <= last_date) {
        let dateStr = first_date.toISOString().split('T')[0]; // "YYYY-MM-DD" 형식으로 변환
        date_array.push(dateStr);
        first_date.setDate(first_date.getDate() + 1); // 하루씩 증가
    }    
    return date_array;
}

// 일정 등록 검증 함수
function schedule_form_check() {
    let inputs = [
        { input: $('#title'), errorMsg: "일정 제목을 입력하세요" },
        { input: $('#start_date'), errorMsg: "일정 시작일을 선택하세요" },
        { input: $('#start_time'), errorMsg: "일정 시작시간을 선택하세요" },
        { input: $('#end_date'), errorMsg: "일정 종료일을 선택하세요" },
        { input: $('#end_time'), errorMsg: "일정 종료시간을 선택하세요" }
    ];
    let input_return = true;

    // 각 필드 확인
    inputs.forEach(({ input, errorMsg }) => {
        if (input.is(':disabled')) {
            return;
        }
        if (input.val().length < 1) {
            showError(input, errorMsg);
            input_return = false;
        } else {
            hideError(input);
        }
    });
    return input_return;
}

// 오류 메시지 표시
function showError(input, msg) {
    let error_msg = input.parents(".input_fields").find(".check_error");
    error_msg.text(msg).show();
}

// 오류 메시지 숨기기
function hideError(input) {
    input.parents(".input_fields").find(".check_error").hide();
}

// 입력값이 blur될 때마다 검증
$('#title, #start_date, #end_date, #start_time, #end_time').on('blur', function () {
    schedule_form_check();
});

// 일정 등록 후 모달 닫기
function schedule_modal_close() {
    $(".schedule_modal").fadeOut(); // 모달 숨기기
    $("body").css("overflow", "auto");
}

// 기본 오늘 날짜
function getToday(){
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);    
    return `${year}-${month}-${day}`;
}
$(".schedule_title > span").html(getToday);

// 달력 리스트 출력
function schedule_list(e_date) {
    $(".schedule_list_wrap").html(""); // 기존 내용 지우기

    if (e_date.length > 0) {
        // 여러 일정 출력
        e_date.forEach(event => {
            let date_status = event.start_date == event.end_date ? event.start_date : `${event.start_date} ~ ${event.end_date}`;
            
            // 다일 일정의 경우 시간이 없다면 표시하지 않음
            let time_status = '';
            if (event.start_time !== "00:00" && event.end_time !== "00:00") {
                time_status = `${event.start_time} ~ ${event.end_time}`;
            }
            
            let calendarHtml = `
                <div class="schedule_box">
                    <ul class="schedule_list">
                        <li class="schedule_name">${event.title}</li>
                        <li class="schedule_date">
                            <img src="../icon/icon_date.svg" alt="달력 아이콘">${date_status}
                        </li>
                        ${time_status ? `<li class="schedule_time">${time_status}</li>` : ''}
                    </ul>
                </div>
            `;
            $(".schedule_list_wrap").append(calendarHtml); // 일정 추가
        });
    } else {
        $(".schedule_list_wrap").append("<span class='none_date'>등록된 일정이 없습니다.</span>");
    }
}

// 기본 오늘 날짜
function getToday(){
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);    
    return `${year}-${month}-${day}`;
}

// 페이지 로드 시 오늘 날짜에 등록된 일정이 있는지 확인
function today_schedule() {
    const today = getToday();
    $(".schedule_title > span").html(today);

    // 오늘 날짜에 등록된 일정들 필터링
    const today_event = events.filter(event => event.start_date <= today && event.end_date >= today);

    // 일정 출력
    schedule_list(today_event);
}

// 페이지 로드 시 오늘 날짜에 대한 일정 표시
$(document).ready(function() {
    today_schedule(); // 페이지 로드 시 오늘 일정 로딩
});

// 날짜 클릭시
$(document).on('click', '#calendar td', function() {
    $("#calendar td").removeClass("day_act");
    $(this).addClass("day_act");
    
    // 클릭된 날짜
    const clicked_date = $(this).data("date");
    $(".schedule_title > span").html(clicked_date);
    
    // 해당 날짜의 일정 필터링 (일정 전부 반환)
    const e_date = events.filter(event => event.start_date <= clicked_date && event.end_date >= clicked_date);

    // 일정 출력
    schedule_list(e_date);
});

let curr_month = new Date().getMonth();
let curr_year = new Date().getFullYear();

// 달력
function print_calendar() {
    const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    $(".cal_month").html(`<p class="cal_today">${curr_year}년 ${months[curr_month]}월</p>`);
    
    const first_day = new Date(curr_year, curr_month, 1).getDay();
    const last_day = new Date(curr_year, curr_month + 1, 0).getDate();
    let calendar = "<table border='1'><tr><th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th></tr><tr>";
    
    for (let i = 0; i < first_day; i++) {
        calendar += "<td>&nbsp;</td>";
    }
    
    for (let day = 1; day <= last_day; day++) {
        const date_str = `${curr_year}-${curr_month + 1 < 10 ? '0' + (curr_month + 1) : curr_month + 1}-${day < 10 ? '0' + day : day}`;
        const today = (day == new Date().getDate() && curr_month == new Date().getMonth() && curr_year == new Date().getFullYear()) ? "class='today'" : "";
        
        // 일정(이벤트)
        const eventCount = events.filter(event => event.start_date <= date_str && event.end_date >= date_str).length;
        const spans = Array.from({ length: eventCount }, () => '<span class="circle">&nbsp;</span>').join(''); // 원 표시
        const event_box = `<div class="event_day">${spans}</div>`;
        
        calendar += `<td ${today} data-date="${date_str}" class="${eventCount > 0 ? 'event' : ''}"><p>${day}</p>${event_box}</td>`;
        
        if ((day + first_day) % 7 == 0) {
            calendar += "</tr><tr>";
        }
    }
    
    // 마지막 주에 비어있는 날
    const none_day = (last_day + first_day) % 7;
    if (none_day > 0) {
        for (let i = none_day; i < 7; i++) {
            calendar += "<td>&nbsp;</td>";
        }
    }
    
    calendar += "</tr></table>";
    $("#calendar").html(calendar);
}

// 전월 버튼
$(".cal_prev_btn").click(function () {
    if (curr_month == 0) {
        curr_month = 11;
        curr_year--;
    } else {
        curr_month--;
    }
    print_calendar();
});

// 익월 버튼
$(".cal_next_btn").click(function () {
    if (curr_month == 11) {
        curr_month = 0;
        curr_year++;
    } else {
        curr_month++;
    }
    print_calendar();
});

print_calendar();