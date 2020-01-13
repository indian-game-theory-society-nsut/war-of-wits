module.exports = (req,res) => {
    // console.log(req.session.registerationErrors)
    // console.log(req.flash('data'))
    res.render('register', {
        errors: req.flash('registerationErrors'),
        data: req.flash('data')[0]
    })
};
