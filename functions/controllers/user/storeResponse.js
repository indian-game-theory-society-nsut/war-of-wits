const { uuid } = require('uuidv4')
const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = async (req,res) => {
    quiz_id = req.params.id;
    const { question_id } = req.body;
    if(typeof(question_id) == 'string') {
        const ResponseObject = {
            question: question_id,
            user_response: req.body["answer0"]
        }
        response_id = uuid().replace(/-/g, '');
        try {
            await db.collection('response').doc(`/${response_id}/`).create(ResponseObject);
            console.log("done single response")
            return res.redirect('/')
        }
        catch (error) {
            req.flash('data', ResponseObject)
            return res.redirect(`/quiz/${quiz_id}`)
        }
    }
    else {
        for(i = 0;i < question_id.length;i++) {
            const ResponseObject = {
                question: question_id[i],
                user_response: req.body[`answer${i}`]
            }
            response_id = uuid().replace(/-/g, '');
            try {
                await db.collection('response').doc(`/${response_id}/`).create(ResponseObject);
                console.log("done multiple response")
            }
            catch (error) {
                req.flash('data', ResponseObject)
                return res.redirect(`/quiz/${quiz_id}`)
            }
        }
        return res.redirect('/')
    }
};
