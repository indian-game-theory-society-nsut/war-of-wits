const path = require('path')
const { uuid } = require('uuidv4')
const admin = require('firebase-admin');
const db = admin.firestore();
const storage = admin.storage();
const fs = require('fs')

async function addQuestion(question_type, idx, category_idx, req) {
    var ans = new Array();
    if(typeof(question_type) == 'string') {
        curr_question_type = question_type;
    }
    else {
        curr_question_type = question_type[idx];
    }
    // ans[0] is options, ans[1] is answer
    if(curr_question_type == "Text") {
        // Text type
        const { answer_text } = req.body;
        ans.push(new Array());
        if(typeof(answer_text) == 'string') {
            ans.push(new Array(answer_text));
        }
        else {
            ans.push(new Array(answer_text[category_idx]));
        }
    }
    else if(curr_question_type == "Single") {
        // Single Answer type
        const { answer_single, option_single1, option_single2, option_single3, option_single4 } = req.body;
        if(typeof(answer_single) == 'string') {
            ans.push(new Array(
                option_single1,
                option_single2,
                option_single3,
                option_single4
            ))
            ans.push(new Array(answer_single));
        }
        else {
            ans.push(new Array(
                option_single1[category_idx],
                option_single2[category_idx],
                option_single3[category_idx],
                option_single4[category_idx]
            ))
            ans.push(new Array(answer_single[category_idx]));
        }
    }
    else if(curr_question_type == "Multiple") {
        // Muliple Answer type
        const { option_multiple1, option_multiple2, option_multiple3, option_multiple4 } = req.body;
        const { answer_multiple1, answer_multiple2, answer_multiple3, answer_multiple4 } = req.body;
        if(typeof(answer_multiple1) == 'string') {
            ans.push(new Array(
                option_multiple1,
                option_multiple2,
                option_multiple3,
                option_multiple4
            ))
            ans.push(new Array(
                answer_multiple1,
                answer_multiple2,
                answer_multiple3,
                answer_multiple4
            ))
        }
        else {
            ans.push(new Array(
                option_multiple1[category_idx],
                option_multiple2[category_idx],
                option_multiple3[category_idx],
                option_multiple4[category_idx]
            ))
            ans.push(new Array(
                answer_multiple1[category_idx],
                answer_multiple2[category_idx],
                answer_multiple3[category_idx],
                answer_multiple4[category_idx]
            ))
        }
    }
    return ans;
}

module.exports = async (req,res) => {
    const { quizTitle, quizTopic, start_date, start_time, end_date, end_time, quiz_id } = req.body;
    const QuizObject = {
        title: quizTitle,
        topic: quizTopic,
        start_time: new Date(start_date + " " + start_time),
        end_time: new Date(end_date + " " + end_time),
        author: req.session.userId
    }
    try {
        await db.collection('quiz').doc(`/${quiz_id}/`).create(QuizObject);
        console.log("done quiz")
    }
    catch (error) {
        // const registerationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
        // req.flash('registerationErrors', registerationErrors)
        req.flash('data', QuizObject)
        return res.redirect('/quizzes/new')
    }

    const { question_text, questionImageURL, question_id, question_type } = req.body;
    // Check if one question only
    if(typeof(question_type) == 'string') {
        console.log("Single Questions")
        ans = await addQuestion(question_type, 0, 0, req);
        QuestionObject = {
            text: question_text,
            image: questionImageURL,
            options: ans[0],
            answer: ans[1],
            quiz: quiz_id
        }
        // console.log(QuestionObject)
        try {
            await db.collection('question').doc(`/${question_id}/`).create(QuestionObject);
            console.log("done question")
            return res.redirect('/')
            // return res.status(200).send();
        }
        catch (error) {
            // const registerationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            // req.flash('registerationErrors', registerationErrors)
            req.flash('data', QuizObject)
            return res.redirect('/quizzes/new')
        }
    }
    else {
        console.log("Multiple Questions")
        var num_question_types = new Array();
        num_question_types['Single'] = 0;
        num_question_types['Text'] = 0;
        num_question_types['Multiple'] = 0;
        for(i = 0;i < question_type.length;i++) {
            ans = await addQuestion(question_type, i, num_question_types[question_type[i]], req);
            QuestionObject = {
                text: question_text[i],
                image: questionImageURL[i],
                options: ans[0],
                answer: ans[1],
                quiz: quiz_id
            }
            num_question_types[question_type[i]]++;
            try {
                await db.collection('question').doc(`/${question_id[i]}/`).create(QuestionObject);
                console.log("done question")
                // return res.redirect('/')
                // return res.status(200).send();
            }
            catch (error) {
                // const registerationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
                // req.flash('registerationErrors', registerationErrors)
                req.flash('data', QuizObject)
                return res.redirect('/quizzes/new')
            }
        }
        return res.redirect('/')
    }


    // console.log(req.files)
    // console.log(req.body)
    // prints post form data
};
