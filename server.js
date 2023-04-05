import { createClient } from "@supabase/supabase-js"
import hbs from "express-handlebars"
import Express from "express"
import dotenv from "dotenv"
import handlebars from "handlebars"
import router from "./router.js"
import __dirname from "./__dirname.js"

handlebars.registerHelper("eq", function (value1, value2) {
    return value1 === value2
})

handlebars.registerHelper("replaceAll", function (value1, value2, value3) {
    return value1.replaceAll(value2, value3)
})

dotenv.config()

const app = Express()
const supabase = createClient(
    "https://tsplplrxxpvdycvonvrv.supabase.co",
    process.env.SUPABASE_ANON
)

//routes
app.use(router)

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
})

app.set("view engine", "hbs")
app.engine(
    "hbs",
    hbs.engine({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: __dirname + "/views/layouts/",
        partialsDir: __dirname + "/views/partials/",
    })
)

app.get("/get_job_listings", async (req, res) => {
    let { data: job_listing, error } = await supabase
        .from("job_listing")
        .select("*")
        .order("id")

    if (!error) return res.send(job_listing)
    else return res.json(error)
})

app.get("/job_listing/:id", async (req, res) => {
    const { data: jobListing, error } = await supabase
        .from("job_listing")
        .select("*")
        .eq("id", req.params.id)
    if (error) {
        res.status(500).render("error", {
            message: "Failed to retrieve job listing",
        })
    } else if (jobListing.length === 0) {
        res.status(404).render("notfound", { title: "404 Error | Jobs" })
    } else {
        let sd = new Date(jobListing[0].start_date)
        jobListing[0].start_date =
            sd.getDate() + "/" + (sd.getMonth() + 1) + "/" + sd.getFullYear()

        let ctc = jobListing[0].ctc
        jobListing[0].ctc = ctc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

        let ab = new Date(jobListing[0].apply_by)
        jobListing[0].apply_by =
            ab.getDate() + "/" + (ab.getMonth() + 1) + "/" + ab.getFullYear()

        res.render("job_listing", {
            title: jobListing[0].title.concat(" | Jobs"),
            jobListing: jobListing[0],
        })
    }
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})
