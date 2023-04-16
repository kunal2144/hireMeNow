import { createClient } from "@supabase/supabase-js"
import express from "express"
import path from "path"
import __dirname from "../__dirname.js"
import { sessionChecker } from "../middlewares/auth.js"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

dotenv.config()
const router = express.Router()
const supabase = createClient(
    "https://tsplplrxxpvdycvonvrv.supabase.co",
    process.env.SUPABASE_ANON
)

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.use(express.static(path.join(__dirname, "public")))

router.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about/about.html"))
})

router.get("/login", sessionChecker, (req, res) => {
    if (!req.redirect) {
        if (req.session.user.type == "recruiter")
            return res.redirect("/recruiter")
        else return res.redirect("/seeker")
    }
    res.sendFile(path.join(__dirname, "public", "login/login.html"))
})

router.post("/login", async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const { data, error } = await supabase
        .from("job_seeker_account")
        .select("*")
        .eq("email", email)

    if (error) {
        return res.status(500).json({ Error: "Something went wrong" })
    } else if (data.length == 0) {
        const { data, error } = await supabase
            .from("employer_account")
            .select("*")
            .eq("email", email)

        if (error) {
            return res.status(500).json({ Error: "Something went wrong" })
        } else if (data.length == 0) {
            return res.status(404).json({
                message: "Email does not exist",
            })
        } else {
            const validPassword = await bcrypt.compare(
                password,
                data[0].password
            )

            if (!validPassword) {
                return res.status(401).json({
                    message: "Invalid password",
                })
            }

            req.session.user = {
                email: data[0].email,
                type: "recruiter",
                id: data[0].id,
            }
            res.redirect("/recruiter")
        }
    } else {
        const validPassword = await bcrypt.compare(password, data[0].password)

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid password",
            })
        }

        req.session.user = {
            email: data[0].email,
            type: "seeker",
            id: data[0].id,
        }
        res.redirect("/seeker")
    }
})

router.get("/seeker", sessionChecker, (req, res) => {
    if (req.redirect) return res.redirect("/login")
    if (req.session.user.type == "recruiter") return res.redirect("/recruiter")
    res.sendFile(path.join(__dirname, "public", "seeker/seeker.html"))
})

router.get("/recruiter", sessionChecker, (req, res) => {
    if (req.redirect) return res.redirect("/login")
    if (req.session.user.type == "seeker") return res.redirect("/seeker")
    res.sendFile(path.join(__dirname, "public", "recruiter/recruiter.html"))
})

router.get("/signup", sessionChecker, (req, res) => {
    if (!req.redirect) {
        if (req.session.user.type == "recruiter")
            return res.redirect("/recruiter")
        else return res.redirect("/seeker")
    }
    res.sendFile(path.join(__dirname, "public", "signup/signup.html"))
})

router.post("/signup", async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const type = req.body.type

    const hashedPassword = await hashPass(password)

    if (type == "seeker") {
        const { data, error } = await supabase
            .from("job_seeker_account")
            .insert([{ email: email, password: hashedPassword }])
            .select()

        if (error) {
            if (error.code == 23505)
                return res.status(409).json({ Error: "Email already exists" })
            return res.status(500).json(error)
        } else {
            req.session.user = {
                email: email,
                type: type,
                id: data[0].id,
            }
            res.redirect("/seeker")
        }
    } else {
        const { data, error } = await supabase
            .from("employer_account")
            .insert([{ email: email, password: password }])

        if (error) {
            if (error.code == 23505)
                return res.status(409).json({ Error: "Email already exists" })
            return res.status(500).json(error)
        } else {
            req.session.user = {
                email: email,
                type: type,
                id: data[0].id,
            }
            res.redirect("/recruiter")
        }
    }
})

router.get("/logout", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie("user_sid")
        res.redirect("/")
    } else {
        res.redirect("/login")
    }
})

async function hashPass(password) {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

export default router
