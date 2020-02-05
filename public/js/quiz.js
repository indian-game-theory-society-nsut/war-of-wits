var countdownDate = new Date(document.getElementById("end_time").innerHTML);
document.getElementById("start_time").innerHTML = 'Start Time: ' + printDate(new Date(document.getElementById("start_time").innerHTML));
document.getElementById("end_time").innerHTML = 'End Time: ' + printDate(countdownDate);

function printDate(date) {
    var monthList = new Array(
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    );
    return date.getDate() + ' ' + monthList[date.getMonth()] + ' ' + date.getFullYear() + ' ' + date.toLocaleTimeString();
}

function countdownTimer() {
    function check(t) {
        if(t < 10) {
            t = '0' + t;
        }
        return t;
    }
    var differenceDates = countdownDate.getTime() - (new Date().getTime());

    // Time calculations for days, hours, minutes and seconds
    var days = check(Math.floor(differenceDates / (1000 * 60 * 60 * 24)));
    var hours = check(Math.floor((differenceDates % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    var minutes = check(Math.floor((differenceDates % (1000 * 60 * 60)) / (1000 * 60)));
    var seconds = check(Math.floor((differenceDates % (1000 * 60)) / 1000));

    document.getElementById("countdown_timer").innerHTML = hours + ":" + minutes + ":" + seconds;

    if (differenceDates < 0) {
        console.log(interval_countdownTimer);
        clearInterval(interval_countdownTimer);
        document.getElementById("response_form").submit();
        document.getElementById("countdown_timer").innerHTML = "EXPIRED";
    }
}
countdownTimer();
var interval_countdownTimer = setInterval(countdownTimer, 1000);
var db = firebase.firestore();

function formResponse(response_answer) {
    var answer_arr = new Array();
    for(i = 0;i < 4;i++) {
        if(response_answer[i].checked) {
            answer_arr.push(response_answer[i].value);
        }
    }
    return answer_arr;
}
var user_id = document.getElementById("user_id");
var quiz_id = document.getElementById("quiz_id");
function getNextQuestion() {
    var response_answer = document.getElementsByName("answer");
    const ResponseObject = {
        user: user_id.value,
        quiz: quiz_id.value,
        question: document.getElementById("question_id").value
    }
    if(response_answer[0].type == "text") {
        ResponseObject["user_response"] = new Array(response_answer[0].value);
    }
    else if(response_answer[0].type == "radio") {
        ResponseObject["user_response"] = formResponse(response_answer);
    }
    else if(response_answer[0].type == "checkbox") {
        ResponseObject["user_response"] = formResponse(response_answer);
    }
    console.log(ResponseObject);
    console.log(question_idx);

    if(question_idx < questions_arr.length) {
        db.collection('question').doc(questions_arr[question_idx]).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such quiz');
            }
            else {
                console.log('Quiz found');
                question_idx += 1;
                question = doc.data();
                document.getElementById("question_id").value = doc.id;
                document.getElementById("question_num").innerHTML = `Question ${question_idx}`;
                if(question.image != "Image Absent") {
                    document.getElementById("question_image").style.display = "";
                    document.getElementById("question_image").src = question.image;
                }
                else {
                    document.getElementById("question_image").style.display = "none";
                    document.getElementById("question_image").src = "";
                }
                document.getElementById("question_text").innerHTML = question.text;

                var answer_tags = "";
                var style_attr = "style='height: 45px;width: 120%;border-radius: 5%;color: #4e4949;'";
                if(question.options.length == 0) {
                    // Text Answer Type
                    answer_tags = `
                    <label>Answer</label>
                    <input type="text" name="answer" class="form-control" placeholder="Answer ..." ${style_attr}><br>
                    `
                }
                else {
                    if(question.answer.length == 1) {
                        // Single Correct Choice
                        answer_tags = `
                        Select the correct answer<br>
                        <input type="radio" name="answer" value="${ question.options[0] }" ${style_attr}>${ question.options[0] }<br>
                        <input type="radio" name="answer" value="${ question.options[1] }" ${style_attr}>${ question.options[1] }<br>
                        <input type="radio" name="answer" value="${ question.options[2] }" ${style_attr}>${ question.options[2] }<br>
                        <input type="radio" name="answer" value="${ question.options[3] }" ${style_attr}>${ question.options[3] }<br>
                        `
                    }
                    else {
                        // Multiple Correct Choice
                        answer_tags = `
                        Select the correct answers<br>
                        <input type="checkbox" name="answer" value="${ question.options[0] }" ${style_attr}>${ question.options[0] }<br>
                        <input type="checkbox" name="answer" value="${ question.options[1] }" ${style_attr}>${ question.options[1] }<br>
                        <input type="checkbox" name="answer" value="${ question.options[2] }" ${style_attr}>${ question.options[2] }<br>
                        <input type="checkbox" name="answer" value="${ question.options[3] }" ${style_attr}>${ question.options[3] }<br>
                        `
                    }
                }
                document.getElementById("answer_div").innerHTML = answer_tags;
            }
        })
        .catch(err => {
            console.log('Error getting document');
            // console.log(err)
        });
    }
    else {
        console.log("redirect to start quiz")
    }
    
    db.collection('response').add(ResponseObject);
}

