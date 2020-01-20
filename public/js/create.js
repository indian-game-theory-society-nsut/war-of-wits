// create multiple input tag dynamically js with different name
// https://stackoverflow.com/questions/7880619/multiple-inputs-with-same-name-through-post-in-php
// https://stackoverflow.com/questions/16744594/how-to-use-jquery-to-add-form-elements-dynamically
// https://stackoverflow.com/questions/20961101/dynamically-creating-multiple-inputs-simultaneously
// https://www.w3schools.com/jsref/met_node_appendchild.asp

function addQuestion() {
    var questionList = document.getElementById("questionList");
    var selectQuestionType = document.getElementById("selectQuestionType").value;
    var selectAddImage = document.getElementById("selectAddImage").value;

    if(selectQuestionType == "") {
        return true;
    }
    else if(selectQuestionType == "Text") {
        var answerTag = `
            <input type="text" name="answer_text" class="form-control" placeholder="Answer ...">
        `;
    }
    else if(selectQuestionType == "Single") {
        var answerTag = `
            Select the correct answer<br>
            <select name="answer_single">
                <option value="">correct answer</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select><br>
            <input type="text" name="option_single1" placeholder="Option 1 ..." style="outline: none"><br>
            <input type="text" name="option_single2" placeholder="Option 2 ..." style="outline: none"><br>
            <input type="text" name="option_single3" placeholder="Option 3 ..." style="outline: none"><br>
            <input type="text" name="option_single4" placeholder="Option 4 ..." style="outline: none"><br>
        `;
    }
    else if(selectQuestionType == "Multiple") {
        var answerTag = `
            Select the correct answers<br>
            <select name="answer_multiple1">
                <option value="">correct answer</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <input type="text" name="option_multiple1" placeholder="Option 1 ..." style="outline: none"><br>
            <select name="answer_multiple2">
                <option value="">correct answer</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <input type="text" name="option_multiple2" placeholder="Option 2 ..." style="outline: none"><br>
            <select name="answer_multiple3">
                <option value="">correct answer</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <input type="text" name="option_multiple3" placeholder="Option 3 ..." style="outline: none"><br>
            <select name="answer_multiple4">
                <option value="">correct answer</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <input type="text" name="option_multiple4" placeholder="Option 4 ..." style="outline: none"><br>
        `;
    }
    var QuestionNode = document.createElement("DIV");
    var QuestionTextNode = document.createElement("DIV");
    var question_id = create_UUID().replace(/-/g, '');
    var QuestionText = `
        <button onclick="removeQuestion(this)" style="float:right;margin-top:10px;margin-bottom:10px;" type="button" class="register-button">
            <i class="fa fa-minus"></i>
        </button>
        <label class="accent-text">Question</label>
        <textarea name="question_text" placeholder="Question ..." cols="30" rows="3" class="form-control"></textarea>
        ${answerTag}
        <input type="text" name="question_type" class="form-control-file" value=${selectQuestionType} hidden>
        <input type="text" name="question_id" class="form-control-file question-id-class" value=${question_id} hidden>
    `;
    QuestionTextNode.innerHTML = QuestionText;

    // questionList.appendChild(QuestionTextNode);
    QuestionNode.appendChild(QuestionTextNode);

    var QuestionImageNode = document.createElement("DIV");
    if(selectAddImage == "yes") {
        var QuestionImage = `
            <label>Image</label>
            <progress value="0" max="100" class="uploader">0%</progress>
            <input type="file" name="questionImage" class="form-control-file question-image">
            <input type="text" name="questionImageURL" class="form-control-file question-image-url" value="" hidden>
            <button onclick="uploadImage(this)" type="button" class="register-button">Upload</button>
        `;
        QuestionImageNode.innerHTML = QuestionImage;
    }
    else {
        var QuestionImage = `
            <input type="text" name="questionImageURL" class="form-control-file question-image-url" value="Image Absent" hidden>
        `;
        QuestionImageNode.innerHTML = QuestionImage;
    }
    // questionList.appendChild(QuestionImageNode);
    QuestionNode.appendChild(QuestionImageNode);
    QuestionNode.classList.add("question_node");

    questionList.appendChild(QuestionNode);
    questionList.appendChild(document.createElement("HR"));
}

function removeQuestion(ele) {
    ele.parentNode.parentNode.parentNode.removeChild(ele.parentNode.parentNode);
}

