const $career_box = $(".career_box");
const $career_add_btn = $(".career_add_btn");

// 초기 박스 추가
const career_html = `
    <div class="career_box">
        <div class="career_inner">
            <div class="input_fields">
                <label for="career_field">활동 분야</label>
                <input type="text" name="career_field" class="career_field" placeholder="활동 분야 입력">
                <div class="form_check_box">
                    <p class="check_error"></p>
                </div>
            </div>
            <div class="input_fields">
                <label for="career_content">활동 내용</label>
                <input type="text" name="career_content" class="career_content"  placeholder="활동 내용 입력">
                <div class="form_check_box">
                    <p class="check_error"></p>
                </div>
            </div>
            <div class="input_fields">
                <label for="career_from">활동경력 시작일</label>
                <input type="date" name="career_from" class="career_from">
                <div class="form_check_box">
                    <p class="check_error"></p>
                </div>
            </div>
            <div class="input_fields">
                <label for="career_to">활동경력 종료일</label>
                <input type="date" name="career_to" class="career_to">
                <div class="form_check_box">
                    <p class="check_error"></p>
                </div>
            </div>
            <button type="button" class="career_del">삭제</button>
        </div>
        <div class="alltime_box">
            <input type="checkbox" name="career_alltime" id="career_alltime1">
            <label for="career_alltime1"><img src="../../static/icon/icon_check.svg" alt="체크 아이콘"></label>
            <label for="career_alltime1">활동 진행중</label>
        </div>
    </div>
`;
$career_box.append(career_html);

$career_add_btn.on("click", function() {
    // 새로운 박스 생성
    const add_career_box = $(`
        <div class="career_box">
            <div class="career_inner">
                <div class="input_fields">
                    <label for="career_field">활동 분야</label>
                    <input type="text" name="career_field" class="career_field" placeholder="활동 분야 입력">
                    <div class="form_check_box">
                        <p class="check_error"></p>
                    </div>
                </div>
                <div class="input_fields">
                    <label for="career_content">활동 내용</label>
                    <input type="text" name="career_content" class="career_content"  placeholder="활동 내용 입력">
                    <div class="form_check_box">
                        <p class="check_error"></p>
                    </div>
                </div>
                <div class="input_fields">
                    <label for="career_from">활동경력 시작일</label>
                    <input type="date" name="career_from" class="career_from">
                    <div class="form_check_box">
                        <p class="check_error"></p>
                    </div>
                </div>
                <div class="input_fields">
                    <label for="career_to">활동경력 종료일</label>
                    <input type="date" name="career_to" class="career_to">
                    <div class="form_check_box">
                        <p class="check_error"></p>
                    </div>
                </div>
                <button type="button" class="career_del">삭제</button>
            </div>
            <div class="alltime_box">
                <input type="checkbox" name="career_alltime" id="career_alltime1">
                <label for="career_alltime1"><img src="../../static/icon/icon_check.svg" alt="체크 아이콘"></label>
                <label for="career_alltime1">활동 진행중</label>
            </div>
        </div>
    `);

    // 새 박스 추가
    $career_box.append(add_career_box);

    // 삭제 버튼 클릭 시 박스 삭제
    add_career_box.find(".career_del").on("click", function() {
        $(this).parent().closest('.career_box').remove(); // 해당 박스 삭제
    });
});