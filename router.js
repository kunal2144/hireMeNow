import express from "express"
import { fileURLToPath } from "url"
import path from "path"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

export default router