function validateQuestion(question_type, idx, category_idx, errorsSet) {
    // var errorsSet = new Set();
    var question_text = document.getElementsByName("question_text")[idx].value;
    if(question_text == "") {
        errorsSet.add("Question Field cannot be empty");
    }
    if(question_type == "Text") {
        var answer_text = document.getElementsByName("answer_text")[category_idx].value;
        if(answer_text == "") {
            errorsSet.add("Answer Field for text answer type question cannot be empty");
        }
    }
    else if(question_type == "Single") {
        var answer_single = document.getElementsByName("answer_single")[category_idx].value;
        if(answer_single == "") {
            errorsSet.add("Please select the correct answer for single answer type questions");
        }
        var option_single1 = document.getElementsByName("option_single1")[category_idx].value;
        var option_single2 = document.getElementsByName("option_single2")[category_idx].value;
        var option_single3 = document.getElementsByName("option_single3")[category_idx].value;
        var option_single4 = document.getElementsByName("option_single4")[category_idx].value;
        if(option_single1 == "" || option_single2 == "" || option_single3 == "" || option_single4 == "") {
            errorsSet.add("Option values cannot be empty");
        }
    }
    else if(question_type == "Multiple") {
        var answer_multiple1 = document.getElementsByName("answer_multiple1")[category_idx].value;
        var answer_multiple2 = document.getElementsByName("answer_multiple2")[category_idx].value;
        var answer_multiple3 = document.getElementsByName("answer_multiple3")[category_idx].value;
        var answer_multiple4 = document.getElementsByName("answer_multiple4")[category_idx].value;
        if(answer_multiple1 == "" || answer_multiple2 == "" || answer_multiple3 == "" || answer_multiple4 == "") {
            errorsSet.add("Options for multiple answer type questions is not marked as correct or incorrect");
        }
        var option_multiple1 = document.getElementsByName("option_multiple1")[category_idx].value;
        var option_multiple2 = document.getElementsByName("option_multiple2")[category_idx].value;
        var option_multiple3 = document.getElementsByName("option_multiple3")[category_idx].value;
        var option_multiple4 = document.getElementsByName("option_multiple4")[category_idx].value;
        if(option_multiple1 == "" || option_multiple2 == "" || option_multiple3 == "" || option_multiple4 == "") {
            errorsSet.add("Option values cannot be empty");
        }
    }
}

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function validateData() {
    var error_color = "#ffb3b3", original_color = "";
    var quiz_error_text = new Set();
    try {
        var questionImage = document.getElementsByName("questionImage");
        for(i = 0;i < questionImage.length;i++) {
            questionImage[i].parentElement.style.backgroundColor = original_color;
            if(questionImage[i].value == "") {
                quiz_error_text.add("Image must be uploaded");
                questionImage[i].parentElement.style.backgroundColor = error_color;
            }
        }
    }
    catch(e) {
        // Maybe no question with image option
    }
    var question_type = document.getElementsByName("question_type");
    if(question_type.length == 0) {
        quiz_error_text.add("No question added to the quiz");
    }
    var quizTitle = document.getElementsByName("quizTitle")[0];
    quizTitle.parentElement.style.backgroundColor = original_color;
    if(quizTitle.value == "") {
        quizTitle.parentElement.style.backgroundColor = error_color;
        quiz_error_text.add("Quiz must have a title");
    }
    var quizTopic = document.getElementsByName("quizTopic")[0];
    quizTopic.parentElement.style.backgroundColor = original_color;
    if(quizTopic.value == "") {
        quizTopic.parentElement.style.backgroundColor = error_color;
        quiz_error_text.add("Quiz must have a topic");
    }
    var start_date = document.getElementsByName("start_date")[0];
    var start_time = document.getElementsByName("start_time")[0];
    start_date.parentElement.style.backgroundColor = original_color;
    if(start_date.value == "" || start_time.value == "") {
        start_date.parentElement.style.backgroundColor = error_color;
        quiz_error_text.add("Quiz must have a start time");
    }
    var end_date = document.getElementsByName("end_date")[0];
    var end_time = document.getElementsByName("end_time")[0];
    end_date.parentElement.style.backgroundColor = original_color;
    if(end_date.value == "" || end_time.value == "") {
        end_date.parentElement.style.backgroundColor = error_color;
        quiz_error_text.add("Quiz must have an end time");
    }
    if(start_date.value != "" && start_time.value != "" && end_date.value != "" && end_time.value != "") {
        start = new Date(start_date.value + ' ' + start_time.value);
        end = new Date(end_date.value + ' ' + end_time.value);
        if(start.getTime() >= end.getTime()) {
            start_date.parentElement.style.backgroundColor = error_color;
            end_date.parentElement.style.backgroundColor = error_color;
            quiz_error_text.add("Quiz start time must be less than quiz end time");
        }
    }
    var num_question_types = new Array();
    num_question_types['Single'] = 0;
    num_question_types['Text'] = 0;
    num_question_types['Multiple'] = 0;
    for(var i = 0;i < question_type.length;i++) {
        // validateQuestion(question_type, idx, category_idx, errorsSet);
        validateQuestion(question_type[i].value, i, num_question_types[question_type[i].value], quiz_error_text);
        num_question_types[question_type[i].value]++;
    }
    if(quiz_error_text.size > 0) {
        // Data is invalid
        var quiz_errors_list = document.getElementById("quiz-errors-list");
        // Removing previous submit errors if any
        quiz_errors_list.innerHTML = "";
        for(var ele of quiz_error_text) {
            var quiz_error = document.createElement("LI");
            quiz_error.classList.add("list-group-item");
            quiz_error.classList.add("text-danger");
            quiz_error.innerHTML = ele;
            quiz_errors_list.appendChild(quiz_error);
        }
        // Stopping html from submitting form to the server
        return false;
    }
    // Allowing html to submit form to the server
    return true;
}

var quiz_id = create_UUID().replace(/-/g, '');
document.getElementById("quiz_id_tag").value = quiz_id;
// Your web app's Firebase configuration
var firebaseConfig = {
    storageBucket: "war-of-wits.appspot.com"
};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


function uploadImage(ele) {
    var question_id = ele.parentElement.parentElement.getElementsByClassName("question-id-class")[0].value;
    var progressBar = ele.parentNode.getElementsByClassName("uploader")[0];
    var imageFile = ele.parentElement.getElementsByClassName("question-image")[0].files[0];
    var imageURL = ele.parentElement.getElementsByClassName("question-image-url")[0];

    var storageRef = firebase.storage().ref(`quiz/${quiz_id}/${question_id}`);
    var uploadTask = storageRef.put(imageFile);
    uploadTask.on('state_changed',
        function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.value = percentage;
        },
        function error(err) {

        },
        function complete() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                imageURL.value = downloadURL;
            });
        }
    )
}

