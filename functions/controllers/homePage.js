const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = (req, res) => {
    db.collection('quiz').where('end_time', '>', new Date()).get()
    .then(snapshot => {
        no_quiz = false
        quizzes = new Array()
        if (snapshot.empty) {
            console.log('No matching quizzes');
            no_quiz = true
        }
        console.log("Home succesful quizzes")
        snapshot.forEach(doc => {
            // console.log(doc.id, '=>', doc.data());
            curr = doc.data()
            curr['id'] = doc.id
            quizzes.push(curr)
        });
        return res.render('index', {
            quizzes,
            no_quiz
        })
    })
    .catch(err => {
        // console.log('Error getting documents', err);
        quizzes = new Array()
        error = true
        return res.render('index', {
            quizzes,
            error
        })
    });

    // console.log(posts)
    // console.log(req.session)
};

