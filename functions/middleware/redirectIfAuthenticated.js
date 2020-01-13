// redirectIfAuthenticated

module.exports = (req, res, next) => {
    if(req.session.userId) {
        console.log("Redirect If Authenticated failed")
        return res.redirect('/')
    }
    console.log("Redirect If Authenticated passed")
    return next();
}
