export function sessionChecker(req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        req.redirect = false
        next()
    } else {
        req.redirect = true
        next()
    }
}

export function seekerChecker(req, res, next) {
    if (!req.redirect && req.session.user.type == "seeker") {
        req.redirect = false
        next()
    } else {
        req.redirect = true
        next()
    }
}

export function recruiterChecker(req, res, next) {
    if (!req.redirect && req.session.user.type == "recruiter") {
        req.redirect = false
        next()
    } else {
        req.redirect = true
        next()
    }
}
