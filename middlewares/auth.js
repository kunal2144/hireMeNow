export const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        req.redirect = false
        next()
    } else {
        req.redirect = true
        next()
    }
}