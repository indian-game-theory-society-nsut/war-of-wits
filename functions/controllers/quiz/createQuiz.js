module.exports = (req, res) => {
    return res.render('create', {
        errors: req.flash('registerationErrors'),
        data: req.flash('data')[0]
    })
};
