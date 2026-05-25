export const isLoggedIn = (req, res, next) => {

    if(!req.session.user) {

        return res.redirect("/login");

    }

    next();

};


export const isAdmin = (req, res, next) => {

    if(req.session.user.role !== "admin") {

        return res.send("Akses ditolak");

    }

    next();

};


export const isPolisi = (req, res, next) => {

    if(req.session.user.role !== "polisi") {

        return res.send("Akses ditolak");

    }

    next();

};