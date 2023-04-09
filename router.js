import express from "express"
import path from "path"
import __dirname from "./__dirname.js"

const router = express.Router()

router.use(express.static(path.join(__dirname, "public")))

router.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about/about.html"))
})

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login/login.html"))
})

router.get("/seeker", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "seeker/seeker.html"))
})

router.get("/recruiter", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "recruiter/recruiter.html"))
})

router.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup/signup.html"))
})

export default router
