const isAuthenticated = (req, res, next) => {

    if (req.session.user) {
        return next();
    }

    req.session.redirectTo = req.originalUrl;

    res.redirect("/login");
};

export default isAuthenticated;