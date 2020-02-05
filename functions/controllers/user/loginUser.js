module.exports = (req, res) => {
    req.session.userId = req.body.uid
    return res.redirect('/startquiz')
}
