const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    next(); 
};

const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login'); 
    }
    next();
};

const isUser = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'client') {
        return res.redirect('/login'); 
    }
    next(); 
};

module.exports = { isLoggedIn, isAdmin, isUser };