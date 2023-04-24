import express from "express"
import path from "path"
import __dirname from "../__dirname.js"
import { sessionChecker, recruiterChecker } from "../middlewares/auth.js"
import { createClient } from "@supabase/supabase-js"
import fileUpload from "express-fileupload"
import bcrypt from "bcrypt"

const supabase = createClient(
    "https://tsplplrxxpvdycvonvrv.supabase.co",
    process.env.SUPABASE_ANON
)
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.use(express.static(path.join(__dirname, "public")))

router.get("/listings", sessionChecker, recruiterChecker, (req, res) => {
    if (req.redirect) return res.redirect("/login")
    res.sendFile(path.join(__dirname, "public", "listings/listings.html"))
})

router.get("/get-listings", async (req, res) => {
    let { data, error } = await supabase
        .from("job_listing")
        .select()
        .eq("employer_id", req.session.user.id)

    if (error) {
        console.log(error)
        return res.status(500).json({ Error: "Failed to get listings" })
    }

    return res.status(200).json(data)
})

router.post("/delete-listing", async (req, res) => {
    let { data, error } = await supabase
        .from("job_application")
        .delete()
        .eq("job_id", req.body.id)

    if (error) {
        console.log(error)
        return res.status(500).json({ Error: "Failed to delete listing" })
    }

    ;({ data, error } = await supabase
        .from("job_listing")
        .delete()
        .eq("id", req.body.id))

    if (error) {
        console.log(error)
        return res.status(500).json({ Error: "Failed to delete listing" })
    }

    return res.status(200).json(data)
})

export default router
