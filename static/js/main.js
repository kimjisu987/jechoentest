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
// 액션그룹, 재능활동가, 공동체마켓 스와이퍼
var swiper = new Swiper(".tab_swiper", {
    slidesPerView: "1.2",
    spaceBetween: 16,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
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
        };
    });
});
// 액션그룹~마켓 탭
$(".sec_tab_list > li > a").click(function(e){
    e.preventDefault();
    $(".sec_tab_list > li > a").removeClass("tab_list_act");
    $(this).addClass("tab_list_act");
});
// 일정 등록 모달
function schedule_modal_open() {
    $(".schedule_modal").fadeIn();
    $("body").css("overflow","hidden");
}
function schedule_modal_close() {
    $(".schedule_modal").fadeOut();
    $("body").css("overflow","auto");
}
$(".day_add_btn").click(function(e){
    e.preventDefault();
    schedule_modal_open();
});
$(".schedule_add_close").click(function(e){
    e.preventDefault();
    schedule_modal_close();
});

// 단일 일정, 다일 일정
schedule_check();
$("input[name='schedule_check']").off("change").on("change", function() {
    schedule_check();
});
function schedule_check() {
    // 단일 일정
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
    } else { // 다일 일정
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
};

$(".schedule_submit_btn").click(function(e) {
    e.preventDefault();
    if (schedule_form_check()) {
        // 일정 정보
        const title = $('#title').val();
        const startDate = $('#start_date').val();
        const startTime = $('#start_time').val();
        const endDate = $('#end_date').val();
        const endTime = $('#end_time').val();
        
        // 단일 일정인지 확인
        if ($("input[name='schedule_check']:checked").hasClass("single_schedule")) {
            // 단일 일정 추가
            calendar.addEvent({
                title: title,
                start: `${startDate}T${startTime}`,
                end: `${endDate}T${endTime}`
            });
        } else {
            // 다중 일정 추가
            calendar.addEvent({
                title: title,
                start: `${startDate}T09:00:01`,
                end: `${endDate}T23:59:59`
            });
        }
        schedule_modal_close();
        $("input").val("");
        alert_modal("modal_ok", "일정 등록 완료", "일정 등록이 완료되었습니다. 등록하신 일정은 메인페이지에 표시됩니다.");
    } else {
        alert_modal('modal_error', '작성하신 내용을 확인해주세요.', '모든 내용은 필수 입력 사항입니다.');
    }

    function schedule_form_check() {
        let inputs = [
            { input: $('#title'), errorMsg: "일정 제목을 입력하세요" },
            { input: $('#start_date'), errorMsg: "일정 시작일을 선택하세요" },
            { input: $('#start_time'), errorMsg: "일정 시작시간을 선택하세요" },
            { input: $('#end_date'), errorMsg: "일정 종료일을 선택하세요" },
            { input: $('#end_time'), errorMsg: "일정 종료시간을 선택하세요" }
        ];
        let input_return = true;

        // 유효성 검사
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

    // 공통 오류 메시지 표시
    function showError(input, msg) {
        let error_msg = input.parents(".input_fields").find(".check_error");
        error_msg.text(msg).show();
    }
    // 오류 메시지 숨기기
    function hideError(input) {
        input.parents(".input_fields").find(".check_error").hide();
    }

    // 포커스 해제 시 유효성 검사 (플래그를 체크하여 조건부 실행)
    $('#title, #start_date, #end_date, #start_time, #end_time').on('blur', function() {
        schedule_form_check();
    });
});
    
// 달력 라이브러리
let calendar;

document.addEventListener('DOMContentLoaded', function() {
        var calendar_box = document.getElementById('calendar');
    
        calendar = new FullCalendar.Calendar(calendar_box, {
            headerToolbar: { // 상단 툴바 설정
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            editable: false, // 드래그앤드롭 수정
            selectable: true, // 하루 최대 이벤트수
            dayMaxEvents: true,
            firstDay: 0, // 시작 날짜 (0=일요일/1=월요일)
            locale: "ko", // 언어 설정
            timeZone: 'local',
            displayEventTime: false, // 시간 표시
    
            // 이벤트 클릭시 동작
            dateClick: function(info) {
                show_date(info.dateStr);
            },

        events: [
        ]
    });

    calendar.render();

    // 페이지 로드 시 오늘 날짜의 일정 표시
    let date = new Date();
    let dateOffset = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const today = dateOffset.toISOString().split('T')[0];
    show_date(today); // 오늘 날짜로 일정 표시
    
    function show_date(click_date) {
        const events = calendar.getEvents(); // 현재 등록된 모든 일정

        // 클릭된 날짜에 해당하는 일정 필터링
        const event_filter = events.filter(e => {
            const event_start = e.start.toISOString().split('T')[0]; // 이벤트 시작 날짜
            const event_end = e.end ? e.end.toISOString().split('T')[0] : event_start; // 이벤트 종료 날짜
            return event_start <= click_date && event_end >= click_date;
        });

        // 클릭한 날짜 표시
        document.querySelector(".schedule_title > span").innerHTML = click_date;

        // 기존 일정을 비우기
        const schedule_list_wrap = document.querySelector(".schedule_list_wrap");
        schedule_list_wrap.innerHTML = '';

        // 일정 표시
        // ★ 데이터 저장된 걸로 불러와야 함!! (여기서 불러오면 영국시간(-9시간) 기준이 되어서 9시 이전 스케쥴인 경우 전날 클릭해도 불러와짐...)
        if (event_filter.length > 0) {
            event_filter.forEach(e => {
                // 한국 시간으로 날짜 가져오기
                const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul' };
                // 숫자 표시==numeric, 2-digit==시간을 2자리 숫자로 표기
                const start_date = e.start.toLocaleDateString('ko-KR', options).replace(/\s+/g, '').replace(/\./g, '-').slice(0, -1); // 시작 날짜
                const end_date = e.end ? e.end.toLocaleDateString('ko-KR', options).replace(/\s+/g, '').replace(/\./g, '-').slice(0, -1) : start_date; // 종료 날짜
                // console.log(e.start.toLocaleDateString('ko-KR', options));  // 24024. 11. 01.

                // 단일 일정인지 확인
                const date_status = start_date == end_date
                    ? start_date // 단일 일정인 경우
                    : `${start_date} ~ ${end_date}`; // 기간 일정인 경우

                // 시간 정보를 설정
                let time_status = '';
                if (start_date == end_date) {
                    const start_time = e.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                    const end_time = e.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                    time_status = `<li class="schedule_time"><img src="/icon/icon_time.svg" alt="시계 아이콘">${start_time} ~ ${end_time}</li>`;
                }

                let calendarHtml = `
                    <div class="schedule_box">
                        <ul class="schedule_list">
                            <li class="schedule_name">${e.title}</li>
                            <li class="schedule_date"><img src="/icon/icon_date.svg" alt="달력 아이콘">${date_status}</li>
                            ${time_status} <!-- 시간 정보 추가 -->
                        </ul>
                    </div>
                `;
                schedule_list_wrap.insertAdjacentHTML('beforeend', calendarHtml);
            });
        } else {
            console.log('No events found for this date.');
            document.querySelector(".schedule_list_wrap").innerHTML = "<span class='none_date'>등록된 일정이 없습니다.</span>";
        }
    }
});