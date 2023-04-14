import express from "express"
import path from "path"
import __dirname from "../__dirname.js"
import { sessionChecker } from "../middlewares/auth.js"

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.use(express.static(path.join(__dirname, "public")))

router.get("/update-profile", sessionChecker, (req, res) => {
    if (req.redirect) return res.redirect("/login")
    res.sendFile(
        path.join(__dirname, "public", "update-profile/update-profile.html")
    )
})

export default router
