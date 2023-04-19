import express from "express"
import path from "path"
import __dirname from "../__dirname.js"
import { sessionChecker } from "../middlewares/auth.js"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    "https://tsplplrxxpvdycvonvrv.supabase.co",
    process.env.SUPABASE_ANON
)
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.use(express.static(path.join(__dirname, "public")))

router
    .get("/update-profile", sessionChecker, (req, res) => {
        if (req.redirect) return res.redirect("/login")
        res.sendFile(
            path.join(__dirname, "public", "update-profile/update-profile.html")
        )
    })
    .post("/update-profile", async (req, res) => {
        let { data, error } = await supabase
            .from("job_seeker_profile")
            .select("*")
            .eq("id", req.session.user.id)

        if (data.length == 0) {
            ;({ data, error } = await supabase
                .from("job_seeker_profile")
                .insert([
                    {
                        id: req.session.user.id,
                        first_name: req.body.first_name,
                        middle_name: req.body.middle_name,
                        last_name: req.body.last_name,
                        status: "Active",
                    },
                ]))
        } else {
            ;({ data, error } = await supabase
                .from("job_seeker_profile")
                .update({
                    first_name: req.body.first_name,
                    middle_name: req.body.middle_name,
                    last_name: req.body.last_name,
                })
                .eq("id", req.session.user.id))
        }

        if (error) {
            console.log(error)
            return res
                .status(500)
                .json({ Error: "Failed to save user details" })
        } else {
            return res
                .status(200)
                .json({ Success: "Profile Updated Successfully" })
        }
    })

export default router
