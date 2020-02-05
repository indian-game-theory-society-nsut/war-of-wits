const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = (req, res) => {
    if(req.session.quizId == req.session.quizComplete) {
        // Quiz is completed
        req.session.quizId = null;
        return res.render('index')
    }
    db.collection('quiz').where('end_time', '>', new Date()).get()
    .then(snapshot => {
        no_quiz = false
        quizzes = new Array()
        if (snapshot.empty) {
            console.log('No matching quizzes');
        }
        console.log("Home succesful quizzes")
        snapshot.forEach(doc => {
            // console.log(doc.id, '=>', doc.data());
            req.session.quizId = doc.id;
            // curr = doc.data()
            // curr['id'] = doc.id
            // quizzes.push(curr)
        });
        if(req.session.quizId == req.session.quizComplete) {
            // Quiz is completed
            req.session.quizId = null;
            return res.render('index')
        }
        // New Quiz has started
        req.session.quizComplete = null;
        return res.render('index')
    })
    .catch(err => {
        error = true
        return res.render('index')
    });
};

