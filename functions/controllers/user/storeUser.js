const bcrypt = require('bcryptjs')
const admin = require('firebase-admin');
const db = admin.firestore();
const { uuid } = require('uuidv4')

module.exports = (req,res) => {
    const { email, password, username } = req.body;
    bcrypt.hash(password, 10, (error, encrypted) => {
        if(error) {
            req.flash('data', req.body)
            return res.redirect('/auth/register')
        }
        UserObject = {
            id: uuid().replace(/-/g, ''),
            password: encrypted,
            username: username
        }
        db.collection('user').doc(`/${email}/`).create(UserObject)
        .then((res) => {
            // console.log(`Document created at ${res.updateTime}`);
            console.log("User stored")
            return res.redirect('/auth/login')
        })
        .catch((err) => {
            console.log(`Failed to create user`);
            // console.log(Object.keys(error.errors))
            // console.log(Object.keys(error.errors).map(key => error.errors[key].message))
            // const registerationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            // req.flash('registerationErrors', registerationErrors)

            req.flash('data', req.body)

            // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
            // This error if this not returned
            return res.redirect('/auth/register')
        });
        return res.redirect('/auth/login')
    })
};

