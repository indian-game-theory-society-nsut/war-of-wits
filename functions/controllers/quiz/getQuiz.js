const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = async (req,res) => {
    // Firestore
    quiz_id = req.params.id
    if(req.session.quizComplete == quiz_id) {
        attempted = true;
        return res.render('index', {
            attempted
        })
    }
    quiz = null
    questions = null
    author = null
    await db.collection('quiz').doc(`/${quiz_id}/`).get()
    .then(doc => {
        if (!doc.exists) {
            console.log('No such quiz');
            return res.redirect('/startquiz')
        }
        else {
            console.log('Quiz found');
            // console.log('Document data:', doc.data().end_time);
            quiz = doc.data()
        }
    })
    .catch(err => {
        console.log('Error getting document', err);
    });
    currDate = new Date()
    if(currDate.getTime() < quiz.start_time.toDate().getTime() || currDate.getTime() > quiz.end_time.toDate().getTime()) {
        // Quiz has not started yet or has already ended
        // return res.redirect('/')
    }

    response_num = 0
    await db.collection('response').where('user', '==', req.session.userId).where('quiz', '==', req.session.quizId).get()
    .then(snapshot => {
        if (snapshot.empty) {
            response_num = 0
        }
        response_num = snapshot.size;
    })
    .catch(err => {
        response_num = 0
    });

    var curr_question = null
    await db.collection('question').where('quiz', '==', quiz_id).orderBy('idx').get()
    .then(snapshot => {
        if (snapshot.empty) {
            console.log('No matching questions.');
        }
        questions = new Array()
        i = 0
        snapshot.forEach(doc => {
            // console.log(doc.id, '=>', doc.data());
            if(i == response_num) {
                curr_question = doc.data()
                curr_question['id'] = doc.id
            }
            i += 1
            curr = {
                id: doc.id
            }
            questions.push(curr)
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });

    if(curr_question == null) {
        console.log("All responses stored")
        req.session.quizComplete = quiz_id;
        attempted = true;
        return res.render('index', {
            attempted
        })
    }
    console.log("Done getting data")

    // console.log(quiz)
    // console.log(questions)
    // console.log(author)
    res.render('quiz', {
        curr_question,
        quiz,
        questions,
        response_num,
        quiz_id
    })
};

