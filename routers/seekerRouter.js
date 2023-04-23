import express from "express"
import path from "path"
import __dirname from "../__dirname.js"
import { sessionChecker } from "../middlewares/auth.js"
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

router
    .get("/update-profile", sessionChecker, (req, res) => {
        if (req.redirect) return res.redirect("/login")
        res.sendFile(
            path.join(__dirname, "public", "update-profile/update-profile.html")
        )
    })
    .post(
        "/update-profile",
        fileUpload({ createParentPath: true }),
        async (req, res) => {
            let user = {
                ...req.body,
            }

            if (user.current_password) {
                const { data, error } = await supabase
                    .from("job_seeker_account")
                    .select("*")
                    .eq("id", req.session.user.id)

                if (error) {
                    return res
                        .status(500)
                        .json({ Error: "Something went wrong" })
                } else {
                    const validPassword = await bcrypt.compare(
                        user.current_password,
                        data[0].password
                    )

                    if (!validPassword) {
                        return res.status(401).json({
                            Error: "Incorrect password",
                        })
                    } else {
                        const salt = await bcrypt.genSalt(10)
                        user.new_password = await bcrypt.hash(
                            user.new_password,
                            salt
                        )

                        const { data, error } = await supabase
                            .from("job_seeker_account")
                            .update({
                                password: user.new_password,
                            })
                            .eq("id", req.session.user.id)

                        if (error) {
                            return res
                                .status(500)
                                .json({ Error: "Something went wrong" })
                        }
                    }
                }
            }

            if (req.files) {
                user.text_resume = req.files.text_resume
                    ? req.files.text_resume
                    : null
                user.video_resume = req.files.video_resume
                    ? req.files.video_resume
                    : null
            } else {
                user.text_resume = null
                user.video_resume = null
            }

            if (user.text_resume) {
                let { data, error } = await supabase.storage
                    .from("text-resumes")
                    .list(`${req.session.user.id}`)

                if (error) {
                    console.log(error)
                } else {
                    if (data.length > 0) {
                        ;({ data, error } = await supabase.storage
                            .from("text-resumes")
                            .remove(`${req.session.user.id}/${data[0].name}`, {
                                hard: true,
                            }))
                    }
                }

                ;({ data, error } = await supabase.storage
                    .from("text-resumes")
                    .upload(
                        `${req.session.user.id}/${user.text_resume.name}`,
                        user.text_resume.data,
                        {
                            contentType: `application/pdf`,
                        }
                    ))

                if (!error) {
                    user.text_resume_url = data.path
                } else {
                    console.log(error)
                    return res
                        .status(500)
                        .json({ Error: "Failed to save user details" })
                }
            }

            if (user.video_resume) {
                let { data, error } = await supabase.storage
                    .from("video-resumes")
                    .list(`${req.session.user.id}`)

                if (error) {
                    console.log(error)
                } else {
                    if (data.length > 0) {
                        ;({ data, error } = await supabase.storage
                            .from("video-resumes")
                            .remove(`${req.session.user.id}/${data[0].name}`, {
                                hard: true,
                            }))
                    }
                }

                ;({ data, error } = await supabase.storage
                    .from("video-resumes")
                    .upload(
                        `${req.session.user.id}/${user.video_resume.name}`,
                        user.video_resume.data,
                        {
                            contentType: `${user.video_resume.mimetype}`,
                        }
                    ))
            }

            let { data, error } = await supabase
                .from("job_seeker_profile")
                .select("*")
                .eq("id", req.session.user.id)

            let update = {}

            if (user.text_resume) update.text_resume = user.text_resume_url
            if (user.video_resume) update.video_resume = user.video_resume_url
            ;({ data, error } = await supabase
                .from("resume")
                .update(update)
                .eq("id", data[0].resume_id))
            ;({ data, error } = await supabase
                .from("job_seeker_profile")
                .update({
                    first_name: user.first_name,
                    middle_name: user.middle_name,
                    last_name: user.last_name,
                    phone: user.phone,
                })
                .eq("id", req.session.user.id))

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
        }
    )

//here
router.post("/apply/:id", async (req, res) => {
    let { data, error } = await supabase
        .from("job_seeker_profile")
        .select("resume_id")
        .eq("id", req.session.user.id)

    if (error) {
        console.log(error)
        return res.status(500).json({ Error: "Failed to apply" })
    }

    ;({ data, error } = await supabase.from("job_application").insert([
        {
            job_id: req.body.job_id,
            job_seeker_id: req.session.user.id,
            resume_id: data[0].resume_id,
            cover_letter: req.body.cover_letter,
            status: "Pending",
        },
    ]))

    if (error) {
        console.log(error)
        return res.status(500).json({ error: "Failed to apply" })
    }

    return res.status(200).json({ Success: "Applied Successfully" })
})

router.get("/applications", sessionChecker, (req, res) => {
    if (req.redirect) return res.redirect("/login")
    res.sendFile(
        path.join(__dirname, "public", "applications/applications.html")
    )
})

router.get("/get-applications", async (req, res) => {
    let { data, error } = await supabase
        .from("job_application")
        .select("job_id")
        .eq("job_seeker_id", req.session.user.id)

    if (error) {
        console.log(error)
        return res.status(500).json({ Error: "Failed to get applications" })
    }

    let jobs = []

    for (let i = 0; i < data.length; i++) {
        let { data: job, error } = await supabase
            .from("job_listing")
            .select("*")
            .eq("id", data[i].job_id)

        if (error) {
            console.log(error)
            return res.status(500).json({ Error: "Failed to get applications" })
        }

        jobs.push(job[0])
    }

    return res.status(200).json(jobs)
})

export default router
