// Validate Create Post Middleware

module.exports = (req, res, next) => {
    if(!req.body.quizTitle || !req.body.quizTopic || !req.body.start_date || !req.body.start_time || !req.body.end_date || !req.body.end_time) {
        console.log("Validate Quiz Data failed")
        return res.redirect('/quizzes/new')
    }
    console.log("Validate Quiz Data passed")
    // console.log("validateQuizDataMiddleware is called");
    return next();
}
