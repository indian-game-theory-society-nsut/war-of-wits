const bcrypt = require('bcryptjs')

const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = (req, res) => {
    console.log(req.body)
    req.session.userId = req.body.uid
    return res.redirect('/')

    // const { email, password } = req.body;
    // console.log(req.body)
    // console.log(email)
    // console.log(password)
    // Try to find user
    // db.collection('user').doc(`/${email}/`).get()
    // .then(doc => {
    //     if (!doc.exists) {
    //         console.log('No such user for login');
    //         return res.redirect('/auth/login')
    //     }
    //     else {
    //         user = doc.data()
    //         // Compare password
    //         // bcrypt.compare(user input, hashed version)
    //         bcrypt.compare(password, user.password, (error, result) => {
    //             if(result) {
    //                 // Successful Login
    //                 console.log("Successful login")
    //                 // Store user session
    //                 req.session.userId = user.id

    //                 // Redirect to login
    //                 res.redirect('/')
    //             }
    //             else {
    //                 console.log("password not match")
    //                 res.redirect('/auth/login')
    //             }
    //         })
    //     }
    //     return ""
    // })
    // .catch(err => {
    //     console.log('Error getting user for login', err);
    //     return res.redirect('/auth/login')
    // });
}
