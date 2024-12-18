const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    next(); // Proceed if authenticated
};

const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login'); // Redirect to login if not an admin
    }
    next(); // Proceed if admin
};

const isUser = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'client') {
        return res.redirect('/login'); // Redirect to login if not a client
    }
    next(); // Proceed if user
};

module.exports = { isLoggedIn, isAdmin, isUser };