exports.showLogin = (req, res) => {
    const messages = req.flash();
    res.render('login', { messages });
};

exports.showRegister = (req, res) => {
    const messages = req.flash();
    res.render('register', { messages });
};

exports.showProfile = (req, res) => {
    res.render('profile', { user: req.session.user });
};
