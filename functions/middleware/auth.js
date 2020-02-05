const admin = require('firebase-admin');

module.exports = (req, res, next) => {
    if(!req.session.userId) {
        console.log("Session id not found auth middleware")
        return res.redirect('/')
    }
    // Fetch user from database
    admin.auth().getUser(req.session.userId)
    .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully fetched user data");
        // console.log(userRecord.toJSON());
        return next();
    })
    .catch(function(error) {
        console.log("Error fetching user data:", error);
        return res.redirect('/')
    });

    // verify user

    // if user is valid, permit request

    // else redirect
}
